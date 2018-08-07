from django.db import migrations

from api.migrations.operations.trigger_operation import AuditTable

def create_table(apps, schema_editor):

    ddl_postgresql = 'create table data_load_operations(id serial4 not null primary key, ' \
                 'script_name varchar(1024) not null, ' \
                 'is_reverting bool not null, ' \
                 'successful bool not null, ' \
                 'comment text, ' \
                 'source_code text, ' \
                 'run_at timestamp without time zone not null);' \
                 'comment on table data_load_operations is \'Maintain a record of calls to the load_ops_data management command\';' \
                 'comment on column data_load_operations.id is \'Primary Key\'; ' \
                     'comment on column data_load_operations.script_name is \'Script file name\'; ' \
                     'comment on column data_load_operations.is_reverting is \'True if this was a run to revert a script\'; ' \
                     'comment on column data_load_operations.successful is \'True if the run completed successfully\'; ' \
                     'comment on column data_load_operations.comment is \'Script comment\'; ' \
                     'comment on column data_load_operations.source_code is \'Python source code for the script\'; '  \
                     'comment on column data_load_operations.run_at is \'The time the script run was started\';'
    
    ddl_sqlite = 'create table data_load_operations(id integer not null primary key autoincrement, ' \
                     'script_name varchar(1024) not null, ' \
                     'is_reverting bool not null, ' \
                     'successful bool not null, ' \
                     'comment text, ' \
                     'source_code text, ' \
                     'run_at timestamp without time zone);'

    sql = {}
    sql['sqlite'] = ddl_sqlite
    sql['postgresql'] = ddl_postgresql

    if schema_editor.connection.vendor not in sql.keys():
        return

    with schema_editor.connection.cursor() as cursor:
        cursor.execute(sql[schema_editor.connection.vendor])


def drop_table(apps, schema_editor):

    if schema_editor.connection.vendor not in ['sqlite', 'postgresql']:
        return

    with schema_editor.connection.cursor() as cursor:
        cursor.execute('drop table data_load_operations;')


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0023_core_data_load'),
    ]

    operations = [
        migrations.RunPython(create_table, drop_table),
        AuditTable('data_load_operations')
    ]
