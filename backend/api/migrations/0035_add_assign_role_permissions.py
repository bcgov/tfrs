from django.db import migrations
from django.db.migrations import RunPython


def update_permissions(apps, schema_editor):
    """
    Updates the Admin permissions so it can assign roles
    """
    db_alias = schema_editor.connection.alias

    permission = apps.get_model("api", "Permission")
    role = apps.get_model("api", "Role")
    role_permission = apps.get_model("api", "RolePermission")

    permission.objects.using(db_alias).create(
        code="ASSIGN_GOVERNMENT_ROLES",
        name="Assign Government Roles",
        description="Allows the user to assign government roles to users"
    )

    permission.objects.using(db_alias).create(
        code="ASSIGN_FS_ROLES",
        name="Assign Fuel Supplier Roles",
        description="Allows the user to assign fuel supplier roles to users"
    )

    role_permission.objects.using(db_alias).bulk_create([
        role_permission(
            role=role.objects.using(db_alias).get(name='Admin'),
            permission=permission.objects.using(db_alias).get(
                code='ASSIGN_GOVERNMENT_ROLES')
        ),
        role_permission(
            role=role.objects.using(db_alias).get(name='Admin'),
            permission=permission.objects.using(db_alias).get(
                code='ASSIGN_FS_ROLES')
        ),
        role_permission(
            role=role.objects.using(db_alias).get(name='FSAdmin'),
            permission=permission.objects.using(db_alias).get(
                code='ASSIGN_FS_ROLES')
        )
    ])


def revert_permissions(apps, schema_editor):
    """
    Removes the permissions for assigning roles
    """
    db_alias = schema_editor.connection.alias

    permission = apps.get_model("api", "Permission")
    role_permission = apps.get_model("api", "RolePermission")

    role_permission.objects.using(db_alias).filter(
        permission__code__in=["ASSIGN_FS_ROLES", "ASSIGN_GOVERNMENT_ROLES"]
    ).delete()

    permission.objects.using(db_alias).filter(
        code__in=["ASSIGN_FS_ROLES", "ASSIGN_GOVERNMENT_ROLES"]
    ).delete()


class Migration(migrations.Migration):
    """
    Attaches the functions for the migrations
    """
    dependencies = [
        ('api', '0034_update_guest_permissions'),
    ]

    operations = [
        RunPython(update_permissions, revert_permissions)
    ]
