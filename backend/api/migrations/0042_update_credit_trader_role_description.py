from django.db import migrations
from django.db.migrations import RunPython


def update_description(apps, schema_editor):
    """
    Updates the role: Credit Trader to Credit Transfers
    """
    db_alias = schema_editor.connection.alias

    role = apps.get_model('api', "Role")

    role.objects.using(db_alias).filter(
        name="FSUser"
    ).update(
        description="Credit Transfers"
    )


def revert_description(apps, schema_editor):
    """
    Reverts the role back to Credit Trader from Credit Transfers
    """
    db_alias = schema_editor.connection.alias

    role = apps.get_model('api', "Role")

    role.objects.using(db_alias).filter(
        name="FSUser"
    ).update(
        description="Credit Trader"
    )


class Migration(migrations.Migration):
    """
    Attaches the functions for the migrations
    """
    dependencies = [
        ('api', '0041_merge_20181031_2228'),
    ]

    operations = [
        RunPython(update_description, revert_description)
    ]
