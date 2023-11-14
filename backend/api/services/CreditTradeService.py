import pytz
from datetime import datetime, date, time
from dateutil.parser import parse
from collections import defaultdict, namedtuple
from dateutil.relativedelta import relativedelta
from django.utils import timezone

from django.core.exceptions import ValidationError
from django.db.models import Q
from django.db import transaction

from api.models.CompliancePeriod import CompliancePeriod
from api.models.CreditTradeHistory import CreditTradeHistory
from api.models.CreditTradeStatus import CreditTradeStatus
from api.models.CreditTradeCategory import CreditTradeCategory
from api.models.Organization import Organization
from api.models.OrganizationBalance import OrganizationBalance
from api.models.CreditTrade import CreditTrade

from api.exceptions import PositiveIntegerException
from api.notifications.notification_types import NotificationType
from api.async_tasks import async_send_notification, async_send_notifications

from django.db.transaction import on_commit


class CreditTradeService(object):
    """
    Helper functions for Credit Trades
    """

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
            #  don't show "Refused" transactions
            #  don't show "Draft", "Submitted" transactions unless the
            #  initiator was government
            #  (Please note that government creating drafts and submitted is
            #  for testing only, in reality government will not do this)
            credit_trades = CreditTrade.objects.filter(
                ~Q(status__status__in=["Cancelled"]) &
                (~Q(status__status__in=["Draft", "Submitted", "Refused"]) |
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
            credit_trades = CreditTrade.objects.filter((
                    ((~Q(status__status__in=[
                            "Recorded", "Cancelled"
                        ]) &
                      Q(type__is_gov_only_type=False)) |
                     (Q(status__status__in=[
                            "Approved", "Declined"
                        ]) &
                      Q(type__is_gov_only_type=True))) &
                    ((~Q(status__status__in=["Draft"]) &
                      Q(respondent=organization)) | Q(initiator=organization))
            ))

        return credit_trades

    @staticmethod
    def create_history(credit_trade, is_new=False):
        """
        Create the CreditTradeHistory
        """
        user = (
            credit_trade.create_user
            if is_new
            else credit_trade.update_user)

        role_id = None

        if user.roles.filter(name="GovDirector").exists():
            role_id = user.roles.get(name="GovDirector").id
        elif user.roles.filter(name="GovDeputyDirector").exists():
            role_id = user.roles.get(name="GovDeputyDirector").id
        else:
            role_id = user.roles.first().id

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
            compliance_period_id=credit_trade.compliance_period_id,
            is_rescinded=credit_trade.is_rescinded,
            create_user=user,
            user_role_id=role_id,
            date_of_written_agreement=credit_trade.date_of_written_agreement,
            category_d_selected=credit_trade.category_d_selected
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
    def calculate_transfer_category(agreement_date, proposal_date, category_d_selected):
        if category_d_selected:
            return CreditTradeCategory.objects.get(category="D")

        now = datetime.now(pytz.UTC)

        # Ensure agreement_date is datetime and timezone aware
        if agreement_date:
            if isinstance(agreement_date, str):
                agreement_date = parse(agreement_date)
            elif isinstance(agreement_date, date):  # if it's a date, convert to datetime
                agreement_date = datetime.combine(agreement_date, time())
            
            if agreement_date.tzinfo is None or agreement_date.tzinfo.utcoffset(agreement_date) is None:
                agreement_date = pytz.UTC.localize(agreement_date)
            else:
                agreement_date = agreement_date.astimezone(pytz.UTC)

        # Ensure proposal_date is datetime and timezone aware
        if proposal_date:
            if isinstance(proposal_date, str):
                proposal_date = parse(proposal_date)
            elif isinstance(proposal_date, date):  # if it's a date, convert to datetime
                proposal_date = datetime.combine(proposal_date, time())
            
            if proposal_date.tzinfo is None or proposal_date.tzinfo.utcoffset(proposal_date) is None:
                proposal_date = pytz.UTC.localize(proposal_date)
            else:
                proposal_date = proposal_date.astimezone(pytz.UTC)
        else:
            proposal_date = now

        delta = relativedelta(proposal_date, agreement_date)
        difference_in_months = delta.years * 12 + delta.months

        if difference_in_months <= 6:
            return CreditTradeCategory.objects.get(category="A")
        elif 6 < difference_in_months <= 12:
            return CreditTradeCategory.objects.get(category="B")
        else:
            return CreditTradeCategory.objects.get(category="C")


    @staticmethod
    def approve(credit_trade, update_user=None, batch_process=False):
        """
        Transfers the credits between the organizations
        Sets the Credit Transfer to Approved
        """
        status_approved = CreditTradeStatus.objects.get(status="Approved")

        # Calculate and assign trade category. Dont assign category if transfer are added through historical data entry or if credit trade type is NOT 1 (buy) or 2 (sell)
        if not batch_process and credit_trade.type_id in (1, 2):
            credit_trade.trade_category = CreditTradeService.calculate_transfer_category(
                credit_trade.date_of_written_agreement, credit_trade.create_timestamp, credit_trade.category_d_selected)

        # Set the effective_date to today if credit_trade's trade_effective_date is null or in the past, 
        # otherwise use trade_effective_date
        today = timezone.localdate()
        effective_date = credit_trade.trade_effective_date \
            if credit_trade.trade_effective_date and credit_trade.trade_effective_date > today else today

        # Only transfer credits if the effective_date is today or in the past
        if effective_date <= today:
            CreditTradeService.transfer_credits(
                credit_trade.credits_from,
                credit_trade.credits_to,
                credit_trade.id,
                credit_trade.number_of_credits,
                effective_date
            )

        if update_user:
            credit_trade.update_user = update_user

        credit_trade.status = status_approved
        CreditTradeService.create_history(credit_trade)
        credit_trade.save()

        return credit_trade
    

    @staticmethod
    def process_future_effective_dates(organization):
        """
        Process CreditTransactions that have future effective dates
        """
        status_approved = CreditTradeStatus.objects.get(status="Approved")

        # Get all approved transactions where effective_date < now and 
        # that are not already in the organization_balance table
        future_transactions = CreditTrade.objects.filter(
            Q(initiator=organization) &
            Q(trade_effective_date__lte=timezone.now()) &
            Q(status=status_approved) &
            ~Q(id__in=OrganizationBalance.objects.exclude(credit_trade_id__isnull=True).values('credit_trade_id'))
        )

        # Update balance for each future transaction
        for transaction in future_transactions:
            # Get the organization who will receive the credits
            to_organization = transaction.respondent
            # Get the number of credits to transfer
            num_of_credits = transaction.number_of_credits
            # Call the transfer_credits method
            CreditTradeService.transfer_credits(organization, to_organization, transaction.id, 
                                                num_of_credits, transaction.trade_effective_date)

    @staticmethod
    @transaction.atomic()
    def transfer_credits(_from, _to, credit_trade_id, num_of_credits,
                         effective_date):
        """
        Make the appropriate addition and reduction to the credits for the
        organizations Involved
        """
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
        """
        Checks and makes sure that the organizations have enough credit
        balance
        """
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
                    "`{}` has insufficient credits.".format(
                        credit_trade.id, credit_trade.credits_from.name
                    )
                )

        if errors:
            raise PositiveIntegerException(errors)

    @staticmethod
    def get_temp_balance(storage, organization_id):
        """
        Gets the credits of an organization stored in a temporary list
        This allows us to simulate credit transfers without actually
        needing to write to the database. (e.g. Lets find out if
        the organization has enough credits to do the transfer)
        """
        starting_balance = None
        index = None

        if storage:
            for balance_index, balance in enumerate(storage):
                if balance["id"] == organization_id:
                    starting_balance = balance["credits"]
                    index = balance_index

        if starting_balance is None:
            try:  # if balance hasn't been populated, get from the database
                organization_balance = OrganizationBalance.objects.get(
                    organization_id=organization_id,
                    expiration_date=None)

                starting_balance = organization_balance.validated_credits
            except OrganizationBalance.DoesNotExist:
                starting_balance = 0

        return index, starting_balance

    @staticmethod
    def get_compliance_period_id(credit_trade):
        """
        Gets the compliance period the effective date falls under
        """
        # Use the effective_date today if credit_trade's trade_effective_date is null
        # otherwise use trade_effective_date
        today = timezone.localdate()
        trade_effective_date = credit_trade.trade_effective_date \
            if credit_trade.trade_effective_date else today
        
        compliance_period = CompliancePeriod.objects.filter(
            effective_date__lte=trade_effective_date,
            expiration_date__gte=trade_effective_date
        ).first()

        if compliance_period is None:
            return None

        return compliance_period.id

    @staticmethod
    def update_temp_balance(storage, index, num_of_credits, organization_id):
        """
        Update the temporary list that contains the credits for the
        organizations
        """
        if index is None:
            storage.append({
                "id": organization_id,
                "credits": num_of_credits
            })
        else:
            storage[index]["credits"] = num_of_credits

    @staticmethod
    def get_allowed_statuses(credit_trade, request):
        """
        This is used for validation.
        This will return a list of statuses that the credit trade can be
        updated to.
        e.g. Draft -> Proposed
        Proposed -> Accepted, Rejected
        IDIR users uses the PROPOSE_CREDIT_TRANSFER permission to create PVRs
        """
        allowed_statuses = []

        # Non-government users can never make changes to government only
        # transactions
        if credit_trade.type.is_gov_only_type and \
                not request.user.is_government_user:
            return allowed_statuses

        if credit_trade.status.status == "Draft":
            if request.user.has_perm('PROPOSE_CREDIT_TRANSFER'):
                allowed_statuses.append("Cancelled")
                allowed_statuses.append("Draft")

            if (request.user.has_perm('SIGN_CREDIT_TRANSFER') and
                    credit_trade.initiator == request.user.organization):
                allowed_statuses.append("Submitted")

            if (credit_trade.type.is_gov_only_type and
                    request.user.has_perm('RECOMMEND_CREDIT_TRANSFER')):
                allowed_statuses.append("Recommended")

        elif (credit_trade.status.status == "Submitted" and
              credit_trade.respondent == request.user.organization):
            if request.user.has_perm('REFUSE_CREDIT_TRANSFER'):
                allowed_statuses.append("Refused")

            if request.user.has_perm('SIGN_CREDIT_TRANSFER'):
                allowed_statuses.append("Accepted")

        elif credit_trade.status.status == "Accepted":
            if request.user.has_perm('RECOMMEND_CREDIT_TRANSFER'):
                allowed_statuses.append("Recommended")
                allowed_statuses.append("Not Recommended")

        elif credit_trade.status.status in [
            "Not Recommended", "Recommended"
        ]:
            if request.user.has_perm('APPROVE_CREDIT_TRANSFER'):
                allowed_statuses.append("Approved")

            if request.user.has_perm('DECLINE_CREDIT_TRANSFER'):
                allowed_statuses.append("Declined")

            if (credit_trade.type.is_gov_only_type and (
                    request.user.has_perm('DECLINE_CREDIT_TRANSFER') or
                    request.user.has_perm('RESCIND_CREDIT_TRANSFER')
            )):
                allowed_statuses.append("Draft")

        elif credit_trade.status.status == "Recorded":
            if request.user.has_perm('APPROVE_CREDIT_TRANSFER') or \
                    request.user.has_perm('USE_HISTORICAL_DATA_ENTRY'):
                allowed_statuses.append("Recorded")

        return allowed_statuses

    @staticmethod
    def dispatch_notifications(previous_state: CreditTrade,
                               credit_trade: CreditTrade):
        if credit_trade.type.is_gov_only_type:
            return CreditTradeService.pvr_notification(
                previous_state, credit_trade)

        return CreditTradeService.credit_trade_notification(
            previous_state, credit_trade)

    @staticmethod
    def credit_trade_notification(_previous_state, credit_trade):
        notification_map = defaultdict(lambda: [])
        government = Organization.objects.filter(
            type__type='Government').first()

        StatusChange = namedtuple('StatusChange', ['new_status'])
        ResultingNotification = namedtuple('ResultingNotification', [
            'recipient', 'notification_type'])

        notification_map[StatusChange('Draft')] = [
            ResultingNotification(
                credit_trade.initiator,
                NotificationType.CREDIT_TRANSFER_CREATED)
        ]
        notification_map[StatusChange('Submitted')] = [
            ResultingNotification(
                credit_trade.initiator,
                NotificationType.CREDIT_TRANSFER_SIGNED_1OF2),
            ResultingNotification(
                credit_trade.respondent,
                NotificationType.CREDIT_TRANSFER_SIGNED_1OF2)
        ]
        notification_map[StatusChange('Accepted')] = [
            ResultingNotification(
                credit_trade.initiator,
                NotificationType.CREDIT_TRANSFER_SIGNED_2OF2),
            ResultingNotification(
                credit_trade.respondent,
                NotificationType.CREDIT_TRANSFER_SIGNED_2OF2),
            ResultingNotification(
                government, NotificationType.CREDIT_TRANSFER_SIGNED_2OF2),
        ]
        notification_map[StatusChange('Refused')] = [
            ResultingNotification(
                credit_trade.initiator,
                NotificationType.CREDIT_TRANSFER_PROPOSAL_REFUSED),
            ResultingNotification(
                credit_trade.respondent,
                NotificationType.CREDIT_TRANSFER_PROPOSAL_REFUSED)
        ]
        notification_map[StatusChange('Recommended')] = [
            ResultingNotification(
                government,
                NotificationType.CREDIT_TRANSFER_RECOMMENDED_FOR_APPROVAL),
        ]

        notification_map[StatusChange('Not Recommended')] = [
            ResultingNotification(
                government,
                NotificationType.CREDIT_TRANSFER_RECOMMENDED_FOR_DECLINATION),
        ]

        notification_map[StatusChange('Approved')] = [
            ResultingNotification(
                credit_trade.initiator,
                NotificationType.CREDIT_TRANSFER_APPROVED),
            ResultingNotification(
                credit_trade.respondent,
                NotificationType.CREDIT_TRANSFER_APPROVED),
            ResultingNotification(
                government,
                NotificationType.CREDIT_TRANSFER_APPROVED),
        ]

        notification_map[StatusChange('Declined')] = [
            ResultingNotification(
                credit_trade.initiator,
                NotificationType.CREDIT_TRANSFER_DECLINED),
            ResultingNotification(
                credit_trade.respondent,
                NotificationType.CREDIT_TRANSFER_DECLINED),
            ResultingNotification(
                government,
                NotificationType.CREDIT_TRANSFER_DECLINED),
        ]

        if credit_trade.is_rescinded:
            notifications_to_send = [
                ResultingNotification(
                    credit_trade.initiator,
                    NotificationType.CREDIT_TRANSFER_RESCINDED),
                ResultingNotification(
                    credit_trade.respondent,
                    NotificationType.CREDIT_TRANSFER_RESCINDED)
            ]
        else:
            notifications_to_send = notification_map[
                StatusChange(credit_trade.status.status)
            ]

        ps = []
        for notification in notifications_to_send:
            ps.append({
                'interested_organization_id': notification.recipient.id,
                'message': notification.notification_type.name,
                'notification_type': notification.notification_type.value,
                'related_credit_trade_id': credit_trade.id,
                'related_organization_id': credit_trade.respondent.id,
                'originating_user_id': credit_trade.update_user.id
            })
        on_commit(lambda: async_send_notifications(ps))

    @staticmethod
    def pvr_notification(previous_state, credit_trade):
        notification_map = defaultdict(lambda: [])
        government = Organization.objects.filter(
            type__type='Government').first()

        StatusChange = namedtuple('StatusChange', ['new_status'])
        ResultingNotification = namedtuple('ResultingNotification', [
            'recipient', 'notification_type'])

        if previous_state and \
                previous_state.status.status == 'Recommended' and \
                previous_state.update_user == credit_trade.update_user:
            notification_map[StatusChange('Draft')] = [
                ResultingNotification(
                    government,
                    NotificationType.PVR_PULLED_BACK)
            ]
        elif previous_state and \
                previous_state.status.status == 'Recommended' and \
                previous_state.update_user != credit_trade.update_user:
            notification_map[StatusChange('Draft')] = [
                ResultingNotification(
                    government,
                    NotificationType.PVR_RETURNED_TO_ANALYST)
            ]
        else:
            notification_map[StatusChange('Draft')] = [
                ResultingNotification(
                    government,
                    NotificationType.PVR_CREATED)
            ]

        notification_map[StatusChange('Recommended')] = [
            ResultingNotification(
                government,
                NotificationType.PVR_RECOMMENDED_FOR_APPROVAL),
        ]

        notification_map[StatusChange('Approved')] = [
            ResultingNotification(
                credit_trade.respondent,
                NotificationType.PVR_APPROVED),
            ResultingNotification(
                government,
                NotificationType.PVR_APPROVED),
        ]

        notification_map[StatusChange('Declined')] = [
            ResultingNotification(
                credit_trade.respondent,
                NotificationType.PVR_DECLINED),
            ResultingNotification(
                government,
                NotificationType.PVR_DECLINED),
        ]

        notifications_to_send = notification_map[
            StatusChange(
                credit_trade.status.status
            )
        ]

        ps = []
        for notification in notifications_to_send:
            ps.append({
                'interested_organization_id': notification.recipient.id,
                'message': notification.notification_type.name,
                'notification_type': notification.notification_type.value,
                'related_credit_trade_id': credit_trade.id,
                'related_organization_id': credit_trade.respondent.id,
                'originating_user_id': credit_trade.update_user.id
            })
        on_commit(lambda:
                  async_send_notifications(ps)
                  )
