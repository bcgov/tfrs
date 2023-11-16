import logging
from django.db import migrations, transaction
from django.utils import timezone

def update_expiration_dates(apps, schema_editor):
    """
    Sets new expiration dates for specific SigningAuthorityAssertion records
    If any record is not updated, all changes are reverted.
    """
    signing_authority_assertion = apps.get_model('api', 'SigningAuthorityAssertion')
    new_expiration_date = timezone.datetime.strptime('2023-11-06', "%Y-%m-%d").date()

    # IDs of the SigningAuthorityAssertion records to update
    assertion_ids = [2, 3]

    with transaction.atomic():
        for assertion_id in assertion_ids:
            try:
                assertion = signing_authority_assertion.objects.get(id=assertion_id)
                assertion.expiration_date = new_expiration_date
                assertion.save()
            except signing_authority_assertion.DoesNotExist:
                logging.warning(
                    'Failed to update SigningAuthorityAssertion: No entry found with id "%s"; '
                    'all changes within this transaction will be reverted.',
                    assertion_id
                )

class Migration(migrations.Migration):
    """
    Attaches the update function to the migration operations
    """
    dependencies = [
        ('api', '0011_credit_trade_category'),
    ]

    operations = [
        migrations.RunPython(update_expiration_dates),
    ]
