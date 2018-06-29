"""
    REST API Documentation for the NRS TFRS Credit Trading Application

    The Transportation Fuels Reporting System is being designed to streamline
    compliance reporting for transportation fuel suppliers in accordance with
    the Renewable & Low Carbon Fuel Requirements Regulation.

    OpenAPI spec version: v1

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
"""

from django.test import TestCase, Client

from api.models.CreditTradeStatus import CreditTradeStatus
from api.models.CreditTradeType import CreditTradeType
from api.models.CreditTradeZeroReason import CreditTradeZeroReason
from api.models.Organization import Organization
from api.models.Role import Role
from api.models.User import User
from api.models.UserRole import UserRole


class BaseTestCase(TestCase):
    """
    Base Test class that we can use to setup the initial data
    """
    fixtures = ['organization_types.json',
                'organization_government.json',
                'organization_balance_gov.json',
                'credit_trade_statuses.json',
                'credit_trade_statuses_refused.json',
                'credit_trade_zero_reason.json',
                'organization_actions_types.json',
                'organization_statuses.json',
                'test_users.json',
                'credit_trade_types.json',
                'test_credit_trades.json',
                'test_organization_fuel_suppliers.json',
                'test_organization_balances.json',
                'roles.json',
                'permissions.json',
                'roles_permissions.json',
                'signing_authority_assertions.json']

    def setUp(self):
        """
        This should get called as the test runs
        """
        super().setUp()

        # Initialize Foreign keys
        gov_user = User.objects.filter(organization__id=1).first()
        gov_client = Client(
            HTTP_SMGOV_USERGUID=str(gov_user.authorization_guid),
            HTTP_SMGOV_USERDISPLAYNAME=gov_user.display_name,
            HTTP_SMGOV_USEREMAIL=gov_user.email,
            HTTP_SM_UNIVERSALID=gov_user.authorization_id,
            HTTP_SMGOV_USERTYPE='Internal',
            HTTP_SM_AUTHDIRNAME='IDIR')

        # Apply a government role to Teperson
        gov_role = Role.objects.get(name='GovDirector')
        UserRole.objects.create(user_id=gov_user.id, role_id=gov_role.id)

        fs_user_1 = User.objects.filter(organization__id=2).first()
        fs_client_1 = Client(
            HTTP_SMGOV_USERGUID=str(fs_user_1.authorization_guid),
            HTTP_SMGOV_USERDISPLAYNAME=fs_user_1.display_name,
            HTTP_SMGOV_USEREMAIL=fs_user_1.email,
            HTTP_SM_UNIVERSALID=fs_user_1.authorization_id)

        fs_user_2 = User.objects.filter(organization__id=3).first()
        fs_client_2 = Client(
            HTTP_SMGOV_USERGUID=str(fs_user_2.authorization_guid),
            HTTP_SMGOV_USERDISPLAYNAME=fs_user_2.display_name,
            HTTP_SMGOV_USEREMAIL=fs_user_2.email,
            HTTP_SM_UNIVERSALID=fs_user_2.authorization_id)

        fs_user_3 = User.objects.filter(organization__id=4).first()
        fs_client_3 = Client(
            HTTP_SMGOV_USERGUID=str(fs_user_3.authorization_guid),
            HTTP_SMGOV_USERDISPLAYNAME=fs_user_3.display_name,
            HTTP_SMGOV_USEREMAIL=fs_user_3.email,
            HTTP_SM_UNIVERSALID=fs_user_3.authorization_id)

        # Attach signing authority roles to User 1 and User 2
        manager_role = Role.objects.get(name='FSManager')
        UserRole.objects.create(user_id=fs_user_1.id,
                                role_id=manager_role.id)

        UserRole.objects.create(user_id=fs_user_2.id,
                                role_id=manager_role.id)

        from_organization = Organization.objects.create(
            name="Test 1",
            actions_type_id=1,
            status_id=1)

        to_organization = Organization.objects.create(
            name="Test 2",
            actions_type_id=1,
            status_id=1)

        self.clients = {
            'gov': gov_client,
            'fuel_supplier_1': fs_client_1,
            'fuel_supplier_2': fs_client_2,
            'fuel_supplier_3': fs_client_3,
        }

        self.credit_trade_types = {
            'buy': CreditTradeType.objects.get(the_type='Buy'),
            'sell': CreditTradeType.objects.get(the_type='Sell')
        }

        self.organizations = {
            'from': from_organization,
            'to': to_organization
        }

        self.statuses = {
            'accepted': CreditTradeStatus.objects.get(status='Accepted'),
            'approved': CreditTradeStatus.objects.get(status='Approved'),
            'cancelled': CreditTradeStatus.objects.get(status='Cancelled'),
            'completed': CreditTradeStatus.objects.get(status='Completed'),
            'draft': CreditTradeStatus.objects.get(status='Draft'),
            'not_recommended':
            CreditTradeStatus.objects.get(status='Not Recommended'),
            'recommended': CreditTradeStatus.objects.get(status='Recommended'),
            'refused': CreditTradeStatus.objects.get(status='Refused'),
            'submitted': CreditTradeStatus.objects.get(status='Submitted')
        }

        self.users = {
            'gov': gov_user,
            'fuel_supplier_1': fs_user_1,
            'fuel_supplier_2': fs_user_2,
            'fuel_supplier_3': fs_user_3
        }

        self.zero_reason = {
            'other': CreditTradeZeroReason.objects.get(reason='Other')
        }
