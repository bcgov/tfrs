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
from api.serializers.CompliancePeriod import CompliancePeriodSerializer
from api.serializers.Organization import OrganizationDisplaySerializer
from api.serializers import \
    datetime, OrganizationMinSerializer, CompliancePeriodSerializer
from api.serializers.constants import ComplianceReportValidation
from api.services.ComplianceReportService import ComplianceReportService


class ExclusionAgreementRecordSerializer(serializers.ModelSerializer):
    """
    Default Serializer for the Exclusion Agreement rows
    """
    transaction_type = SlugRelatedField(
        slug_field='the_type', queryset=TransactionType.objects.all())
    fuel_type = SlugRelatedField(
        slug_field='name', queryset=ApprovedFuel.objects.all())
    unit_of_measure = serializers.SerializerMethodField()

    def validate_transaction_partner(self, value):
        org = self.context['request'].user.organization
        if value == org.name:
            raise serializers.ValidationError(ComplianceReportValidation.own_organization_selected)
        return value

    def validate_quantity(self, value):
        if value == 0:
            raise serializers.ValidationError(ComplianceReportValidation.zero)

        if value < 0:
            raise serializers.ValidationError(
                ComplianceReportValidation.negative
            )

        if round(value) != value:
            raise serializers.ValidationError(
                ComplianceReportValidation.fractional
            )

        return value

    def validate_quantity_not_sold(self, value):
        if value < 0:
            raise serializers.ValidationError(
                ComplianceReportValidation.negative
            )

        if round(value) != value:
            raise serializers.ValidationError(
                ComplianceReportValidation.fractional
            )

        return value

    def validate(self, data):
        if data['quantity_not_sold'] > data['quantity']:
            raise serializers.ValidationError({
                'quantity_not_sold': ComplianceReportValidation.x_cannot_exceed_y.format(x='Quantity Not Sold',
                                                                                         y='Quantity')
            })

        return data

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
    organization = OrganizationDisplaySerializer(read_only=True)
    status = ComplianceReportWorkflowStateSerializer(read_only=True)
    type = ComplianceReportTypeSerializer(read_only=True)
    deltas = serializers.SerializerMethodField()
    display_name = serializers.SerializerMethodField()
    read_only = serializers.SerializerMethodField()

    skip_deltas = False

    def get_display_name(self, obj):
        if obj.nickname is not None and obj.nickname is not '':
            return obj.nickname
        return obj.generated_nickname

    def get_deltas(self, obj):

        deltas = []

        if self.skip_deltas:
            return deltas

        current = obj

        while current:
            if current.supplements:
                ancestor = current.supplements

                qs = ComplianceReportSnapshot.objects.filter(compliance_report=ancestor)

                if qs.exists():
                    ancestor_snapshot = qs.first().snapshot
                    ancestor_computed = False
                else:
                    # no snapshot. make one.
                    ser = ExclusionReportDetailSerializer(ancestor, context=self.context)
                    ser.skip_deltas = True
                    ancestor_snapshot = ser.data
                    ancestor_computed = True

                qs = ComplianceReportSnapshot.objects.filter(compliance_report=current)

                if qs.exists():
                    current_snapshot = qs.first().snapshot
                else:
                    # no snapshot
                    ser = ExclusionReportDetailSerializer(current, context=self.context)
                    ser.skip_deltas = True
                    current_snapshot = ser.data

                deltas += [{
                    'levels_up': 1,
                    'ancestor_id': ancestor.id,
                    'ancestor_display_name': ancestor.nickname if (ancestor.nickname is not None and ancestor.nickname != '') else ancestor.generated_nickname,
                    'delta': ComplianceReportService.compute_delta(current_snapshot, ancestor_snapshot),
                    'snapshot': {
                        'data': ancestor_snapshot,
                        'computed': ancestor_computed
                    }
                }]

            current = current.supplements

        return deltas

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

    def get_read_only(self, obj):
        user = self.context['request'].user \
            if 'request' in self.context else None

        if not user.has_perm('COMPLIANCE_REPORT_MANAGE'):
            return True

        return obj.read_only

    class Meta:
        model = ComplianceReport
        fields = ['id', 'status', 'type', 'organization', 'compliance_period',
                  'exclusion_agreement', 'read_only', 'history', 'actions',
                  'actor', 'has_snapshot', 'deltas', 'display_name',
                  'supplemental_note', 'is_supplemental']


class ExclusionReportValidator:
    def validate_exclusion_agreement(self, data):
        if 'records' not in data:
            return data

        seen_tuples = {}

        for (i, record) in enumerate(data['records']):
            prov = None

            if ('transaction_type' in record and
                record['transaction_type'] is not None) and \
                    ('fuel_type' in record and
                     record['fuel_type'] is not None) and \
                    ('transaction_partner' in record and
                     record['transaction_partner'] is not None) and \
                    ('postal_address' in record and
                     record['postal_address'] is not None):
                prov = (
                    record['transaction_type'],
                    record['fuel_type'],
                    record['transaction_partner'],
                    record['postal_address']
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


class ExclusionReportValidationSerializer(serializers.ModelSerializer, ExclusionReportValidator):
    exclusion_agreement = ExclusionAgreementSerializer(allow_null=True, required=False)

    class Meta:
        model = ComplianceReport
        fields = ['exclusion_agreement']


class ExclusionReportUpdateSerializer(serializers.ModelSerializer, ExclusionReportValidator):
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
    organization = OrganizationDisplaySerializer(read_only=True)
    status = ComplianceReportWorkflowStateSerializer(required=False)
    type = SlugRelatedField(slug_field='the_type', read_only=True)
    supplemental_note = serializers.CharField(max_length=500, min_length=1, required=False, allow_null=True)
    display_name = serializers.SerializerMethodField()

    def get_display_name(self, obj):
        if obj.nickname is not None and obj.nickname is not '':
            return obj.nickname
        return obj.generated_nickname

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
                if instance.supplements is not None and instance.status.fuel_supplier_status.status in ['Submitted']:
                    # supplemental note is required
                    if 'supplemental_note' not in validated_data:
                        raise serializers.ValidationError(
                            'supplemental note is required when submitting a '
                            'supplemental report'
                        )
                    instance.supplemental_note = validated_data.pop(
                        'supplemental_note'
                    )
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
            'exclusion_agreement', 'read_only', 'actions', 'actor',
            'display_name', 'supplemental_note', 'is_supplemental'
        )
        read_only_fields = (
            'compliance_period', 'read_only', 'organization', 'actions',
            'actor', 'is_supplemental', 'display_name'
        )
