from django.db import transaction

from api.management.data_script import OperationalDataScript
from api.models.ApprovedFuel import ApprovedFuel
from api.models.DefaultCarbonIntensity import DefaultCarbonIntensity


class AddDefaultCarbonIntensities(OperationalDataScript):
    """
    Adds Default Carbon Intensities
    """
    is_revertable = False
    comment = 'Adds Default Carbon Intensities'

    def check_run_preconditions(self):
        return True

    @transaction.atomic
    def run(self):
        DefaultCarbonIntensity.objects.create(
            fuel=ApprovedFuel.objects.get(
                name="Renewable fuel in relation to diesel class fuel"
            ),
            effective_date="2017-01-01",
            density="98.96"
        )
        DefaultCarbonIntensity.objects.create(
            fuel=ApprovedFuel.objects.get(
                name="Propane"
            ),
            effective_date="2017-01-01",
            density="75.35"
        )
        DefaultCarbonIntensity.objects.create(
            fuel=ApprovedFuel.objects.get(
                name="Renewable fuel in relation to gasoline class fuel"
            ),
            effective_date="2017-01-01",
            density="88.14"
        )
        DefaultCarbonIntensity.objects.create(
            fuel=ApprovedFuel.objects.get(
                name="Natural gas-based gasoline"
            ),
            effective_date="2017-01-01",
            density="90.07"
        )
        DefaultCarbonIntensity.objects.create(
            fuel=ApprovedFuel.objects.get(
                name="LNG"
            ),
            effective_date="2017-01-01",
            density="112.65"
        )
        DefaultCarbonIntensity.objects.create(
            fuel=ApprovedFuel.objects.get(
                name="CNG"
            ),
            effective_date="2017-01-01",
            density="63.64"
        )
        DefaultCarbonIntensity.objects.create(
            fuel=ApprovedFuel.objects.get(
                name="Electricity"
            ),
            effective_date="2017-01-01",
            density="19.73"
        )
        DefaultCarbonIntensity.objects.create(
            fuel=ApprovedFuel.objects.get(
                name="Hydrogen"
            ),
            effective_date="2017-01-01",
            density="96.82"
        )

script_class = AddDefaultCarbonIntensities
