from django.db import models

from api.models.CompliancePeriod import CompliancePeriod
from api.models.DocumentStatus import DocumentStatus
from api.models.DocumentType import DocumentType


class DocumentData(models.Model):
    """Common fields for Document and DocumentHistory"""

    title = models.CharField(
        max_length=120,
        db_comment="High-level description of the Submission.",
        blank=False
    )

    status = models.ForeignKey(
        DocumentStatus,
        on_delete=models.PROTECT,
        null=False
    )

    type = models.ForeignKey(
        DocumentType,
        on_delete=models.PROTECT,
        null=False
    )

    compliance_period = models.ForeignKey(
        CompliancePeriod,
        on_delete=models.PROTECT,
        null=False
    )

    milestone = models.CharField(
        blank=True, max_length=1000, null=True,
        db_comment="Record section of agreement containing milestone."
    )

    class Meta:
        abstract = True
