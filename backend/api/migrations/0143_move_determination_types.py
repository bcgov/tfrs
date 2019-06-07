from django.db import migrations
from django.db.migrations import RunPython


def update_descriptions(apps, schema_editor):
    """
    Updates the provision field with the description.
    Updates the description with the determination_type description
    """
    db_alias = schema_editor.connection.alias

    provision_act = apps.get_model('api', 'ProvisionOfTheAct')
    determination_type = apps.get_model(
        'api', 'CarbonIntensityDeterminationType')

    provisions = provision_act.objects.using(db_alias).all()

    for provision_obj in provisions:
        determination_type_obj = determination_type.objects.using(
            db_alias).get(id=provision_obj.determination_type_id)
        provision_obj.provision = provision_obj.description
        provision_obj.description = determination_type_obj.description
        provision_obj.save()


def revert_descriptions(apps, schema_editor):
    """
    Reverts the changes
    """
    db_alias = schema_editor.connection.alias

    provision_act = apps.get_model('api', 'ProvisionOfTheAct')

    provisions = provision_act.objects.using(db_alias).all()

    for provision_obj in provisions:
        provision_obj.description = provision_obj.provision
        provision_obj.provision = ""
        provision_obj.save()


class Migration(migrations.Migration):
    """
    Attaches the functions for the migrations
    """
    dependencies = [
        ('api', '0142_auto_20190606_2119'),
    ]

    operations = [
        RunPython(
            update_descriptions,
            revert_descriptions
        )
    ]
