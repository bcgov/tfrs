from django.db import migrations

def delete_user_role(apps, schema_editor):
    """Deletes UserRole objects filtered by user_id=1636."""
    db_alias = schema_editor.connection.alias
    model = apps.get_model("api", "UserRole")
    model.objects.using(db_alias).filter(user_id=1636).delete()

def delete_user_creation_request(apps, schema_editor):
    """Deletes UserCreationRequest objects filtered by user_id=1636."""
    db_alias = schema_editor.connection.alias
    model = apps.get_model("api", "UserCreationRequest")
    model.objects.using(db_alias).filter(user_id=1636).delete()

def delete_user(apps, schema_editor):
    """Deletes User objects filtered by user_id=1636."""
    db_alias = schema_editor.connection.alias
    model = apps.get_model("api", "User")
    model.objects.using(db_alias).filter(id=1636).delete()

class Migration(migrations.Migration):
    """
    Defines migration dependencies and operations for deleting user data.
    """
    dependencies = [
        ('api', '0022_update_trade_effective_dates'),
    ]

    operations = [
        migrations.RunPython(delete_user_role),
        migrations.RunPython(delete_user_creation_request),
        migrations.RunPython(delete_user),
    ]
