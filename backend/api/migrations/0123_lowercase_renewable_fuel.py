from django.db import migrations
from django.db.migrations import RunPython


def update_to_lowercase(apps, schema_editor):
    """
    Sets fuel to lowercase in Renewable Fuel in relation to ...
    """
    db_alias = schema_editor.connection.alias

    category = apps.get_model('api', 'DefaultCarbonIntensityCategory')

    category.objects.using(db_alias).filter(
        name="Renewable Fuel in relation to diesel class fuel"
    ).update(
        name="Renewable fuel in relation to diesel class fuel"
    )

    category.objects.using(db_alias).filter(
        name="Renewable Fuel in relation to gasoline class fuel"
    ).update(
        name="Renewable fuel in relation to gasoline class fuel"
    )

def update_to_uppercase(apps, schema_editor):
    """
    Sets fuel to uppercase in Renewable fuel in relation to ...
    """
    db_alias = schema_editor.connection.alias

    category = apps.get_model('api', 'DefaultCarbonIntensityCategory')

    category.objects.using(db_alias).filter(
        name="Renewable fuel in relation to diesel class fuel"
    ).update(
        name="Renewable Fuel in relation to diesel class fuel"
    )

    category.objects.using(db_alias).filter(
        name="Renewable fuel in relation to gasoline class fuel"
    ).update(
        name="Renewable Fuel in relation to gasoline class fuel"
    )


class Migration(migrations.Migration):
    """
    Attaches the functions for the migrations
    """
    dependencies = [
        ('api', '0122_auto_20190425_1514'),
    ]

    operations = [
        RunPython(
            update_to_lowercase,
            update_to_uppercase
        )
    ]
