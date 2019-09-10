from django.db import connection, migrations
from django.db.migrations import RunPython


def update_status_column_to_50(apps, schema_editor):
    """
    Updates the length of various status columns to 50
    """
    with connection.cursor() as cursor:
        cursor.execute("ALTER TABLE compliance_report_workflow_state ALTER COLUMN analyst_status_id TYPE varchar(50);")
        cursor.execute("ALTER TABLE compliance_report_workflow_state ALTER COLUMN director_status_id TYPE varchar(50);")
        cursor.execute("ALTER TABLE compliance_report_workflow_state ALTER COLUMN fuel_supplier_status_id TYPE varchar(50);")
        cursor.execute("ALTER TABLE compliance_report_workflow_state ALTER COLUMN manager_status_id TYPE varchar(50);")


def update_status_column_to_25(apps, schema_editor):
    """
    Reduces the length the various status columns back to 25
    """
    with connection.cursor() as cursor:
        cursor.execute("ALTER TABLE compliance_report_workflow_state ALTER COLUMN analyst_status_id TYPE varchar(25);")
        cursor.execute("ALTER TABLE compliance_report_workflow_state ALTER COLUMN director_status_id TYPE varchar(25);")
        cursor.execute("ALTER TABLE compliance_report_workflow_state ALTER COLUMN fuel_supplier_status_id TYPE varchar(25);")
        cursor.execute("ALTER TABLE compliance_report_workflow_state ALTER COLUMN manager_status_id TYPE varchar(25);")


class Migration(migrations.Migration):
    """
    Attaches the functions for the migrations
    """
    dependencies = [
        ('api', '0185_add_request_supplemental_report_status'),
    ]

    operations = [
        RunPython(
            update_status_column_to_50,
            update_status_column_to_25
        ),
    ]
