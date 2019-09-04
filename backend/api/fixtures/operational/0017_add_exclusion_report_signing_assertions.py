from django.db import transaction

from api.management.data_script import OperationalDataScript
from api.models.SigningAuthorityAssertion import SigningAuthorityAssertion


class AddComplianceReportSigningAssertions(OperationalDataScript):
    """
    Adds Signing Assertions for Exclusion Report
    """
    is_revertable = False
    comment = 'Adds Signing Assertions for Exclusion Report'

    def check_run_preconditions(self):
        return True

    @transaction.atomic
    def run(self):
        SigningAuthorityAssertion.objects.create(
            description="I certify that records evidencing each matter "
                        "reported under section 11.032 (4) (b) or (c) of the "
                        "Renewable and Low Carbon Fuel Requirements "
                        "Regulation are available on request.",
            display_order="1",
            effective_date="2018-01-01",
            module="exclusion_report"
        )
        SigningAuthorityAssertion.objects.create(
            description="I certify that records evidencing my authority to "
                        "submit this report are available on request.",
            display_order="2",
            effective_date="2018-01-01",
            module="exclusion_report"
        )
        SigningAuthorityAssertion.objects.create(
            description="I certify that the information in this report is "
                        "true and complete to the best of my knowledge and I "
                        "understand that I may be required to provide to the "
                        "Director records evidencing the truth of that "
                        "information.",
            display_order="3",
            effective_date="2018-01-01",
            module="exclusion_report"
        )

script_class = AddComplianceReportSigningAssertions
