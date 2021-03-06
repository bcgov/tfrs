# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2018-07-19 16:57
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0019_organizationaddress'),
    ]

    operations = [
        migrations.AddField(
            model_name='credittradecomment',
            name='trade_history_at_creation',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, related_name='credit_trade_comments', to='api.CreditTradeHistory'),
        ),
    ]
