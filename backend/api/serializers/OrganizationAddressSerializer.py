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

from api.models.OrganizationAddress import OrganizationAddress


class OrganizationAddressSerializer(serializers.ModelSerializer):
    """
    Address Serializer that loads all the fields that useful for
    displaying.
    """

    def create(self, validated_data):
        organization = validated_data.pop('organization')

        addr = OrganizationAddress.objects.create(**validated_data,
                                                  primary=True)
        addr.organization = validated_data['organization']
        addr.save()

        return addr

    class Meta:
        model = OrganizationAddress
        fields = (
            'id', 'address_line_1', 'address_line_2', 'address_line_3',
            'city', 'postal_code', 'state', 'county', 'country')
