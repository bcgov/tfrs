# -*- coding: utf-8 -*-
# Generated by Django 1.11.18 on 2019-02-20 00:14
from __future__ import unicode_literals

import db_comments.model_mixins
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0080_remove_credittrade_note'),
    ]

    operations = [
        migrations.CreateModel(
            name='DocumentCreditTrade',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('create_timestamp', models.DateTimeField(auto_now_add=True, null=True)),
                ('update_timestamp', models.DateTimeField(auto_now=True, null=True)),
                ('create_user', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='api_documentcredittrade_CREATE_USER', to=settings.AUTH_USER_MODEL)),
                ('credit_trade', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='api.CreditTrade')),
                ('document', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='api.Document')),
                ('update_user', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='api_documentcredittrade_UPDATE_USER', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'document_credit_trade',
            },
            bases=(models.Model, db_comments.model_mixins.DBComments),
        ),
        migrations.AddField(
            model_name='credittrade',
            name='documents',
            field=models.ManyToManyField(through='api.DocumentCreditTrade', to='api.Document'),
        ),
        migrations.AddField(
            model_name='document',
            name='credit_trades',
            field=models.ManyToManyField(through='api.DocumentCreditTrade', to='api.CreditTrade'),
        ),
        migrations.AlterUniqueTogether(
            name='documentcredittrade',
            unique_together=set([('credit_trade', 'document')]),
        ),
    ]
