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
import logging

from rest_framework import serializers
from rest_framework.relations import SlugRelatedField

from api.models.CompliancePeriod import CompliancePeriod
from api.models.ComplianceReport import \
    ComplianceReportType, ComplianceReportStatus, ComplianceReport
from api.models.ComplianceReportSchedules import \
    ScheduleCRecord, ScheduleC, ScheduleARecord, ScheduleA, \
    ScheduleBRecord, ScheduleB
from api.serializers import \
    OrganizationMinSerializer, CompliancePeriodSerializer
from api.serializers.ComplianceReportSchedules import \
    ScheduleCDetailSerializer, ScheduleADetailSerializer, \
    ScheduleBDetailSerializer, ScheduleBRecordSerializer


class ComplianceReportTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ComplianceReportType
        fields = ('the_type', 'description')
        read_only_fields = ('the_type', 'description')


class ComplianceReportStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = ComplianceReportStatus
        fields = ('status',)
        read_only_fields = ('status',)


class ComplianceReportListSerializer(serializers.ModelSerializer):
    status = SlugRelatedField(slug_field='status', read_only=True)
    type = SlugRelatedField(slug_field='the_type', read_only=True)
    organization = OrganizationMinSerializer(read_only=True)
    compliance_period = CompliancePeriodSerializer(read_only=True)

    class Meta:
        model = ComplianceReport
        fields = ('id', 'status', 'type', 'organization', 'compliance_period',
                  'update_timestamp')


class ComplianceReportDetailSerializer(serializers.ModelSerializer):
    status = ComplianceReportStatusSerializer(read_only=True)
    type = ComplianceReportTypeSerializer(read_only=True)
    organization = OrganizationMinSerializer(read_only=True)
    compliance_period = CompliancePeriodSerializer(read_only=True)
    schedule_a = ScheduleADetailSerializer(read_only=True)
    schedule_b = ScheduleBDetailSerializer(read_only=True)
    schedule_c = ScheduleCDetailSerializer(read_only=True)
    summary = serializers.SerializerMethodField()

    def get_summary(self, obj):
        total_petroleum_diesel = 0
        total_petroleum_gasoline = 0
        total_renewable_diesel = 0
        total_renewable_gasoline = 0

        schedule_b_records = ScheduleBRecord.objects.filter(
            schedule_id=obj.schedule_b.id
        )

        for record in schedule_b_records:
            if record.fuel_type.name in [
                    "Biodiesel", "HDRD", "Renewable diesel"]:
                if record.fuel_code is not None and \
                        record.fuel_code.renewable_percentage > 0:
                    total_renewable_diesel += record.quantity * (
                        record.fuel_code.renewable_percentage/100
                    )
                else:
                    total_renewable_diesel += record.quantity

            elif record.fuel_type.name in ["Ethanol", "Renewable gasoline"]:
                if record.fuel_code is not None and \
                        record.fuel_code.renewable_percentage > 0:
                    total_renewable_gasoline += record.quantity * (
                        record.fuel_code.renewable_percentage/100
                    )
                else:
                    total_renewable_gasoline += record.quantity

            elif record.fuel_type.name == "Petroleum-based diesel":
                total_petroleum_diesel += record.quantity

            elif record.fuel_type.name == "Petroleum-based gasoline":
                total_petroleum_gasoline += record.quantity

        schedule_c_records = ScheduleCRecord.objects.filter(
            schedule_id=obj.schedule_c.id
        )

        for record in schedule_c_records:
            if record.fuel_type.name == "Petroleum-based diesel" and \
                    record.expected_use.description == "Heating Oil":
                total_petroleum_diesel += record.quantity

        return {
            "total_petroleum_diesel": total_petroleum_diesel,
            "total_petroleum_gasoline": total_petroleum_gasoline,
            "total_renewable_diesel": total_renewable_diesel,
            "total_renewable_gasoline": total_renewable_gasoline
        }

    class Meta:
        model = ComplianceReport
        fields = ['id', 'status', 'type', 'organization', 'compliance_period',
                  'schedule_a', 'schedule_b', 'schedule_c', 'summary']


class ComplianceReportCreateSerializer(serializers.ModelSerializer):
    status = SlugRelatedField(
        slug_field='status',
        queryset=ComplianceReportStatus.objects.filter(status__in=['Draft'])
    )
    type = SlugRelatedField(
        slug_field='the_type', queryset=ComplianceReportType.objects.all()
    )
    compliance_period = SlugRelatedField(
        slug_field='description',
        queryset=CompliancePeriod.objects.all()
    )
    organization = OrganizationMinSerializer(read_only=True)
    schedule_c = ScheduleCDetailSerializer(allow_null=True, required=False)
    schedule_b = ScheduleBDetailSerializer(allow_null=True, required=False)
    schedule_a = ScheduleADetailSerializer(allow_null=True, required=False)

    def create(self, validated_data):
        schedule_c_data = None
        if 'schedule_c' in validated_data:
            schedule_c_data = validated_data.pop('schedule_c')

        schedule_b_data = None
        if 'schedule_b' in validated_data:
            schedule_b_data = validated_data.pop('schedule_b')

        schedule_a_data = None
        if 'schedule_a' in validated_data:
            schedule_a_data = validated_data.pop('schedule_a')

        instance = ComplianceReport.objects.create(**validated_data)

        if schedule_c_data and 'records' in schedule_c_data:
            records_data = schedule_c_data.pop('records')
            schedule_c = ScheduleC.objects.create(
                **schedule_c_data, compliance_report=instance
            )
            instance.schedule_c = schedule_c
            for record_data in records_data:
                record = ScheduleCRecord.objects.create(
                    **record_data, schedule=schedule_c
                )
                schedule_c.records.add(record)
                schedule_c.save()

        if schedule_b_data and 'records' in schedule_b_data:
            records_data = schedule_b_data.pop('records')
            schedule_b = ScheduleB.objects.create(
                **schedule_b_data, compliance_report=instance
            )
            instance.schedule_b = schedule_b
            for record_data in records_data:
                record = ScheduleBRecord.objects.create(
                    **record_data, schedule=schedule_b
                )
                schedule_b.records.add(record)
                schedule_b.save()

        if schedule_a_data and 'records' in schedule_a_data:
            records_data = schedule_a_data.pop('records')
            schedule_a = ScheduleA.objects.create(
                **schedule_a_data, compliance_report=instance
            )
            instance.schedule_a = schedule_a
            for record_data in records_data:
                record = ScheduleARecord.objects.create(
                    **record_data, schedule=schedule_a
                )
                schedule_a.records.add(record)
                schedule_a.save()

        instance.save()
        return instance

    class Meta:
        model = ComplianceReport
        fields = ('status', 'type', 'compliance_period', 'organization',
                  'schedule_a', 'schedule_b', 'schedule_c')


class ComplianceReportUpdateSerializer(serializers.ModelSerializer):
    status = SlugRelatedField(
        slug_field='status',
        queryset=ComplianceReportStatus.objects.filter(status__in=['Draft'])
    )
    type = SlugRelatedField(slug_field='the_type', read_only=True)
    compliance_period = SlugRelatedField(slug_field='description', read_only=True)
    organization = OrganizationMinSerializer(read_only=True)
    schedule_a = ScheduleADetailSerializer(allow_null=True, required=False)
    schedule_b = ScheduleBDetailSerializer(allow_null=True, required=False)
    schedule_c = ScheduleCDetailSerializer(allow_null=True, required=False)

    def update(self, instance, validated_data):
        if 'schedule_c' in validated_data:
            schedule_c_data = validated_data.pop('schedule_c')

            if instance.schedule_c:
                ScheduleCRecord.objects.filter(
                    schedule=instance.schedule_c
                ).delete()
                instance.schedule_c.delete()

            if 'records' in schedule_c_data:
                records_data = schedule_c_data.pop('records')

                schedule_c = ScheduleC.objects.create(
                    **schedule_c_data, compliance_report=instance
                )
                instance.schedule_c = schedule_c

                for record_data in records_data:
                    record = ScheduleCRecord.objects.create(
                        **record_data, schedule=schedule_c
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
                instance.schedule_b.delete()

            if 'records' in schedule_b_data:
                records_data = schedule_b_data.pop('records')

                schedule_b = ScheduleB.objects.create(
                    **schedule_b_data, compliance_report=instance
                )
                instance.schedule_b = schedule_b

                for record_data in records_data:
                    record = ScheduleBRecord.objects.create(
                        **record_data, schedule=schedule_b
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
                instance.schedule_a.delete()

            if 'records' in schedule_a_data:
                records_data = schedule_a_data.pop('records')

                schedule_a = ScheduleA.objects.create(
                    **schedule_a_data, compliance_report=instance
                )
                instance.schedule_a = schedule_a

                for record_data in records_data:
                    record = ScheduleARecord.objects.create(
                        **record_data, schedule=schedule_a
                    )
                    schedule_a.records.add(record)
                    schedule_a.save()

            instance.save()

        # all other fields are read-only
        return instance

    class Meta:
        model = ComplianceReport
        fields = ('status', 'type', 'compliance_period', 'organization',
                  'schedule_a', 'schedule_b', 'schedule_c')


class ComplianceReportDeleteSerializer(serializers.ModelSerializer):
    """
    Delete serializer for Compliance Reports
    """

    def destroy(self):
        """
        Delete function to mark the compliance report as deleted.
        """
        compliance_report = self.instance
        if compliance_report.status not in \
                ComplianceReportStatus.objects.filter(status__in=["Draft"]):
            raise serializers.ValidationError({
                'readOnly': "Cannot delete a compliance report that's not a "
                            "draft."
            })

        compliance_report.status = ComplianceReportStatus.objects.get(
            status="Deleted"
        )
        compliance_report.save()

    class Meta:
        model = ComplianceReport
        fields = '__all__'
