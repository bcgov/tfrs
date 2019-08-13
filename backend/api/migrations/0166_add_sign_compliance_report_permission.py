from django.db import migrations
from django.db.migrations import RunPython


def add_compliance_report_signing_permission(apps, schema_editor):
    """
    Adds the signing compliance report permission and attaches it to
    the Signing Authority role
    """
    db_alias = schema_editor.connection.alias

    permission = apps.get_model(
        'api', 'Permission')
    role = apps.get_model('api', 'Role')
    role_permission = apps.get_model('api', 'RolePermission')

    signing_permission = permission.objects.using(db_alias).create(
        code="SIGN_COMPLIANCE_REPORT",
        name="Sign a Compliance Report",
        description="The ability to sign and execute a Credit Transfer "
                    "Proposal."
    )

    role_permission.objects.create(
        role=role.objects.get(name="FSManager"),
        permission=signing_permission
    )


def remove_compliance_report_signing_permission(apps, schema_editor):
    """
    Removes the signing compliance report permission and removes it
    from the role
    """
    db_alias = schema_editor.connection.alias

    permission = apps.get_model('api', 'Permission')
    role_permission = apps.get_model('api', 'RolePermission')

    signing_permission = permission.objects.using(db_alias).filter(
        code="SIGN_COMPLIANCE_REPORT"
    ).first()

    if signing_permission:
        role_permission.objects.filter(
            permission_id=signing_permission.id
        ).delete()

    signing_permission.delete()


class Migration(migrations.Migration):
    """
    Attaches the functions for the migrations
    """
    dependencies = [
        ('api', '0165_compliance_reporting_manager_role'),
    ]

    operations = [
        RunPython(
            add_compliance_report_signing_permission,
            remove_compliance_report_signing_permission
        )
    ]
