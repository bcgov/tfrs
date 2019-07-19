import uuid
import os

from datetime import datetime

from django.db import transaction

from api.management.data_script import OperationalDataScript
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
from api.models.Organization import Organization
from api.models.OrganizationActionsType import OrganizationActionsType
from api.models.OrganizationBalance import OrganizationBalance
from api.models.OrganizationStatus import OrganizationStatus
from api.models.OrganizationType import OrganizationType
from api.models.PetroleumCarbonIntensity import PetroleumCarbonIntensity
from api.models.PetroleumCarbonIntensityCategory import PetroleumCarbonIntensityCategory
from api.models.Role import Role
from api.models.User import User
from api.models.UserRole import UserRole


class FunctionalTestDataLoad(OperationalDataScript):
    comment = 'Functional Test Data Setup'

    is_revertable = False

    _usernames = ['functest_fs1',
                  'functest_fs2',
                  'functtest_analyst',
                  'functest_director',
                  'functest_tfrsadmin'
                  ]

    _orgs = ['Test Fuel Supplier 1', 'Test Fuel Supplier 2']

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

        Organization(name=self._orgs[0],
                     actions_type=OrganizationActionsType.objects.get_by_natural_key("Buy And Sell"),
                     type=OrganizationType.objects.get_by_natural_key("Part3FuelSupplier"),
                     status=OrganizationStatus.objects.get_by_natural_key('Active')).save()
        Organization(name=self._orgs[1],
                     actions_type=OrganizationActionsType.objects.get_by_natural_key("Buy And Sell"),
                     type=OrganizationType.objects.get_by_natural_key("Part3FuelSupplier"),
                     status=OrganizationStatus.objects.get_by_natural_key('Active')).save()

        OrganizationBalance(organization=Organization.objects.get_by_natural_key(self._orgs[0]), credit_trade=None,
                            validated_credits=1000, effective_date=datetime.today().strftime('%Y-%m-%d')).save()
        OrganizationBalance(organization=Organization.objects.get_by_natural_key(self._orgs[1]), credit_trade=None,
                            validated_credits=1000, effective_date=datetime.today().strftime('%Y-%m-%d')).save()

        User(email='fs1@test', username='functest_fs1',
             first_name='Functest1', last_name='Supplier', display_name='Test 1 Supplier',
             organization=Organization.objects.get_by_natural_key(self._orgs[0])).save()
        User(email='fs2@test', username='functest_fs2',
             first_name='Functest2', last_name='Supplier', display_name='Test 2 Supplier',
             organization=Organization.objects.get_by_natural_key(self._orgs[1])).save()
        User(email='analyst@test', username='functest_analyst',
             first_name='Analyst', last_name='Government', display_name='functest_analyst',
             organization=Organization.objects.get(id=1)).save()
        User(email='director@test', username='functest_director',
             first_name='Director', last_name='Government', display_name='Director',
             organization=Organization.objects.get(id=1)).save()
        User(email='tfrsadmin@test', username='functest_tfrsadmin',
             first_name='TfrsAdmin', last_name='Government', display_name='TfrsAdmin',
             organization=Organization.objects.get(id=1)).save()

        UserRole(user=User.objects.get(username='functest_fs1'), role=Role.objects.get_by_natural_key('FSManager')).save()
        UserRole(user=User.objects.get(username='functest_fs1'), role=Role.objects.get_by_natural_key('ComplianceReporting')).save()
        UserRole(user=User.objects.get(username='functest_fs1'), role=Role.objects.get_by_natural_key('FSDocSubmit')).save()
        UserRole(user=User.objects.get(username='functest_fs2'), role=Role.objects.get_by_natural_key('FSManager')).save()
        UserRole(user=User.objects.get(username='functest_fs2'), role=Role.objects.get_by_natural_key('FSDocSubmit')).save()
        UserRole(user=User.objects.get(username='functest_analyst'), role=Role.objects.get_by_natural_key('GovUser')).save()
        UserRole(user=User.objects.get(username='functest_analyst'), role=Role.objects.get_by_natural_key('GovDoc')).save()
        UserRole(user=User.objects.get(username='functest_director'), role=Role.objects.get_by_natural_key('GovDirector')).save()
        UserRole(user=User.objects.get(username='functest_tfrsadmin'), role=Role.objects.get_by_natural_key('Admin')).save()


script_class = FunctionalTestDataLoad
