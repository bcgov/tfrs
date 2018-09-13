from django.db import migrations
from django.db.migrations import RunPython


def update_organization_name(apps, schema_editor):
    """
    Renames Government Of British Columbia to
    Government of British Columbia
    (lowercase 'of')
    """
    db_alias = schema_editor.connection.alias

    organization = apps.get_model("api", "Organization")

    organization.objects.using(db_alias).filter(
        name="Government Of British Columbia"
    ).update(name="Government of British Columbia")


def revert_organization_name(apps, schema_editor):
    """
    Renames Government of British Columbia back to
    Government Of British Columbia
    (lowercase 'Of')
    """
    db_alias = schema_editor.connection.alias

    organization = apps.get_model("api", "Organization")

    organization.objects.using(db_alias).filter(
        name="Government of British Columbia"
    ).update(name="Government Of British Columbia")


class Migration(migrations.Migration):
    """
    Attaches the functions for the migrations
    """
    dependencies = [
        ('api', '0027_auto_20180827_1414'),
    ]

    operations = [
        RunPython(update_organization_name, revert_organization_name)
    ]
