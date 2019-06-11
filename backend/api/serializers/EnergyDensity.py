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

from api.models.ApprovedFuel import ApprovedFuel
from api.models.EnergyDensityCategory import EnergyDensityCategory
from api.models.UnitOfMeasure import UnitOfMeasure
from api.services.CreditCalculationService import CreditCalculationService


class EnergyDensitySerializer(serializers.ModelSerializer):
    """
    Default Energy Density Serializer
    """
    density = serializers.SerializerMethodField()
    revised_density = serializers.SerializerMethodField()
    unit_of_measure = serializers.SerializerMethodField()

    def get_density(self, obj):
        """
        Gets the Energy Density
        """
        density = CreditCalculationService.get(
            model_name="EnergyDensity",
            category_id=obj.id,
            effective_date=date.today()
        )

        return density.density if density else None

    def get_revised_density(self, obj):
        """
        Gets the future density value, if applicable
        """
        density = CreditCalculationService.get_later(
            model_name="EnergyDensity",
            category_id=obj.id,
            effective_date=date.today()
        )

        if not density:
            return None

        return {
            "density": density.density,
            "effective_date": density.effective_date
        }

    def get_unit_of_measure(self, obj):
        """
        Gets the unit of measure through the Approved Fuel model.
        There should never ba case where Approved Fuels falling under the same
        energy density category having differing unit of measures.
        """
        fuel = ApprovedFuel.objects.filter(
            energy_density_category=obj.id
        ).first()

        return UnitOfMeasure.objects.get(id=fuel.unit_of_measure_id).name

    class Meta:
        model = EnergyDensityCategory
        fields = (
            'id', 'name', 'density', 'revised_density', 'unit_of_measure'
        )


class EnergyDensityUpdateSerializer(serializers.Serializer):
    """
    Energy Density Update Serializer
    """

    density = serializers.FloatField(allow_null=False)
    effective_date = serializers.DateField(allow_null=False)
    expiration_date = serializers.DateField(allow_null=True, required=False)

    def __init__(self, *args, **kwargs):
        super(EnergyDensityUpdateSerializer, self).__init__(*args, **kwargs)

    def update(self, instance, validated_data):
        request = self.context.get('request')

        CreditCalculationService.update(
            category_id=instance.id,
            effective_date=validated_data['effective_date'],
            model_name="EnergyDensity",
            density=validated_data['density'],
            update_user=request.user
        )

        return validated_data


class EnergyDensityDetailSerializer(serializers.ModelSerializer):
    """
    Energy Density Detail Serializer
    """
    density = serializers.SerializerMethodField()
    unit_of_measure = serializers.SerializerMethodField()
    all_values = serializers.SerializerMethodField()

    def get_all_values(self, obj):
        rows = CreditCalculationService.get_all(
            model_name="EnergyDensity",
            category_id=obj.id
        )

        serialized = []

        for row in rows:
            serialized.append({
                "density": row.density,
                "effective_date": row.effective_date,
                "expiration_date": row.expiration_date,
                "create_timestamp": row.create_timestamp
            })

        return serialized

    def get_density(self, obj):
        """
        Gets the Energy Density
        """
        row = CreditCalculationService.get(
            model_name="EnergyDensity",
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

    def get_unit_of_measure(self, obj):
        """
        Gets the unit of measure through the Approved Fuel model.
        There should never ba case where Approved Fuels falling under the same
        energy density category having differing unit of measures.
        """
        fuel = ApprovedFuel.objects.filter(
            energy_density_category=obj.id
        ).first()

        return UnitOfMeasure.objects.get(id=fuel.unit_of_measure_id).name

    class Meta:
        model = EnergyDensityCategory
        fields = (
            'id', 'name', 'density', 'unit_of_measure', 'all_values'
        )
