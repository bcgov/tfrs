from django.db import migrations
from django.db.migrations import RunPython


def add_gov_analyst_view_compliance_report_permission(apps, schema_editor):
    """
    Adds the View Compliance Report to the Gov Analyst role
    """
    db_alias = schema_editor.connection.alias

    permission = apps.get_model(
        'api', 'Permission')
    role = apps.get_model('api', 'Role')
    role_permission = apps.get_model('api', 'RolePermission')

    view_permission = permission.objects.using(db_alias).get(
        code="VIEW_COMPLIANCE_REPORT"
    )

    role = role.objects.using(db_alias).get(name="GovUser")

    role_permission.objects.using(db_alias).create(
        role=role,
        permission=view_permission
    )


def remove_gov_analyst_view_compliance_report_permission(apps, schema_editor):
    """
    Removes the View Compliance Reports from the Gov Analyst role
    """
    db_alias = schema_editor.connection.alias

    role_permission = apps.get_model('api', 'RolePermission')

    role_permission.objects.using(db_alias).filter(
        permission__code="VIEW_COMPLIANCE_REPORT",
        role__name="GovUser"
    ).delete()


class Migration(migrations.Migration):
    """
    Attaches the functions for the migrations
    """
    dependencies = [
        ('api', '0181_auto_20190829_2036'),
    ]

    operations = [
        RunPython(
            add_gov_analyst_view_compliance_report_permission,
            remove_gov_analyst_view_compliance_report_permission
        )
    ]
