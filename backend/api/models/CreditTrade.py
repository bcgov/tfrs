"""
    REST API Documentation for the NRS TFRS Credit Trading Application

    The Transportation Fuels Reporting System is being designed to streamline
    compliance reporting for transportation fuel suppliers in accordance with
    the Renewable & Low Carbon Fuel Requirements Regulation.

    OpenAPI spec version: v1


    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
"""
from decimal import Decimal
from django.db import models
from django.db.models import Count
from django.db.models import Max
from django.db.models import Q
from api import validators
from auditable.models import Auditable

from .CompliancePeriod import CompliancePeriod
from .CreditTradeComment import CreditTradeComment
from .CreditTradeHistory import CreditTradeHistory
from .CreditTradeStatus import CreditTradeStatus
from .CreditTradeType import CreditTradeType
from .CreditTradeZeroReason import CreditTradeZeroReason
from .Organization import Organization
from .SigningAuthorityConfirmation import SigningAuthorityConfirmation


class CreditTrade(Auditable):
    """
    Holds the credit trade proposal information between the
    organizations
    """
    status = models.ForeignKey(
        CreditTradeStatus,
        related_name='credit_trades',
        on_delete=models.PROTECT)
    initiator = models.ForeignKey(
        Organization,
        related_name='initiator_credit_trades',
        blank=True, null=True,
        on_delete=models.PROTECT)
    respondent = models.ForeignKey(
        Organization,
        related_name='respondent_credit_trades',
        on_delete=models.PROTECT)
    type = models.ForeignKey(
        CreditTradeType,
        related_name='credit_trades',
        on_delete=models.PROTECT)
    number_of_credits = models.IntegerField(
        validators=[validators.CreditTradeNumberOfCreditsValidator])
    fair_market_value_per_credit = models.DecimalField(
        null=True, blank=True, max_digits=999,
        decimal_places=2,
        default=Decimal('0.00'),
        validators=[validators.CreditTradeFairMarketValueValidator])
    zero_reason = models.ForeignKey(
        CreditTradeZeroReason,
        related_name='credit_trades',
        blank=True, null=True,
        on_delete=models.PROTECT)
    trade_effective_date = models.DateField(blank=True, null=True)
    note = models.CharField(max_length=4000, blank=True, null=True)
    compliance_period = models.ForeignKey(
        CompliancePeriod,
        related_name='credit_trades',
        blank=True, null=True,
        on_delete=models.PROTECT
    )
    is_rescinded = models.BooleanField(default=False)

    @property
    def credits_from(self):
        """
        If the type is Sell, Validation and Award,
        Credits From should be the Initiator
        And for type: Buy and Retirement
        Credits From is the Respondent
        """
        # 3 and 5 is government
        if self.type.id in [1, 3, 5]:
            return self.initiator
        # elif self.type.id in [2, 4]
        return self.respondent

    @property
    def credits_to(self):
        """
        If the type is Sell, Validation and Award,
        Credits From should be the Respondent
        And for type: Buy and Retirement
        Credits From is the Initiator
        """
        # 4 is government
        if self.type.id in [2, 4]:
            return self.initiator
        # elif self.type.id in [1, 3, 5]:
        return self.respondent

    @property
    def total_value(self):
        """
        Returns the calculated total value based on the
        number of credits multiplied by the value per credit
        """
        if self.fair_market_value_per_credit is None:
            return None

        return self.number_of_credits * self.fair_market_value_per_credit

    @property
    def status_display(self):
        """
        Display text for the status in a user-friendly way
        """
        cur_status = self.status.status
        if cur_status == "Cancelled":
            # If this was cancelled by the initiator, it's "Rescinded"
            # If it was cancelled by the respondent, it's "Refused"
            # If it was cancelled by the respondent after accepting,
            #   it's "Rescinded"
            return "Cancelled"
        elif cur_status == "Declined":
            return "Declined for approval"
        elif cur_status == "Recommended":
            return "Recommended for decision"

        return cur_status

    @property
    def comments(self):
        """
        Comments that are only viewable for roles that have a
        specific permission
        """
        comments = CreditTradeComment.objects.filter(
            credit_trade_id=self.id
        )

        return comments

    @property
    def unprivileged_comments(self):
        """
        Comments that are unrestricted
        """
        comments = CreditTradeComment.objects.filter(
            credit_trade_id=self.id
        ).filter(
            privileged_access=False
        )

        return comments

    @property
    def signatures(self):
        """
        Fetches all the user id's that have signed the credit trade
        This will check if the user has signed all 3 of the
        confirmations. But will not count any duplicates
        (Note: The additional values_list is to just ensure we only
        get the id so it makes it easier to serialize)
        """
        signatures = SigningAuthorityConfirmation.objects.values(
            'create_user_id'
        ).annotate(
            cnt=Count('signing_authority_assertion_id', distinct=True),
            timestamp=Max('create_timestamp')
        ).filter(
            credit_trade_id=self.id,
            has_accepted=True,
            cnt__gte=3
        )

        return signatures

    @property
    def reviewed(self):
        """
        Shows the signatures to the involved parties
        Shows whether it's recommended or not to government users
        """
        reviewed = CreditTradeHistory.objects.filter(
            Q(status__status__in=["Not Recommended", "Recommended"]),
            credit_trade_id=self.id
        ).order_by('-update_timestamp').first()

        return reviewed

    class Meta:
        db_table = 'credit_trade'
