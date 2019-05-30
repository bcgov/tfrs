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

from api.models.CompliancePeriod import CompliancePeriod
from api.models.FuelClass import FuelClass
from api.services.CreditCalculationService import CreditCalculationService


class CarbonIntensityLimitSerializer(serializers.ModelSerializer):
    """
    Default Carbon Intensity Limit Serializer
    """
    limits = serializers.SerializerMethodField()
    all_values = serializers.SerializerMethodField()
    revised_limits = serializers.SerializerMethodField()

    def get_all_values(self, obj):

        gasoline_rows = CreditCalculationService.get_all(
            model_name="CarbonIntensityLimit",
            fuel_class__fuel_class="Gasoline",
            compliance_period_id=obj.id,
        )

        diesel_rows = CreditCalculationService.get_all(
            model_name="CarbonIntensityLimit",
            fuel_class__fuel_class="Diesel",
            compliance_period_id=obj.id,
        )

        rows = list(gasoline_rows) + list(diesel_rows)

        serialized = []

        for row in rows:
            serialized.append(
                {
                    "fuel_class": row.fuel_class.fuel_class,
                    "density": row.density,
                    "effective_date": row.effective_date,
                    "expiration_date": row.effective_date,
                    "create_timestamp": row.create_timestamp
                }
            )

        return serialized

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

    class Meta:
        model = CompliancePeriod

        fields = ('id', 'description', 'display_order', 'limits',
                  'all_values', 'revised_limits')


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
