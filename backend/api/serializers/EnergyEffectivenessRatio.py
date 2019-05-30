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

from api.models.EnergyEffectivenessRatioCategory import \
    EnergyEffectivenessRatioCategory
from api.models.FuelClass import FuelClass
from api.services.CreditCalculationService import CreditCalculationService


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
    all_values = serializers.SerializerMethodField()

    def get_all_values(self, obj):
        gasoline_rows = CreditCalculationService.get_all(
            model_name="EnergyEffectivenessRatio",
            fuel_class__fuel_class="Gasoline",
            category_id=obj.id
        )

        diesel_rows = CreditCalculationService.get_all(
            model_name="EnergyEffectivenessRatio",
            fuel_class__fuel_class="Diesel",
            category_id=obj.id
        )

        rows = list(gasoline_rows) + list(diesel_rows)

        serialized = []

        for row in rows:
            serialized.append(
                {
                    "ratio": row.ratio,
                    "fuel_class": row.fuel_class.fuel_class,
                    "effective_date": row.effective_date,
                    "expiration_date": row.expiration_date,
                    "create_timestamp": row.create_timestamp
                }
            )

        return serialized

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
            'id', 'name', 'ratios', 'all_values'
        )
