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
    role = apps.get_model("api", "Role")
    permission = apps.get_model("api", "Permission")
    role_permission = apps.get_model("api", "RolePermission")

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

    permissions = [
        permission(code='DOCUMENTS_CREATE_DRAFT', name='Submit draft documents',
                   description='Submit secure documents with draft status'),
        permission(code='DOCUMENTS_SUBMIT', name='Submit documents',
                   description='Submit secure documents'),
        permission(code='DOCUMENTS_GOVERNMENT_REVIEW', name='Review documents',
                   description='Government can accept documents for review'),
        permission(code='DOCUMENTS_VIEW', name='View documents',
                   description='View secure documents'),
    ]

    for new_permission in permissions:
        if not permission.objects.using(db_alias).filter(code=new_permission.code).exists():
            permission.objects.using(db_alias).bulk_create([new_permission])
        else:
            print('skipping existing permission {}'.format(new_permission.code))

    roles = [
        role(name='FSDoc', description='A Fuel Supplier user with authority to view documents and submit drafts',
             is_government_role=True, display_order=10),
        role(name='FSDocSubmit', description='A Fuel Supplier user with authority to submit documents',
             is_government_role=False, display_order=11)
    ]

    for new_role in roles:
        if not role.objects.using(db_alias).filter(name=new_role.name).exists():
            role.objects.using(db_alias).bulk_create([new_role])
        else:
            print('skipping existing role {}'.format(new_role.name))

    role_permissions = [
        role_permission(role=role.objects.using(db_alias).get(name='FSDoc'),
                        permission=permission.objects.using(db_alias).get(code='DOCUMENTS_VIEW')),
        role_permission(role=role.objects.using(db_alias).get(name='FSDoc'),
                        permission=permission.objects.using(db_alias).get(code='DOCUMENTS_CREATE_DRAFT')),
        role_permission(role=role.objects.using(db_alias).get(name='FSDocSubmit'),
                        permission=permission.objects.using(db_alias).get(code='DOCUMENTS_VIEW')),
        role_permission(role=role.objects.using(db_alias).get(name='FSDocSubmit'),
                        permission=permission.objects.using(db_alias).get(code='DOCUMENTS_CREATE_DRAFT')),
        role_permission(role=role.objects.using(db_alias).get(name='FSDocSubmit'),
                        permission=permission.objects.using(db_alias).get(code='DOCUMENTS_SUBMIT')),
        role_permission(role=role.objects.using(db_alias).get(name='GovUser'),
                        permission=permission.objects.using(db_alias).get(code='DOCUMENTS_VIEW')),
        role_permission(role=role.objects.using(db_alias).get(name='GovUser'),
                        permission=permission.objects.using(db_alias).get(code='DOCUMENTS_GOVERNMENT_REVIEW'))
    ]

    for new_role_permission in role_permissions:
        if not role_permission.objects.using(db_alias).filter(
                role=role.objects.using(db_alias).get(name=new_role_permission.role.name),
                permission=permission.objects.using(db_alias).get(code=new_role_permission.permission.code)).exists():
            role_permission.objects.using(db_alias).bulk_create([new_role_permission])
        else:
            print('skipping existing role<->permission {}:{}'.format(new_role_permission.role.name,
                                                                     new_role_permission.permission.code))


class Migration(migrations.Migration):
    dependencies = [
        ('api', '0045_documents'),
    ]

    operations = [
        # This is a one-way trip
        RunPython(create_initial_data, reverse_code=None)
    ]
