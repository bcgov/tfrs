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

        CompliancePeriod(description='2018', display_order=2,
                         effective_date=datetime.today().strftime('%Y-%m-%d')).save()

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
        UserRole(user=User.objects.get(username='fs1'), role=Role.objects.get_by_natural_key('FSDoc')).save()
        UserRole(user=User.objects.get(username='fs2'), role=Role.objects.get_by_natural_key('FSManager')).save()
        UserRole(user=User.objects.get(username='fs2'), role=Role.objects.get_by_natural_key('FSDoc')).save()
        UserRole(user=User.objects.get(username='fs3'), role=Role.objects.get_by_natural_key('FSManager')).save()
        UserRole(user=User.objects.get(username='fs3'), role=Role.objects.get_by_natural_key('FSDoc')).save()
        UserRole(user=User.objects.get(username='fs3'), role=Role.objects.get_by_natural_key('FSAdmin')).save()
        UserRole(user=User.objects.get(username='analyst'), role=Role.objects.get_by_natural_key('GovUser')).save()
        UserRole(user=User.objects.get(username='director'), role=Role.objects.get_by_natural_key('GovDirector')).save()
        UserRole(user=User.objects.get(username='tfrsadmin'), role=Role.objects.get_by_natural_key('Admin')).save()


script_class = DockerEnvironment
