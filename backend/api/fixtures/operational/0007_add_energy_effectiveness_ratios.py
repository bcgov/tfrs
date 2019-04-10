from django.db import transaction

from api.management.data_script import OperationalDataScript
from api.models.ApprovedFuel import ApprovedFuel
from api.models.EnergyEffectivenessRatio import EnergyEffectivenessRatio
from api.models.FuelClass import FuelClass


class AddEnergyEffectivenessRatios(OperationalDataScript):
    """
    Adds Energy Effectiveness Ratios
    """
    is_revertable = False
    comment = 'Adds Energy Effectiveness Ratios'

    def check_run_preconditions(self):
        return True

    @transaction.atomic
    def run(self):
        EnergyEffectivenessRatio.objects.create(
            fuel=ApprovedFuel.objects.get(
                name="Petroleum-based diesel fuel or renewable fuel in "
                     "relation to diesel class fuel"
            ),
            effective_date="2017-01-01",
            ratio="1.0",
            fuel_class=FuelClass.objects.get(fuel_class="Diesel")
        )
        EnergyEffectivenessRatio.objects.create(
            fuel=ApprovedFuel.objects.get(
                name="Petroleum-based gasoline, natural gas-based gasoline or "
                     "renewable fuel in relation to gasoline class fuel"
            ),
            effective_date="2017-01-01",
            ratio="1.0",
            fuel_class=FuelClass.objects.get(fuel_class="Gasoline")
        )
        EnergyEffectivenessRatio.objects.create(
            fuel=ApprovedFuel.objects.get(
                name="Hydrogen"
            ),
            effective_date="2017-01-01",
            ratio="1.9",
            fuel_class=FuelClass.objects.get(fuel_class="Diesel")
        )
        EnergyEffectivenessRatio.objects.create(
            fuel=ApprovedFuel.objects.get(
                name="Hydrogen"
            ),
            effective_date="2017-01-01",
            ratio="2.5",
            fuel_class=FuelClass.objects.get(fuel_class="Gasoline")
        )
        EnergyEffectivenessRatio.objects.create(
            fuel=ApprovedFuel.objects.get(
                name="LNG"
            ),
            effective_date="2017-01-01",
            ratio="1.0",
            fuel_class=FuelClass.objects.get(fuel_class="Diesel")
        )
        EnergyEffectivenessRatio.objects.create(
            fuel=ApprovedFuel.objects.get(
                name="CNG"
            ),
            effective_date="2017-01-01",
            ratio="0.9",
            fuel_class=FuelClass.objects.get(fuel_class="Diesel")
        )
        EnergyEffectivenessRatio.objects.create(
            fuel=ApprovedFuel.objects.get(
                name="CNG"
            ),
            effective_date="2017-01-01",
            ratio="1.0",
            fuel_class=FuelClass.objects.get(fuel_class="Gasoline")
        )
        EnergyEffectivenessRatio.objects.create(
            fuel=ApprovedFuel.objects.get(
                name="Propane"
            ),
            effective_date="2017-01-01",
            ratio="1.0",
            fuel_class=FuelClass.objects.get(fuel_class="Diesel")
        )
        EnergyEffectivenessRatio.objects.create(
            fuel=ApprovedFuel.objects.get(
                name="Propane"
            ),
            effective_date="2017-01-01",
            ratio="1.0",
            fuel_class=FuelClass.objects.get(fuel_class="Gasoline")
        )
        EnergyEffectivenessRatio.objects.create(
            fuel=ApprovedFuel.objects.get(
                name="Electricity"
            ),
            effective_date="2017-01-01",
            ratio="2.7",
            fuel_class=FuelClass.objects.get(fuel_class="Diesel")
        )
        EnergyEffectivenessRatio.objects.create(
            fuel=ApprovedFuel.objects.get(
                name="Electricity"
            ),
            effective_date="2017-01-01",
            ratio="3.4",
            fuel_class=FuelClass.objects.get(fuel_class="Gasoline")
        )

script_class = AddEnergyEffectivenessRatios
