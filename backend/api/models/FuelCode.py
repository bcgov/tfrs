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


class FuelCode(Auditable):
    """
    Fuel codes for the Secure Document Upload
    """
    fuel_code = models.CharField(
        max_length=100,
        db_comment='Low Carbon Fuel Code.'
    )
    company = models.CharField(
        max_length=100,
        db_comment='Company.'
    )
    carbon_intensity = models.DecimalField(
        blank=True,
        null=True,
        max_digits=999,
        decimal_places=2,
        default=None,
        db_comment='Number value in gCO2e/MJ; negative values are allowed.')
    application_date = models.DateField(
        blank=True,
        null=True,
        db_comment='Application Date.')
    effective_date = models.DateField(
        blank=True,
        null=True,
        db_comment='Effective Date.')
    expiry_date = models.DateField(
        blank=True,
        null=True,
        db_comment='Expiry Date.')
    fuel = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        db_comment='Fuel.')
    feedstock = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        db_comment='Feedstock.'
    )
    feedstock_location = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        db_comment='Feedstock Location.'
    )
    feedstock_misc = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        db_comment='Feedstock Miscellaneous.'
    )
    facility_location = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        db_comment='Fuel Production Facility Location.'
    )
    facility_nameplate = models.IntegerField(
        blank=True,
        null=True,
        db_comment='Fuel Production Facility Nameplate Capacity.'
    )
    feedstock_transport_mode = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        db_comment='Feedstock Transport Mode.'
    )
    fuel_transport_mode = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        db_comment='Finished Fuel Transport Mode.'
    )
    former_company = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        db_comment='Former Company Name.'
    )
    approval_date = models.DateField(
        blank=True,
        null=True,
        db_comment='Approval Date.'
    )

    class Meta:
        db_table = 'fuel_code'

    db_table_comment = 'List of Fuel Codes .'
