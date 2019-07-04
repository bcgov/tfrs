from django.db import migrations
from django.db.migrations import RunPython


def add_permission(apps, schema_editor):
    """
    Adds EDIT_FUEL_SUPPLIER permission and adds it to the Managing Users
    role
    """
    db_alias = schema_editor.connection.alias

    permission = apps.get_model('api', "Permission")
    role = apps.get_model('api', "Role")
    role_permission = apps.get_model('api', "RolePermission")

    permission.objects.using(db_alias).create(
        code="EDIT_FUEL_SUPPLIER",
        description="Allows the user to update the address of their "
                    "organization",
        name="Edit Organization Address"
    )

    role_permission.objects.using(db_alias).create(
        role=role.objects.using(db_alias).get(name="FSAdmin"),
        permission=permission.objects.using(db_alias).get(
            code="EDIT_FUEL_SUPPLIER")
    )


def remove_permission(apps, schema_editor):
    """
    Deletes the EDIT_FUEL_SUPPLIER permission.
    Removes the permission from the Managing Users role first
    """
    db_alias = schema_editor.connection.alias

    permission = apps.get_model('api', "Permission")
    role_permission = apps.get_model('api', "RolePermission")

    role_permission.objects.using(db_alias).filter(
        permission__code="EDIT_FUEL_SUPPLIER",
        role__name="FSAdmin").delete()

    permission.objects.using(db_alias).filter(
        code="EDIT_FUEL_SUPPLIER"
    ).delete()


class Migration(migrations.Migration):
    """
    Attaches the functions for the migrations
    """
    dependencies = [
        ('api', '0151_rename_table_sequences'),
    ]

    operations = [
        RunPython(add_permission, remove_permission)
    ]
