from django.db import migrations
from django.db.migrations import RunPython


def add_director_compliance_report_permissions(apps, schema_editor):
    """
    Adds the Approve, Reject and View Compliance Reports to
    director positions
    """
    db_alias = schema_editor.connection.alias

    permission = apps.get_model(
        'api', 'Permission')
    role = apps.get_model('api', 'Role')
    role_permission = apps.get_model('api', 'RolePermission')

    approve_permission = permission.objects.using(db_alias).create(
        code="APPROVE_COMPLIANCE_REPORT",
        name="Approve Compliance Report",
        description="The ability to make a statuatory decision by approving "
                    "a compliance report"
    )

    reject_permission = permission.objects.using(db_alias).create(
        code="REJECT_COMPLIANCE_REPORT",
        name="Reject Compliance Report",
        description="The ability to make a statuatory decision by rejecting "
                    "a compliance report"
    )

    view_permission = permission.objects.using(db_alias).get(
        code="VIEW_COMPLIANCE_REPORT"
    )

    roles = role.objects.using(db_alias).filter(
        name__in=["GovDirector", "GovDeputyDirector"]
    )

    role_permissions = []

    for role in roles:
        role_permissions.append(
            role_permission(
                role=role,
                permission=approve_permission
            )
        )

        role_permissions.append(
            role_permission(
                role=role,
                permission=reject_permission
            )
        )

        role_permissions.append(
            role_permission(
                role=role,
                permission=view_permission
            )
        )

    role_permission.objects.using(db_alias).bulk_create(role_permissions)


def remove_director_compliance_report_permissions(apps, schema_editor):
    """
    Removes the Approve, Reject and View Compliance Reports from
    director positions
    """
    db_alias = schema_editor.connection.alias

    permission = apps.get_model('api', 'Permission')
    role_permission = apps.get_model('api', 'RolePermission')

    role_permission.objects.using(db_alias).filter(
        permission__code__in=[
            "APPROVE_COMPLIANCE_REPORT",
            "REJECT_COMPLIANCE_REPORT",
            "VIEW_COMPLIANCE_REPORT"
        ],
        role__name__in=["GovDirector", "GovDeputyDirector"]
    ).delete()

    permission.objects.using(db_alias).filter(
        code__in=["APPROVE_COMPLIANCE_REPORT", "REJECT_COMPLIANCE_REPORT"]
    ).delete()


class Migration(migrations.Migration):
    """
    Attaches the functions for the migrations
    """
    dependencies = [
        ('api', '0179_db_column_adjustments_for_compliance_reporting'),
    ]

    operations = [
        RunPython(
            add_director_compliance_report_permissions,
            remove_director_compliance_report_permissions
        )
    ]
