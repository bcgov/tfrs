# -*- coding: utf-8 -*-
# Generated by Django 1.11.21 on 2019-07-16 20:18
from __future__ import unicode_literals

from decimal import Decimal
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0157_credittradecomment_is_deleted'),
    ]

    operations = [
        migrations.AlterField(
            model_name='scheduledsheetoutput',
            name='intensity',
            field=models.DecimalField(blank=True, decimal_places=50, default=Decimal('0.00'), max_digits=100, null=True),
        ),
    ]
