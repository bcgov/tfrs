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

from api.models.OrganizationAddress import OrganizationAddress
from api.models.OrganizationType import OrganizationType
from .base_test_case import BaseTestCase


class TestDocuments(BaseTestCase):
    """Tests for the documents endpoint"""
    extra_fixtures = ['test/test_secure_documents.json']

    def test_get_document_list(self):
        """
        Test that the documents list loads properly
        """
        # View the organization that fs_user_1 belongs to
        response = self.clients['gov_analyst'].get(
            "/api/documents"
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response_data = json.loads(response.content.decode("utf-8"))

        self.assertGreaterEqual(len(response_data), 3)

    def test_get_document_as_creator(self):
        """
        Test that the documents load as the creator
        """

        #

        # View the organization that fs_user_1 belongs to
        response = self.clients['fs_user_1'].get(
            "/api/documents/1"
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

#        response_data = json.loads(response.content.decode("utf-8"))

