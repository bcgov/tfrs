import datetime

from django.core.exceptions import ValidationError
from django.db.models import Q
from django.db import transaction

from api.models.CreditTradeHistory import CreditTradeHistory
from api.models.CreditTradeStatus import CreditTradeStatus
from api.models.Organization import Organization
from api.models.OrganizationBalance import OrganizationBalance
from api.models.CreditTrade import CreditTrade

from api.exceptions import PositiveIntegerException


class CreditTradeService(object):

    @staticmethod
    def get_organization_credit_trades(organization):
        """
        Fetch the credit transactions with various rules based on the user's
        organization
        """
        # Government Organization -- assume OrganizationType id 1 is gov
        gov_org = Organization.objects.get(type=1)
        if organization == gov_org:
            # If organization == Government
            #  don't show "Cancelled" transactions
            #  don't show "Draft", "Submitted" transactions unless the
            #  initiator was government
            #  (Please note that government creating drafts and submitted is
            #  for testing only, in reality government will not do this)
            credit_trades = CreditTrade.objects.filter(
                ~Q(status__status__in=["Cancelled"]) &
                (~Q(status__status__in=["Draft", "Submitted"]) |
                 Q(initiator=organization))
            )
        else:
            # If organization == Fuel Supplier
            #  don't show "Approved" transactions (only show Completed)
            #   don't show "Cancelled" transactions
            #   don't show "Draft" transactions unless the initiator was
            #   the fuel supplier
            #   show "Submitted" and other transactions where the fuel
            #   supplier is the respondent
            credit_trades = CreditTrade.objects.filter(
                ~Q(status__status__in=["Approved", "Cancelled"]) &
                ((~Q(status__status__in=["Draft"]) &
                  Q(respondent=organization)) | Q(initiator=organization))
            )

        return credit_trades

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

        zero_reason = None

        if credit_trade.zero_reason is not None:
            zero_reason = credit_trade.zero_reason.id

        history = CreditTradeHistory(
            credit_trade_id=credit_trade.id,
            respondent_id=credit_trade.respondent.id,
            status_id=credit_trade.status.id,
            type_id=credit_trade.type.id,
            number_of_credits=credit_trade.number_of_credits,
            fair_market_value_per_credit=credit_trade.
            fair_market_value_per_credit,
            zero_reason_id=zero_reason,
            trade_effective_date=credit_trade.trade_effective_date,
            note=credit_trade.note,
            compliance_period_id=credit_trade.compliance_period_id,
            is_internal_history_record=is_internal_history_record,
            credit_trade_update_time=credit_trade_update_time,
            rescinded=credit_trade.rescinded,
            create_user=user,
            update_user=user,
            user=user
        )

        # Validate
        try:
            history.full_clean()
        except ValidationError as error:
            # TODO: Do something based on the errors contained in
            # e.message_dict
            # Display them to a user, or handle them programmatically.
            raise ValidationError(error)

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
        CreditTradeService.create_history(credit_trade)
        credit_trade.save()

        return credit_trade

    @staticmethod
    @transaction.non_atomic_requests()
    def transfer_credits(_from, _to, credit_trade_id, num_of_credits,
                         effective_date):
        from_starting_bal, _ = OrganizationBalance.objects.get_or_create(
            organization_id=_from.id,
            expiration_date=None,
            defaults={'validated_credits': 0})

        to_starting_bal, _ = OrganizationBalance.objects.get_or_create(
            organization_id=_to.id,
            expiration_date=None,
            defaults={'validated_credits': 0})

        # Compute for end balance
        from_credits = from_starting_bal.validated_credits - num_of_credits
        to_credits = to_starting_bal.validated_credits + num_of_credits

        if from_credits < 0:
            raise PositiveIntegerException("Can't complete transaction,"
                                           "`{}` has insufficient credits"
                                           .format(_from.name))

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

    @staticmethod
    def validate_credits(credit_trades):
        errors = []
        temp_storage = []

        for credit_trade in credit_trades:
            from_starting_index, from_starting_balance = CreditTradeService. \
                get_temp_balance(temp_storage, credit_trade.credits_from.id)

            to_starting_index, to_starting_balance = CreditTradeService. \
                get_temp_balance(temp_storage, credit_trade.credits_to.id)

            from_credits_remaining = from_starting_balance - \
                credit_trade.number_of_credits

            to_credits_remaining = to_starting_balance + \
                credit_trade.number_of_credits

            CreditTradeService.update_temp_balance(
                temp_storage,
                from_starting_index,
                from_credits_remaining,
                credit_trade.credits_from.id)

            CreditTradeService.update_temp_balance(
                temp_storage,
                to_starting_index,
                to_credits_remaining,
                credit_trade.credits_to.id)

            if from_credits_remaining < 0:
                errors.append(
                    "[ID: {}] "
                    "Can't complete transaction,"
                    "`{}` has insufficient credits.".
                    format(credit_trade.id, credit_trade.credits_from.name))

        if errors:
            raise PositiveIntegerException(errors)

    @staticmethod
    def get_temp_balance(storage, id):
        starting_balance = None
        index = None

        if len(storage) > 0:
            for balance_index, balance in enumerate(storage):
                if balance["id"] == id:
                    starting_balance = balance["credits"]
                    index = balance_index

        if starting_balance is None:
            try:  # if balance hasn't been populated, get from the database
                organization_balance = OrganizationBalance.objects.get(
                    organization_id=id,
                    expiration_date=None)

                starting_balance = organization_balance.validated_credits
            except OrganizationBalance.DoesNotExist:
                starting_balance = 0

        return index, starting_balance

    @staticmethod
    def update_temp_balance(storage, index, credits, id):
        if index is None:
            storage.append({
                "id": id,
                "credits": credits
            })
        else:
            storage[index]["credits"] = credits
