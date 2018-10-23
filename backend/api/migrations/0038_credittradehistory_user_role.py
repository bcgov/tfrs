# -*- coding: utf-8 -*-
# Generated by Django 1.11.13 on 2018-10-17 21:54
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0037_add_deputy_director_role'),
    ]

    operations = [
        migrations.AddField(
            model_name='credittradehistory',
            name='user_role',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='roles', to='api.Role'),
        ),
    ]
