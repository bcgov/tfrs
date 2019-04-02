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

from .CompliancePeriod import CompliancePeriod


class CarbonIntensityLimits(Auditable):
    """
    Contains the carbon intensity limits for diesel and gasoline.
    """
    compliance_period = models.ForeignKey(
        CompliancePeriod,
        related_name='carbon_intensity',
        blank=True, null=True,
        on_delete=models.PROTECT
    )

    diesel_class_limit = models.DecimalField(
        null=True, blank=True, max_digits=5,
        decimal_places=2,
        default=Decimal('0.00'),
        db_comment="Carbon Intensity Limit for diesel class fuel."
    )

    gasoline_class_limit = models.DecimalField(
        null=True, blank=True, max_digits=5,
        decimal_places=2,
        default=Decimal('0.00'),
        db_comment="Carbon Intensity Limit for gasoline class fuel."
    )

    class Meta:
        db_table = 'carbon_intensity_limits'

    db_table_comment = "Contains the carbon intensity limits for the two " \
                       "fuel limits: Diesel and Gasoline." \
                       "The data in this table is to help users understand " \
                       "how current and future credits will be calculated."
