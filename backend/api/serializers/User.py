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
from .Role import RoleSerializer, RoleMinSerializer


class MemberSerializer(serializers.ModelSerializer):
    role = RoleMinSerializer(read_only=True)

    class Meta:
        model = User
        fields = (
            'id', 'first_name', 'last_name', 'display_name', 'email', 'phone',
            'role', 'is_active')


class UserSerializer(serializers.ModelSerializer):
    organization = OrganizationSerializer(read_only=True)
    role = RoleSerializer(read_only=True)

    class Meta:
        model = User
        fields = (
            'id', 'first_name', 'last_name', 'email', 'authorization_id',
            'username', 'authorization_directory', 'display_name',
            'organization', 'role')


class UserMinSerializer(serializers.ModelSerializer):
    organization = OrganizationMinSerializer(read_only=True)

    class Meta:
        model = User
        fields = (
            'id', 'first_name', 'last_name', 'display_name', 'organization')


class UserViewSerializer(serializers.ModelSerializer):
    """
    Serializer for the viewing the User's profile
    Should show the contact information and activity history of the user
    """
    history = serializers.SerializerMethodField()
    organization = OrganizationMinSerializer(read_only=True)
    role = RoleMinSerializer(read_only=True)

    class Meta:
        model = User
        fields = (
            'authorization_id', 'cell_phone', 'display_name', 'email',
            'first_name', 'history', 'id', 'is_active', 'last_name',
            'organization', 'phone', 'role')

    def get_history(self, obj):
        """
        Function to get the user's activity.
        This should be restricted based on the user's role.
        A government user won't see draft, submitted, refused.
        A regular user won't see recommended and not recommended.
        Regular users will only see histories related to their organization
        """
        from .CreditTradeHistory import CreditTradeHistoryMinSerializer
        request = self.context.get('request')

        # if the user is not a government user we should limit what we show
        # so no recommended/not recommended
        if (request.user.role is None or
                not request.user.role.is_government_role):
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
