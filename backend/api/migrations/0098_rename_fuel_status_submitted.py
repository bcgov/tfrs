from django.db import migrations
from django.db.migrations import RunPython


def rename_submitted_status(apps, schema_editor):
    db_alias = schema_editor.connection.alias

    status = apps.get_model('api', 'FuelCodeStatus')

    submitted_status = status.objects.using(db_alias).filter(
        status="Submitted"
    ).first()

    if submitted_status:
        submitted_status.status = 'Approved'
        submitted_status.save()


def revert_submitted_status(apps, schema_editor):
    db_alias = schema_editor.connection.alias

    status = apps.get_model('api', 'FuelCodeStatus')

    approved_status = status.objects.using(db_alias).filter(
        status="Approved"
    ).first()

    if approved_status:
        approved_status.status = 'Submitted'
        approved_status.save()


class Migration(migrations.Migration):
    """
    Attaches the functions for the migrations
    """
    dependencies = [
        ('api', '0097_add_autocomplete_indices'),
    ]

    operations = [
        RunPython(
            rename_submitted_status,
            revert_submitted_status,
        )
    ]
