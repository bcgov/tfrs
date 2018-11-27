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
from .SigningAuthorityAssertion import SigningAuthorityAssertion


class Document(Auditable):
    """
    Holds the credit trade proposal information between the
    organizations
    """
    title = models.CharField(
    )

    url = models.URLField()

    status = models.ForeignKey(
        CreditTradeStatus,
        related_name='credit_trades',
        on_delete=models.PROTECT)

    type = models.ForeignKey(
        CreditTradeType,
        related_name='credit_trades',
        on_delete=models.PROTECT)

    # @property
    # def comments(self):
    #     """
    #     Comments that are only viewable for roles that have a
    #     specific permission
    #     """
    #     comments = CreditTradeComment.objects.filter(
    #         credit_trade_id=self.id
    #     )
    #
    #     return comments

    #
    # def get_history(self, statuses: List):
    #     history = CreditTradeHistory.objects.filter(
    #         Q(status__status__in=statuses) | Q(is_rescinded=True),
    #         credit_trade_id=self.id
    #     ).order_by('update_timestamp')
    #
    #     return history

    class Meta:
        db_table = 'document'

    db_table_comment = ''
