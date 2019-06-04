from django.db import models

from api.managers.ComplianceReportStatusManager import \
    ComplianceReportStatusManager
from api.managers.TheTypeManager import TheTypeManager
from api.models.CompliancePeriod import CompliancePeriod
from api.models.ComplianceReportSchedules import ScheduleC
from api.models.Organization import Organization
from api.models.mixins.DisplayOrder import DisplayOrder
from api.models.mixins.EffectiveDates import EffectiveDates
from auditable.models import Auditable


class ComplianceReportStatus(Auditable, DisplayOrder, EffectiveDates):
    """
    List of Possible statuses for compliance reports.
    """
    status = models.CharField(
        max_length=25,
        blank=True,
        null=True,
        unique=True,
        db_comment="Contains an enumerated value to describe the compliance "
                   "report status. This is a unique natural key."
    )

    objects = ComplianceReportStatusManager()

    def natural_key(self):
        """
        Allows type 'status' to be used to identify
        a row in the table
        """
        return (self.status,)

    class Meta:
        db_table = 'compliance_report_status'

    db_table_comment = "List of possible statuses." \
                       "(Draft, Submitted, Received, etc.)"


class ComplianceReportType(DisplayOrder):
    """
    List of Possible statuses for compliance reports.
    """
    the_type = models.CharField(
        max_length=100,
        blank=False,
        null=False,
        unique=True,
        db_comment="Short descriptive name of the compliance report type."
    )

    description = models.CharField(
        max_length=1000, blank=True, null=False,
        db_comment="Description of the compliance report type. This is the "
                   "displayed name."
    )

    objects = TheTypeManager()

    def natural_key(self):
        """
        Allows type 'status' to be used to identify
        a row in the table
        """
        return (self.the_type,)

    class Meta:
        db_table = 'compliance_report_type'

    db_table_comment = "List of possible compliance report types."


class ComplianceReport(Auditable):
    """
    List of Possible statuses for compliance reports.
    """
    status = models.ForeignKey(
        ComplianceReportStatus,
        on_delete=models.PROTECT,
        null=False
    )

    type = models.ForeignKey(
        ComplianceReportType,
        on_delete=models.PROTECT,
        null=False
    )

    organization = models.ForeignKey(
        Organization,
        on_delete=models.CASCADE,
        null=False
    )

    compliance_period = models.ForeignKey(
        CompliancePeriod,
        on_delete=models.DO_NOTHING,
        null=False
    )

    schedule_c = models.OneToOneField(
        ScheduleC,
        related_name='compliance_report',
        on_delete=models.CASCADE,
        null=True
    )

    class Meta:
        db_table = 'compliance_report'

    db_table_comment = "Contains annual compliance report records"
