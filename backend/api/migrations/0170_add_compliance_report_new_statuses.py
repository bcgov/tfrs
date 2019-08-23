from django.db import migrations
from django.db.migrations import RunPython


def add_compliance_report_new_statuses(apps, schema_editor):
    """
    Adds Basic Compliance Report Types and Statuses
    """
    db_alias = schema_editor.connection.alias

    compliance_report_status = apps.get_model('api', 'ComplianceReportStatus')


    compliance_report_status.objects.using(db_alias).bulk_create([
        compliance_report_status(
            status='Unreviewed',
            display_order=100,
        ),
        compliance_report_status(
            status='Returned',
            display_order=110,
        ),
        compliance_report_status(
            status='Accepted',
            display_order=1,
        ),
        compliance_report_status(
            status='Rejected',
            display_order=2,
        ),
        compliance_report_status(
            status='Recommended',
            display_order=3,
        ),
        compliance_report_status(
            status='Not Recommended',
            display_order=4,
        ),
    ])


def remove_compliance_report_new_statuses(apps, schema_editor):
    """
    Removes Basic Compliance Report Types and Statuses
    """
    db_alias = schema_editor.connection.alias
    compliance_report_status = apps.get_model('api', 'ComplianceReportStatus')

    compliance_report_status.objects.using(db_alias).get(status='Unreviewed').delete()
    compliance_report_status.objects.using(db_alias).get(status='Accepted').delete()
    compliance_report_status.objects.using(db_alias).get(status='Rejected').delete()
    compliance_report_status.objects.using(db_alias).get(status='Returned').delete()
    compliance_report_status.objects.using(db_alias).get(status='Recommended').delete()
    compliance_report_status.objects.using(db_alias).get(status='Not Recommended').delete()

class Migration(migrations.Migration):
    """
    Attaches the functions for the migrations
    """
    dependencies = [
        ('api', '0171_add_idir_compliance_report_permissions'),
    ]

    operations = [
        RunPython(
            add_compliance_report_new_statuses,
            remove_compliance_report_new_statuses
        ),
    ]
