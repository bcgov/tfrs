"""
    REST API Documentation for the NRS TFRS Credit Trading Application

    The Transportation Fuels Reporting System is being designed to streamline compliance reporting for transportation fuel suppliers in accordance with the Renewable & Low Carbon Fuel Requirements Regulation.

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
from .CreditTradeStatus import CreditTradeStatus

from auditable.models import Auditable
from api import validators


class CreditTrade(Auditable):
    status = models.ForeignKey(
        'CreditTradeStatus',
        related_name='credit_trades',
        on_delete=models.PROTECT)
    initiator = models.ForeignKey(
        'Organization',
        related_name='initiator_credit_trades',
        blank=True, null=True,
        on_delete=models.PROTECT)
    respondent = models.ForeignKey(
        'Organization',
        related_name='respondent_credit_trades',
        on_delete=models.PROTECT)
    type = models.ForeignKey(
        'CreditTradeType',
        related_name='credit_trades',
        on_delete=models.PROTECT)
    number_of_credits = models.IntegerField(
        validators=[validators.CreditTradeNumberOfCreditsValidator])
    fair_market_value_per_credit = models.DecimalField(
        null=True, blank=True, max_digits=999,
        decimal_places=2,
        default=Decimal('0.00'))
    zero_reason = models.ForeignKey(
        'CreditTradeZeroReason',
        related_name='credit_trades',
        blank=True, null=True,
        on_delete=models.PROTECT)
    trade_effective_date = models.DateField(blank=True, null=True)
    note = models.CharField(max_length=4000, blank=True, null=True)

    @property
    def credits_from(self):
        # 3 and 5 is government
        if self.type.id in [1, 3, 5]:
            return self.initiator
        elif self.type.id in [2, 4]:
            return self.respondent

    @property
    def credits_to(self):
        # 4 is government
        if self.type.id in [2, 4]:
            return self.initiator
        elif self.type.id in [1, 3, 5]:
            return self.respondent

    @property
    def total_value(self):
        return self.number_of_credits * self.fair_market_value_per_credit

    @property
    def status_display(self):
        """Display text for the status in a user-friendly way"""
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
    def actions(self):
        """Statuses that can be made for this credit trade"""
        statuses = CreditTradeStatus.objects.all()
        status_dict = {s.status: s for s in statuses}

        cur_status = self.status.status

        if cur_status == "Draft":
            return [status_dict["Draft"],
                    status_dict["Submitted"]]
        elif cur_status == "Submitted":
            return [status_dict["Accepted"],
                    status_dict["Cancelled"]]  # Rescind
        elif cur_status == "Accepted":
            return [status_dict["Cancelled"],  # Refuse
                    status_dict["Recommended"]]
        elif cur_status == "Recommended":
            return [status_dict["Approved"],
                    status_dict["Declined"]]

        return []

    class Meta:
        db_table = 'credit_trade'
