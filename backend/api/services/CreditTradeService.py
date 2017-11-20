from api.models.CreditTradeHistory import CreditTradeHistory
from api.models.OrganizationBalance import OrganizationBalance

from api.exceptions import PositiveIntegerException
from django.core.exceptions import ValidationError


class CreditTradeService(object):

    @staticmethod
    def create_history(credit_trade, is_new=True):
        """
        Create the CreditTradeHistory
        """
        new_status = credit_trade.status

        try:
            previous_history = CreditTradeHistory.objects \
                .select_related('status') \
                .filter(credit_trade=credit_trade.id) \
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
                 previous_history.status.status == 'Draft')):
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
            credit_trade_id=credit_trade.id,
            respondent_id=credit_trade.respondent.id,
            status_id=credit_trade.status.id,
            type_id=credit_trade.type.id,
            newNumberOfCredits=credit_trade.numberOfCredits,
            newFairMarketValuePerCredit=credit_trade.fairMarketValuePerCredit,
            zero_reason_id=credit_trade.zero_reason,
            trade_effective_date=credit_trade.trade_effective_date,
            newNote=credit_trade.note,
            isInternalHistoryRecord=is_internal_history_record,
            creditTradeUpdateTime=credit_trade_update_time,
            create_user=user,
            update_user=user,
            user=user
        )

        # Validate
        try:
            history.full_clean()
        except ValidationError as e:
            # TODO: Do something based on the errors contained in e.message_dict
            # Display them to a user, or handle them programmatically.
            raise ValidationError(e)

        history.save()

    @staticmethod
    def gov_transfer_credits(_to, credit_trade_id, num_of_credits,
                             effective_date, action='increase'):
        to_starting_bal = OrganizationBalance.objects.get(
            organization_id=_to.id,
            expiration_date=None)

        if 'increase' == action:
            to_credits = to_starting_bal.validatedCredits + num_of_credits
        else:
            to_credits = to_starting_bal.validatedCredits - num_of_credits

        if 0 > to_credits:
            raise PositiveIntegerException("Can't complete transaction,"
                                           "insufficient credits")

        to_starting_bal.expiration_date = effective_date

        to_new_bal = OrganizationBalance(
            organization=_to,
            validatedCredits=to_credits,
            effective_date=effective_date,
            credit_trade_id=credit_trade_id
        )

        # Save everything
        to_starting_bal.save()
        to_new_bal.save()

    @staticmethod
    def transfer_credits(_from, _to, credit_trade_id, num_of_credits,
                         effective_date):
        from_starting_bal = OrganizationBalance.objects.get(
            organization_id=_from.id)

        to_starting_bal = OrganizationBalance.objects.get(
            organization_id=_to.id,
            expiration_date=None)

        # Compute for end balance
        from_credits = from_starting_bal.validatedCredits - num_of_credits
        to_credits = to_starting_bal.validatedCredits + num_of_credits

        if 0 > from_credits:
            raise PositiveIntegerException("Can't complete transaction,"
                                           "insufficient credits")

        # Update old balance effective date
        from_starting_bal.expiration_date = effective_date
        to_starting_bal.expiration_date = effective_date

        # Create new fuel supplier balance
        from_new_bal = OrganizationBalance(
            organization=_from,
            validatedCredits=from_credits,
            effective_date=effective_date,
            credit_trade_id=credit_trade_id
        )

        to_new_bal = OrganizationBalance(
            organization=_to,
            validatedCredits=to_credits,
            effective_date=effective_date,
            credit_trade_id=credit_trade_id
        )

        # Save everything
        from_starting_bal.save()
        to_starting_bal.save()
        from_new_bal.save()
        to_new_bal.save()