from django.db import migrations
from django.db.migrations import RunPython


def add_compliance_report_view_permission(apps, schema_editor):
    """
    Adds the view compliance report permission and attaches it to
    the Compliance Manager role and the Compliance Reporting role
    """
    db_alias = schema_editor.connection.alias

    permission = apps.get_model(
        'api', 'Permission')
    role = apps.get_model('api', 'Role')
    role_permission = apps.get_model('api', 'RolePermission')

    view_permission = permission.objects.using(db_alias).create(
        code="VIEW_COMPLIANCE_REPORT",
        name="View Compliance Reports",
        description="The ability to view compliance reports."
    )

    roles = role.objects.using(db_alias).filter(name__in=[
        "ComplianceReporting", "GovComplianceManager"
    ])

    role_permissions = []

    for role in roles:
        role_permissions.append(
            role_permission(
                role=role,
                permission=view_permission
            )
        )

    role_permission.objects.using(db_alias).bulk_create(role_permissions)


def remove_compliance_report_view_permission(apps, schema_editor):
    """
    Removes the view compliance report permission and removes it
    from the roles that had it
    """
    db_alias = schema_editor.connection.alias

    permission = apps.get_model('api', 'Permission')
    role_permission = apps.get_model('api', 'RolePermission')

    view_permission = permission.objects.using(db_alias).filter(
        code="VIEW_COMPLIANCE_REPORT"
    ).first()

    if view_permission:
        role_permission.objects.filter(
            permission_id=view_permission.id
        ).delete()

    view_permission.delete()


class Migration(migrations.Migration):
    """
    Attaches the functions for the migrations
    """
    dependencies = [
        ('api', '0168_signingauthorityconfirmation_title'),
    ]

    operations = [
        RunPython(
            add_compliance_report_view_permission,
            remove_compliance_report_view_permission
        )
    ]
