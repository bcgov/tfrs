from django.db import transaction

from api.management.data_script import OperationalDataScript
from api.models.CompliancePeriod import CompliancePeriod


class DeleteInitialCompliancePeriod(OperationalDataScript):

    is_revertable = False
    comment = 'Remove initial auto-generated compliance period'

    def check_run_preconditions(self):
        return True

    @transaction.atomic
    def run(self):
        CompliancePeriod.objects.get(description='Auto-generated initial compliance period').delete()


script_class = DeleteInitialCompliancePeriod
