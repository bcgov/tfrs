from __future__ import unicode_literals

from django.db.migrations import RunPython

import db_comments.model_mixins
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion

approved_fuel_names = [
    'Biodiesel',
    'CNG',
    'Electricity',
    'Ethanol',
    'HDRD',
    'Hydrogen',
    'LNG',
    'Propane',
    'Renewable diesel',
    'Renewable gasoline'
]


def add_transport_modes_and_approved_fuels(apps, schema_editor):
    """Add initial transport modes and approved fuels"""

    db_alias = schema_editor.connection.alias

    # By retrieving the models via apps.get_model, we get one appropriately
    # versioned for this migration (so this shouldn't ever need to be
    # maintained if fields change)
    transport_mode = apps.get_model('api', 'TransportMode')
    transport_mode.objects.using(db_alias).bulk_create([
        transport_mode(
            name='Truck',
            effective_date='2017-01-01'
        ),
        transport_mode(
            name='Rail',
            effective_date='2017-01-01'
        ),
        transport_mode(
            name='Marine',
            effective_date='2017-01-01'
        ),
        transport_mode(
            name='Adjacent',
            effective_date='2017-01-01'
        ),
        transport_mode(
            name='Pipeline',
            effective_date='2017-01-01'
        )
    ])

    approved_fuel = apps.get_model('api', 'ApprovedFuel')
    approved_fuel.objects.using(db_alias).bulk_create(
        map(lambda af: approved_fuel(
            name=af,
            effective_date='2017-01-01'
        ), approved_fuel_names)
    )


def remove_transport_modes_and_approved_fuels(apps, schema_editor):
    """
    Remove initial transport modes and approved fuels
    """
    db_alias = schema_editor.connection.alias

    # By retrieving the models via apps.get_model, we get one appropriately
    # versioned for this migration (so this shouldn't ever need to be
    # maintained if fields change)
    transport_mode = apps.get_model('api', 'TransportMode')
    transport_mode.objects.using(db_alias).filter(
        name__in=["Truck", "Rail", "Marine", "Adjacent", "Pipeline"]).delete()

    approved_fuel = apps.get_model('api', 'ApprovedFuel')
    approved_fuel.objects.using(db_alias).filter(
        name__in=approved_fuel_names).delete()


class Migration(migrations.Migration):
    dependencies = [
        ('api', '0091_auto_20190305_0417'),
    ]

    operations = [
        RunPython(add_transport_modes_and_approved_fuels,
                  remove_transport_modes_and_approved_fuels)
    ]
