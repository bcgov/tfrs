from django.db import transaction

from api.management.data_script import OperationalDataScript
from api.models.EnergyDensity import EnergyDensity
from api.models.EnergyDensityCategory import EnergyDensityCategory


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
        EnergyDensity.objects.create(
            category=EnergyDensityCategory.objects.get(
                name="Petroleum-based diesel fuel or diesel fuel produced "
                     "from biomass"
            ),
            effective_date="2017-01-01",
            density="38.65"
        )
        EnergyDensity.objects.create(
            category=EnergyDensityCategory.objects.get(
                name="Hydrogenation-derived renewable diesel fuel"
            ),
            effective_date="2017-01-01",
            density="36.51"
        )
        EnergyDensity.objects.create(
            category=EnergyDensityCategory.objects.get(
                name="Biodiesel"
            ),
            effective_date="2017-01-01",
            density="35.40"
        )
        EnergyDensity.objects.create(
            category=EnergyDensityCategory.objects.get(
                name="Petroleum-based gasoline, natural gas-based "
                     "gasoline or gasoline produced from biomass"
            ),
            effective_date="2017-01-01",
            density="34.69"
        )
        EnergyDensity.objects.create(
            category=EnergyDensityCategory.objects.get(
                name="Ethanol"
            ),
            effective_date="2017-01-01",
            density="23.58"
        )
        EnergyDensity.objects.create(
            category=EnergyDensityCategory.objects.get(
                name="Hydrogen"
            ),
            effective_date="2017-01-01",
            density="141.24"
        )
        EnergyDensity.objects.create(
            category=EnergyDensityCategory.objects.get(
                name="LNG"
            ),
            effective_date="2017-01-01",
            density="52.46"
        )
        EnergyDensity.objects.create(
            category=EnergyDensityCategory.objects.get(
                name="CNG"
            ),
            effective_date="2017-01-01",
            density="37.85"
        )
        EnergyDensity.objects.create(
            category=EnergyDensityCategory.objects.get(
                name="Propane"
            ),
            effective_date="2017-01-01",
            density="25.47"
        )
        EnergyDensity.objects.create(
            category=EnergyDensityCategory.objects.get(
                name="Electricity"
            ),
            effective_date="2017-01-01",
            density="3.60"
        )

script_class = AddEnergyDensities
