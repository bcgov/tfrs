from django.db import transaction

from api.management.data_script import OperationalDataScript
from api.models.CarbonIntensityLimit import CarbonIntensityLimit


class UpdateCarbonIntensityLimits(OperationalDataScript):
    """
    Updates the effective dates for the carbon intensity limits,
    so it follows our pattern with the other credit calculation
    tables
    """
    is_revertable = False
    comment = 'Updates the Carbon Intensity Limits Effective Dates'

    def check_run_preconditions(self):
        return True

    @transaction.atomic
    def run(self):
        CarbonIntensityLimit.objects.update(
            effective_date="2017-01-01",
            expiration_date=None
        )

script_class = UpdateCarbonIntensityLimits
