# -*- coding: utf-8 -*-
# Generated by Django 1.11.21 on 2019-08-19 01:26
from __future__ import unicode_literals

import db_comments.model_mixins
from django.conf import settings
import django.contrib.postgres.fields.jsonb
import django.core.serializers.json
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0169_auto_20190821_1837'),
    ]

    operations = [
        migrations.CreateModel(
            name='ComplianceReportSnapshot',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('create_timestamp', models.DateTimeField(auto_now_add=True, null=True)),
                ('update_timestamp', models.DateTimeField(auto_now=True, null=True)),
                ('snapshot', django.contrib.postgres.fields.jsonb.JSONField(encoder=django.core.serializers.json.DjangoJSONEncoder, null=True)),
            ],
            options={
                'db_table': 'compliance_report_snapshot',
            },
            bases=(models.Model, db_comments.model_mixins.DBComments),
        ),
        migrations.AlterField(
            model_name='compliancereport',
            name='schedule_a',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='compliance_report', to='api.ScheduleA'),
        ),
        migrations.AlterField(
            model_name='compliancereport',
            name='schedule_b',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='compliance_report', to='api.ScheduleB'),
        ),
        migrations.AlterField(
            model_name='compliancereport',
            name='schedule_c',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='compliance_report', to='api.ScheduleC'),
        ),
        migrations.AlterField(
            model_name='compliancereport',
            name='schedule_d',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='compliance_report', to='api.ScheduleD'),
        ),
        migrations.AlterField(
            model_name='compliancereport',
            name='summary',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='compliance_report', to='api.ScheduleSummary'),
        ),
        migrations.AddField(
            model_name='compliancereportsnapshot',
            name='compliance_report',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='api.ComplianceReport'),
        ),
        migrations.AddField(
            model_name='compliancereportsnapshot',
            name='create_user',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='api_compliancereportsnapshot_CREATE_USER', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='compliancereportsnapshot',
            name='update_user',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='api_compliancereportsnapshot_UPDATE_USER', to=settings.AUTH_USER_MODEL),
        ),
    ]
