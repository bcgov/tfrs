from django.db import migrations
from django.db.migrations import RunPython


def add_compliance_period_permission(apps, schema_editor):
    """
    Adds the View Compliance Period permission to FSDoc and FSDocSubmit roles
    """
    db_alias = schema_editor.connection.alias

    # By retrieving the models via apps.get_model, we get one appropriately
    # versioned for this migration (so this shouldn't ever need to be
    # maintained if fields change)
    role = apps.get_model('api', 'Role')
    role_permission = apps.get_model('api', 'RolePermission')
    permission = apps.get_model('api', 'Permission')

    compliance_period_permission = permission.objects.get(code='VIEW_COMPLIANCE_PERIODS')

    role_permissions = []

    roles = role.objects.using(db_alias).filter(name__in=[
       "FSDoc", "FSDocSubmit"
    ])

    for role in roles:
        role_permissions.append(
            role_permission(
                role=role,
                permission=compliance_period_permission
            )
        )

    role_permission.objects.using(db_alias).bulk_create(role_permissions)


class Migration(migrations.Migration):
    """
    Attaches the functions for the migrations
    """
    dependencies = [
        ('api', '0059_comment_permissions'),
    ]

    operations = [
        RunPython(add_compliance_period_permission,
                  None)
    ]
