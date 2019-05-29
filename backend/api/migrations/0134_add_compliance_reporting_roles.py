from django.db import migrations
from django.db.migrations import RunPython


def add_compliance_reporting_roles(apps, schema_editor):
    """
    Creates the basic permissions for the roles to manage and view
    credit calculation related tables
    """
    db_alias = schema_editor.connection.alias

    permission = apps.get_model(
        'api', 'Permission')
    role_model = apps.get_model('api', 'Role')
    role_permission = apps.get_model('api', 'RolePermission')

    manage_permission = permission.objects.using(db_alias).create(
        code="COMPLIANCE_REPORT_MANAGE",
        name="Manage Compliance Reports",
        description="The ability to create, update, and delete compliance reports"
    )

    manage_role = role_model.objects.using(db_alias).create(
        name="ComplianceReporting",
        description="Compliance Report Manager",
        display_order=1
    )

    role_permissions = []

    role_permissions.append(
        role_permission(
            role=manage_role,
            permission=manage_permission
        )
    )

    role_permission.objects.using(db_alias).bulk_create(role_permissions)


def remove_compliance_reporting_roles(apps, schema_editor):
    """
    Removes the credit calculation permissions from roles
    """
    db_alias = schema_editor.connection.alias

    permission = apps.get_model('api', 'Permission')
    role_permission = apps.get_model('api', 'RolePermission')
    role_model = apps.get_model('api', 'Role')

    manage_permission = permission.objects.using(db_alias).filter(
        code="COMPLIANCE_REPORT_MANAGE"
    ).first()

    if manage_permission:
        role_permission.objects.filter(
            permission_id=manage_permission.id
        ).delete()

    manage_permission.delete()

    manage_role = role_model.objects.using(db_alias).filter(
        name="ComplianceReporting"
    ).first()

    manage_role.delete()


class Migration(migrations.Migration):
    """
    Attaches the functions for the migrations
    """
    dependencies = [
        ('api', '0133_add_compliance_report_types_and_statuses'),
    ]

    operations = [
        RunPython(
            add_compliance_reporting_roles,
            remove_compliance_reporting_roles
        )
    ]
