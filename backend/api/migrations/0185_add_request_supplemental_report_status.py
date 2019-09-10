from django.db import migrations
from django.db.migrations import RunPython


def add_request_supplemental_report_status(apps, schema_editor):
    """
    Adds Requested Supplemental Report to compliance report statuses
    """
    db_alias = schema_editor.connection.alias

    compliance_report_status = apps.get_model('api', 'ComplianceReportStatus')

    compliance_report_status.objects.using(db_alias).create(
        status='Requested Supplemental Report',
        display_order=120
    )


def remove_request_supplemental_report_status(apps, schema_editor):
    """
    Removes Requested Supplemental Report from compliance report statuses
    """
    db_alias = schema_editor.connection.alias
    compliance_report_status = apps.get_model('api', 'ComplianceReportStatus')

    compliance_report_status.objects.using(db_alias).get(
        status='Requested Supplemental Report'
    ).delete()


class Migration(migrations.Migration):
    """
    Attaches the functions for the migrations
    """
    dependencies = [
        ('api', '0184_auto_20190909_2203'),
    ]

    operations = [
        RunPython(
            add_request_supplemental_report_status,
            remove_request_supplemental_report_status
        ),
    ]
