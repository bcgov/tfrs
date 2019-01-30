from django.db import migrations
from django.db.migrations import RunPython


def add_document_statuses(apps, schema_editor):
    """
    Adds Cancelled and Rescinded statuses to DocumentStatus
    """
    db_alias = schema_editor.connection.alias

    # By retrieving the models via apps.get_model, we get one appropriately
    # versioned for this migration (so this shouldn't ever need to be
    # maintained if fields change)
    document_status = apps.get_model('api', 'DocumentStatus')
    document_status.objects.using(db_alias).bulk_create([
        document_status(
            status="Rescinded",
            effective_date="2017-01-01",
            display_order="6"
        ),
        document_status(
            status="Cancelled",
            effective_date="2017-01-01",
            display_order="7"
        )
    ])


def remove_document_statuses(apps, schema_editor):
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
        status__in=["Cancelled", "Rescinded"]).delete()


class Migration(migrations.Migration):
    """
    Attaches the functions for the migrations
    """
    dependencies = [
        ('api', '0073_auto_20190128_2014'),
    ]

    operations = [
        RunPython(add_document_statuses,
                  remove_document_statuses)
    ]
