# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models

from api.migrations.operations.trigger_operation import AuditTable


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0194_auto_20191112_2114'),
    ]

    _tables = ['compliance_report_snapshot',
               'compliance_report',
               'document',
               'document_file',
               'fuel_code',
               'notification_message',
               'compliance_report_summary',
               'compliance_report_summary',
               'compliance_report_schedule_a',
               'compliance_report_schedule_a_record',
               'compliance_report_schedule_b',
               'compliance_report_schedule_b_record',
               'compliance_report_schedule_c',
               'compliance_report_schedule_c_record',
               'compliance_report_schedule_d',
               'compliance_report_schedule_d_sheet',
               'compliance_report_schedule_d_sheet_input',
               'compliance_report_schedule_d_sheet_output',
               'compliance_report_exclusion_agreement',
               'compliance_report_exclusion_agreement_record'
               ]

    operations = [AuditTable(table) for table in _tables]
