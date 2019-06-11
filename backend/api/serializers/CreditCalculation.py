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
from django.db.models import Q


from api.models.ApprovedFuel import ApprovedFuel
from api.models.CompliancePeriod import CompliancePeriod
from api.models.FuelCode import FuelCode
from api.serializers.FuelCode import FuelCodeSerializer
from api.services.CreditCalculationService import CreditCalculationService


class CreditCalculationSerializer(serializers.ModelSerializer):
    """
    Serializer to get all the densities and ratios based on a fuel
    type and compliance period
    """
    carbon_intensity_limit = serializers.SerializerMethodField()
    default_carbon_intensity = serializers.SerializerMethodField()
    energy_density = serializers.SerializerMethodField()
    energy_effectiveness_ratio = serializers.SerializerMethodField()
    fuel_codes = serializers.SerializerMethodField()

    def __init__(self, *args, **kwargs):
        super(CreditCalculationSerializer, self).__init__(
            *args, **kwargs
        )

        request = self.context.get('request')
        compliance_period_id = request.GET.get('compliance_period_id', None)
        compliance_period_obj = CompliancePeriod.objects.get(
            id=compliance_period_id
        )

        self.effective_date = compliance_period_obj.effective_date
        self.expiration_date = compliance_period_obj.expiration_date

    def get_carbon_intensity_limit(self, _obj):
        """
        Gets the Carbon Intensity Limit
        """
        diesel_row = CreditCalculationService.get(
            effective_date=self.effective_date,
            fuel_class__fuel_class="Diesel",
            model_name="CarbonIntensityLimit"
        )

        gasoline_row = CreditCalculationService.get(
            effective_date=self.effective_date,
            fuel_class__fuel_class="Gasoline",
            model_name="CarbonIntensityLimit"
        )

        return {
            "diesel": diesel_row.density if diesel_row else None,
            "gasoline": gasoline_row.density if gasoline_row else None
        }

    def get_default_carbon_intensity(self, obj):
        """
        Gets the Default Carbon Intensity
        """
        if obj.credit_calculation_only:
            row = CreditCalculationService.get(
                category__name=obj.name,
                effective_date=self.effective_date,
                model_name="PetroleumCarbonIntensity"
            )
        else:
            row = CreditCalculationService.get(
                category_id=obj.default_carbon_intensity_category_id,
                effective_date=self.effective_date,
                model_name="DefaultCarbonIntensity"
            )

        return row.density if row else None

    def get_energy_density(self, obj):
        """
        Gets the Energy Density
        """
        row = CreditCalculationService.get(
            category_id=obj.energy_density_category_id,
            effective_date=self.effective_date,
            model_name="EnergyDensity"
        )

        return row.density if row else None

    def get_energy_effectiveness_ratio(self, obj):
        """
        Gets the Energy Effectiveness Ratio
        """
        diesel_row = CreditCalculationService.get(
            category_id=obj.energy_effectiveness_ratio_category_id,
            effective_date=self.effective_date,
            fuel_class__fuel_class="Diesel",
            model_name="EnergyEffectivenessRatio"
        )

        gasoline_row = CreditCalculationService.get(
            category_id=obj.energy_effectiveness_ratio_category_id,
            effective_date=self.effective_date,
            fuel_class__fuel_class="Gasoline",
            model_name="EnergyEffectivenessRatio"
        )

        return {
            "diesel": diesel_row.ratio if diesel_row else None,
            "gasoline": gasoline_row.ratio if gasoline_row else None
        }

    def get_fuel_codes(self, obj):
        """
        Gets the available fuel codes for the fuel type
        """
        fuel_codes = FuelCode.objects.filter(
            fuel_id=obj.id
        ).filter(
            Q(effective_date__gte=self.effective_date,
              effective_date__lte=self.expiration_date) |
            Q(expiry_date__gte=self.effective_date,
              expiry_date__lte=self.expiration_date)
        ).order_by(
            'fuel_code', 'fuel_code_version', 'fuel_code_version_minor'
        )

        serializer = FuelCodeSerializer(fuel_codes, read_only=True, many=True)

        return serializer.data

    class Meta:
        model = ApprovedFuel
        fields = (
            'id', 'name', 'carbon_intensity_limit', 'default_carbon_intensity',
            'energy_density', 'energy_effectiveness_ratio', 'fuel_codes'
        )
