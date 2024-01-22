from django.db import migrations

# Forward operation: Adds the 'Administrative Adjustment' entry
def add_administrative_adjustment(apps, schema_editor):
    CreditTradeType = apps.get_model('api', 'CreditTradeType')
    credit_trade_type = CreditTradeType(
        id=6,
        the_type="Administrative Adjustment",
        description="An administrative adjustment of the number of Fuel Credits owned by a Fuel Supplier initiated by the BC Government.",
        is_gov_only_type=True,
        display_order=6,
        effective_date='2017-01-01',
        expiration_date='2117-01-01'
    )
    credit_trade_type.save()

# Reverse operation: Removes the 'Administrative Adjustment' entry
def remove_administrative_adjustment(apps, schema_editor):
    CreditTradeType = apps.get_model('api', 'CreditTradeType')
    try:
        credit_trade_type = CreditTradeType.objects.get(the_type="Administrative Adjustment")
        credit_trade_type.delete()
    except CreditTradeType.DoesNotExist:
        pass

class Migration(migrations.Migration):

    dependencies = [
        ('api', '0015_new_label_changes'),
    ]

    operations = [
        migrations.RunPython(add_administrative_adjustment, remove_administrative_adjustment)
    ]
