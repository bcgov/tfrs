# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('server', '0011_merge'),
    ]

    operations = [
        migrations.CreateModel(
            name='CreditTradeZeroReason',
            fields=[
                ('id', models.AutoField(verbose_name='ID', primary_key=True, serialize=False, auto_created=True)),
                ('CREATE_TIMESTAMP', models.DateTimeField(null=True, auto_now_add=True)),
                ('UPDATE_TIMESTAMP', models.DateTimeField(null=True, auto_now=True)),
                ('reason', models.CharField(max_length=25)),
                ('description', models.CharField(max_length=1000)),
                ('effectiveDate', models.DateField()),
                ('expirationDate', models.DateField(blank=True, null=True)),
                ('displayOrder', models.IntegerField()),
                ('CREATE_USER', models.ForeignKey(blank=True, null=True, related_name='server_credittradezeroreason_CREATE_USER', to='server.User')),
                ('UPDATE_USER', models.ForeignKey(blank=True, null=True, related_name='server_credittradezeroreason_UPDATE_USER', to='server.User')),
            ],
            options={
                'db_table': 'CREDIT_TRADE_ZERO_REASON',
            },
        ),
        migrations.RemoveField(
            model_name='fuelsuppliertype',
            name='CREATE_USER',
        ),
        migrations.RemoveField(
            model_name='fuelsuppliertype',
            name='UPDATE_USER',
        ),
        migrations.RemoveField(
            model_name='opportunity',
            name='CREATE_USER',
        ),
        migrations.RemoveField(
            model_name='opportunity',
            name='UPDATE_USER',
        ),
        migrations.RemoveField(
            model_name='opportunity',
            name='creditTradeTypeFK',
        ),
        migrations.RemoveField(
            model_name='opportunity',
            name='creditTradesSet',
        ),
        migrations.RemoveField(
            model_name='opportunity',
            name='fuelSupplierFK',
        ),
        migrations.RemoveField(
            model_name='opportunity',
            name='fuelSupplierTypeFK',
        ),
        migrations.RemoveField(
            model_name='opportunity',
            name='opportunityStatusFK',
        ),
        migrations.RemoveField(
            model_name='opportunityhistory',
            name='CREATE_USER',
        ),
        migrations.RemoveField(
            model_name='opportunityhistory',
            name='UPDATE_USER',
        ),
        migrations.RemoveField(
            model_name='opportunityhistory',
            name='creditTradeTypeFK',
        ),
        migrations.RemoveField(
            model_name='opportunityhistory',
            name='fuelSupplierTypeFK',
        ),
        migrations.RemoveField(
            model_name='opportunityhistory',
            name='opportunityFK',
        ),
        migrations.RemoveField(
            model_name='opportunityhistory',
            name='userFK',
        ),
        migrations.RemoveField(
            model_name='opportunitystatus',
            name='CREATE_USER',
        ),
        migrations.RemoveField(
            model_name='opportunitystatus',
            name='UPDATE_USER',
        ),
        migrations.RemoveField(
            model_name='credittrade',
            name='historySet',
        ),
        migrations.RemoveField(
            model_name='credittrade',
            name='plainEnglishPhrase',
        ),
        migrations.RemoveField(
            model_name='fuelsupplier',
            name='fuelSupplierTypeFK',
        ),
        migrations.RemoveField(
            model_name='fuelsupplierbalance',
            name='encumberedCredits',
        ),
        migrations.RemoveField(
            model_name='notificationevent',
            name='opportunityFK',
        ),
        migrations.AddField(
            model_name='credittradehistory',
            name='creditTradeFK',
            field=models.ForeignKey(null=True, related_name='CreditTradeHistorycreditTradeFK', to='server.CreditTrade'),
        ),
        migrations.DeleteModel(
            name='FuelSupplierType',
        ),
        migrations.DeleteModel(
            name='Opportunity',
        ),
        migrations.DeleteModel(
            name='OpportunityHistory',
        ),
        migrations.DeleteModel(
            name='OpportunityStatus',
        ),
        migrations.AddField(
            model_name='credittrade',
            name='creditTradeZeroReasonFK',
            field=models.ForeignKey(blank=True, null=True, related_name='CreditTradecreditTradeZeroReasonFK', to='server.CreditTradeZeroReason'),
        ),
    ]
