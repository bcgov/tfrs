import logging
from django.db import migrations

def update_sign_auth_assertion(apps, schema_editor):
    """
    Updates the signing authority declaration statement

    Previous label:
    "I confirm that records evidencing each matter reported under section 11.11 (2) of the 
    Regulation are available on request."

    New label:
    "I confirm that records evidencing each matter reported under section 17 of the Low Carbon
    Fuel (General) Regulation are available on request."
    """
    signing_authority_assertion = apps.get_model('api', 'SigningAuthorityAssertion')
    try:
        assertion = signing_authority_assertion.objects.get(id=1)
        assertion.description = (
            'I confirm that records evidencing each matter reported under section 17 '
            'of the Low Carbon Fuel (General) Regulation are available on request.'
        )
        assertion.save()
    except signing_authority_assertion.DoesNotExist:
        logging.error('Failed to update SigningAuthorityAssertion: No entry found with id "1".')

class Migration(migrations.Migration):
    """
    Attaches the update function to the migration operations
    """
    dependencies = [
        ('api', '0011_report_history_grouping'),
    ]

    operations = [
        migrations.RunPython(update_sign_auth_assertion),
    ]
