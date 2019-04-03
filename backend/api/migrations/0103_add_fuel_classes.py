from django.db import migrations
from django.db.migrations import RunPython


def add_fuel_classes(apps, schema_editor):
    """
    Creates the fuel classes: Gasoline and Diesel
    """
    db_alias = schema_editor.connection.alias

    fuel_class = apps.get_model('api', 'FuelClass')

    fuel_class.objects.using(db_alias).bulk_create([
        fuel_class(
            fuel_class="Diesel",
            display_order=1,
            effective_date='2017-01-01'
        ),
        fuel_class(
            fuel_class="Gasoline",
            display_order=2,
            effective_date='2017-01-01'
        )
    ])


def remove_fuel_classes(apps, schema_editor):
    """
    Removes the credit calculation permissions from roles
    """
    db_alias = schema_editor.connection.alias

    fuel_class = apps.get_model('api', 'FuelClass')

    fuel_class.objects.using(db_alias).all().delete()


class Migration(migrations.Migration):
    """
    Attaches the functions for the migrations
    """
    dependencies = [
        ('api', '0102_add_credit_calculation_permissions'),
    ]

    operations = [
        RunPython(
            add_fuel_classes,
            remove_fuel_classes
        )
    ]
