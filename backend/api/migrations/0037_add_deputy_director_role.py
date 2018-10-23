from django.db import migrations
from django.db.migrations import RunPython


def add_role(apps, schema_editor):
    """
    Adds the Deputy Director role and assigns permissions to it
    """
    db_alias = schema_editor.connection.alias

    permission = apps.get_model("api", "Permission")
    role = apps.get_model("api", "Role")
    role_permission = apps.get_model("api", "RolePermission")

    gov_deputy_director_role = role.objects.using(db_alias).create(
        name="GovDeputyDirector",
        description="Government Deputy Director",
        is_government_role=True,
        display_order="8"
    )

    gov_director_permissions = permission.objects.using(db_alias).filter(
        role_permissions__role__name="GovDirector"
    ).distinct()

    gov_deputy_director_permissions = []

    for permission in gov_director_permissions:
        gov_deputy_director_permissions.append(
            role_permission(
                role=gov_deputy_director_role,
                permission=permission
            )
        )

    role_permission.objects.using(db_alias).bulk_create(
        gov_deputy_director_permissions
    )


def delete_role(apps, schema_editor):
    """
    Delete the Deputy Director role and remove the permissions assigned to it
    """
    db_alias = schema_editor.connection.alias

    role = apps.get_model("api", "Role")
    role_permission = apps.get_model("api", "RolePermission")

    role_permission.objects.using(db_alias).filter(
        role__name="GovDeputyDirector"
    ).delete()

    role.objects.using(db_alias).filter(
        name="GovDeputyDirector"
    ).delete()


class Migration(migrations.Migration):
    """
    Attaches the functions for the migrations
    """
    dependencies = [
        ('api', '0036_update_credit_statuses'),
    ]

    operations = [
        RunPython(add_role, delete_role)
    ]
