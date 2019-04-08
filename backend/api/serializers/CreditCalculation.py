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
from api.models.CarbonIntensity import CarbonIntensity
from api.models.CarbonIntensityLimit import CarbonIntensityLimit
from api.models.CompliancePeriod import CompliancePeriod
from api.models.EnergyDensity import EnergyDensity
from api.models.EnergyEffectivenessRatio import EnergyEffectivenessRatio


class CarbonIntensityLimitSerializer(serializers.ModelSerializer):
    """
    Default Carbon Intensity Limit Serializer
    """
    limits = serializers.SerializerMethodField()

    def get_limits(self, obj):
        """
        Gets the Carbon Intensity Limits for the compliance period
        """
        diesel_limit = CarbonIntensityLimit.objects.filter(
            compliance_period=obj.id,
            fuel_class__fuel_class="Diesel"
        ).first()

        gasoline_limit = CarbonIntensityLimit.objects.filter(
            compliance_period=obj.id,
            fuel_class__fuel_class="Gasoline"
        ).first()

        return {
            "diesel": {
                "fuel": "Diesel Class",
                "density": diesel_limit.density if diesel_limit else 0
            },
            "gasoline": {
                "fuel": "Gasoline Class",
                "density": gasoline_limit.density if gasoline_limit else 0
            }
        }

    class Meta:
        model = CompliancePeriod
        fields = ('id', 'description', 'display_order', 'limits')


class CarbonIntensitySerializer(serializers.ModelSerializer):
    """
    Default Carbon Intensity Serializer
    """
    carbon_intensity = serializers.SerializerMethodField()

    def get_carbon_intensity(self, obj):
        """
        Gets the Carbon Intensity for the Approved Fuel
        """
        density = CarbonIntensity.objects.filter(
            fuel=obj.id
        ).order_by('-effective_date').first()

        return density.density if density else None

    class Meta:
        model = ApprovedFuel
        fields = (
            'id', 'name', 'carbon_intensity'
        )


class EnergyDensitySerializer(serializers.ModelSerializer):
    """
    Default Energy Density Serializer
    """
    energy_density = serializers.SerializerMethodField()

    def get_energy_density(self, obj):
        """
        Gets the Energy Density for the Approved Fuel
        """
        density = EnergyDensity.objects.filter(
            fuel=obj.id
        ).order_by('-effective_date').first()

        return {
            "density": density.density if density else None,
            "unit_of_measure": density.unit_of_measure if density else None
        }

    class Meta:
        model = ApprovedFuel
        fields = (
            'id', 'name', 'energy_density'
        )


class EnergyEffectivenessRatioSerializer(serializers.ModelSerializer):
    """
    Default Energy Effectiveness Ratio Serializer
    """
    energy_effectiveness_ratio = serializers.SerializerMethodField()

    def get_energy_effectiveness_ratio(self, obj):
        """
        Gets the Energy Effectiveness Ratio for the Approved Fuel
        """
        diesel_ratio = EnergyEffectivenessRatio.objects.filter(
            fuel=obj.id,
            fuel_class__fuel_class="Diesel"
        ).order_by('-effective_date').first()

        gasoline_ratio = EnergyEffectivenessRatio.objects.filter(
            fuel=obj.id,
            fuel_class__fuel_class="Gasoline"
        ).order_by('-effective_date').first()

        return {
            "diesel": {
                "fuel": "Diesel Class",
                "ratio": diesel_ratio.ratio if diesel_ratio else None
            },
            "gasoline": {
                "fuel": "Gasoline Class",
                "ratio": gasoline_ratio.ratio if gasoline_ratio else None
            }
        }

    class Meta:
        model = ApprovedFuel
        fields = (
            'id', 'name', 'energy_effectiveness_ratio'
        )
