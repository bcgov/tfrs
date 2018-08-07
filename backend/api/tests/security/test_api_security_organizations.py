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

from api.models.OrganizationActionsType import OrganizationActionsType
from api.models.OrganizationType import OrganizationType
from api.models.OrganizationStatus import OrganizationStatus

from api.tests.data_creation_utilities import DataCreationUtilities

from .base_api_security_test_case import BaseAPISecurityTestCase


class TestOrganizationsAPI(BaseAPISecurityTestCase):
    """
    Test Specific Authorization issues related to organizations API discovered in audit
    """

    def test_get_list(self):
        """Test getting list of organizations is restricted correctly"""

        url = "/api/organizations"

        all_users = self.users
        expected_results = defaultdict(lambda: {
            'status': status.HTTP_403_FORBIDDEN,
            'reason': "Default response should be no access"})

        expected_results[('gov_director',)] = {
            'status': status.HTTP_200_OK,
            'reason': 'Director should have read access to orgs'}

        expected_results[('gov_analyst',)] = {
            'status': status.HTTP_200_OK,
            'reason': 'Analyst should have read access to orgs'}

        expected_results[('gov_multi_role',)] = {
            'status': status.HTTP_200_OK,
            'reason': 'Multi Role should have read access to orgs'}

        for user in all_users:
            with self.subTest(
                user=user,
                expected_status=expected_results[(user,)]['status'],
                reason=expected_results[(user,)]['reason']
            ):
                response = self.clients[user].get(url)
                logging.debug(response.content.decode('utf-8'))
                self.assertEqual(
                    response.status_code,
                    expected_results[(user,)]['status'])

    def test_delete(self):
        """
        Test that deleting organizations is not a semantically valid action
        """

        url = "/api/organizations/{0!s}"

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
                org_that_exists = DataCreationUtilities.create_test_organization()
                response = self.clients[user].delete(
                    url.format(org_that_exists['id']))
                logging.debug(response)

                self.assertIn(
                    response.status_code,
                    expected_results[(user,)]['status'])

    def test_post(self):
        """
        Test that posting new organizations is not a valid action
        unless you have have the analyst, admin, or director role
        """

        url = "/api/organizations"

        all_users = self.users

        expected_results = defaultdict(lambda: {
            'status': status.HTTP_403_FORBIDDEN,
            'reason': "Default response should be no access"})

        expected_results[('gov_admin',)] = {
            'status': status.HTTP_201_CREATED,
            'reason': 'Admin should have create access for orgs'}

        expected_results[('gov_analyst',)] = {
            'status': status.HTTP_201_CREATED,
            'reason': 'Analyst should have create access for orgs'}

        expected_results[('gov_director',)] = {
            'status': status.HTTP_201_CREATED,
            'reason': 'Director should have create access for orgs'}

        expected_results[('gov_multi_role',)] = {
            'status': status.HTTP_201_CREATED,
            'reason': 'Gov Multi-role should have create access for orgs'}

        for index, user in enumerate(all_users):
            with self.subTest(
                user=user,
                expected_status=expected_results[(user,)]['status'],
                reason=expected_results[(user,)]['reason']
            ):
                payload = {
                    'status': OrganizationStatus.objects.get_by_natural_key('Active').id,
                    'type': OrganizationType.objects.get_by_natural_key('Part3FuelSupplier').id,
                    'name': 'Posted org {}'.format(str(uuid.uuid4())),
                    'actions_type': OrganizationActionsType.objects.get_by_natural_key('Buy And Sell').id
                }

                response = self.clients[user].post(
                    url,
                    content_type='application/json',
                    data=json.dumps(payload))

                logging.debug(response.content.decode('utf-8'))
                self.assertEqual(response.status_code, expected_results[(user,)]['status'])

    def test_put_or_patch(self):
        """
        Test that updating organizations is not a valid action
        unless you have an admin role
        """

        url = "/api/organizations/{0!s}"

        all_users = self.users

        expected_results = defaultdict(lambda: {
            'status': status.HTTP_403_FORBIDDEN,
            'reason': "Default response should be no access"})

        expected_results[('gov_admin',)] = {
            'status': status.HTTP_200_OK,
            'reason': 'Admin should have write access for orgs'}

        expected_results[('gov_analyst',)] = {
            'status': status.HTTP_200_OK,
            'reason': 'Analyst should have write access for orgs'}

        expected_results[('gov_director',)] = {
            'status': status.HTTP_200_OK,
            'reason': 'Director should have write access for orgs'}

        expected_results[('gov_multi_role',)] = {
            'status': status.HTTP_200_OK,
            'reason': 'Gov Multi-role should have write access for orgs'}

        for _index, user in enumerate(all_users):
            with self.subTest(
                user=user,
                expected_status=expected_results[(user,)]['status'],
                reason=expected_results[(user,)]['reason']
            ):
                org_that_exists = DataCreationUtilities.create_test_organization()

                payload = {
                    'status': OrganizationStatus.objects.get_by_natural_key('Active').id,
                    'type': OrganizationType.objects.get_by_natural_key('Part3FuelSupplier').id,
                    'name': 'Updated org {}'.format(str(uuid.uuid4())),
                    'actions_type': OrganizationActionsType.objects.get_by_natural_key('Buy And Sell').id
                }

                response = self.clients[user].put(
                    url.format(org_that_exists['id']),
                    content_type='application/json',
                    data=json.dumps(payload)

                )
                logging.debug(response)

                self.assertEqual(
                    response.status_code,
                    expected_results[(user,)]['status'],
                    "PUT")

                payload = {
                    'name': 'Patched org {}'.format(str(uuid.uuid4())),
                }

                response = self.clients[user].patch(
                    url.format(org_that_exists['id']),
                    content_type='application/json',
                    data=json.dumps(payload)

                )
                logging.debug(response)

                self.assertEqual(
                    response.status_code,
                    expected_results[(user,)]['status'],
                    "PATCH")
