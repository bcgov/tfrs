# -*- coding: utf-8 -*-
# Generated by Django 1.11.21 on 2019-08-27 16:08
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0178_documentfileattachment_scan_resubmit_ttl'),
    ]

    operations = [
        migrations.AlterField(
            model_name='compliancereportstatus',
            name='status',
            field=models.CharField(blank=True, max_length=25, unique=True),
        ),
    ]
