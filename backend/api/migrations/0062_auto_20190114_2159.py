# -*- coding: utf-8 -*-
# Generated by Django 1.11.13 on 2019-01-14 21:59
from __future__ import unicode_literals

import db_comments.model_mixins
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0061_auto_20190110_2139'),
    ]

    operations = [
        migrations.CreateModel(
            name='DocumentMilestone',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('create_timestamp', models.DateTimeField(auto_now_add=True, null=True)),
                ('update_timestamp', models.DateTimeField(auto_now=True, null=True)),
                ('agreement_name', models.CharField(blank=True, max_length=1000, null=True)),
                ('milestone', models.CharField(blank=True, max_length=1000, null=True)),
                ('create_user', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='api_documentmilestone_CREATE_USER', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'document_milestone',
            },
            bases=(models.Model, db_comments.model_mixins.DBComments),
        ),
        migrations.AddField(
            model_name='document',
            name='record_number',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='documenthistory',
            name='record_number',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='documentmilestone',
            name='document',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='milestones', to='api.Document'),
        ),
        migrations.AddField(
            model_name='documentmilestone',
            name='update_user',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='api_documentmilestone_UPDATE_USER', to=settings.AUTH_USER_MODEL),
        ),
    ]
