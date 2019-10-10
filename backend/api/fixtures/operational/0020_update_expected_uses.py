from django.db import transaction

from api.management.data_script import OperationalDataScript
from api.models.ExpectedUse import ExpectedUse


class UpdateExpectedUses(OperationalDataScript):
    """
    Updates Permission Labels and Descriptions
    """
    is_revertable = False
    comment = "Expires Aviation and National Defense as they are not " \
              "required to be reported."

    def check_run_preconditions(self):
        return True

    @transaction.atomic
    def run(self):
        ExpectedUse.objects.filter(
            description__in=[
                "Department of National Defence (Canada)",
                "Aviation"
            ]
        ).update(
            expiration_date="2017-01-01"
        )

script_class = UpdateExpectedUses
