from django.db import migrations
from django.db.migrations import RunPython


def add_credit_calculation_permissions(apps, schema_editor):
    """
    Creates the basic permissions for the roles to manage and view
    credit calculation related tables
    """
    db_alias = schema_editor.connection.alias

    permission = apps.get_model(
        'api', 'Permission')
    role_model = apps.get_model('api', 'Role')
    role_permission = apps.get_model('api', 'RolePermission')

    view_permission = permission.objects.using(db_alias).create(
        code="CREDIT_CALCULATION_VIEW",
        name="View Credit Calculation Limits",
        description="The ability to access and view credit calculation limits."
    )

    manage_permission = permission.objects.using(db_alias).create(
        code="CREDIT_CALCULATION_MANAGE",
        name="Edit Credit Calculation Limits",
        description="The ability to create and update credit calculation "
                    "limits."
    )

    role_permissions = []

    roles = role_model.objects.using(db_alias).filter(name__in=[
        "GovDeputyDirector", "GovDirector", "GovUser"
    ])

    for role in roles:
        role_permissions.append(
            role_permission(
                role=role,
                permission=view_permission
            )
        )

        role_permissions.append(
            role_permission(
                role=role,
                permission=manage_permission
            )
        )

    roles = role_model.objects.using(db_alias).filter(name__in=[
        "FSAdmin", "FSManager", "FSUser"
    ])

    for role in roles:
        role_permissions.append(
            role_permission(
                role=role,
                permission=view_permission
            )
        )

    role_permission.objects.using(db_alias).bulk_create(role_permissions)


def remove_credit_calculation_permissions(apps, schema_editor):
    """
    Removes the credit calculation permissions from roles
    """
    db_alias = schema_editor.connection.alias

    permission = apps.get_model('api', 'Permission')
    role_permission = apps.get_model('api', 'RolePermission')

    manage_permission = permission.objects.using(db_alias).filter(
        code="CREDIT_CALCULATION_MANAGE"
    ).first()

    if manage_permission:
        role_permission.objects.filter(
            permission_id=manage_permission.id
        ).delete()

    manage_permission.delete()

    view_permission = permission.objects.using(db_alias).filter(
        code="CREDIT_CALCULATION_VIEW"
    ).first()

    if view_permission:
        role_permission.objects.filter(
            permission_id=view_permission.id
        ).delete()

    view_permission.delete()


class Migration(migrations.Migration):
    """
    Attaches the functions for the migrations
    """
    dependencies = [
        ('api', '0104_auto_20190403_1616'),
    ]

    operations = [
        RunPython(
            add_credit_calculation_permissions,
            remove_credit_calculation_permissions
        )
    ]
