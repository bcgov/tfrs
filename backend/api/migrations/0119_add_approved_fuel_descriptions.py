from django.db import migrations
from django.db.migrations import RunPython


def add_descriptions(apps, schema_editor):
    """
    Adds Fuel Descriptions
    """
    db_alias = schema_editor.connection.alias

    approved_fuel = apps.get_model('api', 'ApprovedFuel')

    approved_fuel.objects.using(db_alias).filter(
        name="Biodiesel"
    ).update(
        description="Biodiesel fuel"
    )
    approved_fuel.objects.using(db_alias).filter(
        name="CNG"
    ).update(
        description="Compressed natural gas"
    )
    approved_fuel.objects.using(db_alias).filter(
        name="Ethanol"
    ).update(
        description="Ethanol produced from biomass"
    )
    approved_fuel.objects.using(db_alias).filter(
        name="HDRD"
    ).update(
        description="Hydrogenation-derived renewable diesel fuel"
    )
    approved_fuel.objects.using(db_alias).filter(
        name="LNG"
    ).update(
        description="Liquefied natural gas"
    )
    approved_fuel.objects.using(db_alias).filter(
        name="Petroleum-based diesel"
    ).update(
        description="Diesel fuel, diesel, petroleum-based diesel"
    )
    approved_fuel.objects.using(db_alias).filter(
        name="Petroleum-based gasoline"
    ).update(
        description="Gasoline"
    )
    approved_fuel.objects.using(db_alias).filter(
        name="Renewable diesel"
    ).update(
        description="Diesel fuel produced from biomass"
    )
    approved_fuel.objects.using(db_alias).filter(
        name="Renewable gasoline"
    ).update(
        description="Gasoline produced from biomass"
    )


def remove_descriptions(apps, schema_editor):
    """
    Removes the descriptions from fuels
    """
    db_alias = schema_editor.connection.alias

    approved_fuel = apps.get_model('api', 'ApprovedFuel')

    approved_fuel.objects.using(db_alias).update(
        description=None
    )


class Migration(migrations.Migration):
    """
    Attaches the functions for the migrations
    """
    dependencies = [
        ('api', '0118_approvedfuel_description'),
    ]

    operations = [
        RunPython(
            add_descriptions,
            remove_descriptions
        )
    ]
