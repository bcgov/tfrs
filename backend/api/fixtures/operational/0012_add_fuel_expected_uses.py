from django.db import transaction

from api.management.data_script import OperationalDataScript
from api.models.ExpectedUse import ExpectedUse


class AddFuelExpectedUses(OperationalDataScript):
    """
    Adds Expected Uses
    """
    is_revertable = False
    comment = 'Adds Expected Uses'

    def check_run_preconditions(self):
        return True

    @transaction.atomic
    def run(self):
        ExpectedUse.objects.create(
            description="Other",
            display_order="99",
            effective_date="2017-01-01"
        )
        ExpectedUse.objects.create(
            description="Heating Oil",
            display_order="1",
            effective_date="2017-01-01"
        )
        ExpectedUse.objects.create(
            description="Department of National Defence (Canada)",
            display_order="2",
            effective_date="2017-01-01"
        )
        ExpectedUse.objects.create(
            description="Aviation",
            display_order="3",
            effective_date="2017-01-01"
        )

script_class = AddFuelExpectedUses
