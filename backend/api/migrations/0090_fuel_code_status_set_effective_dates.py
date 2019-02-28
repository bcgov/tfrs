from django.db import migrations
from django.db.migrations import RunPython


def update_fuel_code_status_effective_dates(apps, schema_editor):
    """
    Adds the effective dates for fuel code status 
    """
    db_alias = schema_editor.connection.alias

    fuel_code_status = apps.get_model('api', 'FuelCodeStatus')

    fuel_code_status.objects.using(db_alias).update(
        effective_date="2017-01-01"
    )


def remove_fuel_code_status_effective_dates(apps, schema_editor):
    """
    Removes the effective dates from fuel code status
    """
    db_alias = schema_editor.connection.alias

    fuel_code_status = apps.get_model('api', 'FuelCodeStatus')

    fuel_code_status.objects.using(db_alias).update(
        effective_date=None
    )


class Migration(migrations.Migration):
    """
    Attaches the functions for the migrations
    """
    dependencies = [
        ('api', '0089_auto_20190228_2106'),
    ]

    operations = [
        RunPython(
            update_fuel_code_status_effective_dates,
            remove_fuel_code_status_effective_dates
        )
    ]
