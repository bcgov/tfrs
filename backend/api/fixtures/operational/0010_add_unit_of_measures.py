from django.db import transaction

from api.management.data_script import OperationalDataScript
from api.models.ApprovedFuel import ApprovedFuel
from api.models.UnitOfMeasure import UnitOfMeasure


class AddUnitOfMeasures(OperationalDataScript):
    """
    Adds Energy Densities
    """
    is_revertable = False
    comment = 'Adds Energy Densities'

    def check_run_preconditions(self):
        return True

    @transaction.atomic
    def run(self):
        l = UnitOfMeasure.objects.create(
            name="L",
            effective_date="2017-01-01"
        )
        kg = UnitOfMeasure.objects.create(
            name="kg",
            effective_date="2017-01-01"
        )
        kwh = UnitOfMeasure.objects.create(
            name="kWh",
            effective_date="2017-01-01"
        )
        m3 = UnitOfMeasure.objects.create(
            name="m³",
            effective_date="2017-01-01"
        )

        ApprovedFuel.objects.filter(
            name__in=[
                "Biodiesel", "Ethanol", "HDRD", "Natural gas-based gasoline",
                "Petroleum-based diesel", "Petroleum-based gasoline",
                "Propane", "Renewable diesel", "Renewable gasoline"
            ]
        ).update(
            unit_of_measure=l
        )
        ApprovedFuel.objects.filter(
            name__in=[
                "Hydrogen", "LNG"
            ]
        ).update(
            unit_of_measure=kg
        )
        ApprovedFuel.objects.filter(
            name="Electricity"
        ).update(
            unit_of_measure=kwh
        )
        ApprovedFuel.objects.filter(
            name="CNG"
        ).update(
            unit_of_measure=m3
        )

script_class = AddUnitOfMeasures
