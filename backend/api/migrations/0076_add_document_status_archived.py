from django.db import migrations
from django.db.migrations import RunPython


def add_document_status(apps, schema_editor):
    """
    Adds Archived status
    """
    db_alias = schema_editor.connection.alias

    # By retrieving the models via apps.get_model, we get one appropriately
    # versioned for this migration (so this shouldn't ever need to be
    # maintained if fields change)
    document_status = apps.get_model('api', 'DocumentStatus')
    document_status.objects.using(db_alias).create(
        status="Archived",
        effective_date="2017-01-01",
        display_order="8"
    )


def remove_document_status(apps, schema_editor):
    """
    Removes the Archived status
    """
    db_alias = schema_editor.connection.alias

    # By retrieving the models via apps.get_model, we get one appropriately
    # versioned for this migration (so this shouldn't ever need to be
    # maintained if fields change)
    document_status = apps.get_model('api', 'DocumentStatus')
    document_status.objects.using(db_alias).filter(
        status="Archived").delete()


class Migration(migrations.Migration):
    """
    Attaches the functions for the migrations
    """
    dependencies = [
        ('api', '0074_add_document_statuses'),
    ]

    operations = [
        RunPython(add_document_status, 
                  remove_document_status)
    ]
