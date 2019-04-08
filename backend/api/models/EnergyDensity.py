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


class EnergyDensity(Auditable, EffectiveDates):
    """
    Energy Densities for Approved Fuel
    """
    fuel = models.ForeignKey(
        'ApprovedFuel',
        blank=False,
        null=False,
        related_name='energy_density',
        on_delete=PROTECT
    )
    density = models.DecimalField(
        blank=True,
        decimal_places=2,
        default=Decimal('0.00'),
        max_digits=5,
        null=True,
        db_comment="Energy density for the specific fuel class"
    )
    unit_of_measure = models.CharField(
        blank=True,
        max_length=50,
        null=True,
        db_comment="Freeform text for Unit of Measure"
    )

    class Meta:
        db_table = 'energy_density'

    db_table_comment = "Contains the energy density for each approved fuel. " \
                       "These densities should help the user understand how " \
                       "current and future credits will be calculated."
