from django.db import migrations
from django.db.migrations import RunPython


def update_permissions(apps, schema_editor):
    """
    Updates the permissions and removes the create/edit fuel suppliers
    from Government Analyst and Director roles
    """
    db_alias = schema_editor.connection.alias

    permission = apps.get_model("api", "Permission")
    role = apps.get_model("api", "Role")
    role_permission = apps.get_model("api", "RolePermission")

    role_permission.objects.using(db_alias).bulk_create([
        role_permission(
            role=role.objects.using(db_alias).get(name='FSNoAccess'),
            permission=permission.objects.using(db_alias).get(
                code='VIEW_CREDIT_TRANSFERS')
        )
    ])


def revert_permissions(apps, schema_editor):
    """
    Reverts the permission back to its previous state by assigning
    back the permission back to Government Analyst and Director
    """
    db_alias = schema_editor.connection.alias

    role_permission = apps.get_model("api", "RolePermission")

    role_permission.objects.using(db_alias).filter(
        permission__code__in=[
            "VIEW_CREDIT_TRANSFERS"
        ],
        role__name="FSNoAccess").delete()


class Migration(migrations.Migration):
    """
    Attaches the functions for the migrations
    """
    dependencies = [
        ('api', '0033_update_admin_permissions'),
    ]

    operations = [
        RunPython(update_permissions, revert_permissions)
    ]
