from django.db import transaction

from api.management.data_script import OperationalDataScript
from api.models.CarbonIntensityLimit import CarbonIntensityLimit
from api.models.CompliancePeriod import CompliancePeriod
from api.models.FuelClass import FuelClass


class AddCarbonIntensityLimits(OperationalDataScript):
    """
    Adds Carbon Intensity Limits
    """
    is_revertable = False
    comment = 'Adds Carbon Intensity Limits for 2017-2030'

    def check_run_preconditions(self):
        return True

    @transaction.atomic
    def run(self):
        #  2017
        CarbonIntensityLimit.objects.create(
            compliance_period=CompliancePeriod.objects.get(description="2017"),
            effective_date="2017-01-01",
            expiration_date="2017-12-31",
            density="90.02",
            fuel_class=FuelClass.objects.get(fuel_class="Diesel")
        )
        CarbonIntensityLimit.objects.create(
            compliance_period=CompliancePeriod.objects.get(description="2017"),
            effective_date="2017-01-01",
            expiration_date="2017-12-31",
            density="83.74",
            fuel_class=FuelClass.objects.get(fuel_class="Gasoline")
        )

        #  2018
        CarbonIntensityLimit.objects.create(
            compliance_period=CompliancePeriod.objects.get(description="2018"),
            effective_date="2018-01-01",
            expiration_date="2018-12-31",
            density="88.60",
            fuel_class=FuelClass.objects.get(fuel_class="Diesel")
        )
        CarbonIntensityLimit.objects.create(
            compliance_period=CompliancePeriod.objects.get(description="2018"),
            effective_date="2018-01-01",
            expiration_date="2018-12-31",
            density="82.41",
            fuel_class=FuelClass.objects.get(fuel_class="Gasoline")
        )

        #  2019
        CarbonIntensityLimit.objects.create(
            compliance_period=CompliancePeriod.objects.get(description="2019"),
            effective_date="2019-01-01",
            expiration_date="2019-12-31",
            density="87.18",
            fuel_class=FuelClass.objects.get(fuel_class="Diesel")
        )
        CarbonIntensityLimit.objects.create(
            compliance_period=CompliancePeriod.objects.get(description="2019"),
            effective_date="2019-01-01",
            expiration_date="2019-12-31",
            density="81.09",
            fuel_class=FuelClass.objects.get(fuel_class="Gasoline")
        )

        carbon_intensities = []

        for period in range(2020, 2031):
            carbon_intensities.append(
                CarbonIntensityLimit(
                    compliance_period=CompliancePeriod.objects.get(
                        description=period
                    ),
                    effective_date="{}-01-01".format(period),
                    expiration_date="{}-12-31".format(period),
                    density="85.28",
                    fuel_class=FuelClass.objects.get(fuel_class="Diesel")
                )
            )

            carbon_intensities.append(
                CarbonIntensityLimit(
                    compliance_period=CompliancePeriod.objects.get(
                        description=period
                    ),
                    effective_date="{}-01-01".format(period),
                    expiration_date="{}-12-31".format(period),
                    density="79.33",
                    fuel_class=FuelClass.objects.get(fuel_class="Gasoline")
                )
            )

        CarbonIntensityLimit.objects.bulk_create(carbon_intensities)

script_class = AddCarbonIntensityLimits
