# -*- coding: utf-8 -*-
# pylint: disable=no-member,invalid-name
"""
    REST API Documentation for the NRsS TFRS Credit Trading Application

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

from api.models.FuelCode import FuelCode
from api.models.FuelCodeStatus import FuelCodeStatus

from .base_test_case import BaseTestCase


class TestFuelCodes(BaseTestCase):
    """Tests for the documents endpoint"""
    extra_fixtures = ['test/test_fuel_codes.json']

    def test_get_fuel_code_list(self):
        """
        Test that the fuel codes list loads properly
        """
        # View the organization that fs_user_1 belongs to
        response = self.clients['gov_analyst'].get(
            "/api/fuel_codes"
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response_data = json.loads(response.content.decode("utf-8"))

        self.assertGreaterEqual(len(response_data), 1)

        response = self.clients['fs_user_1'].get(
            "/api/fuel_codes"
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response_data = json.loads(response.content.decode("utf-8"))

        self.assertGreaterEqual(len(response_data), 1)

    def test_add_draft_as_gov_user(self):
        """
        Test adding a fuel code as a government user
        """
        status_draft = FuelCodeStatus.objects.filter(status="Draft").first()
        fuel_code = 'Test Fuel Code'

        payload = {
            'applicationDate': '2019-01-01',
            'approvalDate': '2019-01-01',
            'carbonIntensity': '10',
            'company': 'Test',
            'effectiveDate': '2019-01-01',
            'expiryDate': '2020-01-01',
            'facilityLocation': 'Test',
            'facilityNameplate': '123',
            'feedstock': 'Test',
            'feedstockLocation': 'Test',
            'feedstockMisc': 'Test',
            'feedstockTransportMode': ['Pipeline', 'Truck'],
            'formerCompany': 'Test',
            'fuel': 'LNG',
            'fuelCode': fuel_code,
            'fuelTransportMode': ['Rail'],
            'status': status_draft.id
        }

        response = self.clients['gov_analyst'].post(
            "/api/fuel_codes",
            content_type='application/json',
            data=json.dumps(payload)
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        response_data = json.loads(response.content.decode("utf-8"))

        fuel_code_obj = FuelCode.objects.get(id=response_data['id'])

        self.assertEqual(fuel_code_obj.fuel_code, fuel_code)
        self.assertEqual(fuel_code_obj.fuel.name, 'LNG')

    def test_add_draft_as_fuel_supplier(self):
        """
        Test adding a fuel code as a fuel supplier
        Note: This should fail
        """
        status_draft = FuelCodeStatus.objects.filter(status="Draft").first()
        fuel_code = 'Test Fuel Code'
        fuel = 'Test Fuel'

        payload = {
            'applicationDate': '2019-01-01',
            'approvalDate': '2019-01-01',
            'carbonIntensity': '10',
            'company': 'Test',
            'effectiveDate': '2019-01-01',
            'expiryDate': '2020-01-01',
            'facilityLocation': 'Test',
            'facilityNameplate': '123',
            'feedstock': 'Test',
            'feedstockLocation': 'Test',
            'feedstockMisc': 'Test',
            'feedstockTransportMode': 'Test',
            'formerCompany': 'Test',
            'fuel': fuel,
            'fuelCode': fuel_code,
            'fuelTransportMode': 'Test',
            'status': status_draft.id
        }

        response = self.clients['fs_user_1'].post(
            "/api/fuel_codes",
            content_type='application/json',
            data=json.dumps(payload)
        )

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_get_fuel_code_export(self):
        """
        Test that the fuel codes XLS generation returns 200
        """
        # View the organization that fs_user_1 belongs to
        response = self.clients['gov_analyst'].get(
            "/api/fuel_codes/xls"
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
