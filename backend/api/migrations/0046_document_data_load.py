from datetime import datetime

from django.db import migrations, IntegrityError
from django.db.migrations import RunPython


def create_initial_data(apps, schema_editor):
    """Load initial data (previously stored in fixtures)
    This is for core (essential) data only -- operational data should be inserted with scripts

    This script is designed to look for existing data and add any missing elements, without
    disrupting existing data, or load a database from nothing (as for testing)

    It is idempotent and irreversible
    """
    db_alias = schema_editor.connection.alias

    # By retrieving the models via apps.get_model, we get one appropriately versioned
    # for this migration (so this shouldn't ever need to be maintained if fields change)
    doc_status = apps.get_model("api", "DocumentStatus")
    doc_type = apps.get_model("api", "DocumentType")
    doc_cat = apps.get_model("api", "DocumentCategory")

    doc_statuses = [
        doc_status(status='Draft',
                   display_order=1,
                   effective_date='2017-01-01'),
        doc_status(status='Submitted',
                   display_order=2,
                   effective_date='2017-01-01'),
        doc_status(status='Received',
                   display_order=3,
                   effective_date='2017-01-01')
    ]

    for new_doc_status in doc_statuses:
        if not doc_status.objects.using(db_alias).filter(status=new_doc_status.status).exists():
            doc_status.objects.using(db_alias).bulk_create([new_doc_status])
        else:
            print('skipping existing document status {}'.format(new_doc_status.status))

    doc_cats = [
        doc_cat(
            name='Part 3 Agreements',
            display_order=1
        )
    ]

    for new_doc_cat in doc_cats:
        if not doc_cat.objects.using(db_alias).filter(name=new_doc_cat.name).exists():
            doc_cat.objects.using(db_alias).bulk_create([new_doc_cat])
        else:
            print('skipping existing document category {}'.format(new_doc_cat.name))

    doc_types = [
        doc_type(the_type='Application',
                 effective_date='2017-01-01',
                 category=doc_cat.objects.get(name='Part 3 Agreements')
                 ),
        doc_type(the_type='Evidence',
                 effective_date='2017-01-01',
                 category=doc_cat.objects.get(name='Part 3 Agreements')
                 )
    ]

    for new_doc_type in doc_types:
        if not doc_type.objects.using(db_alias).filter(the_type=new_doc_type.the_type).exists():
            doc_type.objects.using(db_alias).bulk_create([new_doc_type])
        else:
            print('skipping existing document type {}'.format(new_doc_type.the_type))


class Migration(migrations.Migration):
    dependencies = [
        ('api', '0045_documents'),
    ]

    operations = [
        # This is a one-way trip
        RunPython(create_initial_data, reverse_code=None)
    ]
