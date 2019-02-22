from django.db import migrations
from django.db.migrations import RunPython


def remove_document_link_permission(apps, schema_editor):
    db_alias = schema_editor.connection.alias

    permission = apps.get_model('api', 'Permission')
    role_permission = apps.get_model('api', 'RolePermission')

    link_permission = permission.objects.using(db_alias).filter(
        code="DOCUMENTS_LINK_TO_CREDIT_TRADE"
    ).first()

    if link_permission:
        role_permission.objects.filter(
            permission_id=link_permission.id
        ).delete()

    link_permission.delete()


def add_document_link_permission(apps, schema_editor):
    db_alias = schema_editor.connection.alias

    permission = apps.get_model(
        'api', 'Permission')
    role = apps.get_model('api', 'Role')
    role_permission = apps.get_model('api', 'RolePermission')

    link_permission = permission.objects.using(db_alias).create(
        code="DOCUMENTS_LINK_TO_CREDIT_TRADE",
        name="Establish links between credit transactions and secure file submissions",
        description="Gives the user access to modify document links."
    )

    role_permissions = []

    roles = role.objects.using(db_alias).filter(name__in=[
        "GovDeputyDirector", "GovDirector", "GovUser"
    ])

    for role in roles:
        role_permissions.append(
            role_permission(
                role=role,
                permission=link_permission
            )
        )

    role_permission.objects.using(db_alias).bulk_create(role_permissions)


class Migration(migrations.Migration):
    """
    Attaches the functions for the migrations
    """
    dependencies = [
        ('api', '0079B_auto_20190220_0014'),
    ]

    operations = [
        RunPython(
            add_document_link_permission,
            remove_document_link_permission
        )
    ]
