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
from django.db.models import PROTECT

from api.models.mixins.EffectiveDates import EffectiveDates
from auditable.models import Auditable


class EnergyEffectivenessRatio(Auditable, EffectiveDates):
    """
    Energy Effectiveness Ratio for Approved Fuel
    """
    category = models.ForeignKey(
        'EnergyEffectivenessRatioCategory',
        blank=False,
        null=False,
        related_name='energy_effective_ratio',
        on_delete=PROTECT
    )
    fuel_class = models.ForeignKey(
        'FuelClass',
        blank=True,
        null=True,
        related_name='energy_effective_ratio',
        on_delete=models.PROTECT
    )
    ratio = models.DecimalField(
        blank=True,
        decimal_places=2,
        default=Decimal('0.00'),
        max_digits=5,
        null=True,
        db_comment="Energy effectiveness ratio for the specific fuel class"
    )

    class Meta:
        db_table = 'energy_effectiveness_ratio'

    db_table_comment = "Contains the energy effectiveness ratio for each " \
                       "approved fuel. Ratios are separated per class, " \
                       "diesel and gasoline, most likely. " \
                       "The ratio should help the user understand how the " \
                       "current and future credits will be calculated."
