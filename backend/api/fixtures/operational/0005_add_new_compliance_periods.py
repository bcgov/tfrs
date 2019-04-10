from django.db import transaction

from api.management.data_script import OperationalDataScript
from api.models.CompliancePeriod import CompliancePeriod


class AddCompliancePeriods(OperationalDataScript):
    """
    Adds Compliance Period 2021 to 2030
    """
    is_revertable = False
    comment = 'Adds Compliance Periods 2021-2030'

    def check_run_preconditions(self):
        return True

    @transaction.atomic
    def run(self):
        compliance_periods = []
        display_order = 10

        for period in range(2021, 2031):
            display_order += 1

            compliance_periods.append(
                CompliancePeriod(
                    description=period,
                    display_order=display_order,
                    effective_date="{}-01-01".format(period),
                    expiration_date="{}-12-31".format(period)
                )
            )

        CompliancePeriod.objects.bulk_create(compliance_periods)

script_class = AddCompliancePeriods
