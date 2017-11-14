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
from .FuelSupplier import FuelSupplier

from auditable.models import Auditable
from server import validators


class CreditTrade(Auditable):
    creditTradeStatusFK = models.ForeignKey(
        'CreditTradeStatus',
        related_name='CreditTradecreditTradeStatusFK')
    initiatorFK = models.ForeignKey(
        'FuelSupplier',
        related_name='CreditTradeinitiatorFK',
        blank=True, null=True)
    respondentFK = models.ForeignKey(
        'FuelSupplier',
        related_name='CreditTraderespondentFK')
    creditTradeTypeFK = models.ForeignKey(
        'CreditTradeType',
        related_name='CreditTradecreditTradeTypeFK')
    numberOfCredits = models.IntegerField(
        validators=[validators.CreditTradeNumberOfCreditsValidator])
    fairMarketValuePerCredit = models.DecimalField(
        null=True, max_digits=999,
        decimal_places=2,
        default=None)
    creditTradeZeroReasonFK = models.ForeignKey(
        'CreditTradeZeroReason',
        related_name='CreditTradecreditTradeZeroReasonFK',
        blank=True, null=True)
    tradeEffectiveDate = models.DateField(blank=True, null=True)
    note = models.CharField(max_length=4000, blank=True, null=True)

    @property
    def credits_from(self):
        if self.creditTradeTypeFK.id == 1:
            return self.initiatorFK
        elif self.creditTradeTypeFK.id in [2, 4]:
            return self.respondentFK
        elif self.creditTradeTypeFK.id in [3, 5]:
            # TODO: Fuel supplier is Government, which is not a fuel supplier
            return FuelSupplier(id=0, name="Government of British Columbia")

    @property
    def credits_to(self):
        if self.creditTradeTypeFK.id == 2:
            return self.initiatorFK
        elif self.creditTradeTypeFK.id in [1, 3, 5]:
            return self.respondentFK
        elif self.creditTradeTypeFK.id == 4:
            # TODO: Fuel supplier is Government, which is not a fuel supplier
            return FuelSupplier(id=0, name="Government of British Columbia")

    class Meta:
        db_table = 'credit_trade'
