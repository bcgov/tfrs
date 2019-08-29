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
        db_comment="Size of the file in bytes."
    )
    mime_type = models.CharField(
        null=False, max_length=255,
        db_comment="Mime type information of the file. "
                   "(eg. application/pdf, image/gif, image/png, etc)"
    )
    security_scan_status = models.CharField(
        choices=[('NOT RUN', 'Not Run'), ('IN PROGRESS', 'In Progress'),
                 ('PASS', 'Passed'), ('FAIL', 'Failed')],
        default='NOT RUN', null=False, max_length=20,
        db_comment="Status on whether the file has been scanned for viruses."
                   "NOT RUN - new file and scan hasn't been done"
                   "IN PROGRESS - file currently being scanned"
                   "PASS - file is good"
                   "FAIL - file contains something suspicious"
    )
    scan_resubmit_ttl = models.IntegerField(
        default=200,
        null=False,
        db_comment='Maximum resubmission attempts for scan'
    )
    is_removed = models.BooleanField(
        default=False,
        db_comment="Whether it was marked as deleted"
    )
    record_number = models.CharField(
        blank=True, max_length=100, null=True,
        db_comment="Number stored in TRIM"
    )

    class Meta:
        abstract = True
