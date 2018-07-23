# -*- coding: utf-8 -*-
# pylint: disable=no-member,invalid-name,duplicate-code
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

from django.test import TestCase

from api.models.CreditTradeStatus import CreditTradeStatus
from api.models.CreditTradeType import CreditTradeType
from api.models.CreditTradeZeroReason import CreditTradeZeroReason
from api.models.Organization import Organization
from api.models.User import User
from api.tests.logging_client import LoggingClient


class BaseTestCase(TestCase):
    """
    Base Test class that we can use to setup the initial data
    """

    fixtures = [
        'organization_types.json',
        'organization_government.json',
        'organization_balance_gov.json',
        'credit_trade_statuses.json',
        'credit_trade_statuses_refused.json',
        'organization_actions_types.json',
        'organization_statuses.json',
        'credit_trade_types.json',
        'credit_trade_zero_reason.json',
        'test_organization_fuel_suppliers.json',
        'test_organization_balances.json',
        'roles.json',
        'permissions.json',
        'roles_permissions.json',
        'roles_permissions_v0.3.0.json',
        'roles_permissions_v0.3.1.json',
        'signing_authority_assertions.json',
        'test_prodlike_government_users_and_roles.json',
        'test_prodlike_government_users_and_roles_v0.3.1.json',
        'test_users_and_organizations_v0.3.1.json',
        'test_users_multiple_roles.json'
    ]

    usernames = [
        'fs_user_1',
        'fs_user_2',
        'fs_user_3',
        'gov_director',
        'gov_analyst',
        'gov_admin',
        'gov_multi_role'
    ]

    # For use in child classes
    extra_fixtures = None
    extra_usernames = None

    @classmethod
    def setUpClass(cls):
        """Load any extra fixtures that child classes have declared"""
        if cls.extra_fixtures is not None:
            cls.fixtures = cls.fixtures + cls.extra_fixtures
        super().setUpClass()

    def __init__(self, *args, **kwargs):
        """
        Add any extra usernames that child classes have declared to our
        list of clients
        """

        if self.extra_usernames is not None:
            self.usernames = self.usernames + self.extra_usernames

        super().__init__(*args, **kwargs)

    def setUp(self):
        """Configure test clients"""
        super().setUp()

        self.users = dict(map(
            lambda u: (u, User.objects.get_by_natural_key(u)),
            self.usernames
        ))

        self.clients = dict(
            map(lambda user: (
                user.username,
                LoggingClient(
                    HTTP_SMGOV_USERGUID=str(user.authorization_guid),
                    HTTP_SMGOV_USERDISPLAYNAME=str(user.display_name),
                    HTTP_SMGOV_USEREMAIL=str(user.authorization_email),
                    HTTP_SM_UNIVERSALID=str(user.authorization_id),
                    HTTP_SM_AUTHDIRNAME='IDIR' if user.organization.id == 1
                    else 'BCeID',
                    HTTP_SMGOV_USERTYPE='Internal' if user.organization.id == 1
                    else 'Business'
                )), self.users.values()))

        from_organization = Organization.objects.get_by_natural_key(
            "Test Org 1")
        to_organization = Organization.objects.get_by_natural_key(
            "Test Org 2")

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

        self.zero_reason = {
            'other': CreditTradeZeroReason.objects.get(reason='Other')
        }
