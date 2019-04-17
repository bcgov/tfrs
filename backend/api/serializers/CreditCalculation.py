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
from api.models.CarbonIntensityLimit import CarbonIntensityLimit
from api.models.CompliancePeriod import CompliancePeriod
from api.models.DefaultCarbonIntensity import DefaultCarbonIntensity
from api.models.DefaultCarbonIntensityCategory import \
    DefaultCarbonIntensityCategory
from api.models.EnergyDensity import EnergyDensity
from api.models.EnergyDensityCategory import EnergyDensityCategory
from api.models.EnergyEffectivenessRatio import EnergyEffectivenessRatio
from api.models.EnergyEffectivenessRatioCategory import \
    EnergyEffectivenessRatioCategory
from api.models.UnitOfMeasure import UnitOfMeasure


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
                "density": diesel_limit.density if diesel_limit else 0,
                "effective_date":
                    diesel_limit.effective_date if diesel_limit else None,
                "expiration_date":
                    diesel_limit.expiration_date if diesel_limit else None
            },
            "gasoline": {
                "fuel": "Gasoline Class",
                "density": gasoline_limit.density if gasoline_limit else 0,
                "effective_date":
                    gasoline_limit.effective_date if gasoline_limit else None,
                "expiration_date":
                    gasoline_limit.expiration_date if gasoline_limit else None
            }
        }

    class Meta:
        model = CompliancePeriod
        fields = ('id', 'description', 'display_order', 'limits')


class DefaultCarbonIntensitySerializer(serializers.ModelSerializer):
    """
    Default Carbon Intensity Serializer
    """
    density = serializers.SerializerMethodField()

    def get_density(self, obj):
        """
        Gets the Energy Density
        """
        row = DefaultCarbonIntensity.objects.filter(
            category=obj.id
        ).order_by('-effective_date').first()

        return row.density if row else None

    class Meta:
        model = DefaultCarbonIntensityCategory
        fields = (
            'id', 'name', 'density'
        )


class DefaultCarbonIntensityDetailSerializer(serializers.ModelSerializer):
    """
    Default Carbon Intensity Detail Serializer
    """
    density = serializers.SerializerMethodField()

    def get_density(self, obj):
        """
        Gets the Energy Density
        """
        row = DefaultCarbonIntensity.objects.filter(
            category=obj.id
        ).order_by('-effective_date').first()

        return {
            "density": row.density if row else None,
            "effective_date": row.effective_date if row else None,
            "expiration_date": row.expiration_date if row else None
        }

    class Meta:
        model = DefaultCarbonIntensityCategory
        fields = (
            'id', 'name', 'density'
        )


class EnergyDensitySerializer(serializers.ModelSerializer):
    """
    Default Energy Density Serializer
    """
    density = serializers.SerializerMethodField()
    unit_of_measure = serializers.SerializerMethodField()

    def get_density(self, obj):
        """
        Gets the Energy Density
        """
        density = EnergyDensity.objects.filter(
            category=obj.id
        ).order_by('-effective_date').first()

        return density.density if density else None

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
            'id', 'name', 'density', 'unit_of_measure'
        )


class EnergyEffectivenessRatioSerializer(serializers.ModelSerializer):
    """
    Default Energy Effectiveness Ratio Serializer
    """
    diesel_ratio = serializers.SerializerMethodField()
    gasoline_ratio = serializers.SerializerMethodField()

    def get_diesel_ratio(self, obj):
        """
        Gets the Energy Effectiveness Ratio for Diesel Class
        """
        diesel_ratio = EnergyEffectivenessRatio.objects.filter(
            category=obj.id,
            fuel_class__fuel_class="Diesel"
        ).order_by('-effective_date').first()

        return diesel_ratio.ratio if diesel_ratio else None

    def get_gasoline_ratio(self, obj):
        """
        Gets the Energy Effectiveness Ratio for Gasoline Class
        """
        gasoline_ratio = EnergyEffectivenessRatio.objects.filter(
            category=obj.id,
            fuel_class__fuel_class="Gasoline"
        ).order_by('-effective_date').first()

        return gasoline_ratio.ratio if gasoline_ratio else None

    class Meta:
        model = EnergyEffectivenessRatioCategory
        fields = (
            'id', 'name', 'diesel_ratio', 'gasoline_ratio'
        )


class EnergyEffectivenessRatioDetailSerializer(serializers.ModelSerializer):
    """
    Energy Effectiveness Ratio Detail Serializer
    """
    ratios = serializers.SerializerMethodField()

    def get_ratios(self, obj):
        """
        Gets the Energy Effectiveness Ratio for Diesel and Gasoline Class
        """
        diesel_ratio = EnergyEffectivenessRatio.objects.filter(
            category=obj.id,
            fuel_class__fuel_class="Diesel"
        ).order_by('-effective_date').first()

        gasoline_ratio = EnergyEffectivenessRatio.objects.filter(
            category=obj.id,
            fuel_class__fuel_class="Gasoline"
        ).order_by('-effective_date').first()

        return {
            "diesel": {
                "fuel": "Diesel Class",
                "density": diesel_ratio.ratio if diesel_ratio else 0,
                "effective_date":
                    diesel_ratio.effective_date if diesel_ratio else None,
                "expiration_date":
                    diesel_ratio.expiration_date if diesel_ratio else None
            },
            "gasoline": {
                "fuel": "Gasoline Class",
                "ratio": gasoline_ratio.ratio if gasoline_ratio else 0,
                "effective_date":
                    gasoline_ratio.effective_date if gasoline_ratio else None,
                "expiration_date":
                    gasoline_ratio.expiration_date if gasoline_ratio else None
            }
        }

    class Meta:
        model = EnergyEffectivenessRatioCategory
        fields = (
            'id', 'name', 'ratios'
        )
