from server.models.CreditTradeHistory import CreditTradeHistory
from server.models.FuelSupplierBalance import FuelSupplierBalance

from server.exceptions import PositiveIntegerException
from django.core.exceptions import ValidationError


class CreditTradeService(object):

    @staticmethod
    def create_history(credit_trade, is_new=True):
        """
        Create the CreditTradeHistory
        """
        new_status = credit_trade.creditTradeStatusFK

        try:
            previous_history = CreditTradeHistory.objects \
                .select_related('creditTradeStatusFK') \
                .filter(creditTradeFK=credit_trade.id) \
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
            credit_trade.create_timestamp
            if is_new
            else credit_trade.update_timestamp)

        user = (
            credit_trade.create_user
            if is_new
            else credit_trade.update_user)

        history = CreditTradeHistory(
            creditTradeFK_id=credit_trade.id,
            newRespondentFK_id=credit_trade.respondentFK.id,
            creditTradeStatusFK_id=credit_trade.creditTradeStatusFK.id,
            creditTradeTypeFK_id=credit_trade.creditTradeTypeFK.id,
            newNumberOfCredits=credit_trade.numberOfCredits,
            newFairMarketValuePerCredit=credit_trade.fairMarketValuePerCredit,
            newCreditTradeZeroReasonFK_id=credit_trade.creditTradeZeroReasonFK,
            newTradeEffectiveDate=credit_trade.tradeEffectiveDate,
            newNote=credit_trade.note,
            isInternalHistoryRecord=is_internal_history_record,
            creditTradeUpdateTime=credit_trade_update_time,
            create_user=user,
            update_user=user,
            userFK=user
        )

        # Validate
        try:
            history.full_clean()
        except ValidationError as e:
            # TODO: Do something based on the errors contained in e.message_dict
            # Display them to a user, or handle them programmatically.
            print("Throw error", e.message_dict)
            pass

        history.save()

    @staticmethod
    def gov_transfer_credits(_to, credit_trade_id, num_of_credits,
                             effective_date, action='increase'):
        to_starting_bal = FuelSupplierBalance.objects.get(
            fuelSupplierFK_id=_to.id,
            endDate=None)

        if 'increase' == action:
            to_credits = to_starting_bal.validatedCredits + num_of_credits
        else:
            to_credits = to_starting_bal.validatedCredits - num_of_credits

        if 0 > to_credits:
            raise PositiveIntegerException("Can't complete transaction,"
                                           "insufficient credits")

        to_starting_bal.endDate = effective_date

        to_new_bal = FuelSupplierBalance(
            fuelSupplierFK=_to,
            validatedCredits=to_credits,
            effectiveDate=effective_date,
            creditTradeFK_id=credit_trade_id
        )

        # Save everything
        to_starting_bal.save()
        to_new_bal.save()

    @staticmethod
    def transfer_credits(_from, _to, credit_trade_id, num_of_credits,
                         effective_date):
        from_starting_bal = FuelSupplierBalance.objects.get(
            fuelSupplierFK_id=_from.id)

        to_starting_bal = FuelSupplierBalance.objects.get(
            fuelSupplierFK_id=_to.id,
            endDate=None)

        # Compute for end balance
        from_credits = from_starting_bal.validatedCredits - num_of_credits
        to_credits = to_starting_bal.validatedCredits + num_of_credits

        if 0 > from_credits:
            raise PositiveIntegerException("Can't complete transaction,"
                                           "insufficient credits")

        # Update old balance effective date
        from_starting_bal.endDate = effective_date
        to_starting_bal.endDate = effective_date

        # Create new fuel supplier balance
        from_new_bal = FuelSupplierBalance(
            fuelSupplierFK=_from,
            validatedCredits=from_credits,
            effectiveDate=effective_date,
            creditTradeFK_id=credit_trade_id
        )

        to_new_bal = FuelSupplierBalance(
            fuelSupplierFK=_to,
            validatedCredits=to_credits,
            effectiveDate=effective_date,
            creditTradeFK_id=credit_trade_id
        )

        # Save everything
        from_starting_bal.save()
        to_starting_bal.save()
        from_new_bal.save()
        to_new_bal.save()