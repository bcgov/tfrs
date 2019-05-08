from django.db import migrations
from django.db.migrations import RunPython


def clean_filenames(apps, schema_editor):
    """
    Removes query strings from urls
    """
    db_alias = schema_editor.connection.alias

    attachments = apps.get_model('api', 'DocumentFileAttachment')

    rows = attachments.objects.using(db_alias).filter(
        url__contains="?"
    )

    for row in rows:
        row.url = row.url.split('?')[0]
        row.save()


class Migration(migrations.Migration):
    """
    Remove query strings from all stored attachments
    """
    dependencies = [
        ('api', '0127_add_petroleum_carbon_intensity_categories'),
    ]

    operations = [
        RunPython(
            clean_filenames,
            None
        )
    ]
