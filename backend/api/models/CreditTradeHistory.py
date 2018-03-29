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

from auditable.models import Auditable


class CreditTradeHistory(Auditable):
    credit_trade = models.ForeignKey(
        'CreditTrade',
        related_name='credit_trade_histories',
        null=True,
        on_delete=models.SET_NULL)
    user = models.ForeignKey(
        'User', related_name='credit_trade_histories',
        on_delete=models.PROTECT)
    credit_trade_update_time = models.DateTimeField()
    respondent = models.ForeignKey(
        'Organization',
        related_name='credit_trade_histories',
        on_delete=models.PROTECT)
    status = models.ForeignKey(
        'CreditTradeStatus',
        related_name='credit_trade_histories',
        on_delete=models.PROTECT)
    type = models.ForeignKey(
        'CreditTradeType',
        related_name='credit_trade_histories',
        on_delete=models.PROTECT)
    number_of_credits = models.IntegerField()
    fair_market_value_per_credit = models.DecimalField(
        null=True, blank=True, max_digits=999,
        decimal_places=2,
        default=None)
    zero_reason = models.ForeignKey(
        'CreditTradeZeroReason',
        related_name='credit_trade_histories',
        blank=True, null=True,
        on_delete=models.PROTECT)
    trade_effective_date = models.DateField(blank=True, null=True)
    note = models.CharField(max_length=4000, blank=True, null=True)
    is_internal_history_record = models.BooleanField()

    class Meta:
        db_table = 'credit_trade_history'
        ordering = ['-create_timestamp']
