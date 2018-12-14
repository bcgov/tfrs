from api.models.DocumentStatus import DocumentStatus
from django.db import models

from api.models.DocumentType import DocumentType
from api.models.Organization import Organization


class AttachmentData(models.Model):
    """Common fields for Document and DocumentHistory"""

    url = models.URLField(null=False, blank=False, max_length=2048)
    size = models.BigIntegerField(null=False, default=0)
    mime_type = models.CharField(null=False, max_length=255)
    security_scan_status = models.CharField(choices=[('NOT RUN', 'Not Run'),
                                                     ('IN PROGRESS', 'In Progress'),
                                                     ('PASS', 'Passed'),
                                                     ('FAIL', 'Failed')],
                                            default='NOT RUN',
                                            null=False,
                                            max_length=20)

    class Meta:
        abstract = True
