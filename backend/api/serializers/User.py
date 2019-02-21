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
from django.db.models import Q
from rest_framework import serializers
from rest_framework.fields import CharField
from rest_framework.relations import PrimaryKeyRelatedField

from api.models.UserCreationRequest import UserCreationRequest
from api.models.Organization import Organization
from api.models.Role import Role
from api.models.User import User
from api.models.UserRole import UserRole
from .Organization import OrganizationSerializer, OrganizationMinSerializer
from .Permission import PermissionSerializer
from .Role import RoleMinSerializer


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for the full details of the User and what permissions
    the user has
    """
    organization = OrganizationSerializer(read_only=True)
    permissions = PermissionSerializer(many=True, read_only=True)
    roles = RoleMinSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = (
            'id', 'first_name', 'last_name', 'email',
            'username', 'display_name', 'is_active',
            'organization', 'roles', 'is_government_user', 'permissions',
            'phone', 'cell_phone', 'title')


class UserBasicSerializer(serializers.ModelSerializer):
    """
    Serializer for displaying the user's display name
    """
    class Meta:
        model = User
        fields = (
            'id', 'first_name', 'last_name', 'display_name')


class UserCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for user creation via API
    """
    organization = PrimaryKeyRelatedField(queryset=Organization.objects.all())
    roles = PrimaryKeyRelatedField(queryset=Role.objects.all(), many=True)
    id = serializers.ReadOnlyField()
    first_name = CharField(required=True,
                           allow_blank=False,
                           error_messages={'blank': 'A First Name is required'})
    last_name = CharField(required=True,
                          allow_blank=False,
                          error_messages={'blank': 'A Last Name is required'})

    def validate(self, data):
        data['display_name'] = '{} {}'.format(data['first_name'], data['last_name'])

        roles = data.get('roles')
        if not roles:
            raise serializers.ValidationError({
                'roles': 'Please select at least one role for the user'
            })

        return data

    def create(self, validated_data):
        request = self.context.get('request')
        roles = validated_data.pop('roles')
        organization = validated_data.pop('organization')

        user = User.objects.create(**validated_data)
        user.organization = organization
        user.save()
        for role in roles:
            UserRole.objects.create(
                user=user,
                role=role,
                create_user=request.user
            )

        return user

    class Meta:
        model = User
        fields = (
            'first_name', 'last_name', 'email', 'username', 'display_name',
            'id', 'organization', 'roles', 'is_government_user', 'title')


class UserUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for display information for the User
    """
    organization = OrganizationMinSerializer(read_only=True)
    roles = PrimaryKeyRelatedField(queryset=Role.objects.all(), many=True)
    first_name = CharField(required=True,
                           allow_blank=False,
                           error_messages={'blank': 'A First Name is required'})
    last_name = CharField(required=True,
                          allow_blank=False,
                          error_messages={'blank': 'A Last Name is required'})

    def validate(self, data):
        data['display_name'] = '{} {}'.format(
            data.get('first_name'), data.get('last_name'))

        request = self.context.get('request')

        if request.user.has_perm('USER_MANAGEMENT') and 'roles' in data:
            roles = data.get('roles')
            if roles is not None:
                if not roles:
                    raise serializers.ValidationError({
                        'roles': 'Please select at least one role for the user'
                    })

        return data

    def update(self, instance, validated_data):
        request = self.context.get('request')

        if request.user.has_perm('USER_MANAGEMENT'):
            if 'roles' in validated_data:
                roles = validated_data.pop('roles')

                role_mappings = UserRole.objects.filter(user=instance)
                for user_role in role_mappings:
                    if user_role.role not in roles:
                        user_role.delete()

                for role in roles:
                    if not UserRole.objects.filter(
                            user=instance,
                            role=role).exists():
                        UserRole.objects.create(
                            user=instance,
                            role=role,
                            create_user=request.user
                        )

            instance.is_active = validated_data.get(
                'is_active', instance.is_active)

        instance.first_name = validated_data.get(
            'first_name', instance.first_name)
        instance.last_name = validated_data.get(
            'last_name', instance.last_name)
        instance.display_name = validated_data.get(
            'display_name', instance.display_name)
        instance.email = validated_data.get(
            'email', instance.email)
        instance.cell_phone = validated_data.get(
            'cell_phone', instance.cell_phone)
        instance.phone = validated_data.get(
            'phone', instance.phone)
        instance.title = validated_data.get(
            'title', instance.title)
        instance.save()

        return instance

    class Meta:
        model = User
        fields = (
            'id', 'first_name', 'last_name', 'display_name', 'email', 'phone',
            'roles', 'is_active', 'organization', 'cell_phone', 'title'
        )
        read_only_fields = (
            'organization', 'id', 'is_government_user'
        )


class UserMinSerializer(serializers.ModelSerializer):
    """
    Serializer for display information for the User
    """
    organization = OrganizationMinSerializer(read_only=True)
    roles = RoleMinSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = (
            'id', 'first_name', 'last_name', 'display_name', 'email', 'phone',
            'roles', 'is_active', 'organization')


class UserViewSerializer(serializers.ModelSerializer):
    """
    Serializer for the viewing the User's profile
    Should show the contact information and activity history of the user
    """
    organization = OrganizationMinSerializer(read_only=True)
    roles = RoleMinSerializer(many=True, read_only=True)
    keycloak_email = serializers.SerializerMethodField()

    def get_keycloak_email(self, obj):
        """
        Retrieves the keycloak email saved  when the user was created
        """
        user_creation_request = UserCreationRequest.objects.filter(
            user_id=obj.id).first()

        if user_creation_request:
            return user_creation_request.keycloak_email

        return None

    class Meta:
        model = User
        fields = (
            'cell_phone', 'display_name', 'email', 'first_name', 'id',
            'is_active', 'last_name', 'organization', 'phone', 'roles',
            'keycloak_email', 'title')
