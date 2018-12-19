from datetime import datetime

from django.db import migrations
from django.db.migrations import RunPython


def update_document_types(apps, schema_editor):
    """
    Adds the description for Application and Evidence.
    Add 'Other' Category
    Adds Fuel Supply Records and Other
    """
    db_alias = schema_editor.connection.alias

    # By retrieving the models via apps.get_model, we get one appropriately
    # versioned for this migration (so this shouldn't ever need to be
    # maintained if fields change)
    doc_cat = apps.get_model('api', 'DocumentCategory')
    doc_type = apps.get_model('api', 'DocumentType')

    doc_category = doc_cat(
        name='Other',
        display_order=2
    )

    if not doc_cat.objects.using(db_alias).filter(
            name=doc_category.name).exists():
        doc_cat.objects.using(db_alias).bulk_create([doc_category])

    doc_types = [
        doc_type(the_type='Application',
                 description='P3A Application',
                 effective_date='2017-01-01',
                 category=doc_cat.objects.get(name='Part 3 Agreements')
                 ),
        doc_type(the_type='Evidence',
                 description='P3A Milestone Evidence',
                 effective_date='2017-01-01',
                 category=doc_cat.objects.get(name='Part 3 Agreements')
                 ),
        doc_type(the_type='Records',
                 description='Fuel Supply Records',
                 effective_date='2017-01-01',
                 category=doc_cat.objects.get(name='Other')
                 ),
        doc_type(the_type='Other',
                 description='Other',
                 effective_date='2017-01-01',
                 category=doc_cat.objects.get(name='Other')
                 )
    ]

    for new_doc_type in doc_types:
        if not doc_type.objects.using(db_alias).filter(
                the_type=new_doc_type.the_type).exists():
            doc_type.objects.using(db_alias).bulk_create([new_doc_type])
        else:
            doc_type.objects.using(db_alias).filter(
                the_type=new_doc_type.the_type).update(
                    the_type=new_doc_type.the_type,
                    description=new_doc_type.description,
                    effective_date=new_doc_type.effective_date,
                    category=new_doc_type.category)


def revert_document_types(apps, schema_editor):
    """
    Reverts the changes to document types.
    Removes the description for Application Evidence.
    Removes 'Other' Category
    Removes Fuel Supply Records and Other
    """
    db_alias = schema_editor.connection.alias

    doc_cat = apps.get_model('api', 'DocumentCategory')
    doc_type = apps.get_model('api', 'DocumentType')

    doc_type.objects.using(db_alias).filter(
        category=doc_cat.objects.get(name='Other')).delete()

    doc_type.objects.using(db_alias).filter(
        category=doc_cat.objects.get(
            name='Part 3 Agreements')).update(
                description=''
            )

    doc_cat.objects.using(db_alias).filter(
        name='Other').delete()


class Migration(migrations.Migration):
    """
    Attaches the functions for the migrations
    """
    dependencies = [
        ('api', '0051_auto_20181218_1654'),
    ]

    operations = [
        # This is a one-way trip
        RunPython(update_document_types, revert_document_types)
    ]
