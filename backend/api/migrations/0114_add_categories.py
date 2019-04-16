from django.db import migrations
from django.db.migrations import RunPython


def add_categories(apps, schema_editor):
    """
    Adds additional fuel types for credit calculation
    """
    db_alias = schema_editor.connection.alias

    category = apps.get_model('api', 'DefaultCarbonIntensityCategory')

    category.objects.using(db_alias).bulk_create([
        category(
            name="CNG",
            display_order=1
        ),
        category(
            name="Electricity",
            display_order=2
        ),
        category(
            name="Hydrogen",
            display_order=3
        ),
        category(
            name="LNG",
            display_order=4
        ),
        category(
            name="Natural gas-based gasoline",
            display_order=5
        ),
        category(
            name="Petroleum-based diesel",
            display_order=6
        ),
        category(
            name="Petroleum-based gasoline",
            display_order=7
        ),
        category(
            name="Propane",
            display_order=8
        ),
        category(
            name="Renewable Fuel in relation to diesel class fuel",
            display_order=9
        ),
        category(
            name="Renewable Fuel in relation to gasoline class fuel",
            display_order=10
        )
    ])

    category = apps.get_model('api', 'EnergyDensityCategory')

    category.objects.using(db_alias).bulk_create([
        category(
            name="Biodiesel",
            display_order=1
        ),
        category(
            name="CNG",
            display_order=2
        ),
        category(
            name="Electricity",
            display_order=3
        ),
        category(
            name="Ethanol",
            display_order=4
        ),
        category(
            name="Hydrogenation-derived renewable diesel fuel",
            display_order=5
        ),
        category(
            name="Hydrogen",
            display_order=6
        ),
        category(
            name="LNG",
            display_order=7
        ),
        category(
            name="Petroleum-based gasoline, natural gas-based gasoline or "
                 "gasoline produced from biomass",
            display_order=8
        ),
        category(
            name="Petroleum-based diesel fuel or diesel fuel produced from "
                 "biomass",
            display_order=9
        ),
        category(
            name="Propane",
            display_order=10
        )
    ])

    category = apps.get_model('api', 'EnergyEffectivenessRatioCategory')

    category.objects.using(db_alias).bulk_create([
        category(
            name="CNG",
            display_order=1
        ),
        category(
            name="Electricity",
            display_order=2
        ),
        category(
            name="Hydrogen",
            display_order=3
        ),
        category(
            name="LNG",
            display_order=4
        ),
        category(
            name="Petroleum-based diesel fuel or renewable fuel in relation "
                 "to diesel class fuel",
            display_order=5
        ),
        category(
            name="Petroleum-based gasoline, natural gas-based gasoline or "
                 "renewable fuel in relation to gasoline class fuel",
            display_order=6
        ),
        category(
            name="Propane",
            display_order=7
        )
    ])


def remove_categories(apps, schema_editor):
    """
    Removes the credit calculation fuel types
    """
    db_alias = schema_editor.connection.alias

    category = apps.get_model('api', 'DefaultCarbonIntensityCategory')
    category.objects.using(db_alias).delete()

    category = apps.get_model('api', 'EnergyDensityCategory')
    category.objects.using(db_alias).delete()

    category = apps.get_model('api', 'EnergyEffectivenessRatioCategory')
    category.objects.using(db_alias).delete()


class Migration(migrations.Migration):
    """
    Attaches the functions for the migrations
    """
    dependencies = [
        ('api', '0113_auto_20190411_1551'),
    ]

    operations = [
        RunPython(
            add_categories,
            remove_categories
        )
    ]
