from django.db import migrations
from django.db.migrations import RunPython


def update_categories(apps, schema_editor):
    """
    Fixes the default carbon intensity category for Renewable diesel and
    Renewable gasoline
    """
    db_alias = schema_editor.connection.alias

    approved_fuel = apps.get_model('api', 'ApprovedFuel')
    default_carbon_intensity_category = apps.get_model(
        'api', 'DefaultCarbonIntensityCategory')

    approved_fuel.objects.using(db_alias).filter(
        name="Renewable diesel"
    ).update(
        default_carbon_intensity_category=default_carbon_intensity_category
        .objects.using(db_alias).get(
            name="Renewable fuel in relation to diesel class fuel"
        )
    )

    approved_fuel.objects.using(db_alias).filter(
        name="Renewable gasoline"
    ).update(
        default_carbon_intensity_category=default_carbon_intensity_category
        .objects.using(db_alias).get(
            name="Renewable fuel in relation to gasoline class fuel"
        )
    )


def revert_categories(apps, schema_editor):
    """
    Reverts the changes
    """
    db_alias = schema_editor.connection.alias

    approved_fuel = apps.get_model('api', 'ApprovedFuel')
    default_carbon_intensity_category = apps.get_model(
        'api', 'DefaultCarbonIntensityCategory')

    approved_fuel.objects.using(db_alias).filter(
        name="Renewable diesel"
    ).update(
        default_carbon_intensity_category=default_carbon_intensity_category
        .objects.using(db_alias).get(
            name="Petroleum-based diesel"
        )
    )

    approved_fuel.objects.using(db_alias).filter(
        name="Renewable gasoline"
    ).update(
        default_carbon_intensity_category=default_carbon_intensity_category
        .objects.using(db_alias).get(
            name="Petroleum-based gasoline"
        )
    )


class Migration(migrations.Migration):
    """
    Attaches the functions for the migrations
    """
    dependencies = [
        ('api', '0139_auto_20190604_1750'),
    ]

    operations = [
        RunPython(
            update_categories,
            revert_categories
        )
    ]
