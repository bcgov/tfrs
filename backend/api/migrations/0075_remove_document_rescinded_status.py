from django.db import migrations
from django.db.migrations import RunPython


def remove_document_status(apps, schema_editor):
    """
    Re-adds the View Compliance Period and the relationship to the roles
    that previously had it.
    """
    db_alias = schema_editor.connection.alias

    # By retrieving the models via apps.get_model, we get one appropriately
    # versioned for this migration (so this shouldn't ever need to be
    # maintained if fields change)
    document_status = apps.get_model('api', 'DocumentStatus')
    document_status.objects.using(db_alias).filter(
        status="Rescinded").delete()


def add_document_status(apps, schema_editor):
    """
    Adds Cancelled and Rescinded statuses to DocumentStatus
    """
    db_alias = schema_editor.connection.alias

    # By retrieving the models via apps.get_model, we get one appropriately
    # versioned for this migration (so this shouldn't ever need to be
    # maintained if fields change)
    document_status = apps.get_model('api', 'DocumentStatus')
    document_status.objects.using(db_alias).create(
        status="Rescinded",
        effective_date="2017-01-01",
        display_order="6"
    )


class Migration(migrations.Migration):
    """
    Attaches the functions for the migrations
    """
    dependencies = [
        ('api', '0074_add_document_statuses'),
    ]

    operations = [
        RunPython(remove_document_status,
                  add_document_status)
    ]
