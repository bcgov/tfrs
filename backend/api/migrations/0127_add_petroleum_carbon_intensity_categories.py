from django.db import migrations
from django.db.migrations import RunPython


def add_categories(apps, schema_editor):
    """
    Adds petroleum-based diesel fuel and gasoline categories
    """
    db_alias = schema_editor.connection.alias

    category = apps.get_model('api', 'PetroleumCarbonIntensityCategory')

    category.objects.using(db_alias).bulk_create([
        category(
            name="Petroleum-based diesel",
            display_order=1
        ),
        category(
            name="Petroleum-based gasoline",
            display_order=2
        )
    ])


def remove_categories(apps, schema_editor):
    """
    Removes the petroleum-based categories
    """
    db_alias = schema_editor.connection.alias

    category = apps.get_model('api', 'PetroleumCarbonIntensityCategory')
    category.objects.using(db_alias).delete()


class Migration(migrations.Migration):
    """
    Attaches the functions for the migrations
    """
    dependencies = [
        ('api', '0126_auto_20190502_2024'),
    ]

    operations = [
        RunPython(
            add_categories,
            remove_categories
        )
    ]
