from django.db import migrations
from django.db.migrations import RunPython


def create_permissions(apps, schema_editor):
    """
    Adds the historical data entry permission and attach it to the
    Government User and Government Director roles
    """
    db_alias = schema_editor.connection.alias

    permission = apps.get_model("api", "Permission")
    role = apps.get_model("api", "Role")
    role_permission = apps.get_model("api", "RolePermission")

    permission.objects.using(db_alias).create(
        code="USE_HISTORICAL_DATA_ENTRY",
        name="Use Historical Data Entry",
        description="Allows the user to use the functions of "
                    "Historical Data Entry"
    )

    role_permission.objects.using(db_alias).bulk_create([
        role_permission(
            role=role.objects.using(db_alias).get(name='GovDirector'),
            permission=permission.objects.using(db_alias).get(
                code='USE_HISTORICAL_DATA_ENTRY')
        ),
        role_permission(
            role=role.objects.using(db_alias).get(name='GovUser'),
            permission=permission.objects.using(db_alias).get(
                code='USE_HISTORICAL_DATA_ENTRY')
        )
    ])


def delete_permissions(apps, schema_editor):
    """
    Removes the historical data entry permission from the Government roles
    and deletes the actual permission.

    This is for reversing the migration.
    """
    db_alias = schema_editor.connection.alias

    permission = apps.get_model("api", "Permission")
    role_permission = apps.get_model("api", "RolePermission")

    role_permission.objects.using(db_alias).filter(
        permission__code="USE_HISTORICAL_DATA_ENTRY",
        role__name__in=["GovDirector", "GovUser"]).delete()

    permission.objects.using(db_alias).filter(
        code="USE_HISTORICAL_DATA_ENTRY"
    ).delete()


class Migration(migrations.Migration):
    """
    Attaches the functions for the migrations
    """

    dependencies = [
        ('api', '0024_ops_data_tables'),
    ]

    operations = [
        RunPython(create_permissions, delete_permissions)
    ]
