from collections import namedtuple

from django.db import migrations, connection
from django.db.migrations import RunPython


def add_autocomplete_indices(apps, schema_editor):
    """
    Add the postgresql indices for faster autocompletion
    """
    if schema_editor.connection.vendor != 'postgresql':
        return

    Index = namedtuple('Index', [
        'index_name',
        'table',
        'column'
    ])

    indices = [
        Index('idx_autocomplete_company', 'fuel_code', 'company'),
        Index('idx_autocomplete_former_company', 'fuel_code', 'former_company'),
        Index('idx_autocomplete_feedstock', 'fuel_code', 'feedstock'),
        Index('idx_autocomplete_feedstock_location', 'fuel_code', 'feedstock_location'),
        Index('idx_autocomplete_feedstock_misc', 'fuel_code', 'feedstock_misc')
    ]

    with schema_editor.connection.cursor() as cursor:
        for index in indices:
            cursor.execute("create index {index_name} on {table} USING GIST ({column} gist_trgm_ops)"
                           .format(table=index.table,
                                   column=index.column,
                                   index_name=index.index_name))


class Migration(migrations.Migration):
    """
    Attaches the functions for the migrations
    """
    dependencies = [
        ('api', '0091_add_trgm_extension'),
    ]

    operations = [
        RunPython(
            add_autocomplete_indices,
            reverse_code=None
        )
    ]
