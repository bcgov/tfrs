from django.db import migrations
from django.db.migrations import RunPython


def set_default_role(apps, schema_editor):
    """
    Set FSNoAccess (Guest) as a default role
    """
    db_alias = schema_editor.connection.alias

    role = apps.get_model('api', 'Role')

    guest_role = role.objects.using(db_alias).get(name="FSNoAccess")

    guest_role.default_role = True
    guest_role.save()


def remove_default_role(apps, schema_editor):
    """
    Unflag all default roles
    """
    db_alias = schema_editor.connection.alias

    role_model = apps.get_model('api', 'Role')
    default_roles = role_model.objects.using(db_alias).filter(
        default_role=True
    )

    for role in default_roles:
        role.default_role = False
        role.save()


class Migration(migrations.Migration):
    """
    Attaches the functions for the migrations
    """
    dependencies = [
        ('api', '0191_role_default_role'),
    ]

    operations = [
        RunPython(
            set_default_role,
            remove_default_role
        )
    ]
