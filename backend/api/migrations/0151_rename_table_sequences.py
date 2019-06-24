from django.db import connection, migrations
from django.db.migrations import RunPython


def rename_table_sequences(_apps, schema_editor):
    """
    Renames the table sequences so they match what the name of the actual
    tables are
    """
    if connection.vendor == 'postgresql':
        schema_editor.execute(
            'ALTER SEQUENCE carbon_intensity_determination_type_id_seq '
            'RENAME TO determination_type_id_seq;'
        )

        schema_editor.execute(
            'ALTER SEQUENCE approved_fuel_provision_id_seq '
            'RENAME TO carbon_intensity_fuel_determination_id_seq;'
        )

        schema_editor.execute(
            'ALTER SEQUENCE approved_fuel_id_seq '
            'RENAME TO approved_fuel_type_id_seq;'
        )

        schema_editor.execute(
            'ALTER SEQUENCE fuel_transport_mode_id_seq '
            'RENAME TO fuel_transport_mode_type_id_seq;'
        )

        schema_editor.execute(
            'ALTER SEQUENCE fuel_provisions_id_seq '
            'RENAME TO provision_act_id_seq;'
        )


def revert_table_seuqneces(_apps, schema_editor):
    """
    Reverts the changes
    """
    if connection.vendor == 'postgresql':
        schema_editor.execute(
            'ALTER SEQUENCE determination_type_id_seq '
            'RENAME TO carbon_intensity_determination_type_id_seq;'
        )

        schema_editor.execute(
            'ALTER SEQUENCE carbon_intensity_fuel_determination_id_seq '
            'RENAME TO approved_fuel_provision_id_seq;'
        )

        schema_editor.execute(
            'ALTER SEQUENCE approved_fuel_type_id_seq '
            'RENAME TO approved_fuel_id_seq;'
        )

        schema_editor.execute(
            'ALTER SEQUENCE fuel_transport_mode_type_id_seq '
            'RENAME TO fuel_transport_mode_id_seq;'
        )

        schema_editor.execute(
            'ALTER SEQUENCE provision_act_id_seq '
            'RENAME TO fuel_provisions_id_seq;'
        )


class Migration(migrations.Migration):
    """
    Attaches the functions for the migrations
    """
    dependencies = [
        ('api', '0150_auto_20190619_1733'),
    ]

    operations = [
        RunPython(
            rename_table_sequences,
            revert_table_seuqneces
        )
    ]
