# -*- coding: utf-8 -*-
# Generated by Django 1.11.20 on 2019-06-12 01:50
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0138_auto_20190530_1823'),
    ]

    operations = [
        migrations.CreateModel(
            name='ScheduleA',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
            ],
            options={
                'db_table': 'compliance_report_schedule_a',
            },
        ),
        migrations.CreateModel(
            name='ScheduleARecord',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quantity', models.DecimalField(decimal_places=2, max_digits=20)),
                ('trading_partner', models.CharField(max_length=200)),
                ('postal_address', models.CharField(max_length=200)),
                ('fuel_class', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='api.FuelClass')),
                ('schedule', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='records', to='api.ScheduleA')),
                ('transfer_type', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='api.NotionalTransferType')),
            ],
            options={
                'db_table': 'compliance_report_schedule_a_record',
            },
        ),
        migrations.AddField(
            model_name='compliancereport',
            name='schedule_a',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='compliance_report', to='api.ScheduleA'),
        ),
    ]
