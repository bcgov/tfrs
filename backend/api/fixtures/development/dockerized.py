import uuid
import os

from datetime import datetime

from django.db import transaction

from api.management.data_script import OperationalDataScript
from api.models.ApprovedFuel import ApprovedFuel
from api.models.ApprovedFuelProvision import ApprovedFuelProvision
from api.models.CarbonIntensityDeterminationType import CarbonIntensityDeterminationType
from api.models.CarbonIntensityLimit import CarbonIntensityLimit
from api.models.CompliancePeriod import CompliancePeriod
from api.models.DefaultCarbonIntensity import DefaultCarbonIntensity
from api.models.DefaultCarbonIntensityCategory import DefaultCarbonIntensityCategory
from api.models.EnergyDensity import EnergyDensity
from api.models.EnergyDensityCategory import EnergyDensityCategory
from api.models.EnergyEffectivenessRatio import EnergyEffectivenessRatio
from api.models.EnergyEffectivenessRatioCategory import EnergyEffectivenessRatioCategory
from api.models.ExpectedUse import ExpectedUse
from api.models.FuelClass import FuelClass
from api.models.NotionalTransferType import NotionalTransferType
from api.models.Organization import Organization
from api.models.OrganizationActionsType import OrganizationActionsType
from api.models.OrganizationBalance import OrganizationBalance
from api.models.OrganizationStatus import OrganizationStatus
from api.models.OrganizationType import OrganizationType
from api.models.PetroleumCarbonIntensity import PetroleumCarbonIntensity
from api.models.PetroleumCarbonIntensityCategory import PetroleumCarbonIntensityCategory
from api.models.ProvisionOfTheAct import ProvisionOfTheAct
from api.models.Role import Role
from api.models.SigningAuthorityAssertion import SigningAuthorityAssertion
from api.models.TransactionType import TransactionType
from api.models.User import User
from api.models.UserRole import UserRole


class DockerEnvironment(OperationalDataScript):
    comment = 'Build development environment for docker compose'

    is_revertable = False

    _usernames = ['fs1',
                  'fs2',
                  'fs3',
                  'analyst',
                  'director',
                  'tfrsadmin',
                  'admin']

    _orgs = ['Fuel Supplier 1', 'Fuel Supplier 2', 'Fuel Supplier 3']

    def check_run_preconditions(self):
        for username in self._usernames:
            if User.objects.filter(username=username).exists():
                print('Found an existing user {}'.format(username))
                return False

        for org in self._orgs:
            if Organization.objects.filter(name=org).exists():
                print('Found an existing organization {}'.format(username))
                return False

        return True

    @transaction.atomic
    def run(self):

        CompliancePeriod.objects.get(description='Auto-generated initial compliance period').delete()

        display_order = 10
        compliance_periods = []

        for period in range(2013, 2031):
            display_order += 1

            compliance_periods.append(
                CompliancePeriod(
                    description=period,
                    display_order=display_order,
                    effective_date="{}-01-01".format(period),
                    expiration_date="{}-12-31".format(period)
                )
            )

        CompliancePeriod.objects.bulk_create(compliance_periods)

        Organization(name=self._orgs[0],
                     actions_type=OrganizationActionsType.objects.get_by_natural_key("Buy And Sell"),
                     type=OrganizationType.objects.get_by_natural_key("Part3FuelSupplier"),
                     status=OrganizationStatus.objects.get_by_natural_key('Active'), id=2).save()
        Organization(name=self._orgs[1],
                     actions_type=OrganizationActionsType.objects.get_by_natural_key("Buy And Sell"),
                     type=OrganizationType.objects.get_by_natural_key("Part3FuelSupplier"),
                     status=OrganizationStatus.objects.get_by_natural_key('Active'), id=3).save()
        Organization(name=self._orgs[2],
                     actions_type=OrganizationActionsType.objects.get_by_natural_key("Buy And Sell"),
                     type=OrganizationType.objects.get_by_natural_key("Part3FuelSupplier"),
                     status=OrganizationStatus.objects.get_by_natural_key('Active'), id=4).save()

        OrganizationBalance(organization=Organization.objects.get_by_natural_key(self._orgs[0]), credit_trade=None,
                            validated_credits=1000, effective_date=datetime.today().strftime('%Y-%m-%d')).save()
        OrganizationBalance(organization=Organization.objects.get_by_natural_key(self._orgs[1]), credit_trade=None,
                            validated_credits=1000, effective_date=datetime.today().strftime('%Y-%m-%d')).save()
        OrganizationBalance(organization=Organization.objects.get_by_natural_key(self._orgs[2]), credit_trade=None,
                            validated_credits=1000, effective_date=datetime.today().strftime('%Y-%m-%d')).save()

        User(email='fs1@email.com', username='fs1',
             first_name='FS1', last_name='Supplier', display_name='Fuel Supplier',
             organization=Organization.objects.get_by_natural_key(self._orgs[0])).save()
        User(email='fs2@email.com', username='fs2',
             first_name='FS2', last_name='Supplier', display_name='Another Fuel Supplier',
             organization=Organization.objects.get_by_natural_key(self._orgs[1])).save()
        User(email='fs3@email.com', username='fs3',
             first_name='FS3', last_name='Supplier', display_name='Third Fuel Supplier',
             organization=Organization.objects.get_by_natural_key(self._orgs[2])).save()
        User(email='analyst@email.com', username='analyst',
             first_name='Analyst', last_name='Government', display_name='Analyst',
             organization=Organization.objects.get(id=1)).save()
        User(email='director@email.com', username='director',
             first_name='Director', last_name='Government', display_name='(Director)',
             organization=Organization.objects.get(id=1)).save()
        User(email='tfrsadmin@email.com', username='tfrsadmin',
             first_name='TfrsAdmin', last_name='Government', display_name='(TfrsAdmin)',
             organization=Organization.objects.get(id=1)).save()

        UserRole(user=User.objects.get(username='fs1'), role=Role.objects.get_by_natural_key('FSManager')).save()
        UserRole(user=User.objects.get(username='fs1'), role=Role.objects.get_by_natural_key('ComplianceReporting')).save()
        UserRole(user=User.objects.get(username='fs1'), role=Role.objects.get_by_natural_key('FSDocSubmit')).save()
        UserRole(user=User.objects.get(username='fs2'), role=Role.objects.get_by_natural_key('FSManager')).save()
        UserRole(user=User.objects.get(username='fs2'), role=Role.objects.get_by_natural_key('FSDocSubmit')).save()
        UserRole(user=User.objects.get(username='fs3'), role=Role.objects.get_by_natural_key('FSManager')).save()
        UserRole(user=User.objects.get(username='fs3'), role=Role.objects.get_by_natural_key('FSDocSubmit')).save()
        UserRole(user=User.objects.get(username='fs3'), role=Role.objects.get_by_natural_key('FSAdmin')).save()
        UserRole(user=User.objects.get(username='analyst'), role=Role.objects.get_by_natural_key('GovUser')).save()
        UserRole(user=User.objects.get(username='analyst'), role=Role.objects.get_by_natural_key('GovDoc')).save()
        UserRole(user=User.objects.get(username='director'), role=Role.objects.get_by_natural_key('GovDirector')).save()
        UserRole(user=User.objects.get(username='tfrsadmin'), role=Role.objects.get_by_natural_key('Admin')).save()

        # These are copied verbatim from operational scripts 0006 through 0012.
        # They must be copied instead of run on startup since their precondition checks don't do anything

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

        EnergyEffectivenessRatio.objects.create(
            category=EnergyEffectivenessRatioCategory.objects.get(
                name="Petroleum-based diesel fuel or renewable fuel in "
                     "relation to diesel class fuel"
            ),
            effective_date="2017-01-01",
            ratio="1.0",
            fuel_class=FuelClass.objects.get(fuel_class="Diesel")
        )
        EnergyEffectivenessRatio.objects.create(
            category=EnergyEffectivenessRatioCategory.objects.get(
                name="Petroleum-based gasoline, natural gas-based gasoline or "
                     "renewable fuel in relation to gasoline class fuel"
            ),
            effective_date="2017-01-01",
            ratio="1.0",
            fuel_class=FuelClass.objects.get(fuel_class="Gasoline")
        )
        EnergyEffectivenessRatio.objects.create(
            category=EnergyEffectivenessRatioCategory.objects.get(
                name="Hydrogen"
            ),
            effective_date="2017-01-01",
            ratio="1.9",
            fuel_class=FuelClass.objects.get(fuel_class="Diesel")
        )
        EnergyEffectivenessRatio.objects.create(
            category=EnergyEffectivenessRatioCategory.objects.get(
                name="Hydrogen"
            ),
            effective_date="2017-01-01",
            ratio="2.5",
            fuel_class=FuelClass.objects.get(fuel_class="Gasoline")
        )
        EnergyEffectivenessRatio.objects.create(
            category=EnergyEffectivenessRatioCategory.objects.get(
                name="LNG"
            ),
            effective_date="2017-01-01",
            ratio="1.0",
            fuel_class=FuelClass.objects.get(fuel_class="Diesel")
        )
        EnergyEffectivenessRatio.objects.create(
            category=EnergyEffectivenessRatioCategory.objects.get(
                name="CNG"
            ),
            effective_date="2017-01-01",
            ratio="0.9",
            fuel_class=FuelClass.objects.get(fuel_class="Diesel")
        )
        EnergyEffectivenessRatio.objects.create(
            category=EnergyEffectivenessRatioCategory.objects.get(
                name="CNG"
            ),
            effective_date="2017-01-01",
            ratio="1.0",
            fuel_class=FuelClass.objects.get(fuel_class="Gasoline")
        )
        EnergyEffectivenessRatio.objects.create(
            category=EnergyEffectivenessRatioCategory.objects.get(
                name="Propane"
            ),
            effective_date="2017-01-01",
            ratio="1.0",
            fuel_class=FuelClass.objects.get(fuel_class="Diesel")
        )
        EnergyEffectivenessRatio.objects.create(
            category=EnergyEffectivenessRatioCategory.objects.get(
                name="Propane"
            ),
            effective_date="2017-01-01",
            ratio="1.0",
            fuel_class=FuelClass.objects.get(fuel_class="Gasoline")
        )
        EnergyEffectivenessRatio.objects.create(
            category=EnergyEffectivenessRatioCategory.objects.get(
                name="Electricity"
            ),
            effective_date="2017-01-01",
            ratio="2.7",
            fuel_class=FuelClass.objects.get(fuel_class="Diesel")
        )
        EnergyEffectivenessRatio.objects.create(
            category=EnergyEffectivenessRatioCategory.objects.get(
                name="Electricity"
            ),
            effective_date="2017-01-01",
            ratio="3.4",
            fuel_class=FuelClass.objects.get(fuel_class="Gasoline")
        )

        DefaultCarbonIntensity.objects.create(
            category=DefaultCarbonIntensityCategory.objects.get(
                name__iexact="Renewable Fuel in relation to diesel class fuel"
            ),
            effective_date="2017-01-01",
            density="98.96"
        )
        DefaultCarbonIntensity.objects.create(
            category=DefaultCarbonIntensityCategory.objects.get(
                name__iexact="Propane"
            ),
            effective_date="2017-01-01",
            density="75.35"
        )
        DefaultCarbonIntensity.objects.create(
            category=DefaultCarbonIntensityCategory.objects.get(
                name__iexact="Renewable Fuel in relation to gasoline class fuel"
            ),
            effective_date="2017-01-01",
            density="88.14"
        )
        DefaultCarbonIntensity.objects.create(
            category=DefaultCarbonIntensityCategory.objects.get(
                name__iexact="Natural gas-based gasoline"
            ),
            effective_date="2017-01-01",
            density="90.07"
        )
        DefaultCarbonIntensity.objects.create(
            category=DefaultCarbonIntensityCategory.objects.get(
                name__iexact="LNG"
            ),
            effective_date="2017-01-01",
            density="112.65"
        )
        DefaultCarbonIntensity.objects.create(
            category=DefaultCarbonIntensityCategory.objects.get(
                name__iexact="CNG"
            ),
            effective_date="2017-01-01",
            density="63.64"
        )
        DefaultCarbonIntensity.objects.create(
            category=DefaultCarbonIntensityCategory.objects.get(
                name__iexact="Electricity"
            ),
            effective_date="2017-01-01",
            density="19.73"
        )
        DefaultCarbonIntensity.objects.create(
            category=DefaultCarbonIntensityCategory.objects.get(
                name__iexact="Hydrogen"
            ),
            effective_date="2017-01-01",
            density="96.82"
        )

        EnergyDensity.objects.create(
            category=EnergyDensityCategory.objects.get(
                name="Petroleum-based diesel fuel or diesel fuel produced "
                     "from biomass"
            ),
            effective_date="2017-01-01",
            density="38.65"
        )
        EnergyDensity.objects.create(
            category=EnergyDensityCategory.objects.get(
                name="Hydrogenation-derived renewable diesel fuel"
            ),
            effective_date="2017-01-01",
            density="36.51"
        )
        EnergyDensity.objects.create(
            category=EnergyDensityCategory.objects.get(
                name="Biodiesel"
            ),
            effective_date="2017-01-01",
            density="35.40"
        )
        EnergyDensity.objects.create(
            category=EnergyDensityCategory.objects.get(
                name="Petroleum-based gasoline, natural gas-based "
                     "gasoline or gasoline produced from biomass"
            ),
            effective_date="2017-01-01",
            density="34.69"
        )
        EnergyDensity.objects.create(
            category=EnergyDensityCategory.objects.get(
                name="Ethanol"
            ),
            effective_date="2017-01-01",
            density="23.58"
        )
        EnergyDensity.objects.create(
            category=EnergyDensityCategory.objects.get(
                name="Hydrogen"
            ),
            effective_date="2017-01-01",
            density="141.24"
        )
        EnergyDensity.objects.create(
            category=EnergyDensityCategory.objects.get(
                name="LNG"
            ),
            effective_date="2017-01-01",
            density="52.46"
        )
        EnergyDensity.objects.create(
            category=EnergyDensityCategory.objects.get(
                name="CNG"
            ),
            effective_date="2017-01-01",
            density="37.85"
        )
        EnergyDensity.objects.create(
            category=EnergyDensityCategory.objects.get(
                name="Propane"
            ),
            effective_date="2017-01-01",
            density="25.47"
        )
        EnergyDensity.objects.create(
            category=EnergyDensityCategory.objects.get(
                name="Electricity"
            ),
            effective_date="2017-01-01",
            density="3.60"
        )

        CarbonIntensityLimit.objects.update(
            effective_date="2017-01-01",
            expiration_date=None
        )

        PetroleumCarbonIntensity.objects.create(
            category=PetroleumCarbonIntensityCategory.objects.get(
                name="Petroleum-based diesel"
            ),
            effective_date="2017-01-01",
            density="94.76"
        )
        PetroleumCarbonIntensity.objects.create(
            category=PetroleumCarbonIntensityCategory.objects.get(
                name="Petroleum-based gasoline"
            ),
            effective_date="2017-01-01",
            density="88.14"
        )

        ExpectedUse.objects.create(
            description="Other",
            display_order="99",
            effective_date="2017-01-01"
        )
        ExpectedUse.objects.create(
            description="Heating Oil",
            display_order="1",
            effective_date="2017-01-01"
        )
        ExpectedUse.objects.create(
            description="Department of National Defence (Canada)",
            display_order="2",
            effective_date="2017-01-01"
        )
        ExpectedUse.objects.create(
            description="Aviation",
            display_order="3",
            effective_date="2017-01-01"
        )

        NotionalTransferType.objects.create(
            the_type="Received",
            display_order="1",
            effective_date="2017-01-01"
        )
        NotionalTransferType.objects.create(
            the_type="Transferred",
            display_order="2",
            effective_date="2017-01-01"
        )

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

        TransactionType.objects.create(
            the_type="Purchased",
            display_order="1",
            effective_date="2017-01-01"
        )
        TransactionType.objects.create(
            the_type="Sold",
            display_order="2",
            effective_date="2017-01-01"
        )
        SigningAuthorityAssertion.objects.create(
            description="I expect, on reasonable grounds, that any fuels "
                        "reported in Schedule C were used for a purpose other "
                        "than transport in accordance with section 6 (3) of "
                        "the *Greenhouse Gas Reduction (Renewable and Low "
                        "Carbon Fuel Requirements) Act*.",
            display_order="1",
            effective_date="2018-01-01",
            module="compliance_report"
        )
        SigningAuthorityAssertion.objects.create(
            description="I certify that records evidencing each matter "
                        "reported under sections 9 and 11.08 of the Renewable "
                        "and Low Carbon Fuel Requirements Regulation are "
                        "available on request.",
            display_order="2",
            effective_date="2018-01-01",
            module="compliance_report"
        )
        SigningAuthorityAssertion.objects.create(
            description="I certify that I am an officer or employee of the "
                        "fuel supplier, and that records evidencing my "
                        "authority to submit this report are available on "
                        "request.",
            display_order="3",
            effective_date="2018-01-01",
            module="compliance_report"
        )
        SigningAuthorityAssertion.objects.create(
            description="I certify that the information in this report is "
                        "true and complete to the best of my knowledge and I "
                        "understand that I may be required to provide to the "
                        "Director records evidencing the truth of that "
                        "information.",
            display_order="4",
            effective_date="2018-01-01",
            module="compliance_report"
        )
        SigningAuthorityAssertion.objects.create(
            description="I certify that records evidencing each matter "
                        "reported under section 11.032 (4) (b) or (c) of the "
                        "Renewable and Low Carbon Fuel Requirements "
                        "Regulation are available on request.",
            display_order="1",
            effective_date="2018-01-01",
            module="exclusion_report"
        )
        SigningAuthorityAssertion.objects.create(
            description="I certify that records evidencing my authority to "
                        "submit this report are available on request.",
            display_order="2",
            effective_date="2018-01-01",
            module="exclusion_report"
        )
        SigningAuthorityAssertion.objects.create(
            description="I certify that the information in this report is "
                        "true and complete to the best of my knowledge and I "
                        "understand that I may be required to provide to the "
                        "Director records evidencing the truth of that "
                        "information.",
            display_order="3",
            effective_date="2018-01-01",
            module="exclusion_report"
        )

script_class = DockerEnvironment
