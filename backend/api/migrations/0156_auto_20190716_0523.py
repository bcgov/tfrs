# -*- coding: utf-8 -*-
# Generated by Django 1.11.21 on 2019-07-16 05:23
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0155_schedule_d'),
    ]

    operations = [
        migrations.CreateModel(
            name='ScheduleSummary',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('gasoline_class_retained', models.DecimalField(blank=True, decimal_places=2, max_digits=20, null=True)),
                ('gasoline_class_deferred', models.DecimalField(blank=True, decimal_places=2, max_digits=20, null=True)),
                ('diesel_class_retained', models.DecimalField(blank=True, decimal_places=2, max_digits=20, null=True)),
                ('diesel_class_deferred', models.DecimalField(blank=True, decimal_places=2, max_digits=20, null=True)),
            ],
            options={
                'db_table': 'compliance_report_summary',
            },
        ),
        migrations.AddField(
            model_name='compliancereport',
            name='summary',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='compliance_report', to='api.ScheduleSummary'),
        ),
    ]
