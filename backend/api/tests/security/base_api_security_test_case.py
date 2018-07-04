# -*- coding: utf-8 -*-
"""
    REST API Documentation for the NRS TFRS Credit Trading Application

    The Transportation Fuels Reporting System is being designed to streamline compliance reporting
    for transportation fuel suppliers in accordance with the Renewable & Low Carbon Fuel
    Requirements Regulation.

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
from django.test import Client

import django

from api.models.User import User


class BaseAPISecurityTestCase(TestCase):
    """
    Common functionality for testing API security
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
        'test_organization_fuel_suppliers.json',
        'test_organization_balances.json',
        'roles.json',
        'permissions.json',
        'roles_permissions.json',
        'roles_permissions_v0.3.0.json',
        'roles_permissions_v0.3.1.json',
        'test_prodlike_government_users_and_roles.json',
        'test_credit_trade_comments.json'
    ]

    users = ['fs_husky', 'gov_director', 'gov_analyst', 'gov_admin']

    def setUp(self):
        """Configure test clients"""
        self.clients = dict()

        for username in BaseAPISecurityTestCase.users:
            user = User.objects.get_by_natural_key(username)
            self.clients[username] = Client(
                HTTP_SMGOV_USERGUID=str(user.authorization_guid),
                HTTP_SMAUTH_USERDISPLAYNAME=str(user.display_name),
                HTTP_SMGOV_USEREMAIL=str(user.authorization_email),
                HTTP_SM_UNIVERSALID=str(user.authorization_id),
                HTTP_SM_AUTHDIRNAME=('IDIR' if user.organization.id == 1 else 'BCeID'),
                HTTP_SMGOV_USERTYPE=('Internal' if user.organization.id == 1 else '')
            )

        django.setup()
