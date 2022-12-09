"""
    REST API Documentation for the NRS TFRS Credit Trading Application

    The Transportation Fuels Reporting System is being designed to streamline
    compliance reporting for transportation fuel suppliers in accordance with
    the Renewable & Low Carbon Fuel Requirements Regulation.

    OpenAPI spec version: v1


    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
"""
from datetime import datetime
from decimal import *
from django.db.models import Q
from rest_framework import serializers
from rest_framework.exceptions import PermissionDenied, ValidationError
from rest_framework.fields import SerializerMethodField
from rest_framework.relations import SlugRelatedField, PrimaryKeyRelatedField

from api.models.CompliancePeriod import CompliancePeriod
from api.models.ComplianceReport import \
    ComplianceReport, ComplianceReportStatus, ComplianceReportType, \
    ComplianceReportWorkflowState
from api.models.ComplianceReportSchedules import \
    ScheduleCRecord, ScheduleC, ScheduleARecord, ScheduleA, \
    ScheduleBRecord, ScheduleB, ScheduleD, ScheduleDSheet, \
    ScheduleDSheetOutput, ScheduleDSheetInput, ScheduleSummary
from api.models.ComplianceReportSnapshot import ComplianceReportSnapshot
from api.models.ExclusionReportAgreement import ExclusionAgreement, \
    ExclusionAgreementRecord
from api.models.Organization import Organization
from api.permissions.ComplianceReport import ComplianceReportPermissions
from api.serializers import CreditTradeMinSerializer
from api.serializers.CompliancePeriod import CompliancePeriodSerializer
from api.serializers.ComplianceReportSchedules import \
    ScheduleCDetailSerializer, ScheduleADetailSerializer, \
    ScheduleBDetailSerializer, ScheduleDDetailSerializer, \
    ScheduleSummaryDetailSerializer
from api.serializers.Organization import OrganizationMinSerializer, \
    OrganizationDisplaySerializer
from api.serializers.constants import ComplianceReportValidation
from api.services.ComplianceReportService import ComplianceReportService
from api.services.OrganizationService import OrganizationService


class ComplianceReportBaseSerializer:
    def get_last_accepted_offset(self, obj):
        current = obj
        last_accepted = None

        while current.supplements is not None and not last_accepted:
            current = current.supplements

            if current.status.director_status_id in [
                    "Accepted"
            ]:
                last_accepted = current

        if last_accepted:
            return current.summary.credits_offset

        return None

    def get_previous_report_was_credit(self, obj):
        previous_report = obj.supplements
        
        if previous_report is not None and \
                previous_report.status.director_status_id == 'Accepted':

            if previous_report.schedule_b:
                credits = previous_report.schedule_b.total_credits - \
                    previous_report.schedule_b.total_debits
                return True if credits > 0 else False

        return False

    def get_total_previous_credit_reductions(self, obj):
        # Return the total number of credits for all previous reductions for
        # supplemental reports
        # previous_transactions = []
        submitted_reports = []
        current = obj
        submitted_reports_end = False
        rejected_found = False

        total_previous_reduction = Decimal(0.0)

        # this is an attempt to simplify the process of calculation previous
        # credit reductions
        # If the last supplemental report was submitted we can just use the
        # credit offset there as our previous reduction (which is credit offset A)
        if current.supplements and current.supplements.status and \
                current.supplements.status.fuel_supplier_status_id in [
                    "Submitted"
                ] and current.supplements.status.director_status_id in [
                    "Unreviewed"
                ]:
            total_previous_reduction = current.supplements.summary.credits_offset
            submitted_reports_end = True

        while current.supplements is not None and not submitted_reports_end:
            current = current.supplements
            if current.status.director_status_id in [
                    "Rejected"
            ]:
                rejected_found = True

            if current.status.director_status_id in [
                    "Accepted"
            ]:
                submitted_reports_end = True

            # if current.credit_transaction is not None and \
            #         current.status.director_status_id not in ["Rejected"]:
            #     previous_transactions.append(current.credit_transaction)
            if current.status.fuel_supplier_status_id == "Submitted" and \
                    not submitted_reports_end and \
                    not rejected_found:
                submitted_reports.append(current)

            if rejected_found and submitted_reports_end and current.summary:
                # Clear the submitted reports and we only care about the
                # last accepted one
                total_previous_reduction = current.summary.credits_offset

        # for transaction in previous_transactions:
        #     if transaction.type.the_type in ['Credit Reduction']:
        #         total_previous_reduction += transaction.number_of_credits
        #     elif transaction.type.the_type in ['Credit Validation']:
        #         total_previous_reduction -= transaction.number_of_credits

        if not rejected_found:
            for report in submitted_reports:
                if report.summary and report.summary.credits_offset_b:
                    total_previous_reduction += report.summary.credits_offset_b

        return total_previous_reduction

    def get_supplemental_number(self, obj):
        current = obj
        supplemental_number = 0

        while current.supplements is not None:
            current = current.supplements
            supplemental_number += 1

        return supplemental_number


class ComplianceReportTypeSerializer(serializers.ModelSerializer):
    """
    Default serializer for the Compliance Report Type
    """

    class Meta:
        model = ComplianceReportType
        fields = ('the_type', 'description')
        read_only_fields = ('the_type', 'description')


class SelectiveVisibilitySlugField(serializers.SlugRelatedField):
    """ Calls should_show() on parent serializer to decide if
        it should return or censor a value
    """

    def to_representation(self, value):
        visible = getattr(self.parent, 'should_show')

        if visible(self.field_name, value):
            return super().to_representation(value)

        return None


class ComplianceReportWorkflowStateSerializer(serializers.ModelSerializer):
    """
    Default serializer for the Compliance Report Status
    """
    fuel_supplier_status = SlugRelatedField(
        slug_field='status',
        queryset=ComplianceReportStatus.objects.all(),
        required=False
    )
    director_status = SelectiveVisibilitySlugField(
        slug_field='status',
        queryset=ComplianceReportStatus.objects.all(),
        required=False
    )
    analyst_status = SelectiveVisibilitySlugField(
        slug_field='status',
        queryset=ComplianceReportStatus.objects.all(),
        required=False
    )
    manager_status = SelectiveVisibilitySlugField(
        slug_field='status',
        queryset=ComplianceReportStatus.objects.all(),
        required=False
    )

    def should_show(self, field_name, value):
        user = self.context['request'].user \
            if 'request' in self.context else None

        # Show director_status 'Accepted' to everyone
        if value.status in ['Accepted', 'Rejected'] and \
                field_name in 'director_status':
            return True

        if value.status in ['Requested Supplemental'] and \
                field_name in ['manager_status', 'analyst_status']:
            return True

        if user and user.is_government_user:
            return True

        return False

    class Meta:
        model = ComplianceReportWorkflowState
        fields = ('fuel_supplier_status', 'director_status', 'analyst_status',
                  'manager_status')


class ComplianceReportStatusSerializer(serializers.ModelSerializer):
    """
    Default serializer for the Compliance Report Status
    """

    class Meta:
        model = ComplianceReportStatus
        fields = ('status',)
        read_only_fields = ('status',)


class ComplianceReportListSerializer(serializers.ModelSerializer):
    """
    Default List serializer for Compliance Reports
    """
    status = ComplianceReportWorkflowStateSerializer(read_only=True)
    type = SlugRelatedField(slug_field='the_type', read_only=True)
    organization = OrganizationMinSerializer(read_only=True)
    compliance_period = CompliancePeriodSerializer(read_only=True)
    supplemental_reports = SerializerMethodField()
    supplements = PrimaryKeyRelatedField(read_only=True)
    group_id = SerializerMethodField()
    display_name = SerializerMethodField()

    def get_display_name(self, obj):
        if obj.nickname is not None and obj.nickname != '':
            return obj.nickname
        return obj.generated_nickname

    def get_group_id(self, obj):
        user = self.context['request'].user
        return obj.group_id(filter_drafts=user.is_government_user)

    def get_supplemental_reports(self, obj):
        qs = obj.supplemental_reports.order_by('create_timestamp')
        gov_org = Organization.objects.get(type=1)
        organization = self.context['request'].user.organization

        if organization == gov_org:
            # If organization == Government
            #  don't show "Draft" transactions
            #  don't show "Deleted" transactions
            qs = qs.filter(
                ~Q(status__fuel_supplier_status__status__in=[
                    "Draft", "Deleted"
                ])
            )
        else:
            qs = qs.filter(
                ~Q(status__fuel_supplier_status__status__in=["Deleted"])
            )

        return ComplianceReportListSerializer(
            qs.all(),
            read_only=True,
            context=self.context,
            many=True).data

    class Meta:
        model = ComplianceReport
        fields = ('id', 'status', 'type', 'organization', 'compliance_period',
                  'update_timestamp', 'has_snapshot', 'read_only', 'group_id',
                  'supplemental_reports', 'supplements', 'display_name',
                  'sort_date', 'original_report_id')


class ComplianceReportMinSerializer(serializers.ModelSerializer):
    """
    Basic Serializer for a Report (just shows the type and compliance period)
    """
    type = ComplianceReportTypeSerializer(read_only=True)
    compliance_period = CompliancePeriodSerializer(read_only=True)

    class Meta:
        model = ComplianceReport
        fields = ('id', 'type', 'compliance_period')


class ComplianceReportDetailSerializer(
        serializers.ModelSerializer, ComplianceReportBaseSerializer
):
    """
    Detail Serializer for the Compliance Report
    """
    status = ComplianceReportWorkflowStateSerializer(read_only=True)
    type = ComplianceReportTypeSerializer(read_only=True)
    organization = OrganizationDisplaySerializer(read_only=True)
    compliance_period = CompliancePeriodSerializer(read_only=True)
    schedule_a = ScheduleADetailSerializer(read_only=True)
    schedule_b = ScheduleBDetailSerializer(read_only=True)
    schedule_c = ScheduleCDetailSerializer(read_only=True)
    schedule_d = ScheduleDDetailSerializer(read_only=True)
    actions = serializers.SerializerMethodField()
    actor = serializers.SerializerMethodField()
    summary = serializers.SerializerMethodField()
    history = serializers.SerializerMethodField()
    deltas = serializers.SerializerMethodField()
    display_name = SerializerMethodField()
    total_previous_credit_reductions = SerializerMethodField()
    credit_transactions = SerializerMethodField()
    max_credit_offset = SerializerMethodField()
    max_credit_offset_exclude_reserved = SerializerMethodField()
    supplemental_number = SerializerMethodField()
    last_accepted_offset = SerializerMethodField()
    previous_report_was_credit = SerializerMethodField()

    skip_deltas = False

    def get_credit_transactions(self, obj):
        current = obj
        transactions = []
        while current is not None:
            if current.credit_transaction is not None:
                transactions.insert(0, {
                    'id': current.credit_transaction.id,
                    'credits': current.credit_transaction.number_of_credits,
                    'type': current.credit_transaction.type.the_type,
                    'supplemental': current.supplements is not None
                })
            current = current.supplements

        return transactions

    def get_display_name(self, obj):
        if obj.nickname is not None and obj.nickname != '':
            return obj.nickname
        return obj.generated_nickname

    def get_actor(self, obj):
        return ComplianceReportPermissions.get_relationship(
            obj, self.context['request'].user
        ).value

    def get_actions(self, obj):
        relationship = ComplianceReportPermissions.get_relationship(
            obj, self.context['request'].user
        )

        return ComplianceReportPermissions.get_available_actions(
            obj, relationship
        )

    def get_deltas(self, obj):

        deltas = []

        if self.skip_deltas:
            return deltas

        current = obj

        while current:
            if current.supplements:
                ancestor = current.supplements

                qs = ComplianceReportSnapshot.objects.filter(
                    compliance_report=ancestor
                )

                if qs.exists():
                    ancestor_snapshot = qs.first().snapshot
                    ancestor_computed = False
                else:
                    # no snapshot. make one.
                    ser = ComplianceReportDetailSerializer(
                        ancestor, context=self.context
                    )
                    ser.skip_deltas = True
                    ancestor_snapshot = ser.data
                    ancestor_computed = True

                qs = ComplianceReportSnapshot.objects.filter(
                    compliance_report=current
                )

                if qs.exists():
                    current_snapshot = qs.first().snapshot
                else:
                    # no snapshot
                    ser = ComplianceReportDetailSerializer(
                        current, context=self.context
                    )
                    ser.skip_deltas = True
                    current_snapshot = ser.data

                deltas += [{
                    'levels_up': 1,
                    'ancestor_id': ancestor.id,
                    'ancestor_display_name': ancestor.nickname
                    if (ancestor.nickname is not None and
                        ancestor.nickname != '')
                    else ancestor.generated_nickname,
                    'delta': ComplianceReportService.compute_delta(
                        current_snapshot, ancestor_snapshot
                    ),
                    'snapshot': {
                        'data': ancestor_snapshot,
                        'computed': ancestor_computed
                    }
                }]

            current = current.supplements

        return deltas

    def get_max_credit_offset(self, obj):
        max_credit_offset = OrganizationService.get_max_credit_offset(
            obj.organization,
            obj.compliance_period.description
        )

        if max_credit_offset < 0:
            max_credit_offset = 0

        return max_credit_offset

    def get_max_credit_offset_exclude_reserved(self, obj):
        max_credit_offset_exclude_reserved = OrganizationService.get_max_credit_offset(
            obj.organization,
            obj.compliance_period.description,
            exclude_reserved=True
        )

        if max_credit_offset_exclude_reserved < 0:
            max_credit_offset_exclude_reserved = 0

        return max_credit_offset_exclude_reserved

    def get_summary(self, obj):
        total_petroleum_diesel = Decimal(0)
        total_petroleum_gasoline = Decimal(0)
        total_renewable_diesel = Decimal(0)
        total_renewable_gasoline = Decimal(0)
        total_credits = Decimal(0)
        total_debits = Decimal(0)
        net_gasoline_class_transferred = Decimal(0)
        net_diesel_class_transferred = Decimal(0)

        lines = {}

        if obj.summary is not None:
            lines['6'] = obj.summary.gasoline_class_retained \
                if obj.summary.gasoline_class_retained is not None \
                else Decimal(0)
            lines['7'] = obj.summary.gasoline_class_previously_retained \
                if obj.summary.gasoline_class_previously_retained is not None \
                else Decimal(0)
            lines['8'] = obj.summary.gasoline_class_deferred \
                if obj.summary.gasoline_class_deferred is not None \
                else Decimal(0)
            lines['9'] = obj.summary.gasoline_class_obligation \
                if obj.summary.gasoline_class_obligation is not None \
                else Decimal(0)
            lines['17'] = obj.summary.diesel_class_retained \
                if obj.summary.diesel_class_retained is not None \
                else Decimal(0)
            lines['18'] = obj.summary.diesel_class_previously_retained \
                if obj.summary.diesel_class_previously_retained is not None \
                else Decimal(0)
            lines['19'] = obj.summary.diesel_class_deferred \
                if obj.summary.diesel_class_deferred is not None \
                else Decimal(0)
            lines['20'] = obj.summary.diesel_class_obligation \
                if obj.summary.diesel_class_obligation is not None \
                else Decimal(0)
            lines['26'] = obj.summary.credits_offset \
                if obj.summary.credits_offset is not None else Decimal(0)
            lines['26A'] = obj.summary.credits_offset_a \
                if obj.summary.credits_offset_a is not None else Decimal(0)
            lines['26B'] = obj.summary.credits_offset_b \
                if obj.summary.credits_offset_b is not None else Decimal(0)
        else:
            lines['6'] = Decimal(0)
            lines['7'] = Decimal(0)
            lines['8'] = Decimal(0)
            lines['9'] = Decimal(0)
            lines['17'] = Decimal(0)
            lines['18'] = Decimal(0)
            lines['19'] = Decimal(0)
            lines['20'] = Decimal(0)
            lines['26'] = Decimal(0)
            lines['26A'] = Decimal(0)
            lines['26B'] = Decimal(0)

        if obj.schedule_a:
            net_gasoline_class_transferred += \
                obj.schedule_a.net_gasoline_class_transferred
            net_diesel_class_transferred += \
                obj.schedule_a.net_diesel_class_transferred

        lines['5'] = net_gasoline_class_transferred
        lines['16'] = net_diesel_class_transferred

        if obj.schedule_b:
            total_petroleum_diesel += obj.schedule_b.total_petroleum_diesel
            total_petroleum_gasoline += obj.schedule_b.total_petroleum_gasoline
            total_renewable_diesel += obj.schedule_b.total_renewable_diesel
            total_renewable_gasoline += obj.schedule_b.total_renewable_gasoline
            total_credits += obj.schedule_b.total_credits
            total_debits += obj.schedule_b.total_debits

        if obj.schedule_c:
            total_petroleum_diesel += obj.schedule_c.total_petroleum_diesel
            total_petroleum_gasoline += obj.schedule_c.total_petroleum_gasoline
            total_renewable_diesel += obj.schedule_c.total_renewable_diesel
            total_renewable_gasoline += obj.schedule_c.total_renewable_gasoline

        lines['1'] = total_petroleum_gasoline
        lines['2'] = total_renewable_gasoline
        lines['3'] = lines['1'] + lines['2']
        lines['4'] = (lines['3'] * Decimal('0.05')).quantize(
            Decimal('1.'), rounding=ROUND_HALF_UP
        )  # hardcoded 5% renewable requirement
        lines['10'] = lines['2'] + lines['5'] - lines['6'] + lines['7'] + \
            lines['8'] - lines['9']
        lines['11'] = ((lines['4'] - lines['10']) * Decimal('0.30')).max(
            Decimal(0)).quantize(Decimal('.01'), rounding=ROUND_HALF_UP)

        lines['12'] = total_petroleum_diesel
        lines['13'] = total_renewable_diesel
        lines['14'] = lines['12'] + lines['13']
        lines['15'] = (lines['14'] * Decimal('0.04')).quantize(
            Decimal('1.'), rounding=ROUND_HALF_UP
        )  # hardcoded 4% renewable requirement
        lines['21'] = lines['13'] + lines['16'] - lines['17'] + lines['18'] + \
            lines['19'] - lines['20']
        lines['22'] = ((lines['15'] - lines['21']) * Decimal('0.45')).max(
            Decimal(0)).quantize(Decimal('.01'), rounding=ROUND_HALF_UP)

        lines['23'] = total_credits
        lines['24'] = total_debits
        lines['25'] = lines['23'] - lines['24']
        lines['27'] = lines['25'] + lines['26']

        lines['28'] = (lines['27'] * Decimal('-200.00')).max(Decimal(0))

        total_payable = lines['11'] + lines['22'] + lines['28']

        synthetic_totals = {
            "total_petroleum_diesel": total_petroleum_diesel,
            "total_petroleum_gasoline": total_petroleum_gasoline,
            "total_renewable_diesel": total_renewable_diesel,
            "total_renewable_gasoline": total_renewable_gasoline,
            "net_diesel_class_transferred": net_diesel_class_transferred,
            "net_gasoline_class_transferred": net_gasoline_class_transferred,
            "lines": lines,
            "total_payable": total_payable
        }

        if obj.summary is not None:
            ser = ScheduleSummaryDetailSerializer(obj.summary)
            data = ser.data
            synthetic_totals = {**data, **synthetic_totals}

        return synthetic_totals

    def get_history(self, obj):
        """
        Returns all the previous status changes for the compliance report
        """

        from .ComplianceReportHistory import ComplianceReportHistorySerializer
        user = self.context['request'].user \
            if 'request' in self.context else None

        if user and user.is_government_user:
            history = obj.get_history(include_government_statuses=True)

            serializer = ComplianceReportHistorySerializer(
                history, many=True, context=self.context
            )

            return serializer.data
        elif user and not user.is_government_user:
            history = obj.get_history()

            serializer = ComplianceReportHistorySerializer(
                history, many=True, context=self.context
            )

            return serializer.data
        else:
            return None

    class Meta:
        model = ComplianceReport
        fields = ['id', 'status', 'type', 'organization', 'compliance_period',
                  'schedule_a', 'schedule_b', 'schedule_c', 'schedule_d',
                  'summary', 'read_only', 'history', 'has_snapshot', 'actions',
                  'actor', 'deltas', 'display_name', 'supplemental_note',
                  'is_supplemental', 'total_previous_credit_reductions',
                  'credit_transactions', 'max_credit_offset', "max_credit_offset_exclude_reserved",
                  'supplemental_number', 'last_accepted_offset',
                  'previous_report_was_credit']


class ComplianceReportValidator:
    """
    Validation method mixin used for validate and update serializers to check
    business rules for schedule validation (like preventing duplicate rows)
    """

    def validate_schedule_a(self, data):
        if 'records' not in data:
            return data

        seen_tuples = {}

        for (i, record) in enumerate(data['records']):
            prov = None

            if ('trading_partner' in record and
                record['trading_partner'] is not None) and \
               ('postal_address' in record and
                record['postal_address'] is not None) and \
               ('transfer_type' in record and
                record['transfer_type'] is not None) and \
               ('fuel_class' in record and record['fuel_class'] is not None):
                prov = (record['trading_partner'],
                        record['postal_address'],
                        record['transfer_type'],
                        record['fuel_class']
                        )

            if prov is not None:
                if prov in seen_tuples.keys():
                    seen_tuples[prov].append(i)
                else:
                    seen_tuples[prov] = [i]

        failures = []

        for k in seen_tuples.keys():
            if len(seen_tuples[k]) > 1:
                for x in seen_tuples[k]:
                    failures.append(
                        ComplianceReportValidation.duplicate_with_row.format(
                            row=x
                        )
                    )

        if len(failures) > 0:
            raise (serializers.ValidationError(failures))

        return data

    def validate_schedule_b(self, data):
        if 'records' not in data:
            return data

        # these provisions must be unique together with fuelType and fuelClass
        obligate_unique_provisions = ['Section 6 (5) (a)',
                                      'Section 6 (5) (b)',
                                      'Section 6 (5) (d) (i)']

        seen_fuelcodes = {}
        seen_indices = {}
        seen_tuples = {}

        for (i, record) in enumerate(data['records']):
            fc = record['fuel_code'] if 'fuel_code' in record else None
            sdi = record['schedule_d_sheet_index'] \
                if 'schedule_d_sheet_index' in record else None
            prov = None

            if ('fuel_type' in record and record['fuel_type'] is not None) \
                and ('fuel_class' in record and
                     record['fuel_class'] is not None) and \
                ('provision_of_the_act' in record and
                 record['provision_of_the_act'] is not None) and \
                    record['provision_of_the_act'].provision in \
                    obligate_unique_provisions:
                prov = (
                    record['fuel_type'],
                    record['fuel_class'],
                    record['provision_of_the_act']
                )

            if fc is not None:
                if fc in seen_fuelcodes.keys():
                    seen_fuelcodes[fc].append(i)
                else:
                    seen_fuelcodes[fc] = [i]

            if sdi is not None:
                if sdi in seen_indices.keys():
                    seen_indices[sdi].append(i)
                else:
                    seen_indices[sdi] = [i]

            if prov is not None:
                if prov in seen_tuples.keys():
                    seen_tuples[prov].append(i)
                else:
                    seen_tuples[prov] = [i]

        failures = []

        for k in seen_fuelcodes.keys():
            if len(seen_fuelcodes[k]) > 1:
                for x in seen_fuelcodes[k]:
                    failures.append(
                        ComplianceReportValidation.duplicate_with_row.format(
                            row=x
                        )
                    )

        for k in seen_indices.keys():
            if len(seen_indices[k]) > 1:
                for x in seen_indices[k]:
                    failures.append(
                        ComplianceReportValidation.duplicate_with_row.format(
                            row=x
                        )
                    )

        for k in seen_tuples.keys():
            if len(seen_tuples[k]) > 1:
                for x in seen_tuples[k]:
                    failures.append(
                        ComplianceReportValidation.duplicate_with_row.format(
                            row=x
                        )
                    )

        if len(failures) > 0:
            raise (serializers.ValidationError(failures))

        return data

    def validate_schedule_c(self, data):
        if 'records' not in data:
            return data

        seen_tuples = {}

        for (i, record) in enumerate(data['records']):
            prov = None

            if ('expected_use' in record and
                record['expected_use'] is not None) and \
               ('fuel_type' in record and
                record['fuel_type'] is not None) and \
               ('fuel_class' in record and
                record['fuel_class'] is not None) and \
                    record['expected_use'].description != 'Other':
                prov = (
                    record['fuel_type'],
                    record['fuel_class'],
                    record['expected_use']
                )

            if prov is not None:
                if prov in seen_tuples.keys():
                    seen_tuples[prov].append(i)
                else:
                    seen_tuples[prov] = [i]

        failures = []

        for k in seen_tuples.keys():
            if len(seen_tuples[k]) > 1:
                for x in seen_tuples[k]:
                    failures.append(
                        ComplianceReportValidation.duplicate_with_row.format(
                            row=x
                        )
                    )

        if len(failures) > 0:
            raise (serializers.ValidationError(failures))

        return data


class ComplianceReportValidationSerializer(
        serializers.ModelSerializer, ComplianceReportValidator
):
    def validate_schedule_b(self, data):
        if 'records' not in data:
            return data

        # these provisions must be unique together with fuelType and fuelClass
        obligate_unique_provisions = [
            'Section 6 (5) (a)',
            'Section 6 (5) (b)',
            'Section 6 (5) (d) (i)'
        ]

        seen_fuelcodes = {}
        seen_indices = {}
        seen_tuples = {}

        for (i, record) in enumerate(data['records']):
            fc = record['fuel_code']
            sdi = record['schedule_d_sheet_index']
            prov = None

            if ('fuel_type' in record and
                record['fuel_type'] is not None) and \
               ('fuel_class' in record and
                record['fuel_class'] is not None) and \
               ('provision_of_the_act' in record and
                record['provision_of_the_act'] is not None) and \
                    record['provision_of_the_act'].provision in \
                    obligate_unique_provisions:
                prov = (
                    record['fuel_type'],
                    record['fuel_class'],
                    record['provision_of_the_act']
                )

            record_path = 'scheduleB.records.{i}.{column}'

            if fc is not None:
                if fc in seen_fuelcodes.keys():
                    seen_fuelcodes[fc].append(i)
                else:
                    seen_fuelcodes[fc] = [i]

            if sdi is not None:
                if sdi in seen_indices.keys():
                    seen_indices[sdi].append(i)
                else:
                    seen_indices[sdi] = [i]

            if prov is not None:
                if prov in seen_tuples.keys():
                    seen_tuples[prov].append(i)
                else:
                    seen_tuples[prov] = [i]

        failures = []

        for k in seen_fuelcodes.keys():
            if len(seen_fuelcodes[k]) > 1:
                for x in seen_fuelcodes[k]:
                    failures.append(
                        ComplianceReportValidation.duplicateWithRow.format(
                            row=x
                        )
                    )

        for k in seen_indices.keys():
            if len(seen_indices[k]) > 1:
                for x in seen_indices[k]:
                    failures.append(
                        ComplianceReportValidation.duplicateWithRow.format(
                            row=x
                        )
                    )

        for k in seen_tuples.keys():
            if len(seen_tuples[k]) > 1:
                for x in seen_tuples[k]:
                    failures.append(
                        ComplianceReportValidation.duplicateWithRow.format(
                            row=x
                        )
                    )

        if len(failures) > 0:
            raise (serializers.ValidationError(failures))

        return data


class ComplianceReportValidationSerializer(
    serializers.ModelSerializer, ComplianceReportValidator
):
    """
    Validation-only Serializer for the Compliance Report
    """
    schedule_a = ScheduleADetailSerializer(allow_null=True, required=False)
    schedule_b = ScheduleBDetailSerializer(allow_null=True, required=False)
    schedule_c = ScheduleCDetailSerializer(allow_null=True, required=False)
    schedule_d = ScheduleDDetailSerializer(allow_null=True, required=False)
    summary = ScheduleSummaryDetailSerializer(allow_null=True, required=False)

    class Meta:
        model = ComplianceReport
        fields = ('schedule_a', 'schedule_b', 'schedule_c',
                  'schedule_d', 'summary')


class ComplianceReportCreateSerializer(serializers.ModelSerializer):
    """
    Create Serializer for the Compliance Report
    """
    status = ComplianceReportWorkflowStateSerializer()

    type = SlugRelatedField(
        slug_field='the_type',
        queryset=ComplianceReportType.objects.all()
    )
    compliance_period = SlugRelatedField(
        slug_field='description',
        queryset=CompliancePeriod.objects.all()
    )
    supplements = PrimaryKeyRelatedField(
        queryset=ComplianceReport.objects.all(),
        read_only=False,
        required=False,
        allow_null=True
    )
    organization = OrganizationMinSerializer(read_only=True)

    def validate_supplements(self, value):
        user = self.context.get('request').user
        original = value
        relationship = ComplianceReportPermissions.get_relationship(
            original, user
        )
        actions = ComplianceReportPermissions.get_available_actions(
            original, relationship
        )
        if 'CREATE_SUPPLEMENTAL' not in actions:
            raise serializers.ValidationError(
                'Cannot create a supplemental report'
            )
        return value

    def validate(self, data):
        request = self.context.get('request')

        if not request.user.has_perm('COMPLIANCE_REPORT_MANAGE'):
            raise PermissionDenied(
                'You do not have permission to create a report')
        return data

    def validate_status(self, value):
        if value['fuel_supplier_status'].status not in ['Draft']:
            raise serializers.ValidationError('Value must be Draft')
        if 'analyst_status' in value:
            raise serializers.ValidationError('Cannot set this value')
        if 'manager_status' in value:
            raise serializers.ValidationError('Cannot set this value')
        if 'director_status' in value:
            raise serializers.ValidationError('Cannot set this value')

        return value

    def create(self, validated_data):
        status_data = validated_data.pop('status')
        status = ComplianceReportWorkflowState.objects.create(**status_data)
        cr = ComplianceReport.objects.create(
            status=status,
            **validated_data)
        if 'supplements' in validated_data and \
                validated_data['supplements'] is not None:
            # need to copy all the schedule entries
            original_report = validated_data['supplements']
            if original_report.schedule_a is not None:
                schedule_a = ScheduleA.objects.create()
                cr.schedule_a = schedule_a
                schedule_a.save()
                cr.save()
                for original_record in \
                        original_report.schedule_a.records.all():
                    record = ScheduleARecord()
                    record.schedule = schedule_a
                    record.trading_partner = original_record.trading_partner
                    record.postal_address = original_record.postal_address
                    record.quantity = original_record.quantity
                    record.fuel_class = original_record.fuel_class
                    record.transfer_type = original_record.transfer_type
                    record.save()

            if original_report.schedule_b is not None:
                schedule_b = ScheduleB.objects.create()
                cr.schedule_b = schedule_b
                schedule_b.save()
                cr.save()
                for original_record in \
                        original_report.schedule_b.records.all():
                    record = ScheduleBRecord()
                    record.schedule = schedule_b
                    record.provision_of_the_act = \
                        original_record.provision_of_the_act
                    record.intensity = original_record.intensity
                    record.quantity = original_record.quantity
                    record.fuel_type = original_record.fuel_type
                    record.fuel_class = original_record.fuel_class
                    record.fuel_code = original_record.fuel_code
                    record.schedule_d_sheet_index = \
                        original_record.schedule_d_sheet_index
                    record.save()

            if original_report.schedule_c is not None:
                schedule_c = ScheduleC.objects.create()
                cr.schedule_c = schedule_c
                schedule_c.save()
                cr.save()
                for original_record in \
                        original_report.schedule_c.records.all():
                    record = ScheduleCRecord()
                    record.schedule = schedule_c
                    record.quantity = original_record.quantity
                    record.fuel_type = original_record.fuel_type
                    record.fuel_class = original_record.fuel_class
                    record.expected_use = original_record.expected_use
                    record.rationale = original_record.rationale
                    record.save()

            if original_report.schedule_d is not None:
                schedule_d = ScheduleD.objects.create()
                cr.schedule_d = schedule_d
                schedule_d.save()
                cr.save()
                for original_sheet in original_report.schedule_d.sheets.all():
                    sheet = ScheduleDSheet()
                    sheet.schedule = schedule_d
                    sheet.feedstock = original_sheet.feedstock
                    sheet.fuel_type = original_sheet.fuel_type
                    sheet.fuel_class = original_sheet.fuel_class
                    sheet.save()
                    for original_input in original_sheet.inputs.all():
                        input = ScheduleDSheetInput()
                        input.sheet = sheet
                        input.worksheet_name = original_input.worksheet_name
                        input.cell = original_input.cell
                        input.value = original_input.value
                        input.units = original_input.units
                        input.description = original_input.description
                        input.save()

                    for original_output in original_sheet.outputs.all():
                        output = ScheduleDSheetOutput()
                        output.sheet = sheet
                        output.intensity = original_output.intensity
                        output.description = original_output.description
                        output.save()

            if original_report.summary is not None:
                summary = ScheduleSummary.objects.create()
                cr.summary = summary
                cr.save()
                original_summary = original_report.summary
                summary.gasoline_class_retained = \
                    original_summary.gasoline_class_retained
                summary.gasoline_class_deferred = \
                    original_summary.gasoline_class_deferred
                summary.diesel_class_retained = \
                    original_summary.diesel_class_retained
                summary.diesel_class_deferred = \
                    original_summary.diesel_class_deferred
                summary.credits_offset = original_summary.credits_offset
                summary.gasoline_class_previously_retained = \
                    original_summary.gasoline_class_previously_retained
                summary.gasoline_class_obligation = \
                    original_summary.gasoline_class_obligation
                summary.diesel_class_previously_retained = \
                    original_summary.diesel_class_previously_retained
                summary.diesel_class_obligation = \
                    original_summary.diesel_class_obligation
                summary.credits_offset_a = original_summary.credits_offset_a or \
                    original_summary.credits_offset

                if original_report.status.director_status_id == 'Rejected':
                    current = original_report
                    accepted_found = False

                    while current.supplements is not None and not accepted_found:
                        current = current.supplements

                        if current.status.director_status_id in [
                                "Accepted"
                        ]:
                            summary.credits_offset = current.summary.credits_offset
                            summary.credits_offset_a = current.summary.credits_offset
                            accepted_found = True

                summary.save()

            if original_report.exclusion_agreement is not None:
                exclusion_agreement = ExclusionAgreement.objects.create()
                cr.exclusion_agreement = exclusion_agreement
                exclusion_agreement.save()
                for original_record in original_report.exclusion_agreement.records.all():
                    record = ExclusionAgreementRecord()
                    record.exclusion_agreement = exclusion_agreement
                    record.transaction_partner = \
                        original_record.transaction_partner
                    record.postal_address = original_record.postal_address
                    record.quantity = original_record.quantity
                    record.quantity_not_sold = \
                        original_record.quantity_not_sold
                    record.fuel_type = original_record.fuel_type
                    record.transaction_type = original_record.transaction_type
                    record.save()

        return cr

    def save(self, **kwargs):
        super().save(**kwargs)

        request = self.context['request']
        self.instance.create_user = request.user
        self.instance.update_user = request.user
        self.instance.save()

    class Meta:
        model = ComplianceReport
        fields = ('status', 'type', 'compliance_period', 'organization',
                  'id', 'supplements')
        read_only_fields = ('id',)


class ComplianceReportUpdateSerializer(
    serializers.ModelSerializer, ComplianceReportValidator,
    ComplianceReportBaseSerializer
):
    """
    Update Serializer for the Compliance Report
    """
    status = ComplianceReportWorkflowStateSerializer(required=False)
    type = ComplianceReportTypeSerializer(read_only=True)
    compliance_period = CompliancePeriodSerializer(read_only=True)
    organization = OrganizationDisplaySerializer(read_only=True)
    schedule_a = ScheduleADetailSerializer(allow_null=True, required=False)
    schedule_b = ScheduleBDetailSerializer(allow_null=True, required=False)
    schedule_c = ScheduleCDetailSerializer(allow_null=True, required=False)
    schedule_d = ScheduleDDetailSerializer(allow_null=True, required=False)
    summary = ScheduleSummaryDetailSerializer(allow_null=True, required=False)
    supplemental_note = serializers.CharField(
        max_length=500, min_length=1, required=False, allow_null=True
    )
    actions = serializers.SerializerMethodField()
    actor = serializers.SerializerMethodField()
    display_name = SerializerMethodField()
    max_credit_offset = SerializerMethodField()
    max_credit_offset_exclude_reserved = SerializerMethodField()
    total_previous_credit_reductions = SerializerMethodField()
    supplemental_number = SerializerMethodField()
    last_accepted_offset = SerializerMethodField()
    history = SerializerMethodField()
    previous_report_was_credit = SerializerMethodField()

    strip_summary = False
    disregard_status = False

    def get_display_name(self, obj):
        if obj.nickname is not None and obj.nickname != '':
            return obj.nickname
        return obj.generated_nickname

    def get_actor(self, obj):
        return ComplianceReportPermissions.get_relationship(
            obj, self.context['request'].user
        ).value

    def get_actions(self, obj):
        relationship = ComplianceReportPermissions.get_relationship(
            obj, self.context['request'].user
        )
        return ComplianceReportPermissions.get_available_actions(
            obj, relationship
        )

    def get_max_credit_offset(self, obj):
        max_credit_offset = OrganizationService.get_max_credit_offset(
            obj.organization,
            obj.compliance_period.description
        )

        if max_credit_offset < 0:
            max_credit_offset = 0

        return max_credit_offset

    def get_max_credit_offset_exclude_reserved(self, obj):
        max_credit_offset_exclude_reserved = OrganizationService.get_max_credit_offset(
            obj.organization,
            obj.compliance_period.description,
            exclude_reserved=True
        )

        if max_credit_offset_exclude_reserved < 0:
            max_credit_offset_exclude_reserved = 0

        return max_credit_offset_exclude_reserved

    def get_history(self, obj):
        """
        Returns all the previous status changes for the compliance report
        """

        from .ComplianceReportHistory import ComplianceReportHistorySerializer
        user = self.context['request'].user \
            if 'request' in self.context else None

        if user and user.is_government_user:
            history = obj.get_history(include_government_statuses=True)

            serializer = ComplianceReportHistorySerializer(
                history, many=True, context=self.context
            )

            return serializer.data
        elif user and not user.is_government_user:
            history = obj.get_history()

            serializer = ComplianceReportHistorySerializer(
                history, many=True, context=self.context
            )

            return serializer.data
        else:
            return None

    def update(self, instance, validated_data):
        request = self.context.get('request')

        if instance.read_only and not self.disregard_status and \
                not request.user.organization.id == 1:
            raise PermissionDenied('Cannot modify this compliance report')

        previous_director_status = instance.status.director_status.status

        # validate if they have enough credits
        summary_data = validated_data.get('summary')

        max_credit_offset = OrganizationService.get_max_credit_offset(
            instance.organization,
            instance.compliance_period.description
        )

        if summary_data and instance.supplements_id is None and \
                summary_data.get('credits_offset', 0) and \
                summary_data.get('credits_offset', 0) > max_credit_offset:
            raise (serializers.ValidationError(
                'Insufficient available credit balance. Please adjust Line 26.'
            ))

        if summary_data and instance.supplements_id and \
                summary_data.get('credits_offset_b', 0) and \
                summary_data.get('credits_offset_b', 0) > max_credit_offset:
            raise (serializers.ValidationError(
                'Insufficient available credit balance. Please adjust Line 26b.'
            ))

        if 'status' in validated_data:
            status_data = validated_data.pop('status')
            can_change = ComplianceReportPermissions.user_can_change_status(
                request.user,
                instance,
                new_fuel_supplier_status=status_data[
                    'fuel_supplier_status'
                ].status if 'fuel_supplier_status' in status_data else None,
                new_analyst_status=status_data[
                    'analyst_status'
                ].status if 'analyst_status' in status_data else None,
                new_director_status=status_data[
                    'director_status'
                ].status if 'director_status' in status_data else None,
                new_manager_status=status_data[
                    'manager_status'
                ].status if 'manager_status' in status_data else None
            )
            if not can_change:
                raise PermissionDenied('Invalid status change')

            if 'fuel_supplier_status' in status_data:
                instance.status.fuel_supplier_status = status_data[
                    'fuel_supplier_status'
                ]

                if instance.status.fuel_supplier_status.status in [
                        'Submitted'
                ]:
                    # validate if they have enough credits
                    summary_data = validated_data.get('summary')

                    max_credit_offset = OrganizationService.get_max_credit_offset(
                        instance.organization,
                        instance.compliance_period.description
                    )

                    credits_offset = 0

                    if summary_data:
                        if not instance.is_supplemental:
                            credits_offset = summary_data.get(
                                'credits_offset', 0
                            )
                        elif 'credits_offset_b' in summary_data.keys():
                            credits_offset = summary_data.get(
                                'credits_offset_b', 0
                            )

                    if not credits_offset:
                        credits_offset = 0

                    if credits_offset > max_credit_offset:
                        raise (serializers.ValidationError(
                            'Insufficient available credit balance. '
                            'Please adjust Line 26.'
                        ))

                if instance.supplements is not None and \
                        instance.status.fuel_supplier_status.status in [
                            'Submitted'
                        ]:
                    # supplemental note is required
                    if 'supplemental_note' not in validated_data:
                        raise ValidationError(
                            'supplemental note is required when submitting a '
                            'supplemental report'
                        )
                    instance.supplemental_note = validated_data.pop(
                        'supplemental_note'
                    )
            if 'analyst_status' in status_data:
                instance.status.analyst_status = status_data['analyst_status']
            if 'manager_status' in status_data:
                instance.status.manager_status = status_data['manager_status']
            if 'director_status' in status_data:
                instance.status.director_status = \
                    status_data['director_status']

            instance.status.save()

        if 'schedule_d' in validated_data:
            schedule_d_data = validated_data.pop('schedule_d')

            if instance.schedule_d:
                ScheduleDSheetInput.objects.filter(
                    sheet__schedule=instance.schedule_d
                ).delete()
                ScheduleDSheetOutput.objects.filter(
                    sheet__schedule=instance.schedule_d
                ).delete()
                ScheduleDSheet.objects.filter(
                    schedule=instance.schedule_d
                ).delete()
                ScheduleD.objects.filter(id=instance.schedule_d.id).delete()

            if schedule_d_data is not None:
                sheets_data = schedule_d_data.pop('sheets') \
                    if 'sheets' in schedule_d_data else []

                schedule_d = ScheduleD.objects.create(
                    **schedule_d_data,
                    compliance_report=instance
                )
                instance.schedule_d = schedule_d

                for sheet_data in sheets_data:
                    inputs_data = sheet_data.pop('inputs')
                    outputs_data = sheet_data.pop('outputs')
                    sheet = ScheduleDSheet.objects.create(
                        **sheet_data,
                        schedule=schedule_d
                    )

                    for input_data in inputs_data:
                        input = ScheduleDSheetInput.objects.create(
                            **input_data,
                            sheet=sheet
                        )
                        sheet.inputs.add(input)
                        sheet.save()

                    for output_data in outputs_data:
                        output = ScheduleDSheetOutput.objects.create(
                            **output_data,
                            sheet=sheet
                        )
                        sheet.outputs.add(output)
                        sheet.save()

                    schedule_d.sheets.add(sheet)
                    schedule_d.save()
            else:
                instance.schedule_d = None

            instance.save()

        if 'schedule_c' in validated_data:
            schedule_c_data = validated_data.pop('schedule_c')

            if instance.schedule_c:
                ScheduleCRecord.objects.filter(
                    schedule=instance.schedule_c
                ).delete()
                ScheduleC.objects.filter(id=instance.schedule_c.id).delete()

            if 'records' in schedule_c_data:
                records_data = schedule_c_data.pop('records')

                schedule_c = ScheduleC.objects.create(
                    **schedule_c_data,
                    compliance_report=instance
                )
                instance.schedule_c = schedule_c

                for record_data in records_data:
                    record = ScheduleCRecord.objects.create(
                        **record_data,
                        schedule=schedule_c
                    )
                    schedule_c.records.add(record)
                    schedule_c.save()

            instance.save()

        if 'schedule_b' in validated_data:
            schedule_b_data = validated_data.pop('schedule_b')

            if instance.schedule_b:
                ScheduleBRecord.objects.filter(
                    schedule=instance.schedule_b
                ).delete()
                ScheduleB.objects.filter(id=instance.schedule_b.id).delete()

            if 'records' in schedule_b_data:
                records_data = schedule_b_data.pop('records')

                schedule_b = ScheduleB.objects.create(
                    **schedule_b_data,
                    compliance_report=instance
                )
                instance.schedule_b = schedule_b

                for record_data in records_data:
                    record = ScheduleBRecord.objects.create(
                        **record_data,
                        schedule=schedule_b
                    )
                    schedule_b.records.add(record)
                    schedule_b.save()

            instance.save()

        if 'schedule_a' in validated_data:
            schedule_a_data = validated_data.pop('schedule_a')

            if instance.schedule_a:
                ScheduleARecord.objects.filter(
                    schedule=instance.schedule_a
                ).delete()
                ScheduleA.objects.filter(id=instance.schedule_a.id).delete()

            if 'records' in schedule_a_data:
                records_data = schedule_a_data.pop('records')

                schedule_a = ScheduleA.objects.create(
                    **schedule_a_data,
                    compliance_report=instance
                )
                instance.schedule_a = schedule_a

                for record_data in records_data:
                    record = ScheduleARecord.objects.create(
                        **record_data,
                        schedule=schedule_a
                    )
                    schedule_a.records.add(record)
                    schedule_a.save()

            instance.save()

        if 'summary' in validated_data and not self.strip_summary:
            summary_data = validated_data.pop('summary')

            if instance.summary:
                ScheduleSummary.objects.filter(id=instance.summary.id).delete()

            summary = ScheduleSummary.objects.create(
                **summary_data,
                compliance_report=instance
            )
            instance.summary = summary

            instance.save()

        if instance.status.fuel_supplier_status.status in ['Submitted'] and \
                not instance.has_snapshot:
            # Create a snapshot
            request = self.context.get('request')
            ser = ComplianceReportDetailSerializer(
                instance, context=self.context
            )
            ser.skip_deltas = True
            snap = dict(ser.data)
            snap['version'] = 1  # to track deserialization version
            snap['timestamp'] = datetime.now()

            ComplianceReportSnapshot.objects.filter(
                compliance_report=instance
            ).delete()
            ComplianceReportSnapshot.objects.create(
                compliance_report=instance,
                create_user=request.user,
                create_timestamp=datetime.now(),
                snapshot=snap
            )

        if previous_director_status not in ['Accepted'] and \
                instance.status.director_status.status in ['Accepted']:
            # should create a PVR
            ComplianceReportService.create_director_transactions(
                instance, request.user
            )

        instance.update_user = request.user
        instance.save()
        
        # all other fields are read-only
        return instance

    class Meta:
        model = ComplianceReport
        fields = (
            'status', 'type', 'compliance_period', 'organization',
            'schedule_a', 'schedule_b', 'schedule_c', 'schedule_d',
            'summary', 'read_only', 'has_snapshot', 'actions', 'actor',
            'display_name', 'supplemental_note', 'is_supplemental',
            'max_credit_offset', 'max_credit_offset_exclude_reserved', 'total_previous_credit_reductions',
            'supplemental_number', 'last_accepted_offset', 'history',
            'previous_report_was_credit'
        )
        read_only_fields = (
            'compliance_period', 'read_only', 'has_snapshot', 'organization',
            'actions', 'actor', 'display_name', 'is_supplemental',
            'max_credit_offset', 'max_credit_offset_exclude_reserved', 'total_previous_credit_reductions',
            'supplemental_number', 'last_accepted_offset', 'history'
        )


class ComplianceReportDeleteSerializer(serializers.ModelSerializer):
    """
    Delete serializer for Compliance Reports
    """

    def destroy(self):
        """
        Delete function to mark the compliance report as deleted.
        """
        compliance_report = self.instance

        if compliance_report.status.fuel_supplier_status not in \
                ComplianceReportStatus.objects.filter(status__in=["Draft"]):
            raise serializers.ValidationError({
                'readOnly': "Cannot delete a compliance report that's not a "
                            "draft."
            })

        compliance_report.status.fuel_supplier_status = \
            ComplianceReportStatus.objects.get(status="Deleted")
        compliance_report.status.save()

    class Meta:
        model = ComplianceReport
        fields = '__all__'


class ComplianceReportSnapshotSerializer(serializers.ModelSerializer):
    """
    Serialize snapshots
    """

    class Meta:
        model = ComplianceReportSnapshot
        fields = '__all__'
