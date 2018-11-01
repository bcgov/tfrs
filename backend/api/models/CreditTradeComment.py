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

from django.db import models

from auditable.models import Auditable


class CreditTradeComment(Auditable):
    credit_trade = models.ForeignKey(
        'CreditTrade',
        related_name='credit_trade_comments',
        null=False,
        on_delete=models.PROTECT)

    comment = models.CharField(max_length=4000,
                               blank=True,
                               null=True,
                               db_column='credit_trade_comment',
                               db_comment='Contains all comments related to a credit transaction (credit transfer, part 3 award, validation, reduction). Comments may be added by fuel suppliers or government, with some government comments being flagged as internal only.')

    # require a permission to view
    privileged_access = models.BooleanField(
        null=False,
        default=True,
        db_column='is_privileged_access',
        db_comment='Flag. True if this is for internal government viewing only.'
    )

    # For tracking the status at the point in time the comment was made
    trade_history_at_creation = models.ForeignKey(
        'CreditTradeHistory',
        related_name='credit_trade_comments',
        null=True,
        on_delete=models.PROTECT
    )

    class Meta:
        db_table = 'credit_trade_comment'
        ordering = ['create_timestamp']

    db_table_comment = 'Contains all correspondence from fuel suppliers and government (including those with privileged access) related to credit transactions (Credit Transfer, Part 3 Award, Validation, and Reduction).'
