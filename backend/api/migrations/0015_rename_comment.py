# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2018-06-22 17:21
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0014_credittradecomment'),
    ]

    operations = [
        migrations.AlterField(
            model_name='credittradecomment',
            name='comment',
            field=models.CharField(blank=True, db_column='credit_trade_comment', max_length=4000, null=True),
        ),
    ]
