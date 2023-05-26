# Generated by Django 3.2.19 on 2023-05-23 22:37

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0207_alter_notificationsubscription_notification_type'),
    ]

    operations = [
        migrations.AddField(
            model_name='compliancereport',
            name='latest_report',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='latest_reports', to='api.compliancereport'),
        ),
        migrations.AddField(
            model_name='compliancereport',
            name='root_report',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='root_reports', to='api.compliancereport'),
        ),
        migrations.AddField(
            model_name='compliancereport',
            name='traversal',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='compliancereport',
            name='compliance_period',
            field=models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, related_name='+', to='api.complianceperiod'),
        ),
        migrations.AlterField(
            model_name='compliancereport',
            name='credit_transaction',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='compliance_report_credit_trxns', to='api.credittrade'),
        ),
        migrations.AlterField(
            model_name='compliancereport',
            name='exclusion_agreement',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='compliance_report_exclusion_agreements', to='api.exclusionagreement'),
        ),
        migrations.AlterField(
            model_name='compliancereport',
            name='organization',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='compliance_report_organizations', to='api.organization'),
        ),
        migrations.AlterField(
            model_name='compliancereport',
            name='schedule_a',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='compliance_report_schedule_a', to='api.schedulea'),
        ),
        migrations.AlterField(
            model_name='compliancereport',
            name='schedule_b',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='compliance_report_schedule_b', to='api.scheduleb'),
        ),
        migrations.AlterField(
            model_name='compliancereport',
            name='schedule_c',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='compliance_report_schedule_c', to='api.schedulec'),
        ),
        migrations.AlterField(
            model_name='compliancereport',
            name='schedule_d',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='compliance_report_schedule_d', to='api.scheduled'),
        ),
        migrations.AlterField(
            model_name='compliancereport',
            name='status',
            field=models.OneToOneField(on_delete=django.db.models.deletion.PROTECT, related_name='compliance_report_status', to='api.compliancereportworkflowstate'),
        ),
        migrations.AlterField(
            model_name='compliancereport',
            name='summary',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='compliance_report_summaries', to='api.schedulesummary'),
        ),
        migrations.AlterField(
            model_name='compliancereport',
            name='type',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='+', to='api.compliancereporttype'),
        ),
        migrations.AlterField(
            model_name='compliancereportsnapshot',
            name='compliance_report',
            field=models.OneToOneField(on_delete=django.db.models.deletion.DO_NOTHING, related_name='compliance_report_snapshot', to='api.compliancereport'),
        ),
        migrations.AlterField(
            model_name='credittrade',
            name='compliance_period',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='+', to='api.complianceperiod'),
        ),
        migrations.AlterField(
            model_name='credittrade',
            name='documents',
            field=models.ManyToManyField(related_name='credit_trade_documents', through='api.DocumentCreditTrade', to='api.Document'),
        ),
        migrations.AlterField(
            model_name='credittrade',
            name='status',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='+', to='api.credittradestatus'),
        ),
        migrations.AlterField(
            model_name='credittrade',
            name='type',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='+', to='api.credittradetype'),
        ),
        migrations.AlterField(
            model_name='credittrade',
            name='zero_reason',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='+', to='api.credittradezeroreason'),
        ),
        migrations.AlterField(
            model_name='organization',
            name='actions_type',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='+', to='api.organizationactionstype'),
        ),
        migrations.AlterField(
            model_name='organization',
            name='status',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='+', to='api.organizationstatus'),
        ),
        migrations.AlterField(
            model_name='organization',
            name='type',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='+', to='api.organizationtype'),
        ),
    ]
