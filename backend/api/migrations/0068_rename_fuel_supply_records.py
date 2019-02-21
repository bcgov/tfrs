from django.db import migrations
from django.db.migrations import RunPython


def rename_to_compliance_reporting_materials(apps, schema_editor):
    """
    Renames document type: Fuel Supply Records to Compliance
    Reporting Materials
    """
    db_alias = schema_editor.connection.alias

    # By retrieving the models via apps.get_model, we get one appropriately
    # versioned for this migration (so this shouldn't ever need to be
    # maintained if fields change)
    document_type = apps.get_model('api', 'DocumentType')

    document_type.objects.using(db_alias).filter(
        the_type="Records"
    ).update(
        description="Compliance Reporting Materials"
    )


def revert_to_fuel_supply_records(apps, schema_editor):
    """
    Renames transaction type: Compliance Reporting Materials to Fuel Supply
    Records
    """
    db_alias = schema_editor.connection.alias

    # By retrieving the models via apps.get_model, we get one appropriately
    # versioned for this migration (so this shouldn't ever need to be
    # maintained if fields change)
    document_type = apps.get_model('api', 'DocumentType')

    document_type.objects.using(db_alias).filter(
        the_type="Records"
    ).update(
        description="Fuel Supply Records"
    )


class Migration(migrations.Migration):
    """
    Attaches the functions for the migrations
    """
    dependencies = [
        ('api', '0067_permissions_remove_view_compliance_periods'),
    ]

    operations = [
        RunPython(rename_to_compliance_reporting_materials,
                  revert_to_fuel_supply_records)
    ]
