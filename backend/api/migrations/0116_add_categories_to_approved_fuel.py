from django.db import migrations
from django.db.migrations import RunPython


def add_categories(apps, schema_editor):
    """
    Adds additional fuel types for credit calculation
    """
    db_alias = schema_editor.connection.alias

    approved_fuel = apps.get_model('api', 'ApprovedFuel')
    default_carbon_intensity_category = apps.get_model(
        'api', 'DefaultCarbonIntensityCategory')
    energy_density_category = apps.get_model(
        'api', 'EnergyDensityCategory')
    energy_effectiveness_ratio_category = apps.get_model(
        'api', 'EnergyEffectivenessRatioCategory')

    approved_fuel.objects.using(db_alias).filter(
        name="Biodiesel"
    ).update(
        default_carbon_intensity_category=default_carbon_intensity_category
        .objects.using(db_alias).get(
            name="Renewable Fuel in relation to diesel class fuel"
        ),
        energy_density_category=energy_density_category
        .objects.using(db_alias).get(
            name="Biodiesel"
        ),
        energy_effectiveness_ratio_category=energy_effectiveness_ratio_category
        .objects.using(db_alias).get(
            name="Petroleum-based diesel fuel or renewable fuel in relation "
                 "to diesel class fuel"
        )
    )

    approved_fuel.objects.using(db_alias).filter(
        name="CNG"
    ).update(
        default_carbon_intensity_category=default_carbon_intensity_category
        .objects.using(db_alias).get(
            name="CNG"
        ),
        energy_density_category=energy_density_category
        .objects.using(db_alias).get(
            name="CNG"
        ),
        energy_effectiveness_ratio_category=energy_effectiveness_ratio_category
        .objects.using(db_alias).get(
            name="CNG"
        )
    )

    approved_fuel.objects.using(db_alias).filter(
        name="Electricity"
    ).update(
        default_carbon_intensity_category=default_carbon_intensity_category
        .objects.using(db_alias).get(
            name="Electricity"
        ),
        energy_density_category=energy_density_category
        .objects.using(db_alias).get(
            name="Electricity"
        ),
        energy_effectiveness_ratio_category=energy_effectiveness_ratio_category
        .objects.using(db_alias).get(
            name="Electricity"
        )
    )

    approved_fuel.objects.using(db_alias).filter(
        name="Ethanol"
    ).update(
        default_carbon_intensity_category=default_carbon_intensity_category
        .objects.using(db_alias).get(
            name="Renewable Fuel in relation to gasoline class fuel"
        ),
        energy_density_category=energy_density_category
        .objects.using(db_alias).get(
            name="Ethanol"
        ),
        energy_effectiveness_ratio_category=energy_effectiveness_ratio_category
        .objects.using(db_alias).get(
            name="Petroleum-based gasoline, natural gas-based gasoline or "
                 "renewable fuel in relation to gasoline class fuel"
        )
    )

    approved_fuel.objects.using(db_alias).filter(
        name="HDRD"
    ).update(
        default_carbon_intensity_category=default_carbon_intensity_category
        .objects.using(db_alias).get(
            name="Renewable Fuel in relation to diesel class fuel"
        ),
        energy_density_category=energy_density_category
        .objects.using(db_alias).get(
            name="Hydrogenation-derived renewable diesel fuel"
        ),
        energy_effectiveness_ratio_category=energy_effectiveness_ratio_category
        .objects.using(db_alias).get(
            name="Petroleum-based diesel fuel or renewable fuel in relation "
                 "to diesel class fuel"
        )
    )

    approved_fuel.objects.using(db_alias).filter(
        name="Hydrogen"
    ).update(
        default_carbon_intensity_category=default_carbon_intensity_category
        .objects.using(db_alias).get(
            name="Hydrogen"
        ),
        energy_density_category=energy_density_category
        .objects.using(db_alias).get(
            name="Hydrogen"
        ),
        energy_effectiveness_ratio_category=energy_effectiveness_ratio_category
        .objects.using(db_alias).get(
            name="Hydrogen"
        )
    )

    approved_fuel.objects.using(db_alias).filter(
        name="LNG"
    ).update(
        default_carbon_intensity_category=default_carbon_intensity_category
        .objects.using(db_alias).get(
            name="LNG"
        ),
        energy_density_category=energy_density_category
        .objects.using(db_alias).get(
            name="LNG"
        ),
        energy_effectiveness_ratio_category=energy_effectiveness_ratio_category
        .objects.using(db_alias).get(
            name="LNG"
        )
    )

    approved_fuel.objects.using(db_alias).filter(
        name="Natural gas-based gasoline"
    ).update(
        default_carbon_intensity_category=default_carbon_intensity_category
        .objects.using(db_alias).get(
            name="Natural gas-based gasoline"
        ),
        energy_density_category=energy_density_category
        .objects.using(db_alias).get(
            name="Petroleum-based gasoline, natural gas-based gasoline or "
                 "gasoline produced from biomass"
        ),
        energy_effectiveness_ratio_category=energy_effectiveness_ratio_category
        .objects.using(db_alias).get(
            name="Petroleum-based gasoline, natural gas-based gasoline or "
                 "renewable fuel in relation to gasoline class fuel"
        )
    )

    approved_fuel.objects.using(db_alias).filter(
        name="Petroleum-based diesel"
    ).update(
        default_carbon_intensity_category=default_carbon_intensity_category
        .objects.using(db_alias).get(
            name="Petroleum-based diesel"
        ),
        energy_density_category=energy_density_category
        .objects.using(db_alias).get(
            name="Petroleum-based diesel fuel or diesel fuel produced from "
                 "biomass"
        ),
        energy_effectiveness_ratio_category=energy_effectiveness_ratio_category
        .objects.using(db_alias).get(
            name="Petroleum-based diesel fuel or renewable fuel in relation "
                 "to diesel class fuel"
        )
    )

    approved_fuel.objects.using(db_alias).filter(
        name="Petroleum-based gasoline"
    ).update(
        default_carbon_intensity_category=default_carbon_intensity_category
        .objects.using(db_alias).get(
            name="Petroleum-based gasoline"
        ),
        energy_density_category=energy_density_category
        .objects.using(db_alias).get(
            name="Petroleum-based gasoline, natural gas-based gasoline or "
                 "gasoline produced from biomass"
        ),
        energy_effectiveness_ratio_category=energy_effectiveness_ratio_category
        .objects.using(db_alias).get(
            name="Petroleum-based gasoline, natural gas-based gasoline or "
                 "renewable fuel in relation to gasoline class fuel"
        )
    )

    approved_fuel.objects.using(db_alias).filter(
        name="Propane"
    ).update(
        default_carbon_intensity_category=default_carbon_intensity_category
        .objects.using(db_alias).get(
            name="Propane"
        ),
        energy_density_category=energy_density_category
        .objects.using(db_alias).get(
            name="Propane"
        ),
        energy_effectiveness_ratio_category=energy_effectiveness_ratio_category
        .objects.using(db_alias).get(
            name="Propane"
        )
    )

    approved_fuel.objects.using(db_alias).filter(
        name="Renewable diesel"
    ).update(
        default_carbon_intensity_category=default_carbon_intensity_category
        .objects.using(db_alias).get(
            name="Petroleum-based diesel"
        ),
        energy_density_category=energy_density_category
        .objects.using(db_alias).get(
            name="Petroleum-based diesel fuel or diesel fuel produced from "
                 "biomass"
        ),
        energy_effectiveness_ratio_category=energy_effectiveness_ratio_category
        .objects.using(db_alias).get(
            name="Petroleum-based diesel fuel or renewable fuel in relation "
                 "to diesel class fuel"
        )
    )

    approved_fuel.objects.using(db_alias).filter(
        name="Renewable gasoline"
    ).update(
        default_carbon_intensity_category=default_carbon_intensity_category
        .objects.using(db_alias).get(
            name="Petroleum-based gasoline"
        ),
        energy_density_category=energy_density_category
        .objects.using(db_alias).get(
            name="Petroleum-based gasoline, natural gas-based gasoline or "
                 "gasoline produced from biomass"
        ),
        energy_effectiveness_ratio_category=energy_effectiveness_ratio_category
        .objects.using(db_alias).get(
            name="Petroleum-based gasoline, natural gas-based gasoline or "
                 "renewable fuel in relation to gasoline class fuel"
        )
    )


def remove_categories(apps, schema_editor):
    """
    Removes the credit calculation fuel types
    """
    db_alias = schema_editor.connection.alias

    approved_fuel = apps.get_model('api', 'ApprovedFuel')
    approved_fuel.objects.using(db_alias).update(
        default_carbon_intensity_category=None,
        energy_density_category=None,
        energy_effectiveness_ratio_category=None
    )


class Migration(migrations.Migration):
    """
    Attaches the functions for the migrations
    """
    dependencies = [
        ('api', '0115_auto_20190411_1615'),
    ]

    operations = [
        RunPython(
            add_categories,
            remove_categories
        )
    ]
