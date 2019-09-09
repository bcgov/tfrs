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
from api.models.ComplianceReport import ComplianceReport
from api.models.ComplianceReportSnapshot import ComplianceReportSnapshot
from api.models.ExclusionReportAgreement import \
    ExclusionAgreement, ExclusionAgreementRecord
from api.models.TransactionType import TransactionType
from api.serializers.ComplianceReport import \
    ComplianceReportTypeSerializer, ComplianceReportWorkflowStateSerializer
from api.permissions.ComplianceReport import ComplianceReportPermissions
from api.serializers import \
    datetime, OrganizationMinSerializer, CompliancePeriodSerializer


class ExclusionAgreementRecordSerializer(serializers.ModelSerializer):
    """
    Default Serializer for the Exclusion Agreement rows
    """
    transaction_type = SlugRelatedField(
        slug_field='the_type', queryset=TransactionType.objects.all())
    fuel_type = SlugRelatedField(
        slug_field='name', queryset=ApprovedFuel.objects.all())
    unit_of_measure = serializers.SerializerMethodField()

    def get_unit_of_measure(self, obj):
        """
        Get the unit of measure based on the fuel type that was
        saved into the Exclusion Agreement
        """
        if obj.fuel_type:
            return obj.fuel_type.unit_of_measure.name

        return None

    class Meta:
        model = ExclusionAgreementRecord
        fields = (
            'transaction_partner', 'postal_address', 'quantity',
            'quantity_not_sold', 'transaction_type', 'fuel_type',
            'unit_of_measure'
        )


class ExclusionAgreementSerializer(serializers.ModelSerializer):
    """
    Default Serializer for Exclusion Agreement
    """
    records = ExclusionAgreementRecordSerializer(many=True, required=False)

    class Meta:
        model = ExclusionAgreement
        fields = ('records',)


class ExclusionReportDetailSerializer(serializers.ModelSerializer):
    """
    Detail Serializer for the Exclusion Report
    """
    actions = serializers.SerializerMethodField()
    actor = serializers.SerializerMethodField()
    compliance_period = CompliancePeriodSerializer(read_only=True)
    exclusion_agreement = ExclusionAgreementSerializer(read_only=True)
    history = serializers.SerializerMethodField()
    organization = OrganizationMinSerializer(read_only=True)
    status = ComplianceReportWorkflowStateSerializer(read_only=True)
    type = ComplianceReportTypeSerializer(read_only=True)

    def get_actor(self, obj):
        return ComplianceReportPermissions.get_relationship(
            obj, self.context['request'].user
        ).value

    def get_actions(self, obj):
        relationship = ComplianceReportPermissions.get_relationship(
            obj, self.context['request'].user
        )

        return ComplianceReportPermissions.get_available_actions(
            obj,
            relationship
        )

    def get_history(self, obj):
        """
        Returns all the previous status changes for the credit trade
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
                  'exclusion_agreement', 'read_only', 'history', 'actions',
                  'actor', 'has_snapshot']


class ExclusionReportUpdateSerializer(serializers.ModelSerializer):
    """
    Update Serializer for the Exclusion Report
    """
    actions = serializers.SerializerMethodField()
    actor = serializers.SerializerMethodField()
    compliance_period = SlugRelatedField(
        slug_field='description',
        read_only=True
    )
    exclusion_agreement = ExclusionAgreementSerializer(
        allow_null=True, required=False
    )
    organization = OrganizationMinSerializer(read_only=True)
    status = ComplianceReportWorkflowStateSerializer(required=False)
    type = SlugRelatedField(slug_field='the_type', read_only=True)

    def get_actions(self, obj):
        relationship = ComplianceReportPermissions.get_relationship(
            obj, self.context['request'].user
        )

        return ComplianceReportPermissions.get_available_actions(
            obj,
            relationship
        )

    def get_actor(self, obj):
        return ComplianceReportPermissions.get_relationship(
            obj, self.context['request'].user
        ).value

    def validate_exclusion_agreement(self, data):
        return data

    def update(self, instance, validated_data):
        request = self.context.get('request')

        if 'status' in validated_data:
            status_data = validated_data.pop('status')
            can_change = ComplianceReportPermissions.user_can_change_status(
                request.user,
                instance,
                new_fuel_supplier_status=status_data[
                    'fuel_supplier_status'].status
                if 'fuel_supplier_status' in status_data else None,
                new_analyst_status=status_data['analyst_status'].status
                if 'analyst_status' in status_data else None,
                new_director_status=status_data['director_status'].status
                if 'director_status' in status_data else None,
                new_manager_status=status_data['manager_status'].status
                if 'manager_status' in status_data else None
            )
            if not can_change:
                raise PermissionDenied('Invalid status change')

            if 'fuel_supplier_status' in status_data:
                instance.status.fuel_supplier_status = status_data[
                    'fuel_supplier_status']
            if 'analyst_status' in status_data:
                instance.status.analyst_status = status_data[
                    'analyst_status']
            if 'manager_status' in status_data:
                instance.status.manager_status = status_data[
                    'manager_status']
            if 'director_status' in status_data:
                instance.status.director_status = status_data[
                    'director_status']

            instance.status.save()

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

        if instance.status.fuel_supplier_status.status in ['Submitted'] and \
                not instance.has_snapshot:
            # Create a snapshot
            request = self.context.get('request')
            snap = dict(ExclusionReportDetailSerializer(
                instance,
                context=self.context
            ).data)
            snap['version'] = 1  # to track deserialization version
            snap['timestamp'] = datetime.now()

            ComplianceReportSnapshot.objects.filter(compliance_report=instance).delete()
            ComplianceReportSnapshot.objects.create(
                compliance_report=instance,
                create_user=request.user,
                create_timestamp=datetime.now(),
                snapshot=snap
            )

        if request:
            instance.update_user = request.user

        instance.save()

        # all other fields are read-only
        return instance

    class Meta:
        model = ComplianceReport
        fields = (
            'status', 'type', 'compliance_period', 'organization',
            'exclusion_agreement', 'read_only', 'actions', 'actor'
        )
        read_only_fields = (
            'compliance_period', 'read_only', 'organization', 'actions',
            'actor'
        )
