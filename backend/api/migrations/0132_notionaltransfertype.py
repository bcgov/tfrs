# -*- coding: utf-8 -*-
# Generated by Django 1.11.20 on 2019-05-29 16:18
from __future__ import unicode_literals

import db_comments.model_mixins
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0131_autosavedformdata_last_access'),
    ]

    operations = [
        migrations.CreateModel(
            name='NotionalTransferType',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('create_timestamp', models.DateTimeField(auto_now_add=True, null=True)),
                ('update_timestamp', models.DateTimeField(auto_now=True, null=True)),
                ('display_order', models.IntegerField()),
                ('effective_date', models.DateField(blank=True, null=True)),
                ('expiration_date', models.DateField(blank=True, null=True)),
                ('the_type', models.CharField(max_length=25, unique=True)),
                ('create_user', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='api_notionaltransfertype_CREATE_USER', to=settings.AUTH_USER_MODEL)),
                ('update_user', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='api_notionaltransfertype_UPDATE_USER', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'notional_transfer_type',
            },
            bases=(models.Model, db_comments.model_mixins.DBComments),
        ),
    ]
