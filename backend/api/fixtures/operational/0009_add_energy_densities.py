from django.db import transaction

from api.management.data_script import OperationalDataScript
from api.models.ApprovedFuel import ApprovedFuel
from api.models.EnergyDensity import EnergyDensity
from api.models.UnitOfMeasure import UnitOfMeasure


class AddEnergyDensities(OperationalDataScript):
    """
    Adds Energy Densities
    """
    is_revertable = False
    comment = 'Adds Energy Densities'

    def check_run_preconditions(self):
        return True

    @transaction.atomic
    def run(self):
        mj_l = UnitOfMeasure.objects.create(
            name="MJ/L",
            effective_date="2017-01-01"
        )
        mj_kg = UnitOfMeasure.objects.create(
            name="MJ/kg",
            effective_date="2017-01-01"
        )
        mj_kwh = UnitOfMeasure.objects.create(
            name="MJ/kWh",
            effective_date="2017-01-01"
        )
        mj_m3 = UnitOfMeasure.objects.create(
            name="MJ/m³",
            effective_date="2017-01-01"
        )

        EnergyDensity.objects.create(
            fuel=ApprovedFuel.objects.get(
                name="Petroleum-based diesel fuel or diesel fuel produced "
                     "from biomass"
            ),
            effective_date="2017-01-01",
            density="38.65",
            unit_of_measure=mj_l
        )
        EnergyDensity.objects.create(
            fuel=ApprovedFuel.objects.get(
                name="Hydrogenation-derived renewable diesel fuel"
            ),
            effective_date="2017-01-01",
            density="36.51",
            unit_of_measure=mj_l
        )
        EnergyDensity.objects.create(
            fuel=ApprovedFuel.objects.get(
                name="Biodiesel"
            ),
            effective_date="2017-01-01",
            density="35.40",
            unit_of_measure=mj_l
        )
        EnergyDensity.objects.create(
            fuel=ApprovedFuel.objects.get(
                name="Petroleum-based gasoline, natural gas-based "
                     "gasoline or gasoline produced from biomass"
            ),
            effective_date="2017-01-01",
            density="34.69",
            unit_of_measure=mj_l
        )
        EnergyDensity.objects.create(
            fuel=ApprovedFuel.objects.get(
                name="Ethanol"
            ),
            effective_date="2017-01-01",
            density="23.58",
            unit_of_measure=mj_l
        )
        EnergyDensity.objects.create(
            fuel=ApprovedFuel.objects.get(
                name="Hydrogen"
            ),
            effective_date="2017-01-01",
            density="141.24",
            unit_of_measure=mj_kg
        )
        EnergyDensity.objects.create(
            fuel=ApprovedFuel.objects.get(
                name="LNG"
            ),
            effective_date="2017-01-01",
            density="52.46",
            unit_of_measure=mj_kg
        )
        EnergyDensity.objects.create(
            fuel=ApprovedFuel.objects.get(
                name="CNG"
            ),
            effective_date="2017-01-01",
            density="37.85",
            unit_of_measure=mj_m3
        )
        EnergyDensity.objects.create(
            fuel=ApprovedFuel.objects.get(
                name="Propane"
            ),
            effective_date="2017-01-01",
            density="25.47",
            unit_of_measure=mj_l
        )
        EnergyDensity.objects.create(
            fuel=ApprovedFuel.objects.get(
                name="Electricity"
            ),
            effective_date="2017-01-01",
            density="3.60",
            unit_of_measure=mj_kwh
        )

script_class = AddEnergyDensities
