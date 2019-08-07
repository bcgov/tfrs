from django.db import migrations
from django.db.migrations import RunPython


def add_compliance_manager(apps, schema_editor):
    """
    Renames the existing Compliance Report Manager to Compliance Reporting
    Adds the Compliance Manager role for government
    """
    db_alias = schema_editor.connection.alias

    role = apps.get_model('api', 'Role')

    role.objects.using(db_alias).filter(
        name="ComplianceReporting"
    ).update(
        description="Compliance Reporting"
    )

    role.objects.using(db_alias).create(
        name="GovComplianceManager",
        description="Compliance Manager",
        display_order=12,
        is_government_role=True
    )


def remove_compliance_manager(apps, schema_editor):
    """
    Removes the credit calculation permissions from roles
    """
    db_alias = schema_editor.connection.alias

    role = apps.get_model('api', 'Role')

    role.objects.using(db_alias).filter(
        name="GovComplianceManager"
    ).delete()

    role.objects.using(db_alias).filter(
        name="ComplianceReporting"
    ).update(
        description="Compliance Report Manager"
    )


class Migration(migrations.Migration):
    """
    Attaches the functions for the migrations
    """
    dependencies = [
        ('api', '0164_auto_20190729_1810'),
    ]

    operations = [
        RunPython(
            add_compliance_manager,
            remove_compliance_manager
        )
    ]
