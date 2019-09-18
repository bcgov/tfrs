import collections
from datetime import datetime
from typing import List
from django.db import models
from django.db.models import Q

from api.managers.ComplianceReportStatusManager import \
    ComplianceReportStatusManager
from api.managers.TheTypeManager import TheTypeManager
from api.models.CompliancePeriod import CompliancePeriod
from api.models.ComplianceReportHistory import ComplianceReportHistory
from api.models.ComplianceReportSchedules import ScheduleD, ScheduleC, \
    ScheduleB, ScheduleA, ScheduleSummary
from api.models.CreditTrade import CreditTrade
from api.models.ExclusionReportAgreement import ExclusionAgreement
from api.models.ComplianceReportSnapshot import ComplianceReportSnapshot
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
        null=False,
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
        return self.status

    class Meta:
        db_table = 'compliance_report_status'

    db_table_comment = "List of possible statuses." \
                       "(Draft, Submitted, Received, etc.)"


class ComplianceReportWorkflowState(Auditable):
    fuel_supplier_status = models.ForeignKey(
        ComplianceReportStatus,
        null=False,
        # limit_choices_to=['Draft', 'Submitted', 'Deleted'],
        related_name='+',
        to_field='status',
        default='Draft')

    analyst_status = models.ForeignKey(
        ComplianceReportStatus,
        null=False,
        related_name='+',
        to_field='status',
        default='Unreviewed'
    )

    manager_status = models.ForeignKey(
        ComplianceReportStatus,
        null=False,
        related_name='+',
        to_field='status',
        default='Unreviewed'
    )

    director_status = models.ForeignKey(
        ComplianceReportStatus,
        null=False,
        related_name='+',
        to_field='status',
        default='Unreviewed'
    )

    class Meta:
        db_table = 'compliance_report_workflow_state'

    db_table_comment = "Track the workflow state for each of the four " \
                       "parties (fuel supplier, analyst, manager, and " \
                       "director) who can effect state changes on a " \
                       "compliance report."


class ComplianceReportType(DisplayOrder):
    """
    List of Possible types for compliance reports.
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
        Allows type 'the_type' to be used to identify
        a row in the table
        """
        return (self.the_type,)

    class Meta:
        db_table = 'compliance_report_type'

    db_table_comment = "List of possible compliance report types."


class ComplianceReport(Auditable):
    """
    Compliance Report records
    """
    status = models.OneToOneField(
        ComplianceReportWorkflowState,
        related_name='compliance_report',
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

    credit_transaction = models.OneToOneField(
        CreditTrade,
        on_delete=models.DO_NOTHING,
        related_name='compliance_report',
        null=True,
        db_comment='FK for validations or reductions awarded as a result of accepting '
                   'this compliance report'
    )

    compliance_period = models.ForeignKey(
        CompliancePeriod,
        on_delete=models.DO_NOTHING,
        null=False
    )

    schedule_a = models.OneToOneField(
        ScheduleA,
        related_name='compliance_report',
        on_delete=models.SET_NULL,
        null=True
    )

    schedule_b = models.OneToOneField(
        ScheduleB,
        related_name='compliance_report',
        on_delete=models.SET_NULL,
        null=True
    )

    schedule_c = models.OneToOneField(
        ScheduleC,
        related_name='compliance_report',
        on_delete=models.SET_NULL,
        null=True
    )

    schedule_d = models.OneToOneField(
        ScheduleD,
        related_name='compliance_report',
        on_delete=models.SET_NULL,
        null=True
    )

    summary = models.OneToOneField(
        ScheduleSummary,
        related_name='compliance_report',
        on_delete=models.SET_NULL,
        null=True
    )

    exclusion_agreement = models.OneToOneField(
        ExclusionAgreement,
        related_name='compliance_report',
        on_delete=models.SET_NULL,
        null=True
    )

    supplements = models.ForeignKey(
        'ComplianceReport',
        related_name='supplemental_reports',
        on_delete=models.PROTECT,
        null=True
    )

    nickname = models.CharField(
        max_length=255, blank=True, null=True,
        db_comment="An optional user-supplied nickname for this report"
    )

    @property
    def generated_nickname(self):
        """ Used for display in the UI when no nickname is set"""
        best_timestamp = datetime.now()

        if self.update_timestamp:
            best_timestamp = self.update_timestamp
        if self.create_timestamp:
            best_timestamp = self.create_timestamp

        if self.supplements is not None:
            # found out how many in this tree
            supplement_count = 0

            # wind back to root
            ancestor = self
            while ancestor.supplements is not None:
                ancestor = ancestor.supplements

            # now at the root, traverse to find all
            visited = []
            to_visit = collections.deque([ancestor.id])
            position_in_traversal = 0
            i = 0

            while len(to_visit) > 0:
                current_id = to_visit.popleft()

                #break loops
                if current_id in visited:
                    continue
                visited.append(current_id)

                current = ComplianceReport.objects.get(id=current_id)

                # don't count non-supplement reports (really should just be the root)
                if current.supplements is not None:
                    i += 1

                if current_id == self.id:
                    position_in_traversal = i

                for descendant in current.supplemental_reports.order_by('create_timestamp').all():
                    to_visit.append(descendant.id)

            return 'Supplemental {} #{}, {}'.format(self.type.the_type, position_in_traversal, best_timestamp.strftime('%Y-%m-%d %H:%M'))
        else:
            return '{},  {}'.format(self.type.the_type, best_timestamp.strftime('%Y-%m-%d %H:%M'))

    def get_history(self, include_government_statuses=False):
        """
        Fetch the compliance report status changes.
        The parameter needed here would be the statuses that
        we'd like to show.
        """
        if include_government_statuses:
            history = ComplianceReportHistory.objects.filter(
                Q(status__fuel_supplier_status__status__in=["Submitted"]) |
                Q(status__analyst_status__status__in=[
                    "Recommended", "Not Recommended",
                    "Requested Supplemental"
                ]) |
                Q(status__director_status__status__in=[
                    "Accepted", "Rejected"
                ]) |
                Q(status__manager_status__status__in=[
                    "Recommended", "Not Recommended",
                    "Requested Supplemental"
                ]),
                compliance_report_id=self.id
            ).order_by('create_timestamp')
        else:
            history = ComplianceReportHistory.objects.filter(
                Q(
                    Q(status__fuel_supplier_status__status__in=["Submitted"]) &
                    Q(user_role__is_government_role=False)
                ) |
                Q(status__director_status__status__in=[
                    "Accepted", "Rejected"
                ]) |
                Q(status__analyst_status__status__in=[
                    "Requested Supplemental"
                ]) |
                Q(status__manager_status__status__in=[
                    "Requested Supplemental"
                ]),
                compliance_report_id=self.id
            ).order_by('create_timestamp')

        return history

    @property
    def read_only(self):
        return self.status.fuel_supplier_status.status not in ['Draft']

    @property
    def has_snapshot(self):
        return ComplianceReportSnapshot.objects. \
                   filter(compliance_report=self).count() > 0

    @property
    def is_supplemental(self):
        return self.supplements is not None

    @property
    def snapshot(self):
        return ComplianceReportSnapshot.objects.filter(compliance_report=self).first().snapshot

    class Meta:
        db_table = 'compliance_report'

    db_table_comment = "Contains annual compliance report records"
