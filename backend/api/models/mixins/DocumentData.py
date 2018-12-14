from api.models.CompliancePeriod import CompliancePeriod
from api.models.DocumentStatus import DocumentStatus
from django.db import models

from api.models.DocumentType import DocumentType
from api.models.Organization import Organization


class DocumentData(models.Model):
    """Common fields for Document and DocumentHistory"""

    title = models.CharField(
        max_length=120
    )

    comment = models.CharField(
        max_length=1024,
        null=True,
        blank=True
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

    creating_organization = models.ForeignKey(
        Organization,
        on_delete=models.PROTECT,
        null=False
    )

    compliance_period = models.ForeignKey(
        CompliancePeriod,
        on_delete=models.PROTECT,
        null=False
    )

    class Meta:
        abstract = True