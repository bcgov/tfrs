from api.models.CreditTradeHistory import CreditTradeHistory
from api.models.CreditTradeStatus import CreditTradeStatus
from api.models.OrganizationBalance import OrganizationBalance

from api.exceptions import PositiveIntegerException
from django.core.exceptions import ValidationError

import datetime


class CreditTradeService(object):

    @staticmethod
    def create_history(credit_trade, is_new=False):
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
                 new_status.status == 'Rescinded' and
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
            number_of_credits=credit_trade.number_of_credits,
            fair_market_value_per_credit=credit_trade.fair_market_value_per_credit,
            zero_reason_id=credit_trade.zero_reason,
            trade_effective_date=credit_trade.trade_effective_date,
            note=credit_trade.note,
            is_internal_history_record=is_internal_history_record,
            credit_trade_update_time=credit_trade_update_time,
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
    def approve(credit_trade):

        status_approved = CreditTradeStatus.objects.get(status="Approved")
        status_completed = CreditTradeStatus.objects.get(status="Completed")

        credit_trade.status = status_approved
        CreditTradeService.create_history(credit_trade)
        credit_trade.save()

        effective_date = datetime.date.today()
        CreditTradeService.transfer_credits(
            credit_trade.credits_from,
            credit_trade.credits_to,
            credit_trade.id,
            credit_trade.number_of_credits,
            effective_date
        )

        credit_trade.status = status_completed
        credit_trade.trade_effective_date = effective_date
        CreditTradeService.create_history(credit_trade)
        credit_trade.save()

        return credit_trade

    @staticmethod
    def transfer_credits(_from, _to, credit_trade_id, num_of_credits,
                         effective_date):
        from_starting_bal = OrganizationBalance.objects.get(
            organization_id=_from.id)

        to_starting_bal = OrganizationBalance.objects.get(
            organization_id=_to.id,
            expiration_date=None)

        # Compute for end balance
        from_credits = from_starting_bal.validated_credits - num_of_credits
        to_credits = to_starting_bal.validated_credits + num_of_credits

        if 0 > from_credits:
            raise PositiveIntegerException("Can't complete transaction,"
                                           "insufficient credits")

        # Update old balance effective date
        from_starting_bal.expiration_date = effective_date
        to_starting_bal.expiration_date = effective_date

        # Create new fuel supplier balance
        from_new_bal = OrganizationBalance(
            organization=_from,
            validated_credits=from_credits,
            effective_date=effective_date,
            credit_trade_id=credit_trade_id
        )

        to_new_bal = OrganizationBalance(
            organization=_to,
            validated_credits=to_credits,
            effective_date=effective_date,
            credit_trade_id=credit_trade_id
        )

        # Save everything
        from_starting_bal.save()
        to_starting_bal.save()

        from_new_bal.save()
        to_new_bal.save()

        # print("to bal s", to_starting_bal.effective_date, vars(to_starting_bal))
        # print("to bal e", to_new_bal.effective_date, vars(to_new_bal))
        # print("from bal s", from_starting_bal.effective_date, vars(from_starting_bal))
        # print("from bal e", from_new_bal.effective_date, vars(from_new_bal))
