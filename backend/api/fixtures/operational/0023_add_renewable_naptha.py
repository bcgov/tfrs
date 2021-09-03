from django.db import transaction

from api.management.data_script import OperationalDataScript
from api.models.ApprovedFuel import ApprovedFuel
from api.models.DefaultCarbonIntensityCategory import \
    DefaultCarbonIntensityCategory
from api.models.EnergyDensity import EnergyDensity
from api.models.EnergyDensityCategory import EnergyDensityCategory
from api.models.EnergyEffectivenessRatioCategory import \
    EnergyEffectivenessRatioCategory
from api.models.UnitOfMeasure import UnitOfMeasure
from api.models.ApprovedFuelClass import ApprovedFuelClass
from api.models.FuelClass import FuelClass
from api.models.ApprovedFuelProvision import ApprovedFuelProvision


class AddRenewableNaptha(OperationalDataScript):
    is_revertable = False
    comment = 'Add renewable naphtha as approved fuel'

    def check_run_preconditions(self):
        return True

    @transaction.atomic
    def run(self):
        carbon_intensity_category = DefaultCarbonIntensityCategory.objects.filter(
            name="Renewable fuel in relation to gasoline class fuel"
        ).first()
        energy_density_category = EnergyDensityCategory.objects.create(
            name="Naphtha produced from biomass",
            display_order="11"
        )
        energy_density = EnergyDensity.objects.create(
            category=energy_density_category,
            density="32.76",
            effective_date="2017-01-01"
        )
        energy_effective_ratio_category = EnergyEffectivenessRatioCategory.objects.get(
            name="Petroleum-based gasoline, natural gas-based gasoline or renewable fuel in relation to gasoline class fuel"
        )
        unit_of_measure = UnitOfMeasure.objects.filter(
            name="L"
        ).first()

        fuel = ApprovedFuel.objects.create(
            name="Renewable naphtha",
            description="Naphtha produced from biomass",
            credit_calculation_only=False,
            default_carbon_intensity_category=carbon_intensity_category,
            effective_date="2022-01-01",
            energy_density_category=energy_density_category,
            energy_effectiveness_ratio_category=energy_effective_ratio_category,
            unit_of_measure=unit_of_measure,
            is_partially_renewable=True
        )

        fuel_class = FuelClass.objects.filter(
            fuel_class="Gasoline"
        ).first()

        ApprovedFuelClass.objects.create(
            fuel=fuel,
            fuel_class=fuel_class
        )

        provisions = ApprovedFuelProvision.objects.filter(
            fuel__name="Ethanol"
        )

        for provision in provisions:
            ApprovedFuelProvision.objects.create(
                fuel_id=fuel.id,
                provision_act_id=provision.provision_act_id,
                determination_type_id=provision.determination_type_id
            )


script_class = AddRenewableNaptha
