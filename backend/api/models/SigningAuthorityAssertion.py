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

from api.managers.SigningAuthorityAssertionManager import SigningAuthorityAssertionManager
from api.models.mixins.DisplayOrder import DisplayOrder
from api.models.mixins.EffectiveDates import EffectiveDates
from auditable.models import Auditable


class SigningAuthorityAssertion(Auditable, DisplayOrder, EffectiveDates):
    description = models.CharField(max_length=4000,
                                   blank=True,
                                   null=True,
                                   db_comment='Description of the signing authority assertion statement. This is the displayed name.')

    objects = SigningAuthorityAssertionManager()

    class Meta:
        db_table = 'signing_authority_assertion'

    db_table_comment = 'Contains a list of valid regulatory statements that must be' \
                       ' confirmed or certified by the officer or employee of the fuel supplier(s)' \
                       ' (i.e. signing authority) prior to signing and submitting a Credit Transfer Proposal, or an Exclusion Report to government for review.'
