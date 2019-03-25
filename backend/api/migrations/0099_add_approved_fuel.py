from django.db import migrations
from django.db.migrations import RunPython


def add_natural_gas_based_gasoline(apps, schema_editor):
    """
    Add natural gas based gasoline into Approved Fuel
    """
    db_alias = schema_editor.connection.alias

    # By retrieving the models via apps.get_model, we get one appropriately
    # versioned for this migration (so this shouldn't ever need to be
    # maintained if fields change)
    approved_fuel = apps.get_model('api', 'ApprovedFuel')
    approved_fuel.objects.using(db_alias).create(
        name="Natural gas-based gasoline",
        effective_date="2017-01-01"
    )


def remove_natural_gas_based_gasoline(apps, schema_editor):
    """
    Removes natural gas based gasoline from Approved Fuel
    """
    db_alias = schema_editor.connection.alias

    # By retrieving the models via apps.get_model, we get one appropriately
    # versioned for this migration (so this shouldn't ever need to be
    # maintained if fields change)
    approved_fuel = apps.get_model('api', 'ApprovedFuel')
    approved_fuel.objects.using(db_alias).filter(
        name="Natural gas-based gasoline"
    ).delete()


class Migration(migrations.Migration):
    dependencies = [
        ('api', '0098_rename_fuel_status_submitted'),
    ]

    operations = [
        RunPython(
            add_natural_gas_based_gasoline,
            remove_natural_gas_based_gasoline
        )
    ]
