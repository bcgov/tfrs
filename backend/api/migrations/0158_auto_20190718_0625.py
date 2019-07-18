# -*- coding: utf-8 -*-
# Generated by Django 1.11.21 on 2019-07-18 06:25
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0157_credittradecomment_is_deleted'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='schedulearecord',
            options={'ordering': ['id']},
        ),
        migrations.AlterModelOptions(
            name='schedulebrecord',
            options={'ordering': ['id']},
        ),
        migrations.AlterModelOptions(
            name='schedulecrecord',
            options={'ordering': ['id']},
        ),
        migrations.AlterModelOptions(
            name='scheduledsheet',
            options={'ordering': ['id']},
        ),
        migrations.AlterModelOptions(
            name='scheduledsheetinput',
            options={'ordering': ['id']},
        ),
        migrations.AddField(
            model_name='schedulebrecord',
            name='intensity',
            field=models.DecimalField(blank=True, decimal_places=2, default=None, max_digits=5, null=True),
        ),
        migrations.AddField(
            model_name='schedulebrecord',
            name='schedule_d_sheet_index',
            field=models.IntegerField(default=None, null=True),
        ),
    ]
