from django.db import transaction

from api.management.data_script import OperationalDataScript
from api.models.DefaultCarbonIntensity import DefaultCarbonIntensity
from api.models.DefaultCarbonIntensityCategory import \
    DefaultCarbonIntensityCategory


class AddPetroleumCarbonIntensities(OperationalDataScript):
    """
    Adds Default Carbon Intensities for Petroleum Gas and Diesel
    """
    is_revertable = False
    comment = 'Adds Default Carbon Intensities'

    def check_run_preconditions(self):
        return True

    @transaction.atomic
    def run(self):
        DefaultCarbonIntensity.objects.create(
            category=DefaultCarbonIntensityCategory.objects.get(
                name="Petroleum-based diesel"
            ),
            effective_date="2017-01-01",
            density="94.76"
        )
        DefaultCarbonIntensity.objects.create(
            category=DefaultCarbonIntensityCategory.objects.get(
                name="Petroleum-based gasoline"
            ),
            effective_date="2017-01-01",
            density="88.14"
        )

script_class = AddPetroleumCarbonIntensities
