# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2018-06-19 17:57
from __future__ import unicode_literals

import django.core.validators
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0013_auto_20180619_2053'),
    ]

    operations = [
        migrations.AlterField(
            model_name='credittradecomment',
            name='credit_trade',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='credit_trade_comments', to='api.CreditTrade'),
        )
    ]
