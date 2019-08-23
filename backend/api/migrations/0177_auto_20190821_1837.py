# -*- coding: utf-8 -*-
# Generated by Django 1.11.22 on 2019-08-21 18:37
from __future__ import unicode_literals

import db_comments.model_mixins
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0176_auto_20190823_0131'),
    ]

    operations = [
        migrations.CreateModel(
            name='ExclusionAgreement',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
            ],
            options={
                'db_table': 'compliance_report_exclusion_agreement',
            },
            bases=(models.Model, db_comments.model_mixins.DBComments),
        ),
        migrations.CreateModel(
            name='ExclusionAgreementRecord',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('transaction_partner', models.CharField(max_length=200)),
                ('postal_address', models.CharField(max_length=200)),
                ('quantity', models.DecimalField(decimal_places=0, max_digits=15)),
                ('quantity_not_sold', models.DecimalField(decimal_places=0, max_digits=15)),
                ('exclusion_agreement', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='records', to='api.ExclusionAgreement')),
                ('fuel_type', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='api.ApprovedFuel')),
                ('transaction_type', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='api.TransactionType')),
            ],
            options={
                'db_table': 'compliance_report_exclusion_agreement_record',
                'ordering': ['id'],
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
            model_name='compliancereport',
            name='exclusion_agreement',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='compliance_report', to='api.ExclusionAgreement'),
        ),
    ]
