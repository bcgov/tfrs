from django.db import migrations

update_trade_effective_dates = """
          UPDATE credit_trade ct
          SET trade_effective_date = ct.update_timestamp
          FROM credit_trade_history cth, 
              (SELECT id FROM credit_trade_status WHERE status = 'Approved') as cts
          WHERE ct.id = cth.credit_trade_id
              AND ct.trade_effective_date IS NULL
              AND ct.type_id IN (1, 2)
              AND ct.is_rescinded = false
              AND cth.status_id = cts.id;
        """

class Migration(migrations.Migration):
    dependencies = [
        ('api', '0021_correct_effective_date_of_transfer_2095'),
    ]

    operations = [
        migrations.RunSQL(update_trade_effective_dates),
    ]
