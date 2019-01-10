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

from api.models.CompliancePeriod import CompliancePeriod
from api.models.Document import Document
from api.models.DocumentFileAttachment import DocumentFileAttachment
from api.models.DocumentStatus import DocumentStatus
from api.models.DocumentType import DocumentType
from api.services.SecurityScan import SecurityScan
from .base_test_case import BaseTestCase


class TestDocumentScan(BaseTestCase):
    """Tests for the documents endpoint"""
    extra_fixtures = ['test/test_secure_documents.json']

    def test_request_security_scan(self):

        doc = Document.objects.create(
            status=DocumentStatus.objects.first(),
            type=DocumentType.objects.first(),
            compliance_period=CompliancePeriod.objects.first(),
            title="test document"
        )

        dfa = DocumentFileAttachment.objects.create(
            url="http://test-url.document",
            size=1202,
            filename="test-file-name",
            mime_type="text/plain",
            security_scan_status='NOT RUN',
            document=doc
        )

        SecurityScan.send_scan_request(dfa)
