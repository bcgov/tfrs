from django.db import transaction

from api.management.data_script import OperationalDataScript
from api.models.PetroleumCarbonIntensity import PetroleumCarbonIntensity
from api.models.PetroleumCarbonIntensityCategory import \
    PetroleumCarbonIntensityCategory


class AddPetroleumCarbonIntensities(OperationalDataScript):
    """
    Adds Petroleum-based Carbon Intensities
    """
    is_revertable = False
    comment = 'Adds Petroleum-based Carbon Intensities'

    def check_run_preconditions(self):
        return True

    @transaction.atomic
    def run(self):
        PetroleumCarbonIntensity.objects.create(
            category=PetroleumCarbonIntensityCategory.objects.get(
                name="Petroleum-based diesel"
            ),
            effective_date="2017-01-01",
            density="94.76"
        )
        PetroleumCarbonIntensity.objects.create(
            category=PetroleumCarbonIntensityCategory.objects.get(
                name="Petroleum-based gasoline"
            ),
            effective_date="2017-01-01",
            density="88.14"
        )

script_class = AddPetroleumCarbonIntensities
