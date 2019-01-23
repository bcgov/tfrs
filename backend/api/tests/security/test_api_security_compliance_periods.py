# -*- coding: utf-8 -*-
# pylint: disable=no-member,invalid-name
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

from rest_framework import status

from api.tests.data_creation_utilities import DataCreationUtilities

from .base_api_security_test_case import BaseAPISecurityTestCase


class TestCompliancePeriodsAPI(BaseAPISecurityTestCase):
    """
    Test Specific Authorization issues related to users API discovered in audit
    """

    def test_get_list(self):
        """Test that getting compliance periods list is restricted correctly"""

        url = "/api/compliance_periods"

        all_users = self.users

        for user in all_users:
            with self.subTest(
                    user=user,
                    expected_status=status.HTTP_200_OK,
                    reason="Everyone should be able to read compliance periods"
            ):
                response = self.clients[user].get(url)
                logging.debug(response.content.decode('utf-8'))

                self.assertEqual(
                    response.status_code,
                    status.HTTP_200_OK)

    def test_get_by_id(self):
        """Test that getting another user directly is not a valid action
         unless you have an admin role"""

        url = "/api/compliance_periods/{0!s}"

        all_users = self.users

        cp_that_exists = DataCreationUtilities.create_compliance_period()

        for user in all_users:
            with self.subTest(
                    user=user,
                    expected_status=status.HTTP_200_OK,
                    reason="Everyone should be able to read compliance periods"
            ):
                response = self.clients[user].get(url.format(cp_that_exists['id']))
                logging.debug(response.content.decode('utf-8'))
                self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_post(self):
        """
        Test that posting new compliance periods is not a valid action
         unless you have an appropriate role
         """

        url = "/api/compliance_periods"

        all_users = self.users

        expected_results = defaultdict(lambda: {
            'status': status.HTTP_403_FORBIDDEN,
            'reason': "Default response should be no access"})

        expected_results[('gov_admin',)] = {
            'status': status.HTTP_201_CREATED,
            'reason': 'Admin should have create access for compliance periods'}

        expected_results[('gov_director',)] = {
            'status': status.HTTP_201_CREATED,
            'reason': 'Director should have create access for compliance '
                      'periods'}

        expected_results[('gov_multi_role',)] = {
            'status': status.HTTP_201_CREATED,
            'reason': 'Multi Role should have create access for compliance '
                      'periods'}

        for _index, user in enumerate(all_users):
            with self.subTest(
                    user=user,
                    expected_status=expected_results[(user,)]['status'],
                    reason=expected_results[(user,)]['reason']
            ):
                payload = {
                    'description': 'Posted CP {0!s}'.format(uuid.uuid4()),
                    'display_order': 1
                }

                response = self.clients[user].post(
                    url,
                    content_type='application/json',
                    data=json.dumps(payload))

                logging.debug(response.content.decode('utf-8'))
                self.assertEqual(
                    response.status_code,
                    expected_results[(user,)]['status'])

    def test_delete(self):
        """
        Test that deleting compliance periods is not a semantically valid
        action
        """

        url = "/api/compliance_periods/{0!s}"

        all_users = self.users

        expected_results = defaultdict(lambda: {
            'status': [
                status.HTTP_405_METHOD_NOT_ALLOWED,
                status.HTTP_403_FORBIDDEN
            ],
            'reason': "Default response should be no access"})

        for user in all_users:
            with self.subTest(
                    user=user,
                    expected_statuses=expected_results[(user,)]['status'],
                    reason=expected_results[(user,)]['reason']
            ):
                cp_that_exists = DataCreationUtilities.create_compliance_period()
                response = self.clients[user].delete(
                    url.format(cp_that_exists['id']))
                logging.debug(response)
                self.assertIn(
                    response.status_code,
                    expected_results[(user,)]['status'])

    def test_put(self):
        """
        Test that updating compliance periods is not a valid action
         unless you have an appropriate role
        """
        url = "/api/compliance_periods/{0!s}"

        all_users = self.users

        expected_results = defaultdict(lambda: {
            'status': status.HTTP_403_FORBIDDEN,
            'reason': "Default response should be no access"})

        expected_results[('gov_admin',)] = {
            'status': status.HTTP_200_OK,
            'reason': 'Admin should have update access for compliance periods'}

        expected_results[('gov_director',)] = {
            'status': status.HTTP_200_OK,
            'reason': 'Director should have update access for compliance '
                      ' periods'}

        expected_results[('gov_multi_role',)] = {
            'status': status.HTTP_200_OK,
            'reason': 'Multi Role should have update access for compliance '
                      ' periods'}

        for _index, user in enumerate(all_users):
            with self.subTest(
                    user=user,
                    expected_status=expected_results[(user,)]['status'],
                    reason=expected_results[(user,)]['reason']
            ):
                cp_that_exists = DataCreationUtilities.create_compliance_period()

                payload = {
                    'description': 'Updated CP {0!s}'.format(uuid.uuid4()),
                    'display_order': 1
                }

                response = self.clients[user].put(
                    url.format(cp_that_exists['id']),
                    content_type='application/json',
                    data=json.dumps(payload)

                )
                logging.debug(response)

                self.assertEqual(
                    response.status_code,
                    expected_results[(user,)]['status'],
                    "PUT")

                payload = {
                    'description': 'Patched CP {0!s}'.format(uuid.uuid4())
                }

                response = self.clients[user].patch(
                    url.format(cp_that_exists['id']),
                    content_type='application/json',
                    data=json.dumps(payload)

                )
                logging.debug(response)

                self.assertEqual(
                    response.status_code,
                    expected_results[(user,)]['status'],
                    "PATCH")
