from django.db import migrations
from django.db.migrations import RunPython


def remove_view_compliance_permission(apps, schema_editor):
    """
    Removes the View Compliance Permission and the relationship
    to the roles that uses it.
    """
    db_alias = schema_editor.connection.alias

    # By retrieving the models via apps.get_model, we get one appropriately
    # versioned for this migration (so this shouldn't ever need to be
    # maintained if fields change)
    permission = apps.get_model('api', 'Permission')
    role_permission = apps.get_model('api', 'RolePermission')

    view_compliance_permission = permission.objects.using(db_alias).filter(
        code="VIEW_COMPLIANCE_PERIODS"
    ).first()

    if view_compliance_permission:
        role_permission.objects.filter(
            permission_id=view_compliance_permission.id
        ).delete()

    view_compliance_permission.delete()


def add_view_compliance_permission(apps, schema_editor):
    """
    Re-adds the View Compliance Period and the relationship to the roles
    that previously had it.
    """
    db_alias = schema_editor.connection.alias

    # By retrieving the models via apps.get_model, we get one appropriately
    # versioned for this migration (so this shouldn't ever need to be
    # maintained if fields change)
    permission = apps.get_model(
        'api', 'Permission')
    role = apps.get_model('api', 'Role')
    role_permission = apps.get_model('api', 'RolePermission')

    view_compliance_permission = permission.objects.using(db_alias).create(
        code="VIEW_COMPLIANCE_PERIODS",
        name="View Compliance Periods",
        description="Gives the user access to view compliance periods."
    )

    role_permissions = []

    roles = role.objects.using(db_alias).filter(name__in=[
        "Admin", "FSAdmin", "FSDoc", "FSDocSubmit", "FSManager", "FSUser",
        "GovDeputyDirector", "GovDirector", "GovUser"
    ])

    for role in roles:
        role_permissions.append(
            role_permission(
                role=role,
                permission=view_compliance_permission
            )
        )

    role_permission.objects.using(db_alias).bulk_create(role_permissions)


class Migration(migrations.Migration):
    """
    Attaches the functions for the migrations
    """
    dependencies = [
        ('api', '0066_documentfileattachment_is_removed'),
    ]

    operations = [
        RunPython(remove_view_compliance_permission,
                  add_view_compliance_permission)
    ]
