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

from rest_framework import status

from .base_test_case import BaseTestCase


class TestUsers(BaseTestCase):
    """Test /api/users"""

    def test_current_user(self):
        """Test that current user endpoint returns expected data for client"""

        for user in self.users.values():
            with self.subTest("evaluating current user endpoint for client",
                              user=user.username,
                              first_name=user.first_name,
                              last_name=user.last_name,
                              display_name=user.display_name,
                              email=user.email,
                              authorization_id=user.authorization_id):

                response = self.clients[user.username].get('/api/users/current')
                self.assertEqual(response.status_code, status.HTTP_200_OK)
                response_data = json.loads(response.content.decode("utf-8"))

                self.assertEqual(response_data['authorizationId'], user.authorization_id, "Authid")
                self.assertEqual(response_data['email'], user.email, "Email")
                self.assertEqual(response_data['displayName'], user.display_name, "Display Name")

                # don't want to leak GUID
                self.assertNotIn('authorizationGuid', response_data, "GUID")
