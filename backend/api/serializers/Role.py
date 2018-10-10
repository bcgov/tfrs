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

from api.models.Role import Role

from .Permission import PermissionSerializer


class RoleSerializer(serializers.ModelSerializer):
    """
    Serializer for the Role used for displaying in the front-end.
    This includes the permissions for the role
    """
    permissions = serializers.SerializerMethodField()

    def get_permissions(self, obj):
        """
        Permissions attached to the role.
        This also handles the sorting for the permissions.
        """
        serializer = PermissionSerializer(
            obj.permissions.order_by('name'),
            many=True,
            read_only=True
        )

        return serializer.data

    class Meta:
        model = Role
        fields = ('id', 'name', 'description', 'is_government_role',
                  'permissions')


class RoleMinSerializer(serializers.ModelSerializer):
    """
    Serializer for the Role used for displaying in the front-end.
    This is just going to retrieve the basic information for the role
    """
    class Meta:
        model = Role
        fields = ('id', 'name', 'description', 'is_government_role')
