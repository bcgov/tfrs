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


class DocumentStatus(Auditable):

    status = models.CharField(
        max_length=25,
        blank=True,
        null=True,
        unique=True,
        db_comment="Contains an enumerated value to describe the document status."
                   "This is a unique natural key."
    )

    description = models.CharField(
        max_length=4000, blank=True, null=True, db_comment='Description of the document status.'
                                                           ' This is the displayed name.')
    display_order = models.IntegerField(
        db_comment='Relative rank in display sorting order')

    effective_date = models.DateField(
        blank=True, null=True, db_comment='The calendar date the document status type value became valid.')

    expiration_date = models.DateField(
        blank=True, null=True, db_comment='The calendar date the document trade status type value is no longer valid.')


    class Meta:
        db_table = 'document_status'

    db_table_comment = ''
