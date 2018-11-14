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
from api.models.User import User


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

    def test_get_by_username_as_admin(self):
        """Test that by_username user endpoint returns expected data for client"""

        for user in self.users.values():
            with self.subTest("evaluating get_by_username user endpoint as admin",
                              user=user.username,
                              first_name=user.first_name,
                              last_name=user.last_name,
                              display_name=user.display_name,
                              email=user.email,
                              authorization_id=user.authorization_id):
                response = self.clients['gov_admin'].get('/api/users/by_username?username={}'.format(user.username))
                self.assertEqual(response.status_code, status.HTTP_200_OK)
                response_data = json.loads(response.content.decode("utf-8"))

                self.assertEqual(response_data['authorizationId'], user.authorization_id, "Authid")
                self.assertEqual(response_data['email'], user.email, "Email")
                self.assertEqual(response_data['displayName'], user.display_name, "Display Name")

                # don't want to leak GUID
                self.assertNotIn('authorizationGuid', response_data, "GUID")

    def test_create_user(self):
        """Test that create user endpoint works"""
        payload = {
            'email': 'unused_email@email.com',
            'user': {
                'first_name': 'firstname',
                'last_name': 'lastname',
                'username': 'new_user_1',
                'organization': 1,
                'roles': [],
                'email': 'email@email.com'
            }
        }
        response = self.clients['gov_admin'].post('/api/users',
                                                  content_type='application/json',
                                                  data=json.dumps(payload))
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_update_self(self):
        """Test that updating self works"""

        payload = {
            'first_name': 'firstname',
            'last_name': 'lastname',
            'email': 'email@email.com',
            'cell_phone': '123456789',
            'phone': '123456788',
            'username': 'new_user_1',
            'authorization_id': 'new_user_auth_1'
        }

        user = User.objects.get(id=self.users['fs_user_1'].id)

        response = self.clients['fs_user_1'].patch(
            '/api/users/{}'.format(user.id),
            content_type='application/json',
            data=json.dumps(payload))

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # not all fields should've been updated
        user = User.objects.get(id=self.users['fs_user_1'].id)

        self.assertEqual(user.first_name, 'firstname')
        self.assertEqual(user.phone, '123456788')
        self.assertNotEqual(user.username, 'new_user_1')
        self.assertNotEqual(user.authorization_id, 'new_user_auth_1')
