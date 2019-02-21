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
from rest_framework import status

from .base_test_case import BaseTestCase


class TestReferenceData(BaseTestCase):

    def test_get_reference_data(self):
        """
        Test that all users can access reference data used by the frontend
        """

        reference_data_endpoints = [
            '/api/organizations/actions_types',
            '/api/organizations/types',
            '/api/organizations/statuses',
            '/api/documents/categories'
        ]

        for client_name, client in self.clients.items():
            for endpoint in reference_data_endpoints:
                with self.subTest(
                        "Testing reference data endpoint",
                        endpoint=endpoint,
                        client=client_name
                ):
                    response = client.get(endpoint)
                    self.assertEqual(response.status_code, status.HTTP_200_OK)
