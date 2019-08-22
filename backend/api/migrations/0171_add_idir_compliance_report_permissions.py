from django.db import migrations
from django.db.migrations import RunPython


def add_idir_compliance_report_permissions(apps, schema_editor):
    """
    Adds the Recommend Accept and Recommend Rejection for Government
    Analyst role.
    Adds the Recommend Accept and Recommend Rejection for Compliance
    Manager role (These should be different from the ones above, so we
    can distinguish them).
    """
    db_alias = schema_editor.connection.alias

    permission = apps.get_model(
        'api', 'Permission')
    role = apps.get_model('api', 'Role')
    role_permission = apps.get_model('api', 'RolePermission')

    recommend_acceptance_perm = permission.objects.using(db_alias).create(
        code="ANALYST_RECOMMEND_ACCEPTANCE_COMPLIANCE_REPORT",
        name="Recommend Acceptance",
        description="The ability to recommend approval of a compliance "
                    "report. (This is for Government Analyst)"
    )

    recommend_rejection_perm = permission.objects.using(db_alias).create(
        code="ANALYST_RECOMMEND_REJECTION_COMPLIANCE_REPORT",
        name="Recommend Rejection",
        description="The ability to recommend rejection of a compliance "
                    "report. (This is for Government Analyst)"
    )

    role_analyst = role.objects.using(db_alias).get(name="GovUser")

    role_permissions = []

    role_permissions.append(
        role_permission(
            role=role_analyst,
            permission=recommend_acceptance_perm
        )
    )

    role_permissions.append(
        role_permission(
            role=role_analyst,
            permission=recommend_rejection_perm
        )
    )

    role_permission.objects.using(db_alias).bulk_create(role_permissions)

    recommend_acceptance_perm = permission.objects.using(db_alias).create(
        code="MANAGER_RECOMMEND_ACCEPTANCE_COMPLIANCE_REPORT",
        name="Recommend Acceptance",
        description="The ability to recommend approval of a compliance "
                    "report. (This is for Compliance Manager)"
    )

    recommend_rejection_perm = permission.objects.using(db_alias).create(
        code="MANAGER_RECOMMEND_REJECTION_COMPLIANCE_REPORT",
        name="Recommend Rejection",
        description="The ability to recommend rejection of a compliance "
                    "report. (This is for Compliance Manager)"
    )

    role_manager = role.objects.using(db_alias).get(
        name="GovComplianceManager"
    )

    role_permissions = []

    role_permissions.append(
        role_permission(
            role=role_manager,
            permission=recommend_acceptance_perm
        )
    )

    role_permissions.append(
        role_permission(
            role=role_manager,
            permission=recommend_rejection_perm
        )
    )

    role_permission.objects.using(db_alias).bulk_create(role_permissions)


def remove_idir_compliance_report_permissions(apps, schema_editor):
    """
    Removes the view compliance report permission and removes it
    from the roles that had it
    """
    db_alias = schema_editor.connection.alias

    permission = apps.get_model('api', 'Permission')
    role_permission = apps.get_model('api', 'RolePermission')

    acceptance_permission = permission.objects.using(db_alias).filter(
        code="ANALYST_RECOMMEND_ACCEPTANCE_COMPLIANCE_REPORT"
    ).first()

    if acceptance_permission:
        role_permission.objects.filter(
            permission_id=acceptance_permission.id
        ).delete()

    acceptance_permission.delete()

    rejection_permission = permission.objects.using(db_alias).filter(
        code="ANALYST_RECOMMEND_REJECTION_COMPLIANCE_REPORT"
    ).first()

    if rejection_permission:
        role_permission.objects.filter(
            permission_id=rejection_permission.id
        ).delete()

    rejection_permission.delete()

    acceptance_permission = permission.objects.using(db_alias).filter(
        code="MANAGER_RECOMMEND_ACCEPTANCE_COMPLIANCE_REPORT"
    ).first()

    if acceptance_permission:
        role_permission.objects.filter(
            permission_id=acceptance_permission.id
        ).delete()

    acceptance_permission.delete()

    rejection_permission = permission.objects.using(db_alias).filter(
        code="MANAGER_RECOMMEND_REJECTION_COMPLIANCE_REPORT"
    ).first()

    if rejection_permission:
        role_permission.objects.filter(
            permission_id=rejection_permission.id
        ).delete()

    rejection_permission.delete()


class Migration(migrations.Migration):
    """
    Attaches the functions for the migrations
    """
    dependencies = [
        ('api', '0170_auto_20190819_0126'),
    ]

    operations = [
        RunPython(
            add_idir_compliance_report_permissions,
            remove_idir_compliance_report_permissions
        )
    ]
