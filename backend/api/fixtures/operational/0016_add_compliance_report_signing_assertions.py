from django.db import transaction

from api.management.data_script import OperationalDataScript
from api.models.SigningAuthorityAssertion import SigningAuthorityAssertion


class AddComplianceReportSigningAssertions(OperationalDataScript):
    """
    Adds Signing Assertions for Compliance Report
    """
    is_revertable = False
    comment = 'Adds Signing Assertions for Compliance Report'

    def check_run_preconditions(self):
        return True

    @transaction.atomic
    def run(self):
        SigningAuthorityAssertion.objects.create(
            description="I expect, on reasonable grounds, that any fuels "
                        "reported in Schedule C were used for a purpose other "
                        "than transport in accordance with section 6 (3) of "
                        "the *Greenhouse Gas Reduction (Renewable and Low "
                        "Carbon Fuel Requirements) Act*.",
            display_order="1",
            effective_date="2018-01-01",
            module="compliance_report"
        )
        SigningAuthorityAssertion.objects.create(
            description="I certify that records evidencing each matter "
                        "reported under sections 9 and 11.08 of the Renewable "
                        "and Low Carbon Fuel Requirements Regulation are "
                        "available on request.",
            display_order="2",
            effective_date="2018-01-01",
            module="compliance_report"
        )
        SigningAuthorityAssertion.objects.create(
            description="I certify that I am an officer or employee of the "
                        "fuel supplier, and that records evidencing my "
                        "authority to submit this report are available on "
                        "request.",
            display_order="3",
            effective_date="2018-01-01",
            module="compliance_report"
        )
        SigningAuthorityAssertion.objects.create(
            description="I certify that the information in this report is "
                        "true and complete to the best of my knowledge and I "
                        "understand that I may be required to provide to the "
                        "Director records evidencing the truth of that "
                        "information.",
            display_order="4",
            effective_date="2018-01-01",
            module="compliance_report"
        )

script_class = AddComplianceReportSigningAssertions
