# -*- coding: utf-8 -*-
# Generated by Django 1.11.22 on 2019-08-06 22:07
from __future__ import unicode_literals

import db_comments.model_mixins
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0166_add_sign_compliance_report_permission'),
    ]

    operations = [
        migrations.CreateModel(
            name='ComplianceReportHistory',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('create_timestamp', models.DateTimeField(auto_now_add=True, null=True)),
                ('update_timestamp', models.DateTimeField(auto_now=True, null=True)),
                ('compliance_report', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='compliance_reports', to='api.ComplianceReport')),
                ('create_user', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='api_compliancereporthistory_CREATE_USER', to=settings.AUTH_USER_MODEL)),
                ('status', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='compliance_reports', to='api.ComplianceReportStatus')),
                ('update_user', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='api_compliancereporthistory_UPDATE_USER', to=settings.AUTH_USER_MODEL)),
                ('user_role', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='compliance_reports', to='api.Role')),
            ],
            options={
                'db_table': 'compliance_report_history',
            },
            bases=(models.Model, db_comments.model_mixins.DBComments),
        ),
    ]
