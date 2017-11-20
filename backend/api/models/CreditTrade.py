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

from django.db import models
from .Organization import Organization

from auditable.models import Auditable
from api import validators


class CreditTrade(Auditable):
    status = models.ForeignKey(
        'CreditTradeStatus',
        related_name='credit_trades')
    initiator = models.ForeignKey(
        'Organization',
        related_name='initiator_credit_trades',
        blank=True, null=True)
    respondent = models.ForeignKey(
        'Organization',
        related_name='respondent_credit_trades')
    type = models.ForeignKey(
        'CreditTradeType',
        related_name='credit_trades')
    numberOfCredits = models.IntegerField(
        validators=[validators.CreditTradeNumberOfCreditsValidator])
    fairMarketValuePerCredit = models.DecimalField(
        null=True, blank=True, max_digits=999,
        decimal_places=2,
        default=None)
    zero_reason = models.ForeignKey(
        'CreditTradeZeroReason',
        related_name='credit_trades',
        blank=True, null=True)
    trade_effective_date = models.DateField(blank=True, null=True)
    note = models.CharField(max_length=4000, blank=True, null=True)

    @property
    def credits_from(self):
        if self.type.id == 1:
            return self.initiator
        elif self.type.id in [2, 4]:
            return self.respondent
        elif self.type.id in [3, 5]:
            # TODO: Fuel supplier is Government, which is not a fuel supplier
            return Organization(id=0, name="Government of British Columbia")

    @property
    def credits_to(self):
        if self.type.id == 2:
            return self.initiator
        elif self.type.id in [1, 3, 5]:
            return self.respondent
        elif self.type.id == 4:
            # TODO: Fuel supplier is Government, which is not a fuel supplier
            return Organization(id=0, name="Government of British Columbia")

    class Meta:
        db_table = 'credit_trade'
