from django.db import migrations
from django.db.migrations import RunPython


def add_fuel_class_relationships(apps, schema_editor):
    """
    Adds Fuel Descriptions
    """
    db_alias = schema_editor.connection.alias

    approved_fuel = apps.get_model('api', 'ApprovedFuel')
    approved_fuel_class = apps.get_model('api', 'ApprovedFuelClass')
    fuel_class = apps.get_model('api', 'FuelClass')

    diesel_fuels = approved_fuel.objects.using(db_alias).filter(
        name__in=[
            "Biodiesel", "CNG", "Electricity", "HDRD", "Hydrogen", "LNG",
            "Petroleum-based diesel", "Propane", "Renewable diesel"
        ]
    )

    diesel_fuel_classes = []

    for fuel in diesel_fuels:
        diesel_fuel_classes.append(
            approved_fuel_class(
                fuel=approved_fuel.objects.using(db_alias).get(
                    name=fuel.name
                ),
                fuel_class=fuel_class.objects.using(db_alias).get(
                    fuel_class="Diesel"
                )
            )
        )

    approved_fuel_class.objects.using(db_alias).bulk_create(
        diesel_fuel_classes)

    gasoline_fuels = approved_fuel.objects.using(db_alias).filter(
        name__in=[
            "CNG", "Electricity", "Ethanol", "Hydrogen",
            "Natural gas-based gasoline", "Petroleum-based gasoline",
            "Propane", "Renewable gasoline"
        ]
    )

    gasoline_fuel_classes = []

    for fuel in gasoline_fuels:
        gasoline_fuel_classes.append(
            approved_fuel_class(
                fuel=approved_fuel.objects.using(db_alias).get(
                    name=fuel.name
                ),
                fuel_class=fuel_class.objects.using(db_alias).get(
                    fuel_class="Gasoline"
                )
            )
        )

    approved_fuel_class.objects.using(db_alias).bulk_create(
        gasoline_fuel_classes)


def remove_fuel_class_relationships(apps, schema_editor):
    """
    Removes the descriptions from fuels
    """
    db_alias = schema_editor.connection.alias

    approved_fuel_class = apps.get_model('api', 'ApprovedFuelClass')

    approved_fuel_class.objects.using(db_alias).delete()


class Migration(migrations.Migration):
    """
    Attaches the functions for the migrations
    """
    dependencies = [
        ('api', '0120_approvedfuelclass'),
    ]

    operations = [
        RunPython(
            add_fuel_class_relationships,
            remove_fuel_class_relationships
        )
    ]
