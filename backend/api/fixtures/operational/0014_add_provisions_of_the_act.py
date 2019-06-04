from django.db import transaction

from api.management.data_script import OperationalDataScript
from api.models.ApprovedFuel import ApprovedFuel
from api.models.ApprovedFuelProvision import ApprovedFuelProvision
from api.models.CarbonIntensityDeterminationType import \
    CarbonIntensityDeterminationType
from api.models.ProvisionOfTheAct import ProvisionOfTheAct


class AddProvisionsOfTheAct(OperationalDataScript):
    """
    Adds the Determination Types and attach them to the
    Provisions of the Act and associates them to the fuel
    """
    is_revertable = False
    comment = "Adds the Determination Types and attach them to the " \
              "Provisions of the Act and associates them to the fuel."

    def check_run_preconditions(self):
        return True

    @transaction.atomic
    def run(self):
        prescribed_carbon_intensity = \
            CarbonIntensityDeterminationType.objects.create(
                description="Prescribed carbon intensity",
                display_order="1",
                effective_date="2017-01-01",
                the_type="Carbon Intensity"
            )
        approved_fuel_code = \
            CarbonIntensityDeterminationType.objects.create(
                description="Approved fuel code",
                display_order="2",
                effective_date="2017-01-01",
                the_type="Fuel Code"
            )
        default_carbon_intensity = \
            CarbonIntensityDeterminationType.objects.create(
                description="Default Carbon Intensity Value",
                display_order="3",
                effective_date="2017-01-01",
                the_type="Default Carbon Intensity"
            )
        gh_genius = \
            CarbonIntensityDeterminationType.objects.create(
                description="GHGenius modelled",
                display_order="4",
                effective_date="2017-01-01",
                the_type="GHGenius"
            )
        alternative_method = \
            CarbonIntensityDeterminationType.objects.create(
                description="Alternative Method",
                display_order="5",
                effective_date="2017-01-01",
                the_type="Alternative"
            )

        provision = ProvisionOfTheAct.objects.create(
            description="Section 6 (5) (a)",
            determination_type=prescribed_carbon_intensity
        )
        ApprovedFuelProvision.objects.create(
            fuel=ApprovedFuel.objects.get(name="Petroleum-based gasoline"),
            provision=provision
        )

        provision = ProvisionOfTheAct.objects.create(
            description="Section 6 (5) (b)",
            determination_type=prescribed_carbon_intensity
        )
        ApprovedFuelProvision.objects.create(
            fuel=ApprovedFuel.objects.get(name="Petroleum-based diesel"),
            provision=provision
        )

        # other fuel types
        fuel_types = ApprovedFuel.objects.exclude(
            name__in=["Petroleum-based diesel", "Petroleum-based gasoline"]
        )

        # Section 6 (5) (c)
        provision = ProvisionOfTheAct.objects.create(
            description="Section 6 (5) (c)",
            determination_type=approved_fuel_code
        )

        obj = [
            ApprovedFuelProvision(
                fuel=fuel_type,
                provision=provision
            ) for fuel_type in fuel_types
        ]

        ApprovedFuelProvision.objects.bulk_create(obj)

        # Section 6 (5) (d) (i)
        provision = ProvisionOfTheAct.objects.create(
            description="Section 6 (5) (d) (i)",
            determination_type=default_carbon_intensity
        )

        obj = [
            ApprovedFuelProvision(
                fuel=fuel_type,
                provision=provision
            ) for fuel_type in fuel_types
        ]

        ApprovedFuelProvision.objects.bulk_create(obj)

        # Section 6 (5) (d) (ii) (A)
        provision = ProvisionOfTheAct.objects.create(
            description="Section 6 (5) (d) (ii) (A)",
            determination_type=gh_genius
        )

        obj = [
            ApprovedFuelProvision(
                fuel=fuel_type,
                provision=provision
            ) for fuel_type in fuel_types
        ]

        ApprovedFuelProvision.objects.bulk_create(obj)

        # Section 6 (5) (d) (ii) (B)
        provision = ProvisionOfTheAct.objects.create(
            description="Section 6 (5) (d) (ii) (B)",
            determination_type=alternative_method
        )

        obj = [
            ApprovedFuelProvision(
                fuel=fuel_type,
                provision=provision
            ) for fuel_type in fuel_types
        ]

        ApprovedFuelProvision.objects.bulk_create(obj)

script_class = AddProvisionsOfTheAct
