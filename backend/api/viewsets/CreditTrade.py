from rest_framework import viewsets, permissions, status, mixins
from rest_framework.decorators import list_route, detail_route
from rest_framework.response import Response
from rest_framework import filters

from auditable.views import AuditableMixin

from api.models.CreditTrade import CreditTrade
from api.models.CreditTradeHistory import CreditTradeHistory
from api.models.CreditTradeStatus import CreditTradeStatus

from api.serializers import CreditTradeCreateSerializer
from api.serializers import CreditTradeUpdateSerializer
from api.serializers import CreditTradeApproveSerializer
from api.serializers import CreditTrade2Serializer as CreditTradeSerializer
from api.serializers import CreditTradeHistory2Serializer \
    as CreditTradeHistorySerializer

from api.services.CreditTradeService import CreditTradeService


class CreditTradeViewSet(AuditableMixin, mixins.CreateModelMixin,
                         mixins.RetrieveModelMixin, mixins.UpdateModelMixin,
                         mixins.ListModelMixin, viewsets.GenericViewSet):
    """
    This viewset automatically provides `list`, `create`, `retrieve`,
    `update` and `destroy` actions.
    """

    permission_classes = (permissions.AllowAny,)
    http_method_names = ['get', 'post', 'put']
    queryset = CreditTrade.objects.all()
    filter_backends = (filters.OrderingFilter,)
    ordering_fields = '__all__'
    ordering = ('-id',)
    serializer_class = CreditTradeSerializer
    serializer_classes = {
        'create': CreditTradeCreateSerializer,
        'update': CreditTradeUpdateSerializer,
        'default': CreditTradeSerializer,
        'history': CreditTradeHistorySerializer,
        'approve': CreditTradeApproveSerializer,
    }

    def get_serializer_class(self):
        if self.action in list(self.serializer_classes.keys()):
            return self.serializer_classes[self.action]
        else:
            return self.serializer_classes['default']

    def get_queryset(self):
        """
        This view should return a list of all the purchases
        for the currently authenticated user.
        """
        user = self.request.user
        return CreditTradeService.get_organization_credit_trades(
            user.organization)

    def perform_create(self, serializer):
        credit_trade = serializer.save()
        CreditTradeService.create_history(credit_trade, True)

    def perform_update(self, serializer):
        credit_trade = serializer.save()
        CreditTradeService.create_history(credit_trade, False)

    @list_route(methods=['post'])
    def bulk(self):
        pass

    @detail_route()
    def history(self, request, pk=None):
        """
        Get the credit trade history
        """
        credit_trade = self.get_object()
        history = CreditTradeHistory.objects.filter(credit_trade=credit_trade)
        serializer = self.get_serializer(history, many=True)

        return Response(serializer.data)

    @detail_route(methods=['put'])
    def delete(self, request, pk=None):
        credit_trade = self.get_object()
        status_cancelled = CreditTradeStatus.objects.get(status="Cancelled")
        credit_trade.status = status_cancelled
        credit_trade.save()

        return Response(None, status=status.HTTP_200_OK)

    @detail_route(methods=['put'])
    def approve(self, request, pk=None):

        credit_trade = self.get_object()

        completed_credit_trade = CreditTradeService.approve(credit_trade,
                                                            request.user)
        serializer = self.get_serializer(completed_credit_trade)

        return Response(serializer.data, status=status.HTTP_200_OK)

    @list_route(methods=['get'])
    def list_approved(self, request):
        status_approved = CreditTradeStatus.objects \
                                           .get(status="Approved")

        credit_trades = CreditTrade.objects.filter(
            status_id=status_approved.id).order_by('id')
        serializer = self.get_serializer(credit_trades, many=True)

        return Response(serializer.data)

    @list_route(methods=['put'])
    def batch_process(self, request):
        status_approved = CreditTradeStatus.objects \
                                           .get(status="Approved")

        credit_trades = CreditTrade.objects.filter(
            status_id=status_approved.id).order_by('id')

        CreditTradeService.validate_credits(credit_trades)

        for credit_trade in credit_trades:
            credit_trade.update_user_id = request.user.id
            CreditTradeService.approve(credit_trade,
                                       request.user)

        return Response({"message":
                         "Approved Credit Transfers have been processed."},
                        status=status.HTTP_200_OK)
