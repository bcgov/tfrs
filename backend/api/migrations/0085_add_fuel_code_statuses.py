from datetime import datetime

from django.db import migrations
from django.db.migrations import RunPython


def add_fuel_code_statuses(apps, schema_editor):
    """Add basic fuel code statuses"""

    db_alias = schema_editor.connection.alias

    # By retrieving the models via apps.get_model, we get one appropriately
    # versioned for this migration (so this shouldn't ever need to be
    # maintained if fields change)
    fuel_code_status = apps.get_model('api', 'FuelCodeStatus')
    fuel_code_status.objects.using(db_alias).bulk_create([
        fuel_code_status(
            status='Draft',
            display_order=1
        ),
        fuel_code_status(
            status='Submitted',
            display_order=2
        ),
        fuel_code_status(
            status='Cancelled',
            display_order=3
        )
    ])


def remove_fuel_code_statuses(apps, schema_editor):
    """
    Re-adds the View Compliance Period and the relationship to the roles
    that previously had it.
    """
    db_alias = schema_editor.connection.alias

    # By retrieving the models via apps.get_model, we get one appropriately
    # versioned for this migration (so this shouldn't ever need to be
    # maintained if fields change)
    fuel_code_status = apps.get_model('api', 'FuelCodeStatus')
    fuel_code_status.objects.using(db_alias).filter(
        status__in=["Draft", "Submitted", "Cancelled"]).delete()


class Migration(migrations.Migration):
    dependencies = [
        ('api', '0084_fuelcodestatus'),
    ]

    operations = [
        RunPython(add_fuel_code_statuses, remove_fuel_code_statuses)
    ]
