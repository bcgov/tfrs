import logging
from django.db import migrations, transaction
from django.utils import timezone

def update_transfer_effective_date(apps, schema_editor):
    """
    Update transfer ID #2095 to correct effective date from March 30, 2022 to March 30, 2023.
    If any record is not updated, all changes are reverted.
    """
    credit_trade_history = apps.get_model('api', 'CreditTradeHistory')
    new_trade_effective_date = timezone.datetime.strptime('2023-03-30', "%Y-%m-%d").date()

    # IDs of the CreditTradeHistory records to update
    history_ids = [4666, 4709]

    with transaction.atomic():
        for history_id in history_ids:
            try:
                history = credit_trade_history.objects.get(id=history_id)
                history.trade_effective_date = new_trade_effective_date
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
        ('api', '0019_update_signing_authority_declaration_statement'),
    ]

    operations = [
        migrations.RunPython(update_transfer_effective_date, reverse_code=migrations.RunPython.noop),
    ]
