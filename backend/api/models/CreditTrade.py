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
from typing import List
from django.db import models
from django.db.models import Count, ManyToManyField
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
from .CreditTradeCategory import CreditTradeCategory
from .Organization import Organization
from .SigningAuthorityConfirmation import SigningAuthorityConfirmation
from .SigningAuthorityAssertion import SigningAuthorityAssertion


class CreditTrade(Auditable):
    """
    Holds the credit trade proposal information between the
    organizations
    """
    status = models.ForeignKey(
        CreditTradeStatus,
        related_name='credit_trades',
        on_delete=models.PROTECT
    )
    initiator = models.ForeignKey(
        Organization,
        related_name='initiator_credit_trades',
        blank=True, null=True,
        on_delete=models.PROTECT
    )
    respondent = models.ForeignKey(
        Organization,
        related_name='respondent_credit_trades',
        on_delete=models.PROTECT,
        db_comment="fk: reference to the organization that will respond to the"
                   " credit transfer proposal"
    )
    type = models.ForeignKey(
        CreditTradeType,
        related_name='credit_trades',
        on_delete=models.PROTECT)
    number_of_credits = models.IntegerField(
        db_comment="Number of credits to be transferred on approval"
    )
    fair_market_value_per_credit = models.DecimalField(
        null=True, blank=True, max_digits=10,
        decimal_places=2,
        default=Decimal('0.00'),
        validators=[validators.CreditTradeFairMarketValueValidator],
        db_comment="The fair market value of any consideration, in Canadian "
                   "dollars, per validated credit being transferred."
    )
    zero_reason = models.ForeignKey(
        CreditTradeZeroReason,
        related_name='credit_trades',
        blank=True,
        null=True,
        on_delete=models.PROTECT,
        db_comment="Rationale for zero-valued transfer"
    )
    date_of_written_agreement = models.DateField(
        blank=True, null=True,
        db_comment="Date on which the written agreement to transfer credits was reached between the suppliers"
    )
    trade_effective_date = models.DateField(
        blank=True, null=True,
        db_comment="Date on which this transfer will become effective if "
                   "approved"
    )
    compliance_period = models.ForeignKey(
        CompliancePeriod,
        related_name='credit_trades',
        blank=True, null=True,
        on_delete=models.PROTECT
    )
    is_rescinded = models.BooleanField(
        default=False,
        db_comment='Flag. True if the trade was rescinded before completion '
                   'by either party.'
    )
    documents = ManyToManyField(
        'Document',
        related_name='credit_trade_documents',
        through='DocumentCreditTrade'
    )
    trade_category = models.ForeignKey(
        CreditTradeCategory,
        related_name='credit_trades',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        db_comment="Category based on the date of agreement and approval"
    )
    category_d_selected = models.BooleanField(default=False)
    
    @property
    def credits_from(self):
        """
        If the type is Sell, Validation and Award,
        Credits From should be the Initiator
        And for type: Buy and Retirement
        Credits From is the Respondent
        """
        # 3, 5 and 6 is government
        if self.type.id in [1, 3, 5, 6]:
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
    def comments(self):
        """
        Comments that are only viewable for roles that have a
        specific permission
        """
        comments = CreditTradeComment.objects.filter(
            credit_trade_id=self.id,
            is_deleted=False
        )

        return comments

    @property
    def unprivileged_comments(self):
        """
        Comments that are unrestricted
        """
        comments = CreditTradeComment.objects.filter(
            credit_trade_id=self.id,
            is_deleted=False
        ).filter(
            privileged_access=False
        )

        return comments

    @property
    def signatures(self):
        """
        Fetches all the user id's that have signed the credit trade
        This will check if the user has signed all of the active
        confirmations. But will not count any duplicates
        (Note: The additional values_list is to just ensure we only
        get the id so it makes it easier to serialize)
        """
        signatures = SigningAuthorityConfirmation.objects.values(
            'create_user_id'
        ).filter(
            credit_trade_id=self.id,
            has_accepted=True,
        ).annotate(
            cnt=Count('signing_authority_assertion_id', distinct=True),
            timestamp=Max('create_timestamp')
        )

        aggregate_signatures = signatures.aggregate(
            timestamp=Max('create_timestamp')
        )

        signing_date = aggregate_signatures['timestamp']\
            .date() if aggregate_signatures['timestamp'] is not None else None

        # Figure out how many were required on the date it was signed
        required_count = SigningAuthorityAssertion.objects.get_active_as_of_date(
            signing_date
        ).count() if signing_date is not None else 0

        return signatures.filter(cnt=required_count)

    def get_history(self, statuses: List):
        """
        Instead of being a property this fetches the history based on the
        statuses that's needed
        For example government users would want to see the following:
        Signed, Accepted, Recommended, Not Recommended and Approved.
        So we pass ["Submitted", "Accepted", "Recommended", "Not Recommended",
        "Approved"]
        """
        history = CreditTradeHistory.objects.filter(
            Q(status__status__in=statuses) | Q(is_rescinded=True),
            credit_trade_id=self.id
        ).order_by('create_timestamp')

        return history

    @property
    def comment(self):
        return self._comment

    @comment.setter
    def comment(self, comment):
        self._comment = comment

    def clean(self):
        super().clean()
        validators.CreditTradeNumberOfCreditsValidator(self.number_of_credits, self)

    class Meta:
        db_table = 'credit_trade'

    db_table_comment = "Records all Credit Transfer Proposals, from " \
                       "creation to statutory decision to approved or decline."
