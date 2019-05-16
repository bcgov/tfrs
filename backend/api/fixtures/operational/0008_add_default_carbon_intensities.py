from django.db import transaction

from api.management.data_script import OperationalDataScript
from api.models.DefaultCarbonIntensity import DefaultCarbonIntensity
from api.models.DefaultCarbonIntensityCategory import \
    DefaultCarbonIntensityCategory


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
            category=DefaultCarbonIntensityCategory.objects.get(
                name__iexact="Renewable Fuel in relation to diesel class fuel"
            ),
            effective_date="2017-01-01",
            density="98.96"
        )
        DefaultCarbonIntensity.objects.create(
            category=DefaultCarbonIntensityCategory.objects.get(
                name__iexact="Propane"
            ),
            effective_date="2017-01-01",
            density="75.35"
        )
        DefaultCarbonIntensity.objects.create(
            category=DefaultCarbonIntensityCategory.objects.get(
                name__iexact="Renewable Fuel in relation to gasoline class fuel"
            ),
            effective_date="2017-01-01",
            density="88.14"
        )
        DefaultCarbonIntensity.objects.create(
            category=DefaultCarbonIntensityCategory.objects.get(
                name__iexact="Natural gas-based gasoline"
            ),
            effective_date="2017-01-01",
            density="90.07"
        )
        DefaultCarbonIntensity.objects.create(
            category=DefaultCarbonIntensityCategory.objects.get(
                name__iexact="LNG"
            ),
            effective_date="2017-01-01",
            density="112.65"
        )
        DefaultCarbonIntensity.objects.create(
            category=DefaultCarbonIntensityCategory.objects.get(
                name__iexact="CNG"
            ),
            effective_date="2017-01-01",
            density="63.64"
        )
        DefaultCarbonIntensity.objects.create(
            category=DefaultCarbonIntensityCategory.objects.get(
                name__iexact="Electricity"
            ),
            effective_date="2017-01-01",
            density="19.73"
        )
        DefaultCarbonIntensity.objects.create(
            category=DefaultCarbonIntensityCategory.objects.get(
                name__iexact="Hydrogen"
            ),
            effective_date="2017-01-01",
            density="96.82"
        )

script_class = AddDefaultCarbonIntensities
