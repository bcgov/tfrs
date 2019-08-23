from django.db.models import Q

from api.models.ComplianceReport import ComplianceReport, ComplianceReportWorkflowState
from api.models.ComplianceReportHistory import ComplianceReportHistory
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
                ~Q(status__fuel_supplier_status__status__in=["Draft", "Deleted"])
            )
        else:
            # If organization == Fuel Supplier
            # Show all compliance reports for which we are the organization
            compliance_reports = ComplianceReport.objects.filter(
                Q(organization=organization) &
                ~Q(status__fuel_supplier_status__status__in=["Deleted"])
            )

        return compliance_reports

    @staticmethod
    def create_history(compliance_report, is_new=False):
        """
        Create the CreditTradeHistory
        """
        user = (
            compliance_report.create_user
            if is_new
            else compliance_report.update_user)

        role_id = None

        if user.roles.filter(name="GovDirector").exists():
            role_id = user.roles.get(name="GovDirector").id
        elif user.roles.filter(name="GovDeputyDirector").exists():
            role_id = user.roles.get(name="GovDeputyDirector").id
        else:
            role_id = user.roles.first().id

        created_status = ComplianceReportWorkflowState.objects.create(
            fuel_supplier_status=compliance_report.status.fuel_supplier_status,
            analyst_status=compliance_report.status.analyst_status,
            manager_status=compliance_report.status.manager_status,
            director_status=compliance_report.status.director_status
        )
        created_status.save()

        history = ComplianceReportHistory(
            compliance_report_id=compliance_report.id,
            status_id=created_status.id,
            create_user=user,
            user_role_id=role_id
        )

        history.save()
