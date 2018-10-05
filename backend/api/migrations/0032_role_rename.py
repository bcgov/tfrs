from django.db import migrations
from django.db.migrations import RunPython


def update_roles_descriptions(apps, schema_editor):
    """
    Renames the descriptions of the roles to something
    more useful
    """
    db_alias = schema_editor.connection.alias

    role = apps.get_model("api", "Role")

    role.objects.using(db_alias).filter(
        name="Admin"
    ).update(
        description="Administrator",
        display_order=3
    )

    role.objects.using(db_alias).filter(
        name="GovUser"
    ).update(
        description="Government Analyst",
        display_order=1
    )

    role.objects.using(db_alias).filter(
        name="GovDirector"
    ).update(
        description="Government Director",
        display_order=2
    )

    role.objects.using(db_alias).filter(
        name="FSUser"
    ).update(
        description="Credit Trader",
        display_order=4
    )

    role.objects.using(db_alias).filter(
        name="FSManager"
    ).update(
        description="Signing Authority",
        display_order=5
    )

    fs_admin = role.objects.using(db_alias).filter(
        name="FSAdmin"
    )

    if fs_admin:
        fs_admin.update(
            description="Managing User",
            display_order=6
        )
    else:
        role.objects.using(db_alias).create(
            name="FSAdmin",
            description="Managing User",
            is_government_role=False,
            display_order=6
        )

    guest = role.objects.using(db_alias).filter(
        name="FSNoAccess"
    )

    if guest:
        guest.update(
            description="Guest",
            display_order=7
        )
    else:
        role.objects.using(db_alias).create(
            name="FSNoAccess",
            description="Guest",
            is_government_role=False,
            display_order=7
        )


def revert_roles_descriptions(apps, schema_editor):
    """
    Renames the descriptions back to their previous states
    """
    db_alias = schema_editor.connection.alias

    role = apps.get_model("api", "Role")

    role.objects.using(db_alias).filter(
        name="Admin"
    ).update(
        description="A System Administrator in the application with User "
                    "Management and Roles and Permissions access."
    )

    role.objects.using(db_alias).filter(
        name="GovUser"
    ).update(
        description="A regular government user in the system."
    )

    role.objects.using(db_alias).filter(
        name="GovDirector"
    ).update(
        description="A government user with authorization to Approve Credit "
                    "Transfers."
    )

    role.objects.using(db_alias).filter(
        name="FSUser"
    ).update(
        description="A Fuel Supplier user with limited abilities to take "
                    "actions."
    )

    role.objects.using(db_alias).filter(
        name="FSManager"
    ).update(
        description="A Fuel Supplier user with authority to act on behalf of "
                    "the Fuel Supplier on Credit Transfers."
    )

    role.objects.using(db_alias).filter(
        name="FSAdmin"
    ).update(
        description="A Fuel Supplier adminuser with authority to add and "
                    "remove organizational users."
    )

    role.objects.using(db_alias).filter(
        name="FSNoAccess"
    ).update(
        description="A Fuel Supplier user defined in the system, but with no "
                    "access to system functionality."
    )


class Migration(migrations.Migration):
    """
    Attaches the functions for the migrations
    """
    dependencies = [
        ('api', '0031_role_display_order'),
    ]

    operations = [
        RunPython(update_roles_descriptions, revert_roles_descriptions)
    ]
