# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2018-06-15 21:09
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    replaces = [(b'api', '0012_credittradecomment'), (b'api', '0013_auto_20180613_2318'), (b'api', '0014_auto_20180613_2324')]

    dependencies = [
        ('api', '0011_auto_20180613_1848'),
    ]

    operations = [
        migrations.CreateModel(
            name='CreditTradeComment',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('create_timestamp', models.DateTimeField(auto_now_add=True, null=True)),
                ('update_timestamp', models.DateTimeField(auto_now=True, null=True)),
                ('comment', models.CharField(blank=True, max_length=4000, null=True)),
                ('create_user', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='api_credittradecomment_CREATE_USER', to=settings.AUTH_USER_MODEL)),
                ('credit_trade', models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, related_name='credit_trade_comments', to='api.CreditTrade')),
                ('update_user', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='api_credittradecomment_UPDATE_USER', to=settings.AUTH_USER_MODEL)),
                ('privileged_access', models.BooleanField(default=True)),
            ],
            options={
                'ordering': ['create_timestamp'],
                'db_table': 'credit_trade_comment',
            },
        ),
    ]
