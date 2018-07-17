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

from api.models.OrganizationAddress import OrganizationAddress
from api.models.OrganizationType import OrganizationType
from .base_test_case import BaseTestCase


class TestOrganizations(BaseTestCase):
    """Tests for the organizations endpoint"""

    def test_get_fuel_suppliers_only(self):
        """
        Test that organizations fuel suppliers endpoint returns only fuel
        suppliers
        """
        response = self.clients['gov_analyst'].get(
            "/api/organizations/fuel_suppliers")
        response_data = json.loads(response.content.decode("utf-8"))

        for fs in response_data:
            self.assertEqual(
                fs['type'],
                OrganizationType.objects.get_by_natural_key(
                    "Part3FuelSupplier").id
            )

    def test_get_organization_address(self):
        """
        Test that the organization loads the address properly
        """
        OrganizationAddress.objects.create(
            address_line_1="Test Address 1",
            city="Test City",
            organization_id=self.users['fs_user_1'].organization.id
        )

        response = self.clients['fs_user_1'].get("/api/organizations/mine")
        response_data = json.loads(response.content.decode("utf-8"))

        self.assertEqual("Test Address 1",
                         response_data['organizationAddress']['addressLine_1'])
        self.assertEqual("Test City",
                         response_data['organizationAddress']['city'])
