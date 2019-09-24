from django.db import transaction

from api.management.data_script import OperationalDataScript
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
from api.models.FuelClass import FuelClass
from api.models.PetroleumCarbonIntensity import PetroleumCarbonIntensity
from api.models.PetroleumCarbonIntensityCategory import \
    PetroleumCarbonIntensityCategory


class AddCreditCalculationValues(OperationalDataScript):
    """
    Adds the Credit Calculation Values for 2013 to 2016
    """
    is_revertable = False
    comment = 'Adds Credit Calculation Values for 2013-2016'

    def check_run_preconditions(self):
        return True

    @transaction.atomic
    def run(self):
        dates = [
            ("2013-07-01", "2014-12-31"),
            ("2015-01-01", "2015-12-31"),
            ("2016-01-01", "2016-12-31")
        ]

        AddCreditCalculationValues.add_carbon_intensity_limits()
        AddCreditCalculationValues.add_energy_effectiveness_ratios(dates)
        AddCreditCalculationValues.add_default_carbon_intensities(dates)
        AddCreditCalculationValues.add_energy_densities(dates)

    @staticmethod
    def add_carbon_intensity_limits():
        #  2013-14
        CarbonIntensityLimit.objects.create(
            compliance_period=CompliancePeriod.objects.get(
                description="2013-14"
            ),
            effective_date="2013-07-01",
            expiration_date="2014-12-31",
            density="92.38",
            fuel_class=FuelClass.objects.get(fuel_class="Diesel")
        )
        CarbonIntensityLimit.objects.create(
            compliance_period=CompliancePeriod.objects.get(
                description="2013-14"
            ),
            effective_date="2013-07-01",
            expiration_date="2014-12-31",
            density="86.20",
            fuel_class=FuelClass.objects.get(fuel_class="Gasoline")
        )

        #  2015
        CarbonIntensityLimit.objects.create(
            compliance_period=CompliancePeriod.objects.get(description="2015"),
            effective_date="2015-01-01",
            expiration_date="2015-12-31",
            density="91.21",
            fuel_class=FuelClass.objects.get(fuel_class="Diesel")
        )
        CarbonIntensityLimit.objects.create(
            compliance_period=CompliancePeriod.objects.get(description="2015"),
            effective_date="2015-01-01",
            expiration_date="2015-12-31",
            density="85.11",
            fuel_class=FuelClass.objects.get(fuel_class="Gasoline")
        )

        #  2016
        CarbonIntensityLimit.objects.create(
            compliance_period=CompliancePeriod.objects.get(description="2016"),
            effective_date="2016-01-01",
            expiration_date="2016-12-31",
            density="90.28",
            fuel_class=FuelClass.objects.get(fuel_class="Diesel")
        )
        CarbonIntensityLimit.objects.create(
            compliance_period=CompliancePeriod.objects.get(description="2016"),
            effective_date="2016-01-01",
            expiration_date="2016-12-31",
            density="84.23",
            fuel_class=FuelClass.objects.get(fuel_class="Gasoline")
        )

    @staticmethod
    def add_energy_effectiveness_ratios(dates):
        for date in dates:
            effective_date, expiration_date = date

            EnergyEffectivenessRatio.objects.create(
                category=EnergyEffectivenessRatioCategory.objects.get(
                    name="CNG"
                ),
                effective_date=effective_date,
                expiration_date=expiration_date,
                ratio="0.9",
                fuel_class=FuelClass.objects.get(fuel_class="Diesel")
            )
            EnergyEffectivenessRatio.objects.create(
                category=EnergyEffectivenessRatioCategory.objects.get(
                    name="CNG"
                ),
                effective_date=effective_date,
                expiration_date=expiration_date,
                ratio="1.0",
                fuel_class=FuelClass.objects.get(fuel_class="Gasoline")
            )
            EnergyEffectivenessRatio.objects.create(
                category=EnergyEffectivenessRatioCategory.objects.get(
                    name="Electricity"
                ),
                effective_date=effective_date,
                expiration_date=expiration_date,
                ratio="2.7",
                fuel_class=FuelClass.objects.get(fuel_class="Diesel")
            )
            EnergyEffectivenessRatio.objects.create(
                category=EnergyEffectivenessRatioCategory.objects.get(
                    name="Electricity"
                ),
                effective_date=effective_date,
                expiration_date=expiration_date,
                ratio="3.4",
                fuel_class=FuelClass.objects.get(fuel_class="Gasoline")
            )
            EnergyEffectivenessRatio.objects.create(
                category=EnergyEffectivenessRatioCategory.objects.get(
                    name="Hydrogen"
                ),
                effective_date=effective_date,
                expiration_date=expiration_date,
                ratio="1.9",
                fuel_class=FuelClass.objects.get(fuel_class="Diesel")
            )
            EnergyEffectivenessRatio.objects.create(
                category=EnergyEffectivenessRatioCategory.objects.get(
                    name="Hydrogen"
                ),
                effective_date=effective_date,
                expiration_date=expiration_date,
                ratio="2.5",
                fuel_class=FuelClass.objects.get(fuel_class="Gasoline")
            )
            EnergyEffectivenessRatio.objects.create(
                category=EnergyEffectivenessRatioCategory.objects.get(
                    name="LNG"
                ),
                effective_date=effective_date,
                expiration_date=expiration_date,
                ratio="1.0",
                fuel_class=FuelClass.objects.get(fuel_class="Diesel")
            )
            EnergyEffectivenessRatio.objects.create(
                category=EnergyEffectivenessRatioCategory.objects.get(
                    name="Petroleum-based diesel fuel or renewable fuel in "
                         "relation to diesel class fuel"
                ),
                effective_date=effective_date,
                expiration_date=expiration_date,
                ratio="1.0",
                fuel_class=FuelClass.objects.get(fuel_class="Diesel")
            )
            EnergyEffectivenessRatio.objects.create(
                category=EnergyEffectivenessRatioCategory.objects.get(
                    name="Petroleum-based gasoline, natural gas-based "
                         "gasoline or renewable fuel in relation to gasoline "
                         "class fuel"
                ),
                effective_date=effective_date,
                expiration_date=expiration_date,
                ratio="1.0",
                fuel_class=FuelClass.objects.get(fuel_class="Gasoline")
            )
            EnergyEffectivenessRatio.objects.create(
                category=EnergyEffectivenessRatioCategory.objects.get(
                    name="Propane"
                ),
                effective_date=effective_date,
                expiration_date=expiration_date,
                ratio="1.0",
                fuel_class=FuelClass.objects.get(fuel_class="Diesel")
            )
            EnergyEffectivenessRatio.objects.create(
                category=EnergyEffectivenessRatioCategory.objects.get(
                    name="Propane"
                ),
                effective_date=effective_date,
                expiration_date=expiration_date,
                ratio="1.0",
                fuel_class=FuelClass.objects.get(fuel_class="Gasoline")
            )

    @staticmethod
    def add_default_carbon_intensities(dates):
        for date in dates:
            effective_date, expiration_date = date

            DefaultCarbonIntensity.objects.create(
                category=DefaultCarbonIntensityCategory.objects.get(
                    name__iexact="CNG"
                ),
                effective_date=effective_date,
                expiration_date=expiration_date,
                density="62.14"
            )
            DefaultCarbonIntensity.objects.create(
                category=DefaultCarbonIntensityCategory.objects.get(
                    name__iexact="Electricity"
                ),
                effective_date=effective_date,
                expiration_date=expiration_date,
                density="11.00"
            )
            DefaultCarbonIntensity.objects.create(
                category=DefaultCarbonIntensityCategory.objects.get(
                    name__iexact="Hydrogen"
                ),
                effective_date=effective_date,
                expiration_date=expiration_date,
                density="95.51"
            )
            DefaultCarbonIntensity.objects.create(
                category=DefaultCarbonIntensityCategory.objects.get(
                    name__iexact="LNG"
                ),
                effective_date=effective_date,
                expiration_date=expiration_date,
                density="63.26"
            )
            DefaultCarbonIntensity.objects.create(
                category=DefaultCarbonIntensityCategory.objects.get(
                    name__iexact="Natural gas-based gasoline"
                ),
                effective_date=effective_date,
                expiration_date=expiration_date,
                density="90.07"
            )
            PetroleumCarbonIntensity.objects.create(
                category=PetroleumCarbonIntensityCategory.objects.get(
                    name="Petroleum-based diesel"
                ),
                effective_date=effective_date,
                expiration_date=expiration_date,
                density="93.55"
            )
            PetroleumCarbonIntensity.objects.create(
                category=PetroleumCarbonIntensityCategory.objects.get(
                    name="Petroleum-based gasoline"
                ),
                effective_date=effective_date,
                expiration_date=expiration_date,
                density="87.29"
            )
            DefaultCarbonIntensity.objects.create(
                category=DefaultCarbonIntensityCategory.objects.get(
                    name__iexact="Propane"
                ),
                effective_date=effective_date,
                expiration_date=expiration_date,
                density="75.35"
            )
            DefaultCarbonIntensity.objects.create(
                category=DefaultCarbonIntensityCategory.objects.get(
                    name__iexact="Renewable Fuel in relation to diesel class "
                                 "fuel"
                ),
                effective_date=effective_date,
                expiration_date=expiration_date,
                density="93.55"
            )
            DefaultCarbonIntensity.objects.create(
                category=DefaultCarbonIntensityCategory.objects.get(
                    name__iexact="Renewable Fuel in relation to gasoline "
                                 "class fuel"
                ),
                effective_date=effective_date,
                expiration_date=expiration_date,
                density="87.29"
            )

    @staticmethod
    def add_energy_densities(dates):
        for date in dates:
            effective_date, expiration_date = date

            EnergyDensity.objects.create(
                category=EnergyDensityCategory.objects.get(
                    name="Biodiesel"
                ),
                effective_date=effective_date,
                expiration_date=expiration_date,
                density="36.94"
            )
            EnergyDensity.objects.create(
                category=EnergyDensityCategory.objects.get(
                    name="CNG"
                ),
                effective_date=effective_date,
                expiration_date=expiration_date,
                density="38.26"
            )
            EnergyDensity.objects.create(
                category=EnergyDensityCategory.objects.get(
                    name="Electricity"
                ),
                effective_date=effective_date,
                expiration_date=expiration_date,
                density="3.60"
            )
            EnergyDensity.objects.create(
                category=EnergyDensityCategory.objects.get(
                    name="Ethanol"
                ),
                effective_date=effective_date,
                expiration_date=expiration_date,
                density="23.58"
            )
            EnergyDensity.objects.create(
                category=EnergyDensityCategory.objects.get(
                    name="Hydrogen"
                ),
                effective_date=effective_date,
                expiration_date=expiration_date,
                density="120.00"
            )
            EnergyDensity.objects.create(
                category=EnergyDensityCategory.objects.get(
                    name="Hydrogenation-derived renewable diesel fuel"
                ),
                effective_date=effective_date,
                expiration_date=expiration_date,
                density="36.51"
            )
            EnergyDensity.objects.create(
                category=EnergyDensityCategory.objects.get(
                    name="LNG"
                ),
                effective_date=effective_date,
                expiration_date=expiration_date,
                density="52.87"
            )
            EnergyDensity.objects.create(
                category=EnergyDensityCategory.objects.get(
                    name="Petroleum-based diesel fuel or diesel fuel produced "
                         "from biomass"
                ),
                effective_date=effective_date,
                expiration_date=expiration_date,
                density="38.65"
            )
            EnergyDensity.objects.create(
                category=EnergyDensityCategory.objects.get(
                    name="Petroleum-based gasoline, natural gas-based "
                         "gasoline or gasoline produced from biomass"
                ),
                effective_date=effective_date,
                expiration_date=expiration_date,
                density="34.69"
            )
            EnergyDensity.objects.create(
                category=EnergyDensityCategory.objects.get(
                    name="Propane"
                ),
                effective_date=effective_date,
                expiration_date=expiration_date,
                density="25.59"
            )


script_class = AddCreditCalculationValues
