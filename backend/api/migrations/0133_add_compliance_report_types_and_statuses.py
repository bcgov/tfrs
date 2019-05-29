from django.db import migrations
from django.db.migrations import RunPython


def add_compliance_report_types_and_statuses(apps, schema_editor):
    """
    Adds Basic Compliance Report Types and Statuses
    """
    db_alias = schema_editor.connection.alias

    compliance_report_type = apps.get_model('api', 'ComplianceReportType')
    compliance_report_status = apps.get_model('api', 'ComplianceReportStatus')

    compliance_report_type.objects.using(db_alias).bulk_create([
        compliance_report_type(
            the_type='Compliance Report',
            description='Annual Compliance Report',
            display_order=10
        ),
        compliance_report_type(
            the_type='Exclusion Report',
            description='Annual Exclusion Report',
            display_order=20
        )
    ])

    compliance_report_status.objects.using(db_alias).bulk_create([
        compliance_report_status(
            status='Draft',
            display_order=10,
        ),
        compliance_report_status(
            status='Submitted',
            display_order=20,
        ),
        compliance_report_status(
            status='Deleted',
            display_order=5,
        )
    ])


def remove_compliance_report_types_and_statuses(apps, schema_editor):
    """
    Removes Basic Compliance Report Types and Statuses
    """
    db_alias = schema_editor.connection.alias
    compliance_report_type = apps.get_model('api', 'ComplianceReportType')
    compliance_report_status = apps.get_model('api', 'ComplianceReportStatus')

    compliance_report_type.objects.using(db_alias).get(the_type='Compliance Report').delete()
    compliance_report_type.objects.using(db_alias).get(the_type='Exclusion Report').delete()
    compliance_report_status.objects.using(db_alias).get(status='Draft').delete()
    compliance_report_status.objects.using(db_alias).get(status='Submitted').delete()


class Migration(migrations.Migration):
    """
    Attaches the functions for the migrations
    """
    dependencies = [
        ('api', '0132_auto_20190522_1753'),
    ]

    operations = [
        RunPython(
            add_compliance_report_types_and_statuses,
            remove_compliance_report_types_and_statuses
        )
    ]
