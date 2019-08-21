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

from api.models.ApprovedFuel import ApprovedFuel
from api.models.CompliancePeriod import CompliancePeriod
from api.models.ComplianceReport import \
    ComplianceReport, ComplianceReportStatus
from api.models.ExclusionReportAgreement import \
    ExclusionAgreement, ExclusionAgreementRecord
from api.models.TransactionType import TransactionType
from api.serializers.ComplianceReport import \
    ComplianceReportStatusSerializer, ComplianceReportTypeSerializer
from api.serializers import \
    OrganizationMinSerializer, CompliancePeriodSerializer


class ExclusionAgreementRecordSerializer(serializers.ModelSerializer):
    transaction_type = SlugRelatedField(
        slug_field='the_type', queryset=TransactionType.objects.all())
    fuel_type = SlugRelatedField(
        slug_field='name', queryset=ApprovedFuel.objects.all())

    class Meta:
        model = ExclusionAgreementRecord
        fields = (
            'transaction_partner', 'postal_address', 'quantity', 'quantity',
            'quantity_not_sold', 'transaction_type', 'fuel_type'
        )


class ExclusionAgreementSerializer(serializers.ModelSerializer):
    records = ExclusionAgreementRecordSerializer(many=True, required=False)

    class Meta:
        model = ExclusionAgreement
        fields = ('records',)


class ExclusionReportDetailSerializer(serializers.ModelSerializer):
    """
    Detail Serializer for the Exclusion Report
    """
    status = ComplianceReportStatusSerializer(read_only=True)
    type = ComplianceReportTypeSerializer(read_only=True)
    organization = OrganizationMinSerializer(read_only=True)
    compliance_period = CompliancePeriodSerializer(read_only=True)
    exclusion_agreement = ExclusionAgreementSerializer(read_only=True)
    history = serializers.SerializerMethodField()

    def get_history(self, obj):
        """
        Returns all the previous status changes for the credit trade
        """
        from .ComplianceReportHistory import ComplianceReportHistorySerializer

        history = obj.get_history(["Submitted"])

        serializer = ComplianceReportHistorySerializer(
            history, many=True
        )

        return serializer.data

    class Meta:
        model = ComplianceReport
        fields = ['id', 'status', 'type', 'organization', 'compliance_period',
                  'exclusion_agreement', 'read_only', 'history']


class ExclusionReportUpdateSerializer(serializers.ModelSerializer):
    """
    Update Serializer for the Compliance Report
    """
    status = SlugRelatedField(
        slug_field='status',
        queryset=ComplianceReportStatus.objects.filter(
            status__in=['Draft', 'Submitted']
        )
    )
    type = SlugRelatedField(slug_field='the_type', read_only=True)
    compliance_period = SlugRelatedField(
        slug_field='description',
        read_only=True
    )
    organization = OrganizationMinSerializer(read_only=True)
    exclusion_agreement = ExclusionAgreementSerializer(
        allow_null=True, required=False
    )

    def validate_exclusion_agreement(self, data):
        return data

    def update(self, instance, validated_data):
        if 'exclusion_agreement' in validated_data:
            agreement_data = validated_data.pop('exclusion_agreement')

            if instance.exclusion_agreement:
                ExclusionAgreementRecord.objects.filter(
                    exclusion_agreement=instance.exclusion_agreement
                ).delete()

                exclusion_agreement = instance.exclusion_agreement

            if 'records' in agreement_data:
                records_data = agreement_data.pop('records')

                if not instance.exclusion_agreement:
                    exclusion_agreement = ExclusionAgreement.objects.create(
                        **agreement_data,
                        compliance_report=instance
                    )
                    instance.exclusion_agreement = exclusion_agreement

                for record_data in records_data:
                    record = ExclusionAgreementRecord.objects.create(
                        **record_data,
                        exclusion_agreement=exclusion_agreement
                    )
                    exclusion_agreement.records.add(record)
                    exclusion_agreement.save()

            instance.save()

        status = validated_data.get('status', None)

        if status:
            instance.status = status

        request = self.context.get('request')
        if request:
            instance.update_user = request.user
            instance.save()

        # all other fields are read-only
        return instance

    class Meta:
        model = ComplianceReport
        fields = ('status', 'type', 'compliance_period', 'organization',
                  'exclusion_agreement', 'read_only')
        read_only_fields = ('compliance_period', 'read_only', 'organization')
