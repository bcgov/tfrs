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
from datetime import date, datetime
from django.core.exceptions import ValidationError
from django.utils import timezone
from rest_framework import serializers
from rest_framework.relations import PrimaryKeyRelatedField

from api.models.Organization import Organization
from api.models.OrganizationActionsType import OrganizationActionsType
from api.models.OrganizationAddress import OrganizationAddress
from api.models.OrganizationStatus import OrganizationStatus
from api.models.OrganizationType import OrganizationType
from api.models.Role import Role
from api.models.User import User
from api.models.UserRole import UserRole
from .OrganizationAddressSerializer import OrganizationAddressSerializer
from .OrganizationStatus import OrganizationMinStatusSerializer
from ..models.CachedPages import CachedPages
from django.core.cache import caches

redis_cache = caches['redis']

class OrganizationSerializer(serializers.ModelSerializer):
    """
    Serializer for the Fuel Supplier
    Loads most of the fields and the balance for the Fuel Supplier
    """
    organization_address = serializers.SerializerMethodField()
    organization_balance = serializers.SerializerMethodField()
    edrms_record = serializers.SerializerMethodField()

    class Meta:
        model = Organization
        fields = ('id', 'name', 'status', 'status_display', 'actions_type',
                  'actions_type_display', 'create_timestamp', 'type',
                  'organization_balance', 'organization_address', 'edrms_record')

    def get_organization_address(self, obj):
        """
        Shows the organization address
        """
        if obj.organization_address is None:
            return None

        serializer = OrganizationAddressSerializer(
            obj.organization_address, read_only=True
        )
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
        balance = redis_cache.get(f"balance_{obj.id}_{datetime.now().year}")
        if balance is not None:
            organization_balance = obj.organization_balance.copy()  # Copy to avoid modifying the original
            organization_balance['validated_credits'] = balance
            return organization_balance
        return obj.organization_balance

    def get_edrms_record(self, obj):
        request = self.context.get('request')

        if not request.user.has_perm('VIEW_FUEL_SUPPLIERS') and \
                request.user.organization.id != obj.id:
            return None

        return obj.edrms_record
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
        CachedPages.objects.filter(cache_key__icontains='organizations').delete()
        obj = Organization.objects.create(
            edrms_record = validated_data['edrms_record'],
            name=validated_data['name'],
            type=validated_data['type'],
            actions_type=validated_data['actions_type'],
            status=validated_data['status']
        )

        addr = validated_data.pop('organization_address')

        OrganizationAddress.objects.create(
            organization=obj,
            effective_date=date.today(),
            **addr
        )

        return obj

    class Meta:
        model = Organization
        fields = ('id', 'name', 'type', 'status', 'actions_type',
                  'organization_address', 'edrms_record')
        read_only_fields = ('id',)


class OrganizationUpdateSerializer(serializers.ModelSerializer):
    """
    Update Serializer for Organization
    """
    organization_address = OrganizationAddressSerializer(
        allow_null=True
    )
    status = PrimaryKeyRelatedField(
        queryset=OrganizationStatus.objects.all()
    )
    type = PrimaryKeyRelatedField(
        queryset=OrganizationType.objects.all()
        )

    def update(self, obj, validated_data):
        request = self.context.get('request')
        CachedPages.objects.filter(cache_key__icontains='organizations').delete()
        if request.user.has_perm('EDIT_FUEL_SUPPLIERS'):
            status = validated_data['status']

            # Default action type
            # (or if set to inactive and organization has zero balance)
            actions_type = OrganizationActionsType.objects.get(
                the_type="None"
            )

            if status.status == 'Active':
                actions_type = OrganizationActionsType.objects.get(
                    the_type="Buy And Sell"
                )
            elif obj.organization_balance['validated_credits'] > 0:
                actions_type = OrganizationActionsType.objects.get(
                    the_type="Sell Only"
                )
            Organization.objects.filter(id=obj.id).update(
                name=validated_data['name'],
                edrms_record=validated_data['edrms_record'],
                actions_type=actions_type,
                status=status,
                update_timestamp=timezone.now()
            )

            # If the organization is being marked as inactive
            # We have to remove all file submission roles
            if status.status == 'Archived':
                file_submission_roles = Role.objects.filter(
                    role_permissions__permission__code="DOCUMENTS_CREATE_DRAFT"
                )

                for role in file_submission_roles:
                    UserRole.objects.filter(
                        user__organization__id=obj.id,
                        role_id=role.id
                    ).delete()

                users = User.objects.filter(
                    organization_id=obj.id,
                    user_roles=None
                )

                default_roles = Role.objects.filter(
                    default_role=True
                )

                for user in users:
                    for role in default_roles:
                        UserRole.objects.create(
                            user=user,
                            role_id=role.id,
                            create_user=request.user
                        )

        addr = validated_data.pop('organization_address')

        organization_address = obj.organization_address

        if organization_address:
            organization_address.expiration_date = date.today()
            organization_address.save()

        OrganizationAddress.objects.create(
            effective_date=date.today(),
            organization=obj,
            **addr
        )
        return obj

    class Meta:
        model = Organization
        fields = ('id', 'name', 'type', 'status', 'actions_type',
                  'organization_address', 'update_timestamp', 'edrms_record')
        read_only_fields = ('id', 'type')


class OrganizationMinSerializer(serializers.ModelSerializer):
    """
    Minimum Serializer for the Fuel Supplier
    Only Loads the basic requirements
    """
    status = OrganizationMinStatusSerializer(read_only=True)

    class Meta:
        model = Organization
        fields = ('id', 'name', 'type', 'status')


class OrganizationDisplaySerializer(serializers.ModelSerializer):
    """
    Display Serializer for the Fuel Supplier
    Loads most information fields like address and name of the fuel supplier
    """
    organization_address = serializers.SerializerMethodField()
    status = OrganizationMinStatusSerializer(read_only=True)

    def get_organization_address(self, obj):
        """
        Shows the organization address
        """
        if obj.organization_address is None:
            return None

        serializer = OrganizationAddressSerializer(
            obj.organization_address, read_only=True
        )
        return serializer.data

    class Meta:
        model = Organization
        fields = ('id', 'name', 'organization_address', 'type', 'status', 'edrms_record')
