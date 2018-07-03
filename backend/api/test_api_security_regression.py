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

import json
import logging
import uuid
from collections import defaultdict
from itertools import product

from django.test import TestCase
from django.test import Client

import django

from rest_framework import status

from .models.User import User

from .models.CreditTradeStatus import CreditTradeStatus
from .models.CreditTradeType import CreditTradeType
from .models.Organization import Organization
from .models.CreditTrade import CreditTrade


class TestAPISecurity(TestCase):
    """
    Test Specific Authorization issues discovered in audit
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

        for username in TestAPISecurity.users:
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

    def test_users_get(self):
        """Test that listing users is not a valid action unless you have an admin role"""
        url = "/api/users"

        all_users = self.users

        expected_results = defaultdict(lambda: {'status': status.HTTP_403_FORBIDDEN,
                                                'reason': "Default response should be no access"})

        expected_results[('gov_admin',)] = {'status': status.HTTP_200_OK,
                                            'reason': 'Admin should have search access to users'}

        for user in all_users:
            with self.subTest(user=user,
                              expected_status=expected_results[(user,)]['status'],
                              reason=expected_results[(user,)]['reason']):
                response = self.clients[user].get(url)
                logging.debug(response.content.decode('utf-8'))
                self.assertEqual(response.status_code, expected_results[(user,)]['status'])

    def test_users_by_ud(self):
        """Test that getting another user directly is not a valid action
         unless you have an admin role"""

        url = "/api/users/{0!s}"

        all_users = self.users

        user_id_that_exists = User.objects.get_by_natural_key(['fs_shell']).id

        expected_results = defaultdict(lambda: {'status': status.HTTP_403_FORBIDDEN,
                                                'reason': "Default response should be no access"})

        expected_results[('gov_admin',)] = {'status': status.HTTP_200_OK,
                                            'reason': 'Admin should have read access to users'}

        for user in all_users:
            with self.subTest(user=user,
                              expected_status=expected_results[(user,)]['status'],
                              reason=expected_results[(user,)]['reason']):
                response = self.clients[user].get(url.format(user_id_that_exists))
                logging.debug(response.content.decode('utf-8'))
                self.assertEqual(response.status_code, expected_results[(user,)]['status'])

    def test_users_search(self):
        """Test that searching users is not a valid action unless you have an admin role"""
        url = "/api/users/search"

        all_users = self.users

        expected_results = defaultdict(lambda: {'status': status.HTTP_403_FORBIDDEN,
                                                'reason': "Default response should be no access"})

        expected_results[('gov_admin',)] = {'status': status.HTTP_200_OK,
                                            'reason': 'Admin should have read access to users'}

        for user in all_users:
            with self.subTest(user=user,
                              expected_status=expected_results[(user,)]['status'],
                              reason=expected_results[(user,)]['reason']):
                response = self.clients[user].get(url)
                logging.debug(response.content.decode('utf-8'))
                self.assertEqual(response.status_code, expected_results[(user,)]['status'])

    def test_users_post(self):
        """Test that posting new users is not a valid action unless you have an admin role"""
        url = "/api/users"

        all_users = self.users

        expected_results = defaultdict(lambda: {'status': status.HTTP_403_FORBIDDEN,
                                                'reason': "Default response should be no access"})

        expected_results[('gov_admin',)] = {'status': status.HTTP_201_CREATED,
                                            'reason': 'Admin should have create access for users'}

        for index, user in enumerate(all_users):
            with self.subTest(user=user,
                              expected_status=expected_results[(user,)]['status'],
                              reason=expected_results[(user,)]['reason']):
                payload = {
                    'first_name': 'Test',
                    'last_name': 'Pilot',
                    'email': 'test_pilot_{0!s}@test.com'.format(index),
                    'authorization_id': 'test_pilot_{0!s}'.format(index),
                    'username': 'test_pilot_{0!s}'.format(index),
                    'authorization_guid': str(uuid.uuid4()),
                    'authorization_directory': 'IDIR',
                    'display_name': 'Canary'
                }

                response = self.clients[user].post(url,
                                                   content_type='application/json',
                                                   data=json.dumps(payload))

                logging.debug(response.content.decode('utf-8'))
                self.assertEqual(response.status_code, expected_results[(user,)]['status'])


    @staticmethod
    def create_test_user(username, organization):
        user = User()
        user.username = username
        user.authorization_guid = str(uuid.uuid4())
        user.organization = Organization.objects.get_by_natural_key(organization)
        

        trade.save()
        trade.refresh_from_db()
        logging.debug("created credit trade %s", trade.id)
        created_trades.append({
            'status': ct_status,
            'rescinded': rescinded,
            'id': trade.id
        })


def test_user_delete(self):
        """Test that deleting users is not a semantically valid action"""

        url = "/api/users/{0!s}"

        all_users = self.users

        user_id_that_exists = create_test_user('test_user_delete')

        expected_results = defaultdict(lambda: {'status': status.HTTP_403_FORBIDDEN,
                                                'reason': "Default response should be no access"})

        for user in all_users:
            with self.subTest(user=user,
                              expected_status=expected_results[(user,)]['status'],
                              reason=expected_results[(user,)]['reason']):
                response = self.clients[user].delete(url.format(user_id_that_exists))
                logging.debug(response)
                self.assertEqual(response.status_code, expected_results[(user,)]['status'])

    def test_user_put_or_patch(self):
        """
        Test that put/patch on users is not a semantically valid action
        This will probably change in future versions
        """
        url = "/api/users/{0!s}"

        all_users = self.users

        user_id_that_exists = User.objects.get_by_natural_key(['fs_shell']).id

        expected_results = defaultdict(lambda: {'status': status.HTTP_403_FORBIDDEN,
                                                'reason': "Default response should be no access"})

        for index, user in enumerate(all_users):
            with self.subTest(user=user,
                              expected_status=expected_results[(user,)]['status'],
                              reason=expected_results[(user,)]['reason']):
                payload = {
                    'first_name': 'Test',
                    'last_name': 'Pilot',
                    'email': 'test_pilot_{0!s}@test.com'.format(index),
                    'authorization_id': 'test_pilot_{0!s}'.format(index),
                    'username': 'test_pilot_{0!s}'.format(index),
                    'authorization_guid': str(uuid.uuid4()),
                    'authorization_directory': 'IDIR',
                    'display_name': 'Canary'
                }

                response = self.clients[user].put(
                    url.format(user_id_that_exists),
                    content_type='application/json',
                    data=json.dumps(payload)

                )
                logging.debug(response)

                self.assertEqual(response.status_code, expected_results[(user,)]['status'], "PUT")

                payload = {
                    'first_name': 'Defaced'
                }

                response = self.clients[user].patch(
                    url.format(user_id_that_exists),
                    content_type='application/json',
                    data=json.dumps(payload)

                )
                logging.debug(response)

                self.assertEqual(response.status_code, expected_results[(user,)]['status'], "PATCH")
