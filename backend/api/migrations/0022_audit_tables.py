from django.db import migrations

from api.migrations.operations.trigger_operation import AuditTable


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0021_audit_triggers'),
    ]

    _tables = ['credit_trade',
               'credit_trade_comment',
               'credit_trade_history',
               'organization',
               'organization_balance',
               'user_role',
               'user',
               'signing_authority_confirmation'
               ]

    operations = [AuditTable(table) for table in _tables]
