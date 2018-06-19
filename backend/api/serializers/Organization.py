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

from api.models.Organization import Organization


class OrganizationSerializer(serializers.ModelSerializer):
    """
    Serializer for the Fuel Supplier
    Loads most of the fields and the balance for the Fuel Supplier
    """
    organization_balance = serializers.SerializerMethodField()

    class Meta:
        model = Organization
        fields = ('id', 'name', 'status', 'status_display', 'actions_type',
                  'actions_type_display', 'create_timestamp', 'type',
                  'organization_balance')

    def get_organization_balance(self, obj):
        """
        Only show the credit balance if the logged in user has permission
        to view fuel suppliers
        """
        request = self.context.get('request')

        if not request.user.has_perm('VIEW_FUEL_SUPPLIERS'):
            return None

        return obj.organization_balance


class OrganizationMinSerializer(serializers.ModelSerializer):
    """
    Minium Serializer for the Fuel Supplier
    Only Loads the id and name for the basic requirements
    """
    class Meta:
        model = Organization
        fields = ('id', 'name', 'type')
