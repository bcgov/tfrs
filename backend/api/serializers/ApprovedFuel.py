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

from api.models.ApprovedFuel import ApprovedFuel
from .FuelClass import FuelClassSerializer
from .ProvisionOfTheAct import ProvisionOfTheActSerializer
from .UnitOfMeasure import UnitOfMeasureSerializer


class ApprovedFuelSerializer(serializers.ModelSerializer):
    """
    Default Serializer for Approved Fuels
    """
    fuel_classes = serializers.SerializerMethodField()
    provisions = serializers.SerializerMethodField()
    unit_of_measure = UnitOfMeasureSerializer(read_only=True)

    def get_fuel_classes(self, obj):
        """
        Fuel classes attached to the approved fuel.
        """
        serializer = FuelClassSerializer(
            obj.fuel_classes.order_by('fuel_class'),
            many=True,
            read_only=True
        )

        return serializer.data

    def get_provisions(self, obj):
        """
        Provisions allowed for the approved fuel
        """
        serializer = ProvisionOfTheActSerializer(
            obj.provisions.order_by('display_order'),
            many=True,
            read_only=True
        )

        return serializer.data

    class Meta:
        model = ApprovedFuel
        fields = 'id', 'name', 'description', 'fuel_classes', \
            'credit_calculation_only', 'is_partially_renewable', \
            'provisions', 'unit_of_measure', 'effective_date'

        read_only_fields = (
            'id', 'name', 'description', 'credit_calculation_only',
            'is_partially_renewable', 'provisions', 'unit_of_measure',
            'effective_date'
        )
