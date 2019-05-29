from datetime import timedelta
from django.apps import apps
from django.db.models import F, Max, Q

from api.models.ComplianceReport import ComplianceReport
from api.models.Organization import Organization


class ComplianceReportService(object):
    """
    Helper functions for Credit Calculation
    """

    @staticmethod
    def get_organization_compliance_reports(organization):
        """
        Fetch the compliance reports with various rules based on the user's
        organization
        """
        # Government Organization -- assume OrganizationType id 1 is gov
        gov_org = Organization.objects.get(type=1)

        if organization == gov_org:
            # If organization == Government
            #  don't show "Draft" transactions
            #  don't show "Deleted" transactions
            compliance_reports = ComplianceReport.objects.filter(
                ~Q(status__status__in=["Draft", "Deleted"])
            )
        else:
            # If organization == Fuel Supplier
            # Show all compliance reports for which we are the organization
            compliance_reports = ComplianceReport.objects.filter(
                Q(organization=organization) &
                ~Q(status__status__in=["Deleted"])
            )

        return compliance_reports
