from django.db import migrations
from django.db.migrations import RunPython


def add_permissions(apps, schema_editor):
    """
    Adds the missing permissions from certain roles
    """
    db_alias = schema_editor.connection.alias

    permission_model = apps.get_model(
        'api', 'Permission')
    role_model = apps.get_model('api', 'Role')
    role_permission = apps.get_model('api', 'RolePermission')

    # Compliance Reporting
    permissions = permission_model.objects.using(db_alias).filter(code__in=[
        "LOGIN", "VIEW_CREDIT_TRANSFERS", "FUEL_CODES_VIEW",
        "CREDIT_CALCULATION_VIEW"
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

    # Signing Authority
    permissions = permission_model.objects.using(db_alias).filter(code__in=[
        "EDIT_FUEL_SUPPLIER", "VIEW_COMPLIANCE_REPORT"
    ])

    role_permissions = []

    for permission in permissions:
        role_permissions.append(
            role_permission(
                role=role_model.objects.using(db_alias).get(
                    name="FSManager"
                ),
                permission=permission
            )
        )

    role_permission.objects.using(db_alias).bulk_create(role_permissions)

    # File Submission
    permissions = permission_model.objects.using(db_alias).filter(code__in=[
        "LOGIN", "VIEW_CREDIT_TRANSFERS", "FUEL_CODES_VIEW"
    ])

    role_permissions = []

    for permission in permissions:
        role_permissions.append(
            role_permission(
                role=role_model.objects.using(db_alias).get(
                    name="FSDocSubmit"
                ),
                permission=permission
            )
        )

    role_permission.objects.using(db_alias).bulk_create(role_permissions)

    # File Submission (Government)
    permissions = permission_model.objects.using(db_alias).filter(code__in=[
        "LOGIN", "VIEW_CREDIT_TRANSFERS", "EDIT_PRIVILEGED_COMMENTS",
        "DOCUMENTS_LINK_TO_CREDIT_TRADE", "USE_HISTORICAL_DATA_ENTRY",
        "VIEW_FUEL_SUPPLIERS", "VIEW_PRIVILEGED_COMMENTS",
        "VIEW_APPROVED_CREDIT_TRANSFERS"
    ])

    role_permissions = []

    for permission in permissions:
        role_permissions.append(
            role_permission(
                role=role_model.objects.using(db_alias).get(
                    name="GovDoc"
                ),
                permission=permission
            )
        )

    role_permission.objects.using(db_alias).bulk_create(role_permissions)

    # Administrator
    permissions = permission_model.objects.using(db_alias).filter(code__in=[
        "EDIT_PRIVILEGED_COMMENTS", "EDIT_FUEL_SUPPLIER",
        "VIEW_PRIVILEGED_COMMENTS"
    ])

    role_permissions = []

    for permission in permissions:
        role_permissions.append(
            role_permission(
                role=role_model.objects.using(db_alias).get(
                    name="Admin"
                ),
                permission=permission
            )
        )

    role_permission.objects.using(db_alias).bulk_create(role_permissions)

    # Director / Deputy Director
    roles = role_model.objects.using(db_alias).filter(name__in=[
        "GovDeputyDirector", "GovDirector"
    ])

    role_permissions = []

    for role in roles:
        role_permissions.append(
            role_permission(
                role=role,
                permission=permission_model.objects.using(db_alias).get(
                    code="DOCUMENTS_VIEW"
                )
            )
        )

    role_permission.objects.using(db_alias).bulk_create(role_permissions)

    # Compliance Manager
    permissions = permission_model.objects.using(db_alias).filter(code__in=[
        "LOGIN", "VIEW_CREDIT_TRANSFERS", "ADD_COMMENT", "FUEL_CODES_VIEW",
        "PROPOSE_CREDIT_TRANSFER", "CREDIT_CALCULATION_MANAGE",
        "FUEL_CODES_MANAGE", "EDIT_PRIVILEGED_COMMENTS",
        "DOCUMENTS_LINK_TO_CREDIT_TRADE", "EDIT_FUEL_SUPPLIERS",
        "RECOMMEND_CREDIT_TRANSFER", "RESCIND_CREDIT_TRANSFER",
        "DOCUMENTS_GOVERNMENT_REVIEW", "USE_HISTORICAL_DATA_ENTRY",
        "CREDIT_CALCULATION_VIEW", "DOCUMENTS_VIEW", "VIEW_FUEL_SUPPLIERS"
        "VIEW_PRIVILEGED_COMMENTS", "VIEW_APPROVED_CREDIT_TRANSFERS"
    ])

    role_permissions = []

    for permission in permissions:
        role_permissions.append(
            role_permission(
                role=role_model.objects.using(db_alias).get(
                    name="GovComplianceManager"
                ),
                permission=permission
            )
        )

    role_permission.objects.using(db_alias).bulk_create(role_permissions)


def remove_permissions(apps, schema_editor):
    """
    Removes the permissions that were added
    """
    db_alias = schema_editor.connection.alias

    role_permission = apps.get_model('api', 'RolePermission')

    # Compliance Reporting
    role_permission.objects.using(db_alias).filter(
        permission__code__in=[
            "LOGIN", "VIEW_CREDIT_TRANSFERS", "FUEL_CODES_VIEW",
            "CREDIT_CALCULATION_VIEW"
        ],
        role__name="ComplianceReporting"
    ).delete()

    # Signing Authority
    role_permission.objects.using(db_alias).filter(
        permission__code__in=[
            "EDIT_FUEL_SUPPLIER", "VIEW_COMPLIANCE_REPORT"
        ],
        role__name="FSManager"
    ).delete()

    # File Submission
    role_permission.objects.using(db_alias).filter(
        permission__code__in=[
            "LOGIN", "VIEW_CREDIT_TRANSFERS", "FUEL_CODES_VIEW"
        ],
        role__name="FSDocSubmit"
    ).delete()

    # File Submission (Government)
    role_permission.objects.using(db_alias).filter(
        permission__code__in=[
            "LOGIN", "VIEW_CREDIT_TRANSFERS", "EDIT_PRIVILEGED_COMMENTS",
            "DOCUMENTS_LINK_TO_CREDIT_TRADE", "USE_HISTORICAL_DATA_ENTRY",
            "VIEW_FUEL_SUPPLIERS", "VIEW_PRIVILEGED_COMMENTS",
            "VIEW_APPROVED_CREDIT_TRANSFERS"
        ],
        role__name="GovDoc"
    ).delete()

    # Administrator
    role_permission.objects.using(db_alias).filter(
        permission__code__in=[
            "EDIT_PRIVILEGED_COMMENTS", "EDIT_FUEL_SUPPLIER",
            "VIEW_PRIVILEGED_COMMENTS"
        ],
        role__name="Admin"
    ).delete()

    # Director / Deputy Director
    role_permission.objects.using(db_alias).filter(
        permission__code="DOCUMENTS_VIEW",
        role__name__in=["GovDeputyDirector", "GovDirector"]
    ).delete()

    # Compliance Manager
    role_permission.objects.using(db_alias).filter(
        permission__code__in=[
            "LOGIN", "VIEW_CREDIT_TRANSFERS", "ADD_COMMENT", "FUEL_CODES_VIEW",
            "PROPOSE_CREDIT_TRANSFER", "CREDIT_CALCULATION_MANAGE",
            "FUEL_CODES_MANAGE", "EDIT_PRIVILEGED_COMMENTS",
            "DOCUMENTS_LINK_TO_CREDIT_TRADE", "EDIT_FUEL_SUPPLIERS",
            "RECOMMEND_CREDIT_TRANSFER", "RESCIND_CREDIT_TRANSFER",
            "DOCUMENTS_GOVERNMENT_REVIEW", "USE_HISTORICAL_DATA_ENTRY",
            "CREDIT_CALCULATION_VIEW", "DOCUMENTS_VIEW", "VIEW_FUEL_SUPPLIERS"
            "VIEW_PRIVILEGED_COMMENTS", "VIEW_APPROVED_CREDIT_TRANSFERS"
        ],
        role__name="GovComplianceManager"
    ).delete()


class Migration(migrations.Migration):
    """
    Attaches the functions for the migrations
    """
    dependencies = [
        ('api', '0187_auto_20190923_1556'),
    ]

    operations = [
        RunPython(
            add_permissions,
            remove_permissions
        )
    ]
