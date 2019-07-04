from django.db import migrations
from django.db.migrations import RunPython


def add_effective_dates(apps, schema_editor):
    """
    Adds effective dates to the organization addresses
    """
    db_alias = schema_editor.connection.alias

    organization_address = apps.get_model('api', 'OrganizationAddress')

    organization_address.objects.using(db_alias).update(
        effective_date="2017-01-01"
    )


def remove_effective_dates(apps, schema_editor):
    """
    Sets the effective dates back to null for the organization addresses
    """
    db_alias = schema_editor.connection.alias

    organization_address = apps.get_model('api', 'OrganizationAddress')

    organization_address.objects.using(db_alias).update(
        effective_date=None
    )


class Migration(migrations.Migration):
    """
    Attaches the functions for the migrations
    """
    dependencies = [
        ('api', '0152_remove_organizationaddress_primary'),
    ]

    operations = [
        RunPython(
            add_effective_dates,
            remove_effective_dates
        )
    ]
