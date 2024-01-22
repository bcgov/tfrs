from django.db import migrations, models, connection

class Migration(migrations.Migration):

    dependencies = [
        ('api', '0017_alter_credittrade_number_of_credits'),
    ]
    # apply migration only to test database
    if connection.settings_dict['NAME'] == 'test_tfrs':
        operations = [
            migrations.RemoveField(
                model_name='compliancereporthistory',
                name='status'
            ),
            migrations.AddField(
                model_name='compliancereporthistory',
                name='status',
                field=models.ForeignKey(on_delete=models.deletion.PROTECT, related_name='history_records', to='api.compliancereportworkflowstate'),
            ),
        ]
