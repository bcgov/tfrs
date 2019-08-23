# -*- coding: utf-8 -*-
# pylint: disable=no-member,invalid-name
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

import json
import logging

from collections import defaultdict

from rest_framework import status

from api.models.User import User
from api.tests.data_creation_utilities import DataCreationUtilities

from .base_api_security_test_case import BaseAPISecurityTestCase


class TestUsersAPI(BaseAPISecurityTestCase):
    """
    Test Specific Authorization issues related to users API discovered in audit
    """

    def test_get_list(self):
        """Test that getting users list is not a valid action unless you have
        an admin role"""

        url = "/api/users"

        all_users = self.users
        expected_results = defaultdict(lambda: {
            'status': status.HTTP_403_FORBIDDEN,
            'reason': "Default response should be no access"})

        expected_results[(
            'gov_admin',
        )] = {'status': status.HTTP_200_OK,
              'reason': 'Admin should have read access to users'}

        for user in all_users:
            with self.subTest(
                    user=user,
                    expected_status=expected_results[(user,)]['status'],
                    reason=expected_results[(user,)]['reason']):
                response = self.clients[user].get(url)
                response_data = response.content.decode('utf-8')
                logging.debug(response_data)

                self.assertEqual(
                    response.status_code, expected_results[(user,)]['status'])

                # quick checks for fields which have been blacklisted
                self.assertNotIn(response_data, 'organizationBalance')

    def test_get_by_id(self):
        """Test that getting another user directly is not a valid action
         unless you have a government role"""

        url = "/api/users/{0!s}"

        all_users = self.users

        user_that_exists = DataCreationUtilities.create_test_user()

        expected_results = defaultdict(lambda: {
            'status': status.HTTP_403_FORBIDDEN,
            'reason': "Default response should be no access"})

        expected_results[('gov_admin',)] = {
            'status': status.HTTP_200_OK,
            'reason': 'Admin should have read access to users'}

        expected_results[('gov_director',)] = {
            'status': status.HTTP_200_OK,
            'reason': 'Director should have read access to users'}

        expected_results[('gov_analyst',)] = {
            'status': status.HTTP_200_OK,
            'reason': 'Analyst should have read access to users'}

        expected_results[('gov_multi_role',)] = {
            'status': status.HTTP_200_OK,
            'reason': 'Multi-role should have read access to users'}

        expected_results[('gov_manager',)] = {
            'status': status.HTTP_200_OK,
            'reason': 'Government Manager should have read access to users'}

        for user in all_users:
            with self.subTest(
                    user=user,
                    expected_status=expected_results[(user,)]['status'],
                    reason=expected_results[(user,)]['reason']):
                response = self.clients[user].get(url.format(
                    user_that_exists['id']))

                logging.debug(response.content.decode('utf-8'))
                self.assertEqual(
                    response.status_code, expected_results[(user,)]['status'])

    def test_get_by_username(self):
        """
        Test that getting another user directly is not a valid action
        unless you have an admin role
        """

        url = "/api/users/by_username?username={0!s}"

        all_users = self.users

        user_that_exists = DataCreationUtilities.create_test_user()

        expected_results = defaultdict(lambda: {
            'status': status.HTTP_403_FORBIDDEN,
            'reason': "Default response should be no access"})

        expected_results[('gov_admin',)] = {
            'status': status.HTTP_200_OK,
            'reason': 'Admin should have read access to users'}

        for user in all_users:
            with self.subTest(
                    user=user,
                    expected_status=expected_results[(user,)]['status'],
                    reason=expected_results[(user,)]['reason']):
                response = self.clients[user].get(url.format(user_that_exists['username']))

                logging.debug(response.content.decode('utf-8'))

                self.assertEqual(
                    response.status_code, expected_results[(user,)]['status'])

    def test_search(self):
        """
        Test that searching users is not a valid action unless you have an
        admin role
        """
        url = "/api/users/search"

        all_users = self.users

        expected_results = defaultdict(lambda: {
            'status': status.HTTP_403_FORBIDDEN,
            'reason': "Default response should be no access"})

        expected_results[('gov_admin',)] = {
            'status': status.HTTP_200_OK,
            'reason': 'Admin should have read access to users'}

        for user in all_users:
            with self.subTest(
                    user=user,
                    expected_status=expected_results[(user,)]['status'],
                    reason=expected_results[(user,)]['reason']):
                response = self.clients[user].get(url)

                logging.debug(response.content.decode('utf-8'))

                self.assertEqual(
                    response.status_code, expected_results[(user,)]['status'])

    def test_post(self):
        """
        Test that posting new users is not a valid action unless you have
        an admin role
        """
        url = "/api/users"

        all_users = self.users

        expected_results = defaultdict(lambda: {
            'status': status.HTTP_403_FORBIDDEN,
            'reason': "Default response should be no access"})

        expected_results[('gov_admin',)] = {
            'status': status.HTTP_201_CREATED,
            'reason': 'Admin should have create access for users'}

        for index, user in enumerate(all_users):
            with self.subTest(
                    user=user,
                    expected_status=expected_results[(user,)]['status'],
                    reason=expected_results[(user,)]['reason']):
                payload = {
                    'email': 'test_pilot_{0!s}@test.com'.format(index),
                    'user': {
                        'first_name': 'Test',
                        'last_name': 'Pilot',
                        'email': 'test_pilot_{0!s}@test.com'.format(index),
                        'username': 'test_pilot_{0!s}'.format(index),
                        'roles': (1, 2),
                        'organization': 1
                    }
                }

                response = self.clients[user].post(
                    url,
                    content_type='application/json',
                    data=json.dumps(payload))

                logging.debug(response.content.decode('utf-8'))
                self.assertEqual(
                    response.status_code, expected_results[(user,)]['status'])

    def test_delete(self):
        """Test that deleting users is not a semantically valid action"""

        url = "/api/users/{0!s}"

        all_users = self.users

        expected_results = defaultdict(lambda: {
            'status': [status.HTTP_405_METHOD_NOT_ALLOWED,
                       status.HTTP_403_FORBIDDEN],
            'reason': "Default response should be no access"})

        for user in all_users:
            with self.subTest(
                    user=user,
                    expected_statuses=expected_results[(user,)]['status'],
                    reason=expected_results[(user,)]['reason']):
                user_that_exists = DataCreationUtilities.create_test_user()
                response = self.clients[user].delete(
                    url.format(user_that_exists['id']))

                logging.debug(response)

                self.assertIn(
                    response.status_code, expected_results[(user,)]['status'])

    def test_put_or_patch_to_other(self):
        """
        Test that put/patch on users is not a semantically valid action
        This will probably change in future versions
        """
        url = "/api/users/{0!s}"

        all_users = self.users

        expected_results = defaultdict(lambda: {
            'status': status.HTTP_403_FORBIDDEN,
            'reason': "Default response should be no access"})

        expected_results[('gov_admin',)] = ({
            'status': status.HTTP_200_OK,
            'reason': "Admin should have write access"})

        for index, user in enumerate(all_users):
            with self.subTest(
                    user=user,
                    expected_status=expected_results[(user,)]['status'],
                    reason=expected_results[(user,)]['reason']):
                user_that_exists = DataCreationUtilities.create_test_user()

                payload = {
                    'first_name': 'Test',
                    'last_name': 'Pilot',
                    'email': 'test_pilot_{0!s}@test.com'.format(index),
                    'phone': '5558675309',
                    'username': 'test_pilot_{0!s}'.format(index),
                    'display_name': 'Canary',
                    'roles': (5, 6),
                    'is_active': True
                }

                response = self.clients[user].put(
                    url.format(user_that_exists['id']),
                    content_type='application/json',
                    data=json.dumps(payload)
                )

                logging.debug(response)

                self.assertEqual(
                    response.status_code,
                    expected_results[(user,)]['status'], "PUT")

                payload = {
                    'first_name': 'Defaced'
                }

                response = self.clients[user].patch(
                    url.format(user_that_exists['id']),
                    content_type='application/json',
                    data=json.dumps(payload)

                )
                logging.debug(response)

                self.assertEqual(
                    response.status_code,
                    expected_results[(user,)]['status'], "PATCH")

    def test_put_or_patch_on_self(self):
        """
        Test that put/patch on self is a semantically valid action
        """
        url = "/api/users/{0!s}"

        all_users = self.users

        expected_results = defaultdict(lambda: {
            'status': status.HTTP_200_OK,
            'reason': "Updating self is accepted (for certain fields)"})

        # TODO check certain fields one at a time for read-only /
        # read-write access

        for index, user in enumerate(all_users):
            with self.subTest(
                    user=user,
                    expected_status=expected_results[(user,)]['status'],
                    reason=expected_results[(user,)]['reason']):
                self_id = User.objects.get_by_natural_key(user).id

                payload = {
                    'first_name': 'Test',
                    'last_name': 'Pilot',
                    'email': 'test_pilot_{0!s}@test.com'.format(index),
                    'username': user,
                    'phone': '5558675309',
                    'display_name': 'Canary',
                    'roles': (1, 2),
                    'is_active': True
                }

                response = self.clients[user].put(
                    url.format(self_id),
                    content_type='application/json',
                    data=json.dumps(payload)

                )
                logging.debug(response)

                self.assertEqual(
                    response.status_code,
                    expected_results[(user,)]['status'], "PUT")

                payload = {
                    'first_name': 'Defaced'
                }

                response = self.clients[user].patch(
                    url.format(self_id),
                    content_type='application/json',
                    data=json.dumps(payload)

                )
                logging.debug(response)

                self.assertEqual(
                    response.status_code,
                    expected_results[(user,)]['status'], "PATCH")
