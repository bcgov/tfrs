from django.db import migrations
from django.db.migrations import RunPython


def update_partially_renewable_fuel_types(apps, schema_editor):
    """
    Marks some fuel types as partially renewable
    """
    db_alias = schema_editor.connection.alias

    approved_fuel = apps.get_model('api', 'ApprovedFuel')

    approved_fuel.objects.using(db_alias).filter(
        name__in=[
            "Biodiesel", "Ethanol", "HDRD", "Natural gas-based gasoline",
            "Renewable diesel", "Renewable gasoline"
        ]
    ).update(
        is_partially_renewable=True
    )


def remove_partially_renewable_fuel_types(apps, schema_editor):
    """
    Sets all fuel types to not be partially renewable
    """
    db_alias = schema_editor.connection.alias

    approved_fuel = apps.get_model('api', 'ApprovedFuel')

    approved_fuel.objects.using(db_alias).filter(
        name__in=[
            "Biodiesel", "Ethanol", "HDRD", "Natural gas-based gasoline",
            "Renewable diesel", "Renewable gasoline"
        ]
    ).update(
        is_partially_renewable=False
    )


class Migration(migrations.Migration):
    """
    Attaches the functions for the migrations
    """
    dependencies = [
        ('api', '0123_auto_20190424_1639'),
    ]

    operations = [
        RunPython(
            update_partially_renewable_fuel_types,
            remove_partially_renewable_fuel_types
        )
    ]
