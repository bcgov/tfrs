from django.db import migrations
from django.db.migrations import RunPython


def rename_fsdoc_role(apps, schema_editor):
    db_alias = schema_editor.connection.alias

    role = apps.get_model('api', 'Role')

    fsdoc_role = role.objects.using(db_alias).filter(
        name="FSDoc"
    ).first()

    fsdoc_role.name = 'GovDoc'

    fsdoc_role.save()


def revert_rename_fsdoc_role(apps, schema_editor):
    db_alias = schema_editor.connection.alias

    role = apps.get_model('api', 'Role')

    fsdoc_role = role.objects.using(db_alias).filter(
        name="GovDoc"
    ).first()

    fsdoc_role.name = 'FSDoc'

    fsdoc_role.save()


class Migration(migrations.Migration):
    """
    Attaches the functions for the migrations
    """
    dependencies = [
        ('api', '0088_auto_20190228_1911'),
    ]

    operations = [
        RunPython(
            rename_fsdoc_role,
            revert_rename_fsdoc_role,
        )
    ]
