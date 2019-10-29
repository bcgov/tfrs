from django.db import transaction

from api.management.data_script import OperationalDataScript
from api.models.CarbonIntensityLimit import CarbonIntensityLimit
from api.models.CompliancePeriod import CompliancePeriod
from api.models.FuelClass import FuelClass


class UpdateCreditCalculationValues(OperationalDataScript):
    """
    Adds the Credit Calculation Values for 2013 to 2016
    """
    is_revertable = False
    comment = 'Adds Credit Calculation Values for 2013-2016'

    def check_run_preconditions(self):
        return True

    @transaction.atomic
    def run(self):
        UpdateCreditCalculationValues.update_carbon_intensity_limits()

    @staticmethod
    def update_carbon_intensity_limits():
        #  2013-14
        CarbonIntensityLimit.objects.filter(
            compliance_period=CompliancePeriod.objects.get(
                description="2013-14"
            ),
            fuel_class=FuelClass.objects.get(fuel_class="Diesel")
        ).update(
            expiration_date=None
        )
        CarbonIntensityLimit.objects.filter(
            compliance_period=CompliancePeriod.objects.get(
                description="2013-14"
            ),
            fuel_class=FuelClass.objects.get(fuel_class="Gasoline")
        ).update(
            expiration_date=None
        )

        #  2015
        CarbonIntensityLimit.objects.filter(
            compliance_period=CompliancePeriod.objects.get(description="2015"),
            fuel_class=FuelClass.objects.get(fuel_class="Diesel")
        ).update(
            expiration_date=None
        )
        CarbonIntensityLimit.objects.filter(
            compliance_period=CompliancePeriod.objects.get(description="2015"),
            fuel_class=FuelClass.objects.get(fuel_class="Gasoline")
        ).update(
            expiration_date=None
        )
        #  2016
        CarbonIntensityLimit.objects.filter(
            compliance_period=CompliancePeriod.objects.get(description="2016"),
            fuel_class=FuelClass.objects.get(fuel_class="Diesel")
        ).update(
            expiration_date=None
        )
        CarbonIntensityLimit.objects.filter(
            compliance_period=CompliancePeriod.objects.get(description="2016"),
            fuel_class=FuelClass.objects.get(fuel_class="Gasoline")
        ).update(
            expiration_date=None
        )


script_class = UpdateCreditCalculationValues
