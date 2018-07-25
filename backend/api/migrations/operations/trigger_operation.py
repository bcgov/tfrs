import logging

from django.db.migrations.operations.base import Operation


class AuditTable(Operation):
    """Enable auditing for a given table. Reversible."""

    reversible = True

    def __init__(self, table):
        self.table = table

    def state_forwards(self, app_label, state):
        pass

    def database_forwards(self, app_label, schema_editor, from_state, to_state):

        if schema_editor.connection.vendor != 'postgresql':
            return

        schema_editor.execute('select tfrs_audit.audit_table(\'{}\');'.format(self.table))
        logging.debug('installed audit trigger for {}'.format(self.table))

    def database_backwards(self, app_label, schema_editor, from_state, to_state):
        if schema_editor.connection.vendor != 'postgresql':
            return

        schema_editor.execute('DROP TRIGGER audit_trigger_row ON "{}";'.format(self.table))
        schema_editor.execute('DROP TRIGGER audit_trigger_stm ON "{}";'.format(self.table))

    def describe(self):
        return 'Enables Postgres auditing for table {}'.format(self.table)

class UnAuditTable(Operation):
    """Drop auditing for a given table (eg if no longer required)"""

    reversible = False

    def __init__(self, table):
        self.table = table

    def state_forwards(self, app_label, state):
        pass

    def database_forwards(self, app_label, schema_editor, from_state, to_state):
        if schema_editor.connection.vendor != 'postgresql':
            return

        schema_editor.execute('DROP TRIGGER audit_trigger_row ON "{}";'.format(self.table))
        schema_editor.execute('DROP TRIGGER audit_trigger_stm ON "{}";'.format(self.table))
        logging.debug('dropped audit trigger for {}'.format(self.table))

    def database_backwards(self, app_label, schema_editor, from_state, to_state):
        pass

    def describe(self):
        return 'Disables Postgres auditing for table {}'.format(self.table)

