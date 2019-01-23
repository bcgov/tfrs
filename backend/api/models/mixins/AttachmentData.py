from django.db import models


class AttachmentData(models.Model):
    """Common fields for Document and DocumentHistory"""
    filename = models.CharField(
        max_length=260,
        db_comment="Filename from when it was in the user's system."
    )
    url = models.URLField(
        null=False, blank=False, max_length=2048,
        db_comment="URL on where the file is stored."
    )
    size = models.BigIntegerField(
        null=False, default=0,
        db_comment="File size"
    )
    mime_type = models.CharField(
        null=False, max_length=255,
        db_comment="Mime type information of the file."
    )
    security_scan_status = models.CharField(
        choices=[('NOT RUN', 'Not Run'), ('IN PROGRESS', 'In Progress'),
                 ('PASS', 'Passed'), ('FAIL', 'Failed')],
        default='NOT RUN', null=False, max_length=20,
        db_comment="Security Scan Status"
    )
    is_removed = models.BooleanField(
        default=False,
        db_comment="Whether it was marked as deleted"
    )

    class Meta:
        abstract = True
