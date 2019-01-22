# -*- coding: utf-8 -*-
# Generated by Django 1.11.13 on 2019-01-22 21:26
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0070_rename_document_upload'),
    ]

    operations = [
        migrations.AddField(
            model_name='notificationmessage',
            name='related_document',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, to='api.Document'),
        ),
    ]
