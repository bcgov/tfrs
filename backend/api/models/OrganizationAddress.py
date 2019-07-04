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

from api.models.mixins.EffectiveDates import EffectiveDates
from auditable.models import Auditable


class OrganizationAddress(Auditable, EffectiveDates):
    """
    Address(es) of the Fuel Supplier
    """
    organization = models.ForeignKey(
        'Organization',
        related_name='addresses',
        on_delete=models.CASCADE
    )
    address_line_1 = models.CharField(
        blank=True,
        max_length=500,
        null=True,
        db_comment="The first line of the organization's address."
    )
    address_line_2 = models.CharField(
        blank=True,
        max_length=100,
        null=True,
        db_comment="The second line of the organization's address."
    )
    address_line_3 = models.CharField(
        blank=True,
        max_length=100,
        null=True,
        db_comment="The third line of the organization's address."
    )
    city = models.CharField(
        blank=True,
        max_length=100,
        null=True,
        db_comment="City"
    )
    postal_code = models.CharField(
        blank=True,
        max_length=10,
        null=True,
        db_comment="Postal Code"
    )
    state = models.CharField(
        blank=True,
        max_length=50,
        null=True,
        db_comment="State or Province"
    )
    county = models.CharField(
        blank=True,
        max_length=50,
        null=True,
        db_comment="County Name"
    )
    country = models.CharField(
        blank=True,
        max_length=100,
        null=True,
        db_comment="Country"
    )
    other = models.CharField(
        blank=True,
        max_length=100,
        null=True,
        db_comment="Other Address Details"
    )

    class Meta:
        db_table = 'organization_address'

    db_table_comment = "Represents an organization's address."
