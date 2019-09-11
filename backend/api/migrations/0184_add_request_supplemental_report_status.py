from django.db import migrations
from django.db.migrations import RunPython


def add_request_supplemental_report_status(apps, schema_editor):
    """
    Adds Requested Supplemental to compliance report statuses
    """
    db_alias = schema_editor.connection.alias

    compliance_report_status = apps.get_model('api', 'ComplianceReportStatus')

    compliance_report_status.objects.using(db_alias).create(
        status='Requested Supplemental',
        display_order=120
    )


def remove_request_supplemental_report_status(apps, schema_editor):
    """
    Removes Requested Supplemental from compliance report statuses
    """
    db_alias = schema_editor.connection.alias
    compliance_report_status = apps.get_model('api', 'ComplianceReportStatus')

    compliance_report_status.objects.using(db_alias).get(
        status='Requested Supplemental'
    ).delete()


class Migration(migrations.Migration):
    """
    Attaches the functions for the migrations
    """
    dependencies = [
        ('api', '0183_add_gov_analyst_view_compliance_report_permission'),
    ]

    operations = [
        RunPython(
            add_request_supplemental_report_status,
            remove_request_supplemental_report_status
        ),
    ]
