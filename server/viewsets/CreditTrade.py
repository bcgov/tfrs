
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import list_route, detail_route
from rest_framework.response import Response


from auditable.views import AuditableMixin

from server.models.CreditTrade import CreditTrade
from server.models.CreditTradeHistory import CreditTradeHistory
from server.models.CreditTradeStatus import CreditTradeStatus
from server.serializers import CreditTradeCreateSerializer
from server.serializers import CreditTradeHistoryCreateSerializer
from server.serializers import CreditTrade2Serializer as CreditTradeSerializer
from server.serializers import CreditTradeHistory2Serializer\
    as CreditTradeHistorySerializer


class CreditTradeViewSet(AuditableMixin, viewsets.ModelViewSet):
    """
    This viewset automatically provides `list`, `create`, `retrieve`,
    `update` and `destroy` actions.
    """

    permission_classes = (permissions.AllowAny,)
    http_method_names = ['get', 'post', 'put', 'delete', 'head', 'options',
                         'trace']
    queryset = CreditTrade.objects.all()
    serializer_class = CreditTradeSerializer
    serializer_classes = {
        'create': CreditTradeCreateSerializer,
        'update': CreditTradeCreateSerializer,
        'default': CreditTradeSerializer,
        'history': CreditTradeHistorySerializer
    }

    def get_serializer_class(self):
        if self.action in list(self.serializer_classes.keys()):
            return self.serializer_classes[self.action]
        else:
            return self.serializer_classes['default']

    @staticmethod
    def create_history(credit_trade, is_new=True):
        """
        Create the CreditTradeHistory
        """
        new_status = CreditTradeStatus.objects.get(
            pk=credit_trade['creditTradeStatusFK'])

        try:
            previous_history = CreditTradeHistory.objects\
                                         .select_related('creditTradeStatusFK')\
                                         .filter(creditTradeFK=credit_trade['id'])\
                                         .latest('create_timestamp')
        except CreditTradeHistory.DoesNotExist:
            previous_history = None

        # This is only set to true if:
        # - the status of the Credit Trade is "Draft"
        # - the previous status of the Credit Trade is "Draft" and the new
        #   status of the Credit Trade is "Cancelled".
        is_internal_history_record = False

        if (new_status.status == 'Draft' or
                (not is_new and
                 new_status.status == 'Cancelled' and
                 previous_history.creditTradeStatusFK.status == 'Draft')):
            is_internal_history_record = True

        credit_trade_update_time = (
            credit_trade['create_timestamp']
            if is_new
            else credit_trade['update_timestamp'])

        user = (
            credit_trade['create_user']
            if is_new
            else credit_trade['update_user'])

        history = {
            'creditTradeFK':
                credit_trade['id'],
            'newRespondentFK':
                credit_trade['respondentFK'],
            'creditTradeStatusFK':
                credit_trade['creditTradeStatusFK'],
            'creditTradeTypeFK':
                credit_trade['creditTradeTypeFK'],
            'newNumberOfCredits':
                credit_trade['numberOfCredits'],
            'newFairMarketValuePerCredit':
                credit_trade['fairMarketValuePerCredit'],
            'newCreditTradeZeroReasonFK':
                credit_trade['creditTradeZeroReasonFK'],
            'newTradeEffectiveDate':
                credit_trade['tradeEffectiveDate'],
            'newNote':
                credit_trade['note'],
            'isInternalHistoryRecord':
                is_internal_history_record,
            'creditTradeUpdateTime':
                credit_trade_update_time,
            'create_user':
                user,
            'update_user':
                user,
            'userFK':
                user
        }

        serializer = CreditTradeHistoryCreateSerializer(data=history)

        serializer.is_valid(raise_exception=True)
        serializer.save()

    def create(self, request, *args, **kwargs):
        """
        Create a new credit trade
        """
        request = self.audit(request)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        self.perform_create(serializer)
        self.create_history(serializer.data, True)

        headers = self.get_success_headers(serializer.data)

        return Response(serializer.data, status=status.HTTP_201_CREATED,
                        headers=headers)

    def update(self, request, *args, **kwargs):
        """
        Update the credit trade
        """
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data,
                                         partial=partial)
        serializer.is_valid(raise_exception=True)

        self.perform_update(serializer)
        self.create_history(serializer.data, False)

        if getattr(instance, '_prefetched_objects_cache', None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)

    @list_route(methods=['post'])
    def bulk(self):
        pass

    @list_route()
    def search(self, request):
        pass

    @detail_route()
    def history(self, request, pk=None):
        """
        Get the credit trade history
        """
        credit_trade = self.get_object()
        history = CreditTradeHistory.objects.filter(creditTradeFK=credit_trade)
        serializer = self.get_serializer(history, many=True)

        return Response(serializer.data)

