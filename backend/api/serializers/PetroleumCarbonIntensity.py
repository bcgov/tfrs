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
from datetime import date
from rest_framework import serializers

from api.models.PetroleumCarbonIntensityCategory import \
    PetroleumCarbonIntensityCategory
from api.services.CreditCalculationService import CreditCalculationService


class PetroleumCarbonIntensitySerializer(serializers.ModelSerializer):
    """
    Default Petroleum Carbon Intensity Serializer
    """
    density = serializers.SerializerMethodField()
    revised_density = serializers.SerializerMethodField()

    def get_density(self, obj):
        """
        Gets the carbon intensity
        """
        row = CreditCalculationService.get(
            category_id=obj.id,
            effective_date=date.today(),
            model_name="PetroleumCarbonIntensity"
        )

        return row.density if row else None

    def get_revised_density(self, obj):
        """
        Gets the future density value, if applicable
        """
        density = CreditCalculationService.get_later(
            model_name="PetroleumCarbonIntensity",
            category_id=obj.id,
            effective_date=date.today()
        )

        if not density:
            return None

        return {
            "density": density.density,
            "effective_date": density.effective_date
        }

    class Meta:
        model = PetroleumCarbonIntensityCategory
        fields = (
            'id', 'name', 'density', 'revised_density'
        )


class PetroleumCarbonIntensityUpdateSerializer(serializers.Serializer):
    """
    Default Petroleum Carbon Intensity Limit Serializer
    """
    density = serializers.FloatField(allow_null=False)
    effective_date = serializers.DateField(allow_null=False)
    expiration_date = serializers.DateField(allow_null=True, required=False)

    def __init__(self, *args, **kwargs):
        super(PetroleumCarbonIntensityUpdateSerializer, self).__init__(
            *args, **kwargs
        )

    def validate(self, data):
        return data

    def update(self, instance, validated_data):
        request = self.context.get('request')

        CreditCalculationService.update(
            category_id=instance.id,
            effective_date=validated_data['effective_date'],
            model_name="PetroleumCarbonIntensity",
            density=validated_data['density'],
            update_user=request.user
        )

        return validated_data


class PetroleumCarbonIntensityDetailSerializer(serializers.ModelSerializer):
    """
    Petroleum Carbon Intensity Detail Serializer
    """
    density = serializers.SerializerMethodField()
    all_values = serializers.SerializerMethodField()


    def get_all_values(self, obj):
        rows = CreditCalculationService.get_all(
            model_name="PetroleumCarbonIntensity",
            category_id=obj.id
        )

        serialized = []

        for row in rows:
            serialized.append({
                "fuel_class": obj.name,
                "density": row.density,
                "effective_date": row.effective_date,
                "expiration_date": row.effective_date,
                "create_timestamp": row.create_timestamp
            })

        return serialized

    def get_density(self, obj):
        """
        Gets the Carbon Intensity
        """
        row = CreditCalculationService.get(
            model_name="PetroleumCarbonIntensity",
            category_id=obj.id,
            effective_date=date.today()
        )

        if not row:
            return None

        return {
            "density": row.density,
            "effective_date": row.effective_date,
            "expiration_date": row.expiration_date
        }

    class Meta:
        model = PetroleumCarbonIntensityCategory
        fields = (
            'id', 'name', 'density', 'all_values'
        )
