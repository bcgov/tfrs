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
from rest_framework.relations import SlugRelatedField, PrimaryKeyRelatedField

from api.models.CompliancePeriod import CompliancePeriod
from api.models.ComplianceReport import ComplianceReportType, ComplianceReportStatus, ComplianceReport
from api.models.ComplianceReportSchedules import ScheduleCRecord, ScheduleC
from api.serializers import OrganizationMinSerializer, CompliancePeriodSerializer, ValidationError
from api.serializers.ComplianceReportSchedules import ScheduleCDetailSerializer


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
    schedule_c = ScheduleCDetailSerializer(read_only=True)

    class Meta:
        model = ComplianceReport
        fields = ['id', 'status', 'type', 'organization', 'compliance_period', 'schedule_c']


class ComplianceReportCreateSerializer(serializers.ModelSerializer):
    status = SlugRelatedField(slug_field='status',
                              queryset=ComplianceReportStatus.objects.filter(status__in=['Draft']))
    type = SlugRelatedField(slug_field='the_type', queryset=ComplianceReportType.objects.all())
    compliance_period = SlugRelatedField(slug_field='description',
                                         queryset=CompliancePeriod.objects.all())
    organization = OrganizationMinSerializer(read_only=True)
    schedule_c = ScheduleCDetailSerializer(allow_null=True, required=False)

    def create(self, validated_data):
        schedule_c_data = None
        if 'schedule_c' in validated_data:
            schedule_c_data = validated_data.pop('schedule_c')

        instance = ComplianceReport.objects.create(**validated_data)

        if schedule_c_data and 'records' in schedule_c_data:
            records_data = schedule_c_data.pop('records')
            schedule_c = ScheduleC.objects.create(**schedule_c_data, compliance_report=instance)
            instance.schedule_c = schedule_c
            for record_data in records_data:
                record = ScheduleCRecord.objects.create(**record_data, schedule=schedule_c)
                schedule_c.records.add(record)
                schedule_c.save()

        instance.save()
        return instance

    class Meta:
        model = ComplianceReport
        fields = ('status', 'type', 'compliance_period', 'organization', 'schedule_c')


class ComplianceReportUpdateSerializer(serializers.ModelSerializer):
    status = SlugRelatedField(slug_field='status',
                              queryset=ComplianceReportStatus.objects.filter(status__in=['Draft']))
    type = SlugRelatedField(slug_field='the_type', read_only=True)
    compliance_period = SlugRelatedField(slug_field='description', read_only=True)
    organization = OrganizationMinSerializer(read_only=True)
    schedule_c = ScheduleCDetailSerializer(allow_null=True, required=False)

    def update(self, instance, validated_data):
        if 'schedule_c' in validated_data:
            schedule_c_data = validated_data.pop('schedule_c')

            if instance.schedule_c:
                ScheduleCRecord.objects.filter(schedule=instance.schedule_c).delete()
                instance.schedule_c.delete()

            if 'records' in schedule_c_data:
                records_data = schedule_c_data.pop('records')

                schedule_c = ScheduleC.objects.create(**schedule_c_data, compliance_report=instance)
                instance.schedule_c = schedule_c

                for record_data in records_data:
                    record = ScheduleCRecord.objects.create(**record_data, schedule=schedule_c)
                    schedule_c.records.add(record)
                    schedule_c.save()

            instance.save()

        # all other fields are read-only
        return instance

    class Meta:
        model = ComplianceReport
        fields = ('status', 'type', 'compliance_period', 'organization', 'schedule_c')


class ComplianceReportDeleteSerializer(serializers.ModelSerializer):
    """
    Delete serializer for Compliance Reports
    """

    def destroy(self):
        """
        Delete function to mark the compliance report as deleted.
        """
        compliance_report = self.instance
        if compliance_report.status not in ComplianceReportStatus.objects.filter(
                status__in=["Draft"]):
            raise serializers.ValidationError({
                'readOnly': "Cannot delete a compliance report that's not a draft."
            })

        compliance_report.status = ComplianceReportStatus.objects.get(status="Deleted")
        compliance_report.save()

    class Meta:
        model = ComplianceReport
        fields = '__all__'
