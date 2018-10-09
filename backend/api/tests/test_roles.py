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

from api.models.Role import Role
from .base_test_case import BaseTestCase


class TestRoles(BaseTestCase):
    """Tests for the roles endpoint"""

    def test_get_roles(self):
        """
        Test that getting roles without parameters as an admin
        """
        response = self.clients['gov_admin'].get(
            "/api/roles")
        response_data = json.loads(response.content.decode("utf-8"))

        self.assertEqual(len(response_data), Role.objects.count())

    def test_get_roles_with_parameters(self):
        """
        Test that passing certain parameters will filter the roles list
        function
        """
        # get get fuel supplier roles only
        response = self.clients['gov_admin'].get(
            "/api/roles", {
                'fuel_supplier_roles_only': 'true'
            }
        )
        response_data = json.loads(response.content.decode("utf-8"))

        count = Role.objects.filter(is_government_role=False).count()

        self.assertEqual(len(response_data), count)

        # get government roles only
        response = self.clients['gov_admin'].get(
            "/api/roles", {
                'government_roles_only': 'true'
            }
        )
        response_data = json.loads(response.content.decode("utf-8"))

        count = Role.objects.filter(is_government_role=True).count()

        self.assertEqual(len(response_data), count)

    def test_get_roles_with_unauthorized(self):
        """
        Test that using an account that doesn't have permission to
        fetch roles
        """
        response = self.clients['gov_director'].get(
            "/api/roles"
        )
        response_data = json.loads(response.content.decode("utf-8"))

        self.assertEqual(len(response_data), 0)
