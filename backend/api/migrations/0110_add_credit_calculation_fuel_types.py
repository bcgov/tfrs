from django.db import migrations
from django.db.migrations import RunPython


def add_credit_calculation_fuel_types(apps, schema_editor):
    """
    Adds additional fuel types for credit calculation
    """
    db_alias = schema_editor.connection.alias

    approved_fuel = apps.get_model('api', 'ApprovedFuel')

    approved_fuel.objects.using(db_alias).bulk_create([
        approved_fuel(
            name='Petroleum-based diesel fuel or renewable fuel in relation '
                 'to diesel class fuel',
            effective_date='2017-01-01',
            credit_calculation_only=True
        ),
        approved_fuel(
            name='Petroleum-based gasoline, natural gas-based gasoline or '
                 'renewable fuel in relation to gasoline class fuel',
            effective_date='2017-01-01',
            credit_calculation_only=True
        ),
        approved_fuel(
            name='Petroleum-based diesel fuel or diesel fuel produced from '
                 'biomass',
            effective_date='2017-01-01',
            credit_calculation_only=True
        ),
        approved_fuel(
            name='Petroleum-based gasoline, natural gas-based gasoline or '
                 'gasoline produced from biomass',
            effective_date='2017-01-01',
            credit_calculation_only=True
        ),
        approved_fuel(
            name='Hydrogenation-derived renewable diesel fuel',
            effective_date='2017-01-01',
            credit_calculation_only=True
        ),
        approved_fuel(
            name='Renewable fuel in relation to diesel class fuel',
            effective_date='2017-01-01',
            credit_calculation_only=True
        ),
        approved_fuel(
            name='Renewable fuel in relation to gasoline class fuel',
            effective_date='2017-01-01',
            credit_calculation_only=True
        )
    ])


def remove_credit_calculation_fuel_types(apps, schema_editor):
    """
    Removes the credit calculation fuel types
    """
    db_alias = schema_editor.connection.alias

    approved_fuel = apps.get_model('api', 'ApprovedFuel')

    approved_fuel.objects.using(db_alias).filter(
        credit_calculation_only=True
    ).delete()


class Migration(migrations.Migration):
    """
    Attaches the functions for the migrations
    """
    dependencies = [
        ('api', '0109_auto_20190409_2101'),
    ]

    operations = [
        RunPython(
            add_credit_calculation_fuel_types,
            remove_credit_calculation_fuel_types
        )
    ]
