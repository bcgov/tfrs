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
from api.models.OrganizationAddress import OrganizationAddress
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
        from api.models.OrganizationAddress import OrganizationAddress

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


class OrganizationUpdateSerializer(serializers.ModelSerializer):
    address_line_1 = serializers.CharField(allow_null=True, allow_blank=True, required=False)
    address_line_2 = serializers.CharField(allow_null=True, allow_blank=True, required=False)
    address_line_3 = serializers.CharField(allow_null=True, allow_blank=True, required=False)
    city = serializers.CharField(allow_null=True, allow_blank=True, required=False)
    country = serializers.CharField(allow_null=True, allow_blank=True, required=False)
    county = serializers.CharField(allow_null=True, allow_blank=True, required=False)
    state = serializers.CharField(allow_null=True, allow_blank=True, required=False)
    postal_code = serializers.CharField(allow_null=True, allow_blank=True, required=False)

    def validate(self, attrs):
        print('ser: {}'.format((attrs)))
        return attrs

    def update(self, obj, validated_data):

        Organization.objects.filter(id=obj.id).update(
            name=validated_data['name'],
            type_id=validated_data['type'],
            actions_type_id=validated_data['actions_type'],
            status_id=validated_data['status']
        )

        OrganizationAddress.objects.filter(organization_id=obj.id).delete()

        OrganizationAddress.objects.create(
            organization=obj,
            address_line_1=validated_data['address_line_1'],
            address_line_2=validated_data['address_line_2'],
            address_line_3=validated_data['address_line_3'],
            city=validated_data['city'],
            country=validated_data['country'],
            state=validated_data['state'],
            county=validated_data['county'],
            postal_code=validated_data['postal_code'],
            primary=True
        )
        return obj

    class Meta:
        model = Organization
        fields = ('id', 'name', 'type', 'status', 'actions_type',
                  'address_line_1', 'address_line_2', 'address_line_3',
                  'city', 'county', 'country', 'state', 'postal_code')
        read_only_fields = ('id',)


class OrganizationMinSerializer(serializers.ModelSerializer):
    """
    Minimum Serializer for the Fuel Supplier
    Only Loads the id and name for the basic requirements
    """
    class Meta:
        model = Organization
        fields = ('id', 'name', 'type')
