from django.db import migrations
from django.db.migrations import RunPython


def add_comment_permission(apps, schema_editor):
    """
    Adds the Add Comment permission and attach it to all roles
    except FSNoAccess
    """
    db_alias = schema_editor.connection.alias

    # By retrieving the models via apps.get_model, we get one appropriately
    # versioned for this migration (so this shouldn't ever need to be
    # maintained if fields change)
    permission = apps.get_model(
        'api', 'Permission')
    role = apps.get_model('api', 'Role')
    role_permission = apps.get_model('api', 'RolePermission')

    comment_permission = permission.objects.using(db_alias).create(
        code="ADD_COMMENT",
        name="Add Comment",
        description="The ability to add comments to credit transactions "
                    "(Credit Transfer Proposal, Part 3 Award, Validation, "
                    "and Reduction)."
    )

    role_permissions = []

    roles = role.objects.using(db_alias).filter(name__in=[
        "Admin", "FSAdmin", "FSDoc", "FSDocSubmit", "FSManager",
        "GovDeputyDirector", "GovDirector", "GovUser"
    ])

    for role in roles:
        role_permissions.append(
            role_permission(
                role=role,
                permission=comment_permission
            )
        )

    role_permission.objects.using(db_alias).bulk_create(role_permissions)


def remove_comment_permission(apps, schema_editor):
    """
    Removes the Add Comment permission and all its links to the roles
    """
    db_alias = schema_editor.connection.alias

    # By retrieving the models via apps.get_model, we get one appropriately
    # versioned for this migration (so this shouldn't ever need to be
    # maintained if fields change)
    permission = apps.get_model(
        'api', 'Permission')
    role = apps.get_model('api', 'Role')
    role_permission = apps.get_model('api', 'RolePermission')

    role_permission.objects.using(db_alias).filter(
        permission=permission.objects.using(db_alias).get(code="ADD_COMMENT")
    ).delete()

    permission.objects.using(db_alias).filter(
        code="ADD_COMMENT"
    ).delete()


class Migration(migrations.Migration):
    """
    Attaches the functions for the migrations
    """
    dependencies = [
        ('api', '0058_auto_20190103_2258'),
    ]

    operations = [
        RunPython(add_comment_permission,
                  remove_comment_permission)
    ]
