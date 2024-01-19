import logging
from django.db import migrations, transaction

def update_credit_trade_history(apps, schema_editor):
    """
    Update transfer ID #2095 to correct compliance period to the year 2023 (compliance_period_id=13)
    from the previous year 2022 (compliance_period_id=12)
    
    If any record is not updated, all changes are reverted.
    """
    credit_trade_history = apps.get_model('api', 'CreditTradeHistory')
    new_compliance_period_id = 13

    # IDs of the CreditTradeHistory records to update
    history_ids = [978, 979]

    with transaction.atomic():
        for history_id in history_ids:
            try:
                history = credit_trade_history.objects.get(id=history_id)
                history.compliance_period_id = new_compliance_period_id
                history.save()
            except credit_trade_history.DoesNotExist:
                logging.warning(
                    'Failed to update CreditTradeHistory: No entry found with id "%s"; '
                    'all changes within this transaction will be reverted.',
                    history_id
                )

class Migration(migrations.Migration):
    """
    Attaches the update function to the migration operations
    """
    dependencies = [
        ('api', '0020_correct_effective_date_of_transfer_2095'),
    ]

    operations = [
        migrations.RunPython(update_credit_trade_history, reverse_code=migrations.RunPython.noop),
    ]
