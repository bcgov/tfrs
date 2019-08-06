from django.db import models

from auditable.models import Auditable


class ComplianceReportHistory(Auditable):
    """
    Contains the status changes of the Compliance Report
    """
    compliance_report = models.ForeignKey(
        'ComplianceReport',
        on_delete=models.PROTECT,
        null=False,
        related_name='compliance_reports'
    )
    status = models.ForeignKey(
        'ComplianceReportStatus',
        on_delete=models.PROTECT,
        null=False,
        related_name='compliance_reports'
    )
    user_role = models.ForeignKey(
        'Role',
        blank=True, null=True,
        on_delete=models.SET_NULL,
        db_comment="Role of the user that made the change.",
        related_name='compliance_reports'
    )

    class Meta:
        db_table = 'compliance_report_history'

    db_table_comment = "Contains the status changes of the Compliance Report"
