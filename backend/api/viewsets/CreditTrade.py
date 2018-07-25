import datetime
import hashlib

from django.db.models import Q

from rest_framework import viewsets, permissions, status, mixins
from rest_framework.decorators import list_route, detail_route
from rest_framework.response import Response
from rest_framework import filters

from auditable.views import AuditableMixin

from api.decorators import permission_required

from api.models.CreditTrade import CreditTrade
from api.models.CreditTradeStatus import CreditTradeStatus

from api.serializers import CreditTrade2Serializer as CreditTradeSerializer
from api.serializers import CreditTradeApproveSerializer
from api.serializers import CreditTradeCreateSerializer
from api.serializers import CreditTradeHistory2Serializer \
    as CreditTradeHistorySerializer
from api.serializers import CreditTradeListSerializer
from api.serializers import CreditTradeUpdateSerializer

from api.services.CreditTradeService import CreditTradeService


class CreditTradeViewSet(AuditableMixin, mixins.CreateModelMixin,
                         mixins.RetrieveModelMixin, mixins.UpdateModelMixin,
                         mixins.ListModelMixin, viewsets.GenericViewSet):
    """
    This viewset automatically provides `list`, `create`, `retrieve`,
    and `update` actions.
    """

    permission_classes = (permissions.AllowAny,)
    http_method_names = ['get', 'post', 'put', 'patch']
    queryset = CreditTrade.objects.all()
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
        'list_approved': CreditTradeListSerializer,
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

    def list(self, request, *args, **kwargs):
        # Explicitly filter out Approved ones in list as we should only
        # be showing Completed here
        # Note: Don't add this in the CreditTradeService
        # IDIR users should still Approved statuses in other areas
        credit_trades = self.get_queryset().filter(
            ~Q(status__status__in=["Approved"])
        ).order_by(*self.ordering)

        # For hash computation
        most_recent_updated_credit_trade = self.get_queryset().exclude(
            Q(update_timestamp=None))\
            .order_by('-update_timestamp').first()

        most_recent_created_credit_trade = self.get_queryset().exclude(
            Q(create_timestamp=None)) \
            .order_by('-create_timestamp').first()

        digest = hashlib.sha256()
        # you could use anything here (like perhaps the PID or startup time
        digest.update(b'salt')
        digest.update(most_recent_updated_credit_trade.update_timestamp.isoformat()
                      .encode('utf-8') if most_recent_updated_credit_trade is not None else b'')
        digest.update(most_recent_created_credit_trade.create_timestamp.isoformat()
                      .encode('utf-8') if most_recent_created_credit_trade is not None else b'')
        etag = 'W/"{}"'.format(digest.hexdigest())

        # Browser has an up-to-date copy
        if 'HTTP_IF_NONE_MATCH' in request.META and etag == request.META['HTTP_IF_NONE_MATCH']:
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

    def perform_update(self, serializer):
        credit_trade = serializer.save()
        CreditTradeService.create_history(credit_trade, False)

    @detail_route(methods=['put'])
    def delete(self, request, pk=None):
        """
        Marks the Credit Trade as Cancelled
        """
        credit_trade = self.get_object()
        status_cancelled = CreditTradeStatus.objects.get(status="Cancelled")
        credit_trade.status = status_cancelled
        credit_trade.save()

        return Response(None, status=status.HTTP_200_OK)

    @detail_route(methods=['put'])
    @permission_required('APPROVE_CREDIT_TRANSFER')
    def approve(self, request, pk=None):
        """
        Marks the Credit Trade as Approved
        Transfers the Credits
        Then, marks the Credit Trade as Completed
        """
        credit_trade = self.get_object()
        credit_trade.trade_effective_date = datetime.date.today()

        serializer = self.get_serializer(credit_trade, data=request.data)
        serializer.is_valid(raise_exception=True)

        completed_credit_trade = CreditTradeService.approve(credit_trade)
        serializer = self.get_serializer(completed_credit_trade)

        return Response(serializer.data, status=status.HTTP_200_OK)

    @list_route(methods=['get'])
    @permission_required('VIEW_APPROVED_CREDIT_TRANSFERS')
    def list_approved(self, request):
        """
        Returns a list of Approved Credit Trades only
        """
        status_approved = CreditTradeStatus.objects \
                                           .get(status="Approved")

        credit_trades = CreditTrade.objects.filter(
            status_id=status_approved.id).order_by('id')
        serializer = self.get_serializer(credit_trades, many=True)

        return Response(serializer.data)

    @list_route(methods=['put'])
    @permission_required('APPROVE_CREDIT_TRANSFER')
    def batch_process(self, request):
        """
        Call the approve function on multiple Credit Trades
        """
        status_approved = CreditTradeStatus.objects \
                                           .get(status="Approved")

        credit_trades = CreditTrade.objects.filter(
            status_id=status_approved.id).order_by('id')

        CreditTradeService.validate_credits(credit_trades)

        for credit_trade in credit_trades:
            credit_trade.update_user_id = request.user.id
            CreditTradeService.approve(credit_trade)

        return Response({"message":
                         "Approved Credit Transactions have been processed."},
                        status=status.HTTP_200_OK)
