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
                display_order="1",
                effective_date="2017-01-01",
                the_type="Carbon Intensity"
            )

        provision = ProvisionOfTheAct.objects.create(
            description="Prescribed carbon intensity",
            display_order="1",
            effective_date="2017-01-01",
            expiration_date=None,
            provision="Section 6 (5) (a)"
        )
        ApprovedFuelProvision.objects.create(
            fuel=ApprovedFuel.objects.get(name="Petroleum-based gasoline"),
            provision_act=provision,
            determination_type=prescribed_carbon_intensity
        )

        provision = ProvisionOfTheAct.objects.create(
            description="Prescribed carbon intensity",
            display_order="2",
            effective_date="2017-01-01",
            expiration_date=None,
            provision="Section 6 (5) (b)"
        )
        ApprovedFuelProvision.objects.create(
            fuel=ApprovedFuel.objects.get(name="Petroleum-based diesel"),
            provision_act=provision,
            determination_type=prescribed_carbon_intensity
        )

        # other fuel types
        approved_fuel_code = \
            CarbonIntensityDeterminationType.objects.create(
                display_order="2",
                effective_date="2017-01-01",
                the_type="Fuel Code"
            )

        fuel_types = ApprovedFuel.objects.exclude(
            name__in=["Petroleum-based diesel", "Petroleum-based gasoline"]
        )

        # Section 6 (5) (c)
        provision = ProvisionOfTheAct.objects.create(
            description="Approved fuel code",
            display_order="3",
            effective_date="2017-01-01",
            expiration_date=None,
            provision="Section 6 (5) (c)"
        )

        obj = [
            ApprovedFuelProvision(
                fuel=fuel_type,
                provision_act=provision,
                determination_type=approved_fuel_code
            ) for fuel_type in fuel_types
        ]

        ApprovedFuelProvision.objects.bulk_create(obj)

        # Section 6 (5) (d) (i)
        default_carbon_intensity = \
            CarbonIntensityDeterminationType.objects.create(
                display_order="3",
                effective_date="2017-01-01",
                the_type="Default Carbon Intensity"
            )

        provision = ProvisionOfTheAct.objects.create(
            description="Default Carbon Intensity Value",
            display_order="4",
            effective_date="2017-01-01",
            expiration_date=None,
            provision="Section 6 (5) (d) (i)"
        )

        obj = [
            ApprovedFuelProvision(
                fuel=fuel_type,
                provision_act=provision,
                determination_type=default_carbon_intensity
            ) for fuel_type in fuel_types
        ]

        ApprovedFuelProvision.objects.bulk_create(obj)

        # Section 6 (5) (d) (ii) (A)
        gh_genius = \
            CarbonIntensityDeterminationType.objects.create(
                display_order="4",
                effective_date="2017-01-01",
                the_type="GHGenius"
            )

        provision = ProvisionOfTheAct.objects.create(
            description="GHGenius modelled",
            display_order="5",
            effective_date="2017-01-01",
            expiration_date=None,
            provision="Section 6 (5) (d) (ii) (A)"
        )

        obj = [
            ApprovedFuelProvision(
                fuel=fuel_type,
                provision_act=provision,
                determination_type=gh_genius
            ) for fuel_type in fuel_types
        ]

        ApprovedFuelProvision.objects.bulk_create(obj)

        # Section 6 (5) (d) (ii) (B)
        alternative_method = \
            CarbonIntensityDeterminationType.objects.create(
                display_order="5",
                effective_date="2017-01-01",
                the_type="Alternative"
            )

        provision = ProvisionOfTheAct.objects.create(
            description="Alternative Method",
            display_order="6",
            effective_date="2017-01-01",
            expiration_date=None,
            provision="Section 6 (5) (d) (ii) (B)"
        )

        obj = [
            ApprovedFuelProvision(
                fuel=fuel_type,
                provision_act=provision,
                determination_type=alternative_method
            ) for fuel_type in fuel_types
        ]

        ApprovedFuelProvision.objects.bulk_create(obj)

script_class = AddProvisionsOfTheAct
