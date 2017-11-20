from rest_framework import viewsets, permissions, status, mixins
from rest_framework.decorators import list_route, detail_route
from rest_framework.response import Response

from auditable.views import AuditableMixin

from api.models.CreditTrade import CreditTrade
from api.models.CreditTradeHistory import CreditTradeHistory
from api.models.CreditTradeStatus import CreditTradeStatus
from api.models.OrganizationBalance import OrganizationBalance
from api.models.Organization import Organization
from api.serializers import CreditTradeCreateSerializer
from api.serializers import CreditTradeHistoryCreateSerializer
from api.serializers import CreditTradeApproveSerializer
from api.serializers import CreditTrade2Serializer as CreditTradeSerializer
from api.serializers import CreditTradeHistory2Serializer \
    as CreditTradeHistorySerializer

from api.services.CreditTradeService import CreditTradeService

from pprint import pprint
from datetime import date

# class CreditTradeViewSet(AuditableMixin, viewsets.ModelViewSet):
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
    serializer_class = CreditTradeSerializer
    serializer_classes = {
        'create': CreditTradeCreateSerializer,
        'update': CreditTradeCreateSerializer,
        'default': CreditTradeSerializer,
        'history': CreditTradeHistorySerializer,
        'approve': CreditTradeApproveSerializer,
    }

    def get_serializer_class(self):
        if self.action in list(self.serializer_classes.keys()):
            return self.serializer_classes[self.action]
        else:
            return self.serializer_classes['default']

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
    def delete(self):
        """Destroys the specified credit trade"""
        pass

    @detail_route(methods=['put'])
    def approve(self, request, pk=None):
        """Approve an "On Director's approval" trade"""
        # update record to status 'approve' (create credit trade history)
        # apply credits to fuel

        # create OrganizationBalance record for credits applied
        # update record to status 'completed' (create credit trade history)
        print("Here in viewset")
        # CreditTrade.approve()
        print("after")
        import traceback
        try:

            status_approved = CreditTradeStatus.objects.get(
                status="Approved")
            status_completed = CreditTradeStatus.objects.get(
                status="Completed")

            credit_trade = CreditTrade.objects.get(id=pk)

            pprint(vars(credit_trade))
            pprint(vars(credit_trade.credits_from))

            print("Approved id:", status_approved.id)
            # Check if credit_trade is not yet approved
            if credit_trade.status.id >= status_approved.id:
                return Response(status=status.HTTP_400_BAD_REQUEST)

            # CreditTrade
            # self.update(request)

            # instance = self.get_object()
            # serializer = self.get_serializer(credit_trade, data=request.data)
            # print(request.data)
            # print(serializer)
            # print("valid?", serializer.is_valid())
            #
            # print("errors?", serializer.errors)
            # print("serialized data", serializer.validated_data)

            todays_date = date.today()

            # Approve with today's date
            # serializer.save(status=status_approved,
            #                 trade_effective_date=todays_date)

            credit_trade.status_id = status_approved.id
            # credit_trade.save()



            # history = CreditTradeHistory(
            #  credit_trade_id=credit_trade.id,
            #  respondent_id=credit_trade.respondent.id,
            #  status_id=credit_trade.status.id,
            #  type_id=credit_trade.type.id,
            #  newNumberOfCredits=credit_trade.numberOfCredits,
            #  newFairMarketValuePerCredit=credit_trade.fairMarketValuePerCredit,
            #  zero_reason_id=credit_trade.zero_reason,
            #  newTradeEffectiveDate=credit_trade.trade_effective_date,
            #  newNote=credit_trade.note,
            # )
            # history.save()

            CreditTradeService.transfer_credits(
                credit_trade.credits_from,
                credit_trade.credits_to,
                credit_trade.id,
                credit_trade.numberOfCredits,
                todays_date)

            # Complete with today's date
            # serializer.save(status=status_completed,
            #                 trade_effective_date=todays_date)


            # num_of_credits_involved = credit_trade.numberOfCredits
            #
            # fs_initiator = credit_trade.initiator
            #
            # if credit_trade.type.id > 2:
            #     # Government involved transaction
            #     if fs_initiator is not None:
            #         raise BaseException
            #
            #
            #
            # else:
            #     # Initiator can't be null
            #     if fs_initiator is None:
            #         raise BaseException

                # if credit_trade.type_id == 1

            # Create history
            # CreditTradeService.create_history(serializer.data, False)


            # Create Organization Balance Records, depending on the credit trade
            # type

            # print()

            # if (fs_initiator is None and credit_trade.type.theType)
            # if fs_initiator is None:
            #     fs_initiator = Government()
            #     # fs_initiator_starting_balance = {'validatedCredits': 100000000000000000000}
            #
            # else:
            #     fs_initiator_starting_balance = OrganizationBalance.objects.get(
            #         organization=fs_initiator,
            #         expiration_date=None)
            #
            # print("Initiator", fs_initiator)
            #
            # fs_respondent = credit_trade.respondent
            # print("Respondent", fs_respondent)
            #
            # # If the government is granting this supplier new credits
            # # there is no need for the initiator starting balance
            #
            # fs_respondent_starting_balance = OrganizationBalance.objects.get(
            #     organization=fs_respondent,
            #     expiration_date=None)
            #
            # fs_respondent_final_credit_balance = fs_respondent_starting_balance
            #
            # print("starting balance (initiator)")
            # pprint(fs_initiator_starting_balance)
            #
            # print("starting balance (respondent)")
            # pprint(fs_respondent_starting_balance)



            # Complete Trade
            # serializer.save(status=status_completed,
            #                 trade_effective_date=todays_date)
        except:
            print("Something bad happened")
            tb = traceback.format_exc()
        else:
            tb = "no error"
        finally:
            print(tb)
        print("all done-----")

        return Response(serializer.data, status=status.HTTP_200_OK)
