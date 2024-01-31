import datetime
import hashlib

from django.db.models import Q
from django.http import HttpResponse
from django.utils.decorators import method_decorator
from django.shortcuts import get_object_or_404

from rest_framework import viewsets, permissions, status, mixins
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import filters

from auditable.views import AuditableMixin

from api.decorators import permission_required
from api.models.CreditTrade import CreditTrade
from api.models.CreditTradeStatus import CreditTradeStatus
from api.models.Organization import Organization
from api.models.OrganizationType import OrganizationType
from api.serializers import CreditTrade2Serializer as CreditTradeSerializer
from api.serializers import CreditTradeApproveSerializer
from api.serializers import CreditTradeCreateSerializer
from api.serializers import CreditTradeHistory2Serializer \
    as CreditTradeHistorySerializer
from api.serializers import CreditTradeListSerializer
from api.serializers import CreditTradeUpdateSerializer

from api.services.CreditTradeService import CreditTradeService
from api.services.SpreadSheetBuilder import SpreadSheetBuilder


class CreditTradeViewSet(AuditableMixin, mixins.CreateModelMixin,
                         mixins.RetrieveModelMixin, mixins.UpdateModelMixin,
                         mixins.ListModelMixin, viewsets.GenericViewSet):
    """
    This viewset automatically provides `list`, `create`, `retrieve`,
    and `update` actions.
    """

    permission_classes = (permissions.AllowAny,)
    http_method_names = ['get', 'post', 'put', 'patch']
    queryset = CreditTrade.objects.select_related('status',
                                                  'initiator',
                                                  'respondent',
                                                  'type',
                                                  'zero_reason',
                                                  'compliance_period')\
        .prefetch_related('credits_from', 'credits_to')
    filter_backends = (filters.OrderingFilter,)
    ordering_fields = '__all__'
    ordering = ('-id',)
    serializer_class = CreditTradeSerializer
    serializer_classes = {
        'approve': CreditTradeApproveSerializer,
        'create': CreditTradeCreateSerializer,
        'default': CreditTradeSerializer,
        'history': CreditTradeHistorySerializer,
        'list': CreditTradeListSerializer,
        'list_recorded': CreditTradeListSerializer,
        'partial_update': CreditTradeUpdateSerializer,
        'update': CreditTradeUpdateSerializer
    }

    def get_serializer_class(self):
        if self.action in list(self.serializer_classes.keys()):
            return self.serializer_classes[self.action]

        return self.serializer_classes['default']

    def get_queryset(self):
        """
        This view should return a list of all the purchases
        for the currently authenticated user.
        """
        user = self.request.user
        return CreditTradeService.get_organization_credit_trades(
            user.organization)

    @method_decorator(permission_required('VIEW_CREDIT_TRANSFERS'))
    def list(self, request, *args, **kwargs):
        """
        Shows the credit transfers for the current organization.
        Government users will see all transfers that are marked accepted
        and up.
        """
        # Explicitly filter out Approved ones in list as we should only
        # be showing Completed here
        # Note: We did not update the CreditTradeService found in
        # get_queryset as we have other API that uses the same service call,
        # but want the Approved transfers included (such as list_recorded)
        credit_trades = self.get_queryset().filter(
            ~Q(status__status__in=["Recorded"])
        ).order_by(*self.ordering)

        # For hash computation
        most_recent_updated_credit_trade = self.get_queryset().exclude(
            Q(update_timestamp=None)) \
            .order_by('-update_timestamp').first()

        most_recent_created_credit_trade = self.get_queryset().exclude(
            Q(create_timestamp=None)) \
            .order_by('-create_timestamp').first()

        most_recent_updated_organization = Organization.objects.filter(
            ~Q(update_timestamp=None)) \
            .order_by('-update_timestamp').first()

        digest = hashlib.sha256()
        # you could use anything here (like perhaps the PID or startup time
        digest.update(b'salt')
        digest.update('user {}'.format(self.request.user.username).encode('utf-8'))
        if most_recent_updated_organization:
            digest.update('org {}'.format(
                most_recent_updated_organization.name).encode('utf-8'))
        digest.update(most_recent_updated_credit_trade.update_timestamp
                      .isoformat()
                      .encode('utf-8')
                      if most_recent_updated_credit_trade is not None else b'')
        digest.update(most_recent_created_credit_trade.create_timestamp
                      .isoformat()
                      .encode('utf-8')
                      if most_recent_created_credit_trade is not None else b'')
        etag = 'W/"{}"'.format(digest.hexdigest())

        # Browser has an up-to-date copy
        if 'HTTP_IF_NONE_MATCH' in request.META and etag == \
                request.META['HTTP_IF_NONE_MATCH']:
            response = Response(status=status.HTTP_304_NOT_MODIFIED)
            response['ETag'] = etag
            return response

        serializer = self.get_serializer(credit_trades, many=True)

        response = Response(serializer.data)
        response['ETag'] = etag
        return response

    def perform_create(self, serializer):
        credit_trade = serializer.save()
        CreditTradeService.create_history(credit_trade, True)
        CreditTradeService.dispatch_notifications(None, credit_trade)

    def perform_update(self, serializer):
        previous_state = self.get_object()
        credit_trade = serializer.save()
        # we only want to create history and send notifications
        # when a status change occurs
        if previous_state.status != 'Rescinded':
            if previous_state.status != credit_trade.status or credit_trade.is_rescinded:
                CreditTradeService.create_history(credit_trade, False)
                status_cancelled = CreditTradeStatus.objects.get(status="Cancelled")
                if serializer.data['status'] != status_cancelled.id:
                    CreditTradeService.dispatch_notifications(
                        previous_state, credit_trade)

    @action(detail=True, methods=['put'])
    def delete(self, request, pk=None):
        """
        Marks the Credit Trade as Cancelled
        """
        credit_trade = self.get_object()
        status_cancelled = CreditTradeStatus.objects.get(status="Cancelled")
        credit_trade.status = status_cancelled
        credit_trade.save()

        return Response(None, status=status.HTTP_200_OK)

    @action(detail=True, methods=['put'])
    @method_decorator(permission_required('APPROVE_CREDIT_TRANSFER'))
    def approve(self, request, pk=None):
        """
        Marks the Credit Trade as Approved
        Transfers the Credits
        Then, marks the Credit Trade as Completed
        """
        try:
            credit_trade = self.get_object()
            previous_state = credit_trade

            if credit_trade.compliance_period_id is None:
                credit_trade.compliance_period_id = \
                    CreditTradeService.get_compliance_period_id(credit_trade)

            serializer = self.get_serializer(credit_trade, data=request.data)
            serializer.is_valid(raise_exception=True)

            completed_credit_trade = CreditTradeService.approve(
                credit_trade, request.user
            )
            serializer = self.get_serializer(completed_credit_trade)

            CreditTradeService.dispatch_notifications(previous_state,
                                                      completed_credit_trade)
        except Exception as e:
            print(e)
            return Response(None, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'])
    @method_decorator(permission_required('VIEW_APPROVED_CREDIT_TRANSFERS'))
    def list_recorded(self, request):
        """
        Returns a list of Recorded Credit Trades only
        """
        status_approved = CreditTradeStatus.objects \
            .get(status="Recorded")

        credit_trades = CreditTrade.objects.filter(
            status_id=status_approved.id).order_by('id')
        serializer = self.get_serializer(credit_trades, many=True)

        return Response(serializer.data)

    @action(detail=False, methods=['put'])
    @method_decorator(permission_required('USE_HISTORICAL_DATA_ENTRY'))
    def batch_process(self, request):
        """
        Call the approve function on multiple Credit Trades
        """
        status_approved = CreditTradeStatus.objects \
            .get(status="Recorded")

        credit_trades = CreditTrade.objects.filter(
            status_id=status_approved.id).order_by('id')

        CreditTradeService.validate_credits(credit_trades)

        for credit_trade in credit_trades:
            credit_trade.update_user_id = request.user.id
            CreditTradeService.approve(credit_trade,batch_process=True)
            CreditTradeService.dispatch_notifications(
                None, credit_trade)

        return Response({"message":
                             "Approved credit transactions have been processed."},
                        status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'])
    @method_decorator(permission_required('VIEW_CREDIT_TRANSFERS'))
    def xls(self, request):
        """
        Exports the credit transfers and organizations table
        as a spreadsheet
        """
        response = HttpResponse(content_type='application/ms-excel')
        response['Content-Disposition'] = (
            'attachment; filename="{}.xls"'.format(
                datetime.datetime.now().strftime(
                    "BC-LCFS_credit_transactions_%Y-%m-%d")
            ))

        credit_trades = self.get_queryset().filter(
            ~Q(status__status__in=["Recorded"])
        ).order_by(*self.ordering)

        # Allow filter by organization (for government users only)
        if (request.user.is_government_user and
                request.query_params.get('organization_id') is not None):
            organization = get_object_or_404(
                Organization,
                pk=request.query_params.get('organization_id'))
            credit_trades = credit_trades.filter(
                Q(initiator=organization) | Q(respondent=organization)
            )

        workbook = SpreadSheetBuilder()
        workbook.add_credit_transfers(credit_trades, request.user)

        if request.user.is_government_user:
            fuel_suppliers = Organization.objects.extra(
                select={'lower_name': 'lower(name)'}) \
                .filter(type=OrganizationType.objects.get(
                    type="Part3FuelSupplier")) \
                .order_by('lower_name')

            workbook.add_fuel_suppliers(fuel_suppliers)

        workbook.save(response)

        return response
