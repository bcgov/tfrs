from django.db import migrations
from django.db.migrations import RunPython


def update_determination_type(apps, schema_editor):
    """
    Updates the provision field with the description.
    Updates the description with the determination_type description
    """
    db_alias = schema_editor.connection.alias

    approved_fuel_provision = apps.get_model('api', 'ApprovedFuelProvision')
    provision_act = apps.get_model('api', 'ProvisionOfTheAct')

    rows = approved_fuel_provision.objects.using(db_alias).all()

    for row in rows:
        provision = provision_act.objects.using(db_alias).get(
            id=row.provision_id)
        row.determination_type_id = provision.determination_type_id
        row.save()


def remove_determination_type(apps, schema_editor):
    """
    Reverts the changes
    """
    db_alias = schema_editor.connection.alias

    approved_fuel_provision = apps.get_model('api', 'ApprovedFuelProvision')

    rows = approved_fuel_provision.objects.using(db_alias).all()

    for row in rows:
        row.determination_type_id = None
        row.save()


class Migration(migrations.Migration):
    """
    Attaches the functions for the migrations
    """
    dependencies = [
        ('api', '0143_move_determination_types'),
    ]

    operations = [
        RunPython(
            update_determination_type,
            remove_determination_type
        )
    ]
