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
from rest_framework.relations import SlugRelatedField

from api.models.ApprovedFuel import ApprovedFuel
from api.models.FuelCode import FuelCode
from api.models.FuelCodeStatus import FuelCodeStatus
from api.models.TransportMode import TransportMode, FeedstockTransportMode, \
    FuelTransportMode
from api.serializers.FuelCodeStatus import FuelCodeStatusSerializer
from api.serializers.User import UserMinSerializer
from api.services.Autocomplete import Autocomplete


class FuelCodeSerializer(serializers.ModelSerializer):
    """
    Default Serializer for Fuel Codes
    """
    status = FuelCodeStatusSerializer(read_only=True)
    create_user = UserMinSerializer(read_only=True)
    update_user = UserMinSerializer(read_only=True)

    feedstock_transport_mode = SlugRelatedField(
        allow_null=False,
        many=True,
        slug_field='name',
        queryset=TransportMode.objects.all()
    )
    fuel = SlugRelatedField(
        read_only=True,
        slug_field='name'
    )
    fuel_transport_mode = SlugRelatedField(
        allow_null=False,
        many=True,
        slug_field='name',
        queryset=TransportMode.objects.all()
    )

    class Meta:
        model = FuelCode
        fields = (
            'application_date', 'approval_date', 'carbon_intensity', 'company',
            'create_timestamp', 'create_user', 'effective_date', 'expiry_date',
            'facility_location', 'facility_nameplate', 'feedstock',
            'feedstock_location', 'feedstock_misc', 'feedstock_transport_mode',
            'former_company', 'fuel', 'fuel_code', 'fuel_code_version',
            'fuel_code_version_minor', 'fuel_transport_mode', 'id', 'status',
            'update_timestamp', 'update_user'
        )

        read_only_fields = (
            'application_date', 'approval_date', 'carbon_intensity', 'company',
            'create_timestamp', 'create_user', 'effective_date', 'expiry_date',
            'facility_location', 'facility_nameplate', 'feedstock',
            'feedstock_location', 'feedstock_misc', 'feedstock_transport_mode',
            'former_company', 'fuel', 'fuel_code', 'fuel_code_version',
            'fuel_code_version_minor', 'fuel_transport_mode', 'id', 'status',
            'update_timestamp', 'update_user'
        )


class FuelCodeCreateSerializer(serializers.ModelSerializer):
    """
    Creation Serializer for Fuel Codes
    """
    fuel = SlugRelatedField(
        allow_null=False,
        slug_field='name',
        queryset=ApprovedFuel.objects.all()
    )
    feedstock_transport_mode = SlugRelatedField(
        allow_null=False,
        many=True,
        slug_field='name',
        queryset=TransportMode.objects.all()
    )
    fuel_transport_mode = SlugRelatedField(
        allow_null=False,
        many=True,
        slug_field='name',
        queryset=TransportMode.objects.all()
    )

    def validate(self, data):
        print('wow')
        # check if fuel code is correct
        fuel_code = data.get('fuel_code')
        fuel_code_version = data.get('fuel_code_version')
        fuel_code_version_minor = data.get('fuel_code_version_minor')

        matches = FuelCode.objects.filter(
            fuel_code=fuel_code,
            fuel_code_version=fuel_code_version,
            fuel_code_version_minor=fuel_code_version_minor
        )

        print(fuel_code)
        print(fuel_code_version)
        print(fuel_code_version_minor)

        if matches.exists():
            raise serializers.ValidationError(
                'The fuel code {}{}.{} is already in use. '
                'Please consult the Fuel Codes table to ensure that this '
                'entry does not already exist.'.format(
                    fuel_code,
                    fuel_code_version,
                    fuel_code_version_minor
                )
            )

        next_available_version = Autocomplete.get_matches(
            'fuel_code.fuel_code_version', str(fuel_code_version))

        print(next_available_version)
        print('wow')
        if next_available_version:
            if next_available_version[0] != '{}.{}'.format(
                    fuel_code_version,
                    fuel_code_version_minor
            ):
                raise serializers.ValidationError(
                    'The next available Fuel Code is {}'.format(
                        next_available_version[0]
                    )
                )

        return data

    def create(self, validated_data):
        feedstock_modes = validated_data.pop('feedstock_transport_mode')
        fuel_modes = validated_data.pop('fuel_transport_mode')

        instance = FuelCode.objects.create(**validated_data)

        if feedstock_modes:
            for feedstock_mode in feedstock_modes:
                FeedstockTransportMode.objects.create(
                    create_user=instance.create_user,
                    fuel_code=instance,
                    transport_mode=feedstock_mode
                )

        if fuel_modes:
            for fuel_mode in fuel_modes:
                FuelTransportMode.objects.create(
                    create_user=instance.create_user,
                    fuel_code=instance,
                    transport_mode=fuel_mode
                )

        return instance

    class Meta:
        model = FuelCode
        fields = '__all__'


class FuelCodeSaveSerializer(serializers.ModelSerializer):
    """
    Update Serializer for Fuel Codes
    Counts the delete functionality
    """
    fuel = SlugRelatedField(
        allow_null=False,
        slug_field='name',
        queryset=ApprovedFuel.objects.all()
    )
    feedstock_transport_mode = SlugRelatedField(
        allow_null=False,
        many=True,
        slug_field='name',
        queryset=TransportMode.objects.all()
    )
    fuel_transport_mode = SlugRelatedField(
        allow_null=False,
        many=True,
        slug_field='name',
        queryset=TransportMode.objects.all()
    )

    def destroy(self):
        """
        We don't really delete records so we mark them as Cancelled, instead
        """
        cancelled_status = FuelCodeStatus.objects.get(status="Cancelled")

        fuel_code = self.instance

        if fuel_code.status not in FuelCodeStatus.objects.filter(
                status__in=["Draft"]):
            raise serializers.ValidationError({
                'readOnly': "Cannot delete a fuel code that's not a draft."
            })

        fuel_code.status = cancelled_status
        fuel_code.save()

    def update(self, instance, validated_data):
        feedstock_modes = validated_data.pop('feedstock_transport_mode')
        fuel_modes = validated_data.pop('fuel_transport_mode')

        if feedstock_modes:
            for feedstock_mode in feedstock_modes:
                FeedstockTransportMode.objects.update_or_create(
                    fuel_code=instance,
                    transport_mode=feedstock_mode,
                    defaults={
                        'create_user': instance.create_user,
                        'update_user': instance.update_user,
                        'fuel_code': instance,
                        'transport_mode': feedstock_mode
                    }
                )

        if fuel_modes:
            for fuel_mode in fuel_modes:
                FuelTransportMode.objects.update_or_create(
                    fuel_code=instance,
                    transport_mode=fuel_mode,
                    defaults={
                        'create_user': instance.create_user,
                        'update_user': instance.update_user,
                        'fuel_code': instance,
                        'transport_mode': fuel_mode
                    }
                )

        FuelCode.objects.filter(id=instance.id).update(**validated_data)

        return instance

    class Meta:
        model = FuelCode
        fields = '__all__'

        read_only_fields = (
            'id', 'create_timestamp', 'create_user', 'fuel_code',
            'fuel_code_version', 'fuel_code_version_minor'
        )
