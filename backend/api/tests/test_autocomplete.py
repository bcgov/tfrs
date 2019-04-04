# -*- coding: utf-8 -*-
# pylint: disable=no-member,invalid-name
"""
    REST API Documentation for the NRS TFRS Credit Trading Application

    The Transportation Fuels Reporting System is being designed to streamline
    compliance reporting for transportation fuel suppliers in accordance with
    the Renewable & Low Carbon Fuel
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
from rest_framework import status

from api.services.Autocomplete import Autocomplete

from .base_test_case import BaseTestCase


class TestAutocomplete(BaseTestCase):
    """Tests for autocomplete service"""

    extra_fixtures = [
        'test/test_autocomplete.json'
    ]

    def test_auto_complete(self):
        """test autocomplete API"""
        result = Autocomplete.get_matches('fuel_code.company', 'Company')
        self.assertIn('Company A', result)
        self.assertGreaterEqual(len(result), 3)

        result = Autocomplete.get_matches('fuel_code.company', 'comp')
        self.assertIn('Company A', result)
        self.assertGreaterEqual(len(result), 2)

        result = Autocomplete.get_matches(
            'fuel_code.feedstock_location', 'here')
        self.assertIn('Nowhere Nice', result)
        self.assertIn('Somewhere', result)
        self.assertNotIn('Someplace', result)
        self.assertGreaterEqual(len(result), 2)

    def test_autocomplete_api_authorized(self):
        """test autocomplete API with an authorized user"""
        response = self.clients['gov_analyst'].get(
            '/api/autocomplete?field={}&q={}'.format(
                'fuel_code.company', 'comp'))

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        suggestions = response.json()
        assert 'Company A' in suggestions

    def test_autocomplete_api_unauthorized(self):
        """test autocomplete API with an unauthorized user"""
        response = self.clients['fs_user_1'].get(
            '/api/autocomplete?field={}&q={}'.format(
                'fuel_code.company', 'com'))

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_autocomplete_api_invalid_field(self):
        """test autocomplete API with an unknown field"""
        response = self.clients['gov_analyst'].get(
            '/api/autocomplete?field={}&q={}'.format(
                'nonexistent.field', 'com'))

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_autocomplete_api_bad_params(self):
        """test autocomplete API with a required parameter missing"""
        response = self.clients['gov_analyst'].get(
            '/api/autocomplete?field={}'.format('fuel_code.company'))

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_autocomplete_increment_api(self):
        """
        test the get next increment function
        """
        response = self.clients['gov_analyst'].get(
            '/api/autocomplete?field={}&q={}'.format(
                'fuel_code.fuel_code_version', '101'))

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response_data = json.loads(response.content.decode("utf-8"))

        self.assertEqual(response_data, ["101.2"])
