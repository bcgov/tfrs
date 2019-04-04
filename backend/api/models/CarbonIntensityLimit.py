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
from django.db import models

from auditable.models import Auditable

from api.models.mixins.EffectiveDates import EffectiveDates
from .CompliancePeriod import CompliancePeriod
from .FuelClass import FuelClass


class CarbonIntensityLimit(Auditable, EffectiveDates):
    """
    Contains the carbon intensity limits for related classes:
    diesel and gasoline most likely
    """
    compliance_period = models.ForeignKey(
        CompliancePeriod,
        related_name='carbon_intensity_limits',
        blank=True, null=True,
        on_delete=models.PROTECT
    )
    fuel_class = models.ForeignKey(
        FuelClass,
        related_name='carbon_intensity_limits',
        blank=True, null=True,
        on_delete=models.PROTECT
    )
    density = models.DecimalField(
        null=True, blank=True, max_digits=5,
        decimal_places=2,
        default=Decimal('0.00'),
        db_comment="Carbon Intensity Limit for the related class."
                   "Values will use this formula: gCO2e/MJ"
    )

    class Meta:
        db_table = 'carbon_intensity_limit'

    db_table_comment = "Contains the carbon intensity limits for the " \
                       "related classes: Diesel and Gasoline most likely." \
                       "The data in this table is to help users understand " \
                       "how current and future credits will be calculated."
