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

from rest_framework import serializers
from rest_framework.exceptions import PermissionDenied
from rest_framework.relations import SlugRelatedField

from api.models.CompliancePeriod import CompliancePeriod
from api.models.ComplianceReport import \
    ComplianceReportType, ComplianceReportStatus, ComplianceReport, ComplianceReportWorkflowState
from api.models.ComplianceReportSchedules import \
    ScheduleCRecord, ScheduleC, ScheduleARecord, ScheduleA, \
    ScheduleBRecord, ScheduleB, ScheduleD, ScheduleDSheet, \
    ScheduleDSheetOutput, ScheduleDSheetInput, ScheduleSummary
from api.models.ComplianceReportSnapshot import ComplianceReportSnapshot
from api.permissions.ComplianceReport import ComplianceReportPermissions
from api.serializers import \
    OrganizationMinSerializer, CompliancePeriodSerializer, datetime
from api.serializers.ComplianceReportSchedules import \
    ScheduleCDetailSerializer, ScheduleADetailSerializer, \
    ScheduleBDetailSerializer, ScheduleDDetailSerializer, \
    ScheduleSummaryDetailSerializer
from api.serializers.constants import ComplianceReportValidation

from decimal import *


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
    fuel_supplier_status = SlugRelatedField(slug_field='status',
                                            queryset=ComplianceReportStatus.objects.all(),
                                            required=False)
    director_status = SelectiveVisibilitySlugField(slug_field='status',
                                                   queryset=ComplianceReportStatus.objects.all(),
                                                   required=False)
    analyst_status = SelectiveVisibilitySlugField(slug_field='status',
                                                  queryset=ComplianceReportStatus.objects.all(),
                                                  required=False)
    manager_status = SelectiveVisibilitySlugField(slug_field='status',
                                                  queryset=ComplianceReportStatus.objects.all(),
                                                  required=False)

    def should_show(self, field_name, value):
        user = self.context['request'].user if 'request' in self.context else None

        # Show director_status 'Accepted' to everyone
        if value.status in ['Accepted'] and field_name in 'director_status':
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

    class Meta:
        model = ComplianceReport
        fields = ('id', 'status', 'type', 'organization', 'compliance_period',
                  'update_timestamp', 'has_snapshot', 'read_only')


class ComplianceReportDetailSerializer(serializers.ModelSerializer):
    """
    Detail Serializer for the Compliance Report
    """
    status = ComplianceReportWorkflowStateSerializer(read_only=True)
    type = ComplianceReportTypeSerializer(read_only=True)
    organization = OrganizationMinSerializer(read_only=True)
    compliance_period = CompliancePeriodSerializer(read_only=True)
    schedule_a = ScheduleADetailSerializer(read_only=True)
    schedule_b = ScheduleBDetailSerializer(read_only=True)
    schedule_c = ScheduleCDetailSerializer(read_only=True)
    schedule_d = ScheduleDDetailSerializer(read_only=True)
    actions = serializers.SerializerMethodField()
    actor = serializers.SerializerMethodField()
    summary = serializers.SerializerMethodField()
    history = serializers.SerializerMethodField()

    def get_actor(self, obj):
        return  ComplianceReportPermissions.get_relationship(obj, self.context['request'].user).value

    def get_actions(self, obj):
        relationship = ComplianceReportPermissions.get_relationship(obj, self.context['request'].user)
        return ComplianceReportPermissions.get_available_actions(obj, relationship)

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
            lines[
                '6'] = obj.summary.gasoline_class_retained if obj.summary.gasoline_class_retained is not None else Decimal(
                0)
            lines[
                '8'] = obj.summary.gasoline_class_deferred if obj.summary.gasoline_class_deferred is not None else Decimal(
                0)
            lines[
                '17'] = obj.summary.diesel_class_retained if obj.summary.diesel_class_retained is not None else Decimal(
                0)
            lines[
                '19'] = obj.summary.diesel_class_deferred if obj.summary.diesel_class_deferred is not None else Decimal(
                0)
            lines['26'] = obj.summary.credits_offset if obj.summary.credits_offset is not None else Decimal(0)
        else:
            lines['6'] = Decimal(0)
            lines['8'] = Decimal(0)
            lines['17'] = Decimal(0)
            lines['19'] = Decimal(0)
            lines['26'] = Decimal(0)

        if obj.schedule_a:
            net_gasoline_class_transferred += obj.schedule_a.net_gasoline_class_transferred
            net_diesel_class_transferred += obj.schedule_a.net_diesel_class_transferred

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

        lines['1'] = total_petroleum_gasoline
        lines['2'] = total_renewable_gasoline
        lines['3'] = lines['1'] + lines['2']
        lines['4'] = (lines['3'] * Decimal('0.05')).quantize(Decimal('1.'),
                                                             rounding=ROUND_HALF_UP)  # hardcoded 5% renewable requirement
        lines['7'] = Decimal(0)
        lines['9'] = Decimal(0)
        lines['10'] = lines['2'] + lines['5'] - lines['6'] + lines['7'] + lines['8'] - lines['9']
        lines['11'] = ((lines['4'] - lines['10']) * Decimal('0.30')).max(Decimal(0)).quantize(Decimal('.01'),
                                                                                              rounding=ROUND_HALF_UP)

        lines['12'] = total_petroleum_diesel
        lines['13'] = total_renewable_diesel
        lines['14'] = lines['12'] + lines['13']
        lines['15'] = (lines['14'] * Decimal('0.04')).quantize(Decimal('1.'),
                                                               rounding=ROUND_HALF_UP)  # hardcoded 4% renewable requirement
        lines['18'] = Decimal(0)
        lines['20'] = Decimal(0)
        lines['21'] = lines['13'] + lines['16'] - lines['17'] + lines['18'] + lines['19'] - lines['20']
        lines['22'] = ((lines['15'] - lines['21']) * Decimal('0.45')).max(Decimal(0)).quantize(Decimal('.01'),
                                                                                               rounding=ROUND_HALF_UP)

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
        user = self.context['request'].user if 'request' in self.context else None

        if user and user.is_government_user:
            from .ComplianceReportHistory import ComplianceReportHistorySerializer

            history = obj.get_history(["Submitted"])

            serializer = ComplianceReportHistorySerializer(
                history, many=True
            )

            return serializer.data
        else:
            return None

    class Meta:
        model = ComplianceReport
        fields = ['id', 'status', 'type', 'organization', 'compliance_period',
                  'schedule_a', 'schedule_b', 'schedule_c', 'schedule_d',
                  'summary', 'read_only', 'history', 'has_snapshot', 'actions',
                  'actor']


class ComplianceReportValidator:
    """
    Validation method mixin used for validate and update serializers to check business rules for
    schedule validation (like preventing duplicate rows)
    """
    def validate_schedule_a(self, data):
        if 'records' not in data:
            return data

        seen_tuples = {}

        for (i, record) in enumerate(data['records']):
            prov = None

            if ('trading_partner' in record and record['trading_partner'] is not None) and \
                    ('postal_address' in record and record['postal_address'] is not None) and \
                    ('transfer_type' in record and record['transfer_type'] is not None) and \
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
                        ComplianceReportValidation.duplicate_with_row.format(row=x))

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
            sdi = record['schedule_d_sheet_index'] if 'schedule_d_sheet_index' in record else None
            prov = None

            if ('fuel_type' in record and record['fuel_type'] is not None) and \
                    ('fuel_class' in record and record['fuel_class'] is not None) and \
                    ('provision_of_the_act' in record and record['provision_of_the_act'] is not None) and \
                    record['provision_of_the_act'].provision in obligate_unique_provisions:
                prov = (record['fuel_type'], record['fuel_class'], record['provision_of_the_act'])

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
                        ComplianceReportValidation.duplicate_with_row.format(row=x))

        for k in seen_indices.keys():
            if len(seen_indices[k]) > 1:
                for x in seen_indices[k]:
                    failures.append(
                        ComplianceReportValidation.duplicate_with_row.format(row=x))

        for k in seen_tuples.keys():
            if len(seen_tuples[k]) > 1:
                for x in seen_tuples[k]:
                    failures.append(
                        ComplianceReportValidation.duplicate_with_row.format(row=x))

        if len(failures) > 0:
            raise (serializers.ValidationError(failures))

        return data

    def validate_schedule_c(self, data):
        if 'records' not in data:
            return data

        seen_tuples = {}

        for (i, record) in enumerate(data['records']):
            prov = None

            if ('expected_use' in record and record['expected_use'] is not None) and \
                    ('fuel_type' in record and record['fuel_type'] is not None) and \
                    ('fuel_class' in record and record['fuel_class'] is not None) and \
                    record['expected_use'].description != 'Other':
                prov = (record['fuel_type'],
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
                        ComplianceReportValidation.duplicate_with_row.format(row=x))

        if len(failures) > 0:
            raise (serializers.ValidationError(failures))

        return data


class ComplianceReportValidationSerializer(serializers.ModelSerializer, ComplianceReportValidator):
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
            fc = record['fuel_code']
            sdi = record['schedule_d_sheet_index']
            prov = None

            if ('fuel_type' in record and record['fuel_type'] is not None) and \
                    ('fuel_class' in record and record['fuel_class'] is not None) and \
                    ('provision_of_the_act' in record and record['provision_of_the_act'] is not None) and \
                    record['provision_of_the_act'].provision in obligate_unique_provisions:
                prov = (record['fuel_type'], record['fuel_class'], record['provision_of_the_act'])

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
                        ComplianceReportValidation.duplicateWithRow.format(row=x))

        for k in seen_indices.keys():
            if len(seen_indices[k]) > 1:
                for x in seen_indices[k]:
                    failures.append(
                        ComplianceReportValidation.duplicateWithRow.format(row=x))

        for k in seen_tuples.keys():
            if len(seen_tuples[k]) > 1:
                for x in seen_tuples[k]:
                    failures.append(
                        ComplianceReportValidation.duplicateWithRow.format(row=x))

        if len(failures) > 0:
            raise (serializers.ValidationError(failures))

        return data


class ComplianceReportValidationSerializer(serializers.ModelSerializer, ComplianceReportValidator):
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
    organization = OrganizationMinSerializer(read_only=True)

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
        return ComplianceReport.objects.create(
            status=status,
            **validated_data)

    def save(self, **kwargs):
        super().save(**kwargs)

        request = self.context['request']
        self.instance.create_user = request.user
        self.instance.update_user = request.user
        self.instance.save()

    class Meta:
        model = ComplianceReport
        fields = ('status', 'type', 'compliance_period', 'organization',
                  'id')
        read_only_fields = ('id',)


class ComplianceReportUpdateSerializer(
    serializers.ModelSerializer, ComplianceReportValidator
):
    """
    Update Serializer for the Compliance Report
    """
    status = ComplianceReportWorkflowStateSerializer(required=False)
    type = SlugRelatedField(slug_field='the_type', read_only=True)
    compliance_period = SlugRelatedField(
        slug_field='description',
        read_only=True
    )
    organization = OrganizationMinSerializer(read_only=True)
    schedule_a = ScheduleADetailSerializer(allow_null=True, required=False)
    schedule_b = ScheduleBDetailSerializer(allow_null=True, required=False)
    schedule_c = ScheduleCDetailSerializer(allow_null=True, required=False)
    schedule_d = ScheduleDDetailSerializer(allow_null=True, required=False)
    summary = ScheduleSummaryDetailSerializer(allow_null=True, required=False)
    actions = serializers.SerializerMethodField()
    actor = serializers.SerializerMethodField()
    strip_summary = False
    disregard_status = False

    def get_actor(self, obj):
        return  ComplianceReportPermissions.get_relationship(obj, self.context['request'].user).value

    def get_actions(self, obj):
        relationship = ComplianceReportPermissions.get_relationship(obj, self.context['request'].user)
        return ComplianceReportPermissions.get_available_actions(obj, relationship)

    def update(self, instance, validated_data):
        request = self.context.get('request')

        if instance.read_only and not self.disregard_status and not request.user.organization.id == 1:
            raise PermissionDenied('Cannot modify this compliance report')

        if 'status' in validated_data:
            status_data = validated_data.pop('status')
            can_change = ComplianceReportPermissions.user_can_change_status(
                request.user,
                instance,
                new_fuel_supplier_status=status_data[
                    'fuel_supplier_status'].status if 'fuel_supplier_status' in status_data else None,
                new_analyst_status=status_data['analyst_status'].status if 'analyst_status' in status_data else None,
                new_director_status=status_data['director_status'].status if 'director_status' in status_data else None,
                new_manager_status=status_data['manager_status'].status if 'manager_status' in status_data else None
            )
            if not can_change:
                raise PermissionDenied('Invalid status change')

            if 'fuel_supplier_status' in status_data:
                instance.status.fuel_supplier_status = status_data['fuel_supplier_status']
            if 'analyst_status' in status_data:
                instance.status.analyst_status = status_data['analyst_status']
            if 'manager_status' in status_data:
                instance.status.manager_status = status_data['manager_status']
            if 'director_status' in status_data:
                instance.status.director_status = status_data['director_status']

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

            sheets_data = schedule_d_data.pop('sheets')
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

        if instance.status.fuel_supplier_status.status in ['Submitted'] and not instance.has_snapshot:
            # Create a snapshot
            request = self.context.get('request')
            snap = dict(ComplianceReportDetailSerializer(instance, context=self.context).data)
            snap['version'] = 1  # to track deserialization version
            snap['timestamp'] = datetime.now()

            ComplianceReportSnapshot.objects.filter(compliance_report=instance).delete()
            ComplianceReportSnapshot.objects.create(
                compliance_report=instance,
                create_user=request.user,
                create_timestamp=datetime.now(),
                snapshot=snap
            )

        instance.update_user = request.user
        instance.save()

        # all other fields are read-only
        return instance

    class Meta:
        model = ComplianceReport
        fields = ('status', 'type', 'compliance_period', 'organization',
                  'schedule_a', 'schedule_b', 'schedule_c', 'schedule_d',
                  'summary', 'read_only', 'has_snapshot', 'actions', 'actor')
        read_only_fields = ('compliance_period', 'read_only', 'has_snapshot',
                            'organization', 'actions', 'actor')


class ComplianceReportDeleteSerializer(serializers.ModelSerializer):
    """
    Delete serializer for Compliance Reports
    """

    def destroy(self):
        """
        Delete function to mark the compliance report as deleted.
        """
        compliance_report = self.instance
        if compliance_report.status.fuel_supplier_status not in ComplianceReportStatus.objects. \
                filter(status__in=["Draft"]):
            raise serializers.ValidationError({
                'readOnly': "Cannot delete a compliance report that's not a "
                            "draft."
            })

        compliance_report.fuel_supplier_status = ComplianceReportStatus.objects.get(
            status="Deleted"
        )
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
