import uuid
import os

from datetime import datetime

from django.db import transaction

from api.management.data_script import OperationalDataScript
from api.models.CompliancePeriod import CompliancePeriod
from api.models.Organization import Organization
from api.models.OrganizationActionsType import OrganizationActionsType
from api.models.OrganizationBalance import OrganizationBalance
from api.models.OrganizationStatus import OrganizationStatus
from api.models.OrganizationType import OrganizationType
from api.models.Role import Role
from api.models.User import User
from api.models.UserRole import UserRole


class LoadFTData(OperationalDataScript):
    comment = 'Load BDD functional test users'

    is_revertable = False

    _usernames = ['bdd-fuelsupplier1',
                  'bdd-fuelsupplier2',
                  'bdd-analyst',
                  'bdd-director',
                  'bdd-fuelsupplier1admin',
                  'bdd-admin']

    _orgs = ['TFRS Fantastic Fuels', 'TFRS IMBeing Green']

    def check_run_preconditions(self):
        for username in self._usernames:
            if User.objects.filter(username=username).exists():
                print('Found an existing user {}'.format(username))
                return False

        for org in self._orgs:
            if Organization.objects.filter(name=org).exists():
                print('Found an existing organization {}'.format(org))
                return False

        return True

    @transaction.atomic
    def run(self):

        Organization(name=self._orgs[0],
                     actions_type=OrganizationActionsType.objects.get_by_natural_key("Buy And Sell"),
                     type=OrganizationType.objects.get_by_natural_key("Part3FuelSupplier"),
                     status=OrganizationStatus.objects.get_by_natural_key('Active'), id=2).save()
        Organization(name=self._orgs[1],
                     actions_type=OrganizationActionsType.objects.get_by_natural_key("Buy And Sell"),
                     type=OrganizationType.objects.get_by_natural_key("Part3FuelSupplier"),
                     status=OrganizationStatus.objects.get_by_natural_key('Active'), id=3).save()

        OrganizationBalance(organization=Organization.objects.get_by_natural_key(self._orgs[0]), credit_trade=None,
                            validated_credits=1000, effective_date=datetime.today().strftime('%Y-%m-%d')).save()
        OrganizationBalance(organization=Organization.objects.get_by_natural_key(self._orgs[1]), credit_trade=None,
                            validated_credits=1000, effective_date=datetime.today().strftime('%Y-%m-%d')).save()

        User( is_superuser='f', username='bdd-fuelsupplier1', 
            email='bdd-fuelsupplier1@test.com', first_name='fuelsupplier1', last_name='bdd',
            is_staff='f', is_active='t', display_name='bdd-fuelsupplier1', 
            organization=Organization.objects.get_by_natural_key(self._orgs[0])).save()

        User( is_superuser='f', username='bdd-fuelsupplier2', 
            email='bdd-fuelsupplier2@test.com', first_name='fuelsupplier2', last_name='bdd',
            is_staff='f', is_active='t', display_name='bdd-fuelsupplier2', 
            organization=Organization.objects.get_by_natural_key(self._orgs[1])).save()

        User( is_superuser='f', username='bdd-analyst', 
            email='bdd-analyst@test.com', first_name='analyst', last_name='bdd',
            is_staff='f', is_active='t', display_name='bdd-analyst', 
            organization=Organization.objects.get_by_natural_key("Government of British Columbia")).save()   

        User( is_superuser='f', username='bdd-director', 
            email='bdd-director@test.com', first_name='director', last_name='bdd',
            is_staff='f', is_active='t', display_name='bdd-director', 
            organization=Organization.objects.get_by_natural_key("Government of British Columbia")).save()  

        User( is_superuser='f', username='bdd-fuelsupplier1admin', 
            email='bdd-fuelsupplier1admin@test.com', first_name='fuelsupplier1admin', last_name='bdd',
            is_staff='f', is_active='t', display_name='bdd-fuelsupplier1admin', 
            organization=Organization.objects.get_by_natural_key(self._orgs[0])).save()  

        User( is_superuser='f', username='bdd-admin', 
            email='bdd-admin@test.com', first_name='admin', last_name='bdd',
            is_staff='f', is_active='t', display_name='bdd-admin', 
            organization=Organization.objects.get_by_natural_key("Government of British Columbia")).save()  

        UserRole(user=User.objects.get(username='bdd-fuelsupplier1'), role=Role.objects.get_by_natural_key('FSManager')).save()
        UserRole(user=User.objects.get(username='bdd-fuelsupplier2'), role=Role.objects.get_by_natural_key('FSManager')).save()
        UserRole(user=User.objects.get(username='bdd-analyst'), role=Role.objects.get_by_natural_key('Admin')).save()
        UserRole(user=User.objects.get(username='bdd-analyst'), role=Role.objects.get_by_natural_key('GovUser')).save()
        UserRole(user=User.objects.get(username='bdd-director'), role=Role.objects.get_by_natural_key('GovDirector')).save()
        UserRole(user=User.objects.get(username='bdd-fuelsupplier1admin'), role=Role.objects.get_by_natural_key('FSUser')).save()
        UserRole(user=User.objects.get(username='bdd-fuelsupplier1admin'), role=Role.objects.get_by_natural_key('FSManager')).save()
        UserRole(user=User.objects.get(username='bdd-fuelsupplier1admin'), role=Role.objects.get_by_natural_key('FSAdmin')).save()
        UserRole(user=User.objects.get(username='bdd-admin'), role=Role.objects.get_by_natural_key('Admin')).save()
        UserRole(user=User.objects.get(username='bdd-admin'), role=Role.objects.get_by_natural_key('GovUser')).save()
        UserRole(user=User.objects.get(username='bdd-admin'), role=Role.objects.get_by_natural_key('GovDirector')).save()

script_class = LoadFTData
