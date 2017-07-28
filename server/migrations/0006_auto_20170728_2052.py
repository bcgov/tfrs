# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('server', '0005_auto_20170501_1354'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='fuelSupplier',
        ),
        migrations.AddField(
            model_name='note',
            name='CREATE_TIMESTAMP',
            field=models.DateTimeField(null=True, auto_now_add=True),
        ),
        migrations.AddField(
            model_name='note',
            name='CREATE_USER',
            field=models.ForeignKey(blank=True, null=True, to='server.User', related_name='server_note_CREATE_USER'),
        ),
        migrations.AddField(
            model_name='note',
            name='UPDATE_TIMESTAMP',
            field=models.DateTimeField(auto_now=True, null=True),
        ),
        migrations.AddField(
            model_name='note',
            name='UPDATE_USER',
            field=models.ForeignKey(blank=True, null=True, to='server.User', related_name='server_note_UPDATE_USER'),
        ),
    ]
