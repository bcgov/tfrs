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
from rest_framework import exceptions, serializers

from api.models.User import User
from .Organization import OrganizationSerializer, OrganizationMinSerializer
from .Permission import PermissionSerializer
from .Role import RoleSerializer


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for the full details of the User and what permissions
    the user has
    """
    organization = OrganizationSerializer(read_only=True)
    permissions = PermissionSerializer(many=True, read_only=True)
    roles = RoleSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = (
            'id', 'first_name', 'last_name', 'email', 'authorization_id',
            'username', 'authorization_directory', 'display_name',
            'organization', 'roles', 'is_government_user', 'permissions')


class UserMinSerializer(serializers.ModelSerializer):
    """
    Serializer for display information for the User
    """
    organization = OrganizationMinSerializer(read_only=True)
    roles = RoleSerializer(many=True, read_only=True)

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
    history = serializers.SerializerMethodField()
    organization = OrganizationMinSerializer(read_only=True)
    roles = RoleSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = (
            'authorization_id', 'cell_phone', 'display_name', 'email',
            'first_name', 'history', 'id', 'is_active', 'last_name',
            'organization', 'phone', 'roles')

    def get_history(self, obj):
        """
        Function to get the user's activity.
        This should be restricted based on the user's roles.
        A government user won't see draft, submitted, refused.
        A regular user won't see recommended and not recommended.
        Regular users will only see histories related to their organization
        """
        from .CreditTradeHistory import CreditTradeHistoryMinSerializer
        request = self.context.get('request')

        # if the user is not a government user we should limit what we show
        # so no recommended/not recommended
        if (not request.user.is_government_user):
            if request.user.organization != obj.organization:
                raise exceptions.PermissionDenied(
                    'You do not have sufficient authorization to use this '
                    'functionality.'
                )

            history = obj.get_history(
                (Q(credit_trade__initiator_id=request.user.organization_id) |
                 Q(credit_trade__respondent_id=request.user.organization_id)) &
                (Q(status__status__in=[
                    "Accepted", "Refused", "Submitted"
                ]) | Q(is_rescinded=True)))
        else:
            history = obj.get_history(
                Q(status__status__in=[
                    "Accepted", "Completed", "Declined", "Not Recommended",
                    "Recommended"
                ]))

        serializer = CreditTradeHistoryMinSerializer(history, read_only=True,
                                                     many=True)

        return serializer.data
