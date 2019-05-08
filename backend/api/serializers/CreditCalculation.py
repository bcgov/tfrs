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
from api.models.CompliancePeriod import CompliancePeriod
from api.models.DefaultCarbonIntensityCategory import \
    DefaultCarbonIntensityCategory
from api.models.EnergyDensityCategory import EnergyDensityCategory
from api.models.EnergyEffectivenessRatioCategory import \
    EnergyEffectivenessRatioCategory
from api.models.FuelClass import FuelClass
from api.models.PetroleumCarbonIntensityCategory import \
    PetroleumCarbonIntensityCategory
from api.models.UnitOfMeasure import UnitOfMeasure
from api.services.CreditCalculationService import CreditCalculationService


class CarbonIntensityLimitSerializer(serializers.ModelSerializer):
    """
    Default Carbon Intensity Limit Serializer
    """
    limits = serializers.SerializerMethodField()
    revised_limits = serializers.SerializerMethodField()

    def get_limits(self, obj):
        """
        Gets the Carbon Intensity Limits for the compliance period
        """
        diesel_limit = CreditCalculationService.get(
            compliance_period_id=obj.id,
            effective_date=date.today(),
            fuel_class__fuel_class="Diesel",
            model_name="CarbonIntensityLimit"
        )

        gasoline_limit = CreditCalculationService.get(
            compliance_period_id=obj.id,
            effective_date=date.today(),
            fuel_class__fuel_class="Gasoline",
            model_name="CarbonIntensityLimit"
        )

        return {
            "diesel": {
                "fuel": "Diesel Class",
                "density": diesel_limit.density,
                "effective_date":
                    diesel_limit.effective_date,
                "expiration_date":
                    diesel_limit.expiration_date
            } if diesel_limit else None,
            "gasoline": {
                "fuel": "Gasoline Class",
                "density": gasoline_limit.density,
                "effective_date":
                    gasoline_limit.effective_date,
                "expiration_date":
                    gasoline_limit.expiration_date
            } if gasoline_limit else None
        }

    def get_revised_limits(self, obj):
        """
        Gets the future Carbon Intensity Limits for the compliance period,
        if applicable
        """
        diesel_limit = CreditCalculationService.get_later(
            compliance_period_id=obj.id,
            effective_date=date.today(),
            fuel_class__fuel_class="Diesel",
            model_name="CarbonIntensityLimit"
        )

        gasoline_limit = CreditCalculationService.get_later(
            compliance_period_id=obj.id,
            effective_date=date.today(),
            fuel_class__fuel_class="Gasoline",
            model_name="CarbonIntensityLimit"
        )

        return {
            "diesel": {
                "fuel": "Diesel Class",
                "density": diesel_limit.density,
                "effective_date":
                    diesel_limit.effective_date,
                "expiration_date":
                    diesel_limit.expiration_date
            }  if diesel_limit else None,
            "gasoline": {
                "fuel": "Gasoline Class",
                "density": gasoline_limit.density,
                "effective_date":
                    gasoline_limit.effective_date,
                "expiration_date":
                    gasoline_limit.expiration_date
            } if gasoline_limit else None
        }

    class Meta:
        model = CompliancePeriod
        fields = ('id', 'description', 'display_order', 'limits',
                  'revised_limits')


class CarbonIntensityLimitUpdateSerializer(serializers.Serializer):
    """
    Carbon Intensity Limit Update Serializer
    """

    diesel_carbon_intensity = serializers.FloatField(allow_null=False)
    diesel_effective_date = serializers.DateField(allow_null=False)
    diesel_expiration_date = serializers.DateField(
        allow_null=True, required=False)

    gasoline_carbon_intensity = serializers.FloatField(allow_null=False)
    gasoline_effective_date = serializers.DateField(allow_null=False)
    gasoline_expiration_date = serializers.DateField(
        allow_null=True, required=False)

    def __init__(self, *args, **kwargs):
        super(CarbonIntensityLimitUpdateSerializer, self).__init__(
            *args, **kwargs
        )

    def update(self, instance, validated_data):
        request = self.context.get('request')

        if 'diesel_carbon_intensity' in validated_data:
            fuel_class_id = FuelClass.objects.get(fuel_class="Diesel").id

            CreditCalculationService.update(
                compliance_period_id=instance.id,
                density=validated_data['diesel_carbon_intensity'],
                effective_date=validated_data['diesel_effective_date'],
                fuel_class_id=fuel_class_id,
                model_name="CarbonIntensityLimit",
                update_user=request.user
            )

        if 'gasoline_carbon_intensity' in validated_data:
            fuel_class_id = FuelClass.objects.get(fuel_class="Gasoline").id

            CreditCalculationService.update(
                compliance_period_id=instance.id,
                density=validated_data['gasoline_carbon_intensity'],
                effective_date=validated_data['gasoline_effective_date'],
                fuel_class_id=fuel_class_id,
                model_name="CarbonIntensityLimit",
                update_user=request.user
            )

        return validated_data


class DefaultCarbonIntensitySerializer(serializers.ModelSerializer):
    """
    Default Carbon Intensity Serializer
    """
    density = serializers.SerializerMethodField()
    revised_density = serializers.SerializerMethodField()

    def get_density(self, obj):
        """
        Gets the Carbon Intensity
        """
        row = CreditCalculationService.get(
            model_name="DefaultCarbonIntensity",
            category_id=obj.id,
            effective_date=date.today()
        )

        return row.density if row else None

    def get_revised_density(self, obj):
        """
        Gets the future density value, if applicable
        """
        density = CreditCalculationService.get_later(
            model_name="DefaultCarbonIntensity",
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
        model = DefaultCarbonIntensityCategory
        fields = (
            'id', 'name', 'density', 'revised_density'
        )


class DefaultCarbonIntensityUpdateSerializer(serializers.Serializer):
    """
    Default Carbon Intensity Limit Serializer
    """

    density = serializers.FloatField(allow_null=False)
    effective_date = serializers.DateField(allow_null=False)
    expiration_date = serializers.DateField(allow_null=True, required=False)

    def __init__(self, *args, **kwargs):
        super(DefaultCarbonIntensityUpdateSerializer, self).__init__(
            *args, **kwargs
        )

    def validate(self, data):
        return data

    def update(self, instance, validated_data):
        request = self.context.get('request')

        CreditCalculationService.update(
            category_id=instance.id,
            effective_date=validated_data['effective_date'],
            model_name="DefaultCarbonIntensity",
            density=validated_data['density'],
            update_user=request.user
        )

        return validated_data


class DefaultCarbonIntensityDetailSerializer(serializers.ModelSerializer):
    """
    Default Carbon Intensity Detail Serializer
    """
    density = serializers.SerializerMethodField()

    def get_density(self, obj):
        """
        Gets the Carbon Intensity
        """
        row = CreditCalculationService.get(
            model_name="DefaultCarbonIntensity",
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
        model = DefaultCarbonIntensityCategory
        fields = (
            'id', 'name', 'density'
        )


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
            'id', 'name', 'density', 'unit_of_measure'
        )


class EnergyEffectivenessRatioSerializer(serializers.ModelSerializer):
    """
    Default Energy Effectiveness Ratio Serializer
    """
    diesel_ratio = serializers.SerializerMethodField()
    gasoline_ratio = serializers.SerializerMethodField()
    revised_diesel_ratio = serializers.SerializerMethodField()
    revised_gasoline_ratio = serializers.SerializerMethodField()

    def get_diesel_ratio(self, obj):
        """
        Gets the Energy Effectiveness Ratio for Diesel Class
        """
        diesel_ratio = CreditCalculationService.get(
            model_name="EnergyEffectivenessRatio",
            category_id=obj.id,
            effective_date=date.today(),
            fuel_class__fuel_class="Diesel"
        )

        return diesel_ratio.ratio if diesel_ratio else None

    def get_gasoline_ratio(self, obj):
        """
        Gets the Energy Effectiveness Ratio for Gasoline Class
        """
        gasoline_ratio = CreditCalculationService.get(
            model_name="EnergyEffectivenessRatio",
            category_id=obj.id,
            effective_date=date.today(),
            fuel_class__fuel_class="Gasoline"
        )

        return gasoline_ratio.ratio if gasoline_ratio else None

    def get_revised_diesel_ratio(self, obj):
        """
        Gets the future diesel ratio, if applicable
        """
        ratio = CreditCalculationService.get_later(
            model_name="EnergyEffectivenessRatio",
            category_id=obj.id,
            effective_date=date.today(),
            fuel_class__fuel_class="Diesel"
        )

        if not ratio:
            return None

        return {
            "ratio": ratio.ratio,
            "effective_date": ratio.effective_date
        }

    def get_revised_gasoline_ratio(self, obj):
        """
        Gets the future gasoline ratio, if applicable
        """
        ratio = CreditCalculationService.get_later(
            model_name="EnergyEffectivenessRatio",
            category_id=obj.id,
            effective_date=date.today(),
            fuel_class__fuel_class="Gasoline"
        )

        if not ratio:
            return None

        return {
            "ratio": ratio.ratio,
            "effective_date": ratio.effective_date
        }

    class Meta:
        model = EnergyEffectivenessRatioCategory
        fields = (
            'id', 'name', 'diesel_ratio', 'gasoline_ratio',
            'revised_diesel_ratio', 'revised_gasoline_ratio'
        )


class EnergyEffectivenessRatioUpdateSerializer(serializers.Serializer):
    """
    Energy Effectiveness Ratio Update Serializer
    """
    diesel_ratio = serializers.FloatField(
        allow_null=True, required=False
    )
    gasoline_ratio = serializers.FloatField(
        allow_null=True, required=False
    )
    diesel_effective_date = serializers.DateField(
        allow_null=True, required=False
    )
    diesel_expiration_date = serializers.DateField(
        allow_null=True, required=False
    )
    gasoline_effective_date = serializers.DateField(
        allow_null=True, required=False
    )
    gasoline_expiration_date = serializers.DateField(
        allow_null=True, required=False
    )

    def __init__(self, *args, **kwargs):
        super(EnergyEffectivenessRatioUpdateSerializer, self).__init__(
            *args, **kwargs
        )

    def update(self, instance, validated_data):
        request = self.context.get('request')

        if 'diesel_ratio' in validated_data:
            fuel_class_id = FuelClass.objects.get(fuel_class="Diesel").id

            CreditCalculationService.update(
                category_id=instance.id,
                effective_date=validated_data['diesel_effective_date'],
                fuel_class_id=fuel_class_id,
                model_name="EnergyEffectivenessRatio",
                ratio=validated_data['diesel_ratio'],
                update_user=request.user
            )

        if 'gasoline_ratio' in validated_data:
            fuel_class_id = FuelClass.objects.get(fuel_class="Gasoline").id

            CreditCalculationService.update(
                category_id=instance.id,
                effective_date=validated_data['gasoline_effective_date'],
                fuel_class_id=fuel_class_id,
                model_name="EnergyEffectivenessRatio",
                ratio=validated_data['gasoline_ratio'],
                update_user=request.user
            )

        return validated_data


class EnergyEffectivenessRatioDetailSerializer(serializers.ModelSerializer):
    """
    Energy Effectiveness Ratio Detail Serializer
    """
    ratios = serializers.SerializerMethodField()

    def get_ratios(self, obj):
        """
        Gets the Energy Effectiveness Ratio for Diesel and Gasoline Class
        """
        diesel_ratio = CreditCalculationService.get(
            category_id=obj.id,
            effective_date=date.today(),
            fuel_class__fuel_class="Diesel",
            model_name="EnergyEffectivenessRatio"
        )

        gasoline_ratio = CreditCalculationService.get(
            category_id=obj.id,
            effective_date=date.today(),
            fuel_class__fuel_class="Gasoline",
            model_name="EnergyEffectivenessRatio"
        )

        return {
            "diesel": {
                "fuel": "Diesel Class",
                "ratio": diesel_ratio.ratio if diesel_ratio else None,
                "effective_date":
                    diesel_ratio.effective_date if diesel_ratio else None,
                "expiration_date":
                    diesel_ratio.expiration_date if diesel_ratio else None
            },
            "gasoline": {
                "fuel": "Gasoline Class",
                "ratio": gasoline_ratio.ratio if gasoline_ratio else None,
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
            'id', 'name', 'density'
        )
