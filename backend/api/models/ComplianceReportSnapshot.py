from django.contrib.postgres.fields import JSONField
from django.db import models

from auditable.models import Auditable

from django.core.serializers.json import DjangoJSONEncoder


class ComplianceReportSnapshot(Auditable):
    """
    List of Possible statuses for compliance reports.
    """

    snapshot = JSONField(
        null=True,
        encoder=DjangoJSONEncoder,
        db_comment='Holds a JSON-serialized snapshot of the state of a compliance report'
                    ' at the time of submission. NULL before submission. $.version is a'
                   ' version code and $.timestamp is time the snapshot was generated.'
    )

    compliance_report = models.OneToOneField(
        'ComplianceReport',
        related_name=None
    )

    class Meta:
        db_table = 'compliance_report_snapshot'

    db_table_comment = "Contains audit records of compliance reports"
