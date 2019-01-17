from datetime import datetime

from django.db import migrations, IntegrityError
from django.db.migrations import RunPython


def add_new_document_statuses(apps, schema_editor):
    """Add additional document statuses"""

    db_alias = schema_editor.connection.alias

    # By retrieving the models via apps.get_model, we get one appropriately versioned
    # for this migration (so this shouldn't ever need to be maintained if fields change)
    doc_status = apps.get_model("api", "DocumentStatus")

    doc_statuses = [
        doc_status(status='Security Scan Failed',
                   display_order=4,
                   effective_date='2017-01-01'),
        doc_status(status='Pending Submission',
                   display_order=5,
                   effective_date='2017-01-01'),
    ]

    for new_doc_status in doc_statuses:
        if not doc_status.objects.using(db_alias).filter(status=new_doc_status.status).exists():
            doc_status.objects.using(db_alias).bulk_create([new_doc_status])
        else:
            print('skipping existing document status {}'.format(new_doc_status.status))


class Migration(migrations.Migration):
    dependencies = [
        ('api', '0063_documents_permission_update'),
    ]

    operations = [
        # This is a one-way trip
        RunPython(add_new_document_statuses, reverse_code=None)
    ]
