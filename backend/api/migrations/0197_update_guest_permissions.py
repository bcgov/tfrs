from django.db import migrations
from django.db.migrations import RunPython


def add_permissions(apps, schema_editor):
    """
    Adds the some permissions to the guest role
    Adjusts some permissions from the compliance manager
    """
    db_alias = schema_editor.connection.alias

    permission_model = apps.get_model('api', 'Permission')
    role_model = apps.get_model('api', 'Role')
    role_permission = apps.get_model('api', 'RolePermission')

    # Guest
    permissions = permission_model.objects.using(db_alias).filter(code__in=[
        "VIEW_COMPLIANCE_REPORT", "DOCUMENTS_VIEW", "FUEL_CODES_VIEW",
        "CREDIT_CALCULATION_VIEW"
    ])

    role_permissions = []

    for permission in permissions:
        role_permissions.append(
            role_permission(
                role=role_model.objects.using(db_alias).get(
                    name="FSNoAccess"
                ),
                permission=permission
            )
        )

    role_permission.objects.using(db_alias).bulk_create(role_permissions)

    # Compliance Reporting
    permissions = permission_model.objects.using(db_alias).filter(code__in=[
        "VIEW_FUEL_SUPPLIERS", "VIEW_PRIVILEGED_COMMENTS"
    ])

    role_permissions = []

    for permission in permissions:
        role_permissions.append(
            role_permission(
                role=role_model.objects.using(db_alias).get(
                    name="ComplianceReporting"
                ),
                permission=permission
            )
        )

    role_permission.objects.using(db_alias).bulk_create(role_permissions)

    role_permission.objects.using(db_alias).filter(
        permission__code="ADD_COMMENT",
        role__name="FSAdmin"
    ).delete()


def remove_permissions(apps, schema_editor):
    """
    Reverts the permissions back to how it was
    """
    db_alias = schema_editor.connection.alias

    permission_model = apps.get_model('api', 'Permission')
    role_model = apps.get_model('api', 'Role')
    role_permission = apps.get_model('api', 'RolePermission')

    # Compliance Reporting
    role_permission.objects.using(db_alias).filter(
        permission__code__in=[
            "VIEW_FUEL_SUPPLIERS", "VIEW_PRIVILEGED_COMMENTS"
        ],
        role__name="ComplianceReporting"
    ).delete()

    # Managing Users
    role_permission.objects.using(db_alias).create(
        role=role_model.objects.using(db_alias).get(
            name="FSAdmin"
        ),
        permission=permission_model.objects.using(db_alias).get(
            code="ADD_COMMENT"
        )
    )

    # Guest
    role_permission.objects.using(db_alias).filter(
        permission__code__in=[
            "VIEW_COMPLIANCE_REPORT", "DOCUMENTS_VIEW", "FUEL_CODES_VIEW",
            "CREDIT_CALCULATION_VIEW"
        ],
        role__name="FSNoAccess"
    ).delete()


class Migration(migrations.Migration):
    """
    Attaches the functions for the migrations
    """
    dependencies = [
        ('api', '0196_auto_20191121_1607'),
    ]

    operations = [
        RunPython(
            add_permissions,
            remove_permissions
        )
    ]
