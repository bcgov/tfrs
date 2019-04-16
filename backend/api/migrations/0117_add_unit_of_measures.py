from django.db import migrations
from django.db.migrations import RunPython


def add_unit_of_measures(apps, schema_editor):
    """
    Adds additional fuel types for credit calculation
    """
    db_alias = schema_editor.connection.alias

    approved_fuel = apps.get_model('api', 'ApprovedFuel')
    unit_of_measure = apps.get_model('api', 'UnitOfMeasure')

    uom_l = unit_of_measure.objects.using(db_alias).create(
        name="L",
        effective_date="2017-01-01"
    )
    uom_kg = unit_of_measure.objects.using(db_alias).create(
        name="kg",
        effective_date="2017-01-01"
    )
    uom_kwh = unit_of_measure.objects.using(db_alias).create(
        name="kWh",
        effective_date="2017-01-01"
    )
    uom_m3 = unit_of_measure.objects.using(db_alias).create(
        name="m³",
        effective_date="2017-01-01"
    )

    approved_fuel.objects.using(db_alias).filter(
        name__in=[
            "Biodiesel", "Ethanol", "HDRD", "Natural gas-based gasoline",
            "Petroleum-based diesel", "Petroleum-based gasoline",
            "Propane", "Renewable diesel", "Renewable gasoline"
        ]
    ).update(
        unit_of_measure=uom_l
    )
    approved_fuel.objects.using(db_alias).filter(
        name__in=[
            "Hydrogen", "LNG"
        ]
    ).update(
        unit_of_measure=uom_kg
    )
    approved_fuel.objects.using(db_alias).filter(
        name="Electricity"
    ).update(
        unit_of_measure=uom_kwh
    )
    approved_fuel.objects.using(db_alias).filter(
        name="CNG"
    ).update(
        unit_of_measure=uom_m3
    )


def remove_unit_of_measures(apps, schema_editor):
    """
    Removes the credit calculation fuel types
    """
    db_alias = schema_editor.connection.alias

    approved_fuel = apps.get_model('api', 'ApprovedFuel')
    unit_of_measure = apps.get_model('api', 'UnitOfMeasure')

    approved_fuel.objects.using(db_alias).update(
        unit_of_measure=None
    )

    unit_of_measure.objects.using(db_alias).delete()


class Migration(migrations.Migration):
    """
    Attaches the functions for the migrations
    """
    dependencies = [
        ('api', '0116_add_categories_to_approved_fuel'),
    ]

    operations = [
        RunPython(
            add_unit_of_measures,
            remove_unit_of_measures
        )
    ]
