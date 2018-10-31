from django.db import migrations
from django.db.migrations import RunPython


def update_permissions(apps, schema_editor):
    """
    Updates the permissions for FS Admin User
    Also add an s to User
    """
    db_alias = schema_editor.connection.alias

    permission = apps.get_model('api', "Permission")
    role = apps.get_model('api', "Role")
    role_permission = apps.get_model('api', "RolePermission")

    role.objects.using(db_alias).filter(
        name="FSAdmin"
    ).update(
        description="Managing Users"
    )

    role_permission.objects.using(db_alias).bulk_create([
        role_permission(
            role=role.objects.using(db_alias).get(name="FSAdmin"),
            permission=permission.objects.using(db_alias).get(
                code="LOGIN")
        ),
        role_permission(
            role=role.objects.using(db_alias).get(name="FSAdmin"),
            permission=permission.objects.using(db_alias).get(
                code="ADD_FS_USER")
        ),
        role_permission(
            role=role.objects.using(db_alias).get(name="FSAdmin"),
            permission=permission.objects.using(db_alias).get(
                code="EDIT_FUEL_SUPPLIER_USERS")
        ),
        role_permission(
            role=role.objects.using(db_alias).get(name="FSAdmin"),
            permission=permission.objects.using(db_alias).get(
                code="VIEW_CREDIT_TRANSFERS")
        )
    ])


def revert_permissions(apps, schema_editor):
    """
    Reverts the permission back to its previous state for
    FS Admin User
    """
    db_alias = schema_editor.connection.alias

    role = apps.get_model('api', "Role")
    role_permission = apps.get_model('api', "RolePermission")

    role_permission.objects.using(db_alias).filter(
        permission__code__in=[
            "LOGIN",
            "ADD_FS_USER",
            "EDIT_FUEL_SUPPLIER_USERS"
            "VIEW_CREDIT_TRANSFERS"
        ],
        role__name="FSAdmin").delete()

    role.objects.using(db_alias).filter(
        name="FSAdmin"
    ).update(
        description="Managing User"
    )


class Migration(migrations.Migration):
    """
    Attaches the functions for the migrations
    """
    dependencies = [
        ('api', '0038_credittradehistory_user_role'),
    ]

    operations = [
        RunPython(update_permissions, revert_permissions)
    ]
