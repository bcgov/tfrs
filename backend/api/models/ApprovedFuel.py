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
from django.db.models import PROTECT

from api.managers.ApprovedFuelManager import ApprovedFuelManager
from api.models.mixins.EffectiveDates import EffectiveDates
from api.models.FuelClass import FuelClass
from api.models.ProvisionOfTheAct import ProvisionOfTheAct
from auditable.models import Auditable


class ApprovedFuel(Auditable, EffectiveDates):
    """
    Approved Fuels
    """
    name = models.CharField(
        max_length=100,
        blank=False,
        null=False,
        unique=True,
        db_comment="Approved fuel name"
    )
    description = models.CharField(
        max_length=1000, blank=True, null=True,
        db_comment="Further description of the fuel"
    )
    credit_calculation_only = models.BooleanField(
        default=False,
        db_comment="Flag. True if this fuel type is only applicable for "
                   "Credit Calculation functions."
    )
    default_carbon_intensity_category = models.ForeignKey(
        'DefaultCarbonIntensityCategory',
        related_name='approved_fuel',
        blank=True,
        null=True,
        on_delete=PROTECT
    )
    energy_density_category = models.ForeignKey(
        'EnergyDensityCategory',
        related_name='approved_fuel',
        blank=True,
        null=True,
        on_delete=PROTECT
    )
    energy_effectiveness_ratio_category = models.ForeignKey(
        'EnergyEffectivenessRatioCategory',
        related_name='approved_fuel',
        blank=True,
        null=True,
        on_delete=PROTECT
    )
    unit_of_measure = models.ForeignKey(
        'UnitOfMeasure',
        related_name='approved_fuel',
        blank=True,
        null=True,
        on_delete=PROTECT
    )
    is_partially_renewable = models.BooleanField(
        default=False,
        db_comment="Flag. True if the fuel type can be partially renewable."
    )

    objects = ApprovedFuelManager()

    @property
    def fuel_classes(self):
        """
        Fuel Classes associated to the Fuel.
        Relationship through ApprovedFuelClass
        """
        fuel_classes = FuelClass.objects.filter(
            approved_fuel_class__fuel_id=self.id
        )

        return fuel_classes

    @property
    def provisions(self):
        """
        Provisions associated with the fuel.
        Relationship through ApprovedFuelProvision
        """
        provisions = ProvisionOfTheAct.objects.filter(
            fuel=self.id
        )

        return provisions

    def natural_key(self):
        """
        Allows type 'name' to be used to identify
        a row in the table
        """
        return (self.name,)

    class Meta:
        db_table = 'approved_fuel_type'

    db_table_comment = "List of approved fuel types (eg LNG, Ethanol)"
