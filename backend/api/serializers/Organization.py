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
from django.core.exceptions import ValidationError
from django.utils import timezone
from rest_framework import serializers
from rest_framework.relations import PrimaryKeyRelatedField

from api.models.Organization import Organization
from api.models.OrganizationActionsType import OrganizationActionsType
from api.models.OrganizationAddress import OrganizationAddress
from api.models.OrganizationStatus import OrganizationStatus
from api.models.OrganizationType import OrganizationType
from .OrganizationAddressSerializer import OrganizationAddressSerializer


class OrganizationSerializer(serializers.ModelSerializer):
    """
    Serializer for the Fuel Supplier
    Loads most of the fields and the balance for the Fuel Supplier
    """
    organization_address = serializers.SerializerMethodField()
    organization_balance = serializers.SerializerMethodField()

    class Meta:
        model = Organization
        fields = ('id', 'name', 'status', 'status_display', 'actions_type',
                  'actions_type_display', 'create_timestamp', 'type',
                  'organization_balance', 'organization_address')

    def get_organization_address(self, obj):
        """
        Shows the organization address
        """
        organization_address = OrganizationAddress.objects.filter(
            organization_id=obj.id).first()

        if organization_address is None:
            return None

        serializer = OrganizationAddressSerializer(organization_address,
                                                   read_only=True)
        return serializer.data

    def get_organization_balance(self, obj):
        """
        Only show the credit balance if the logged in user has permission
        to view fuel suppliers
        """
        request = self.context.get('request')

        if not request.user.has_perm('VIEW_FUEL_SUPPLIERS') and \
                request.user.organization.id != obj.id:
            return None

        return obj.organization_balance


class OrganizationCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating organizations
    """
    organization_address = OrganizationAddressSerializer(allow_null=True)
    actions_type = PrimaryKeyRelatedField(queryset=OrganizationActionsType.objects.all())
    status = PrimaryKeyRelatedField(queryset=OrganizationStatus.objects.all())
    type = PrimaryKeyRelatedField(queryset=OrganizationType.objects.all())

    def validate(self, attrs):
        type = attrs['type']

        if type.id == 1:
            raise ValidationError('Cannot create government orgs')

        return attrs

    def create(self, validated_data):

        obj = Organization.objects.create(
            name=validated_data['name'],
            type=validated_data['type'],
            actions_type=validated_data['actions_type'],
            status=validated_data['status']
        )

        addr = validated_data.pop('organization_address')

        OrganizationAddress.objects.create(
            organization=obj,
            primary=True,
            **addr
        )

        return obj

    class Meta:
        model = Organization
        fields = ('id', 'name', 'type', 'status', 'actions_type',
                  'organization_address')
        read_only_fields = ('id',)


class OrganizationUpdateSerializer(serializers.ModelSerializer):
    """
    Update Serializer for Organization
    """
    organization_address = OrganizationAddressSerializer(allow_null=True)
    actions_type = PrimaryKeyRelatedField(queryset=OrganizationActionsType.objects.all())
    status = PrimaryKeyRelatedField(queryset=OrganizationStatus.objects.all())
    type = PrimaryKeyRelatedField(queryset=OrganizationType.objects.all())

    def update(self, obj, validated_data):
        Organization.objects.filter(id=obj.id).update(
            name=validated_data['name'],
            actions_type=validated_data['actions_type'],
            status=validated_data['status'],
            update_timestamp=timezone.now()
        )

        addr = validated_data.pop('organization_address')

        OrganizationAddress.objects.filter(organization_id=obj.id).delete()
        OrganizationAddress.objects.create(
            organization=obj,
            primary=True,
            **addr
        )
        return obj

    class Meta:
        model = Organization
        fields = ('id', 'name', 'type', 'status', 'actions_type',
                  'organization_address', 'update_timestamp')
        read_only_fields = ('id', 'type')


class OrganizationMinSerializer(serializers.ModelSerializer):
    """
    Minimum Serializer for the Fuel Supplier
    Only Loads the id and name for the basic requirements
    """
    class Meta:
        model = Organization
        fields = ('id', 'name', 'type')
