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
from api.models.DocumentStatus import DocumentStatus
from api.models.DocumentType import DocumentType

from .base_test_case import BaseTestCase


class TestDocumentComments(BaseTestCase):
    """Tests for the documents comments endpoint"""
    def test_add_comments_on_draft(self):
        """
        Test adding a comment on draft documents
        """
        create_user = self.users['fs_user_1']
        compliance_period = CompliancePeriod.objects.first()
        status_draft = DocumentStatus.objects.filter(status="Draft").first()
        type_evidence = DocumentType.objects.filter(
            the_type="Evidence").first()

        created_document = Document.objects.create(
            create_user_id=create_user.id,
            compliance_period_id=compliance_period.id,
            status_id=status_draft.id,
            title="Test Title",
            type_id=type_evidence.id
        )

        payload = {
            'document': created_document.id,
            'comment': 'test',
            'privilegedAccess': False
        }

        response = self.clients['fs_user_1'].post(
            "/api/documents_comments",
            content_type='application/json',
            data=json.dumps(payload)
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_add_comments_on_submitted(self):
        """
        Test adding a comment on submitted documents
        """
        create_user = self.users['fs_user_1']
        compliance_period = CompliancePeriod.objects.first()
        status_submitted = DocumentStatus.objects.filter(status="Submitted").first()
        type_evidence = DocumentType.objects.filter(
            the_type="Evidence").first()

        created_document = Document.objects.create(
            create_user_id=create_user.id,
            compliance_period_id=compliance_period.id,
            status_id=status_submitted.id,
            title="Test Title",
            type_id=type_evidence.id
        )

        payload = {
            'document': created_document.id,
            'comment': 'test',
            'privilegedAccess': False
        }

        response = self.clients['fs_user_1'].post(
            "/api/documents_comments",
            content_type='application/json',
            data=json.dumps(payload)
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_add_comments_on_received(self):
        """
        Test adding a comment on received documents
        (this should fail)
        """
        create_user = self.users['fs_user_1']
        compliance_period = CompliancePeriod.objects.first()
        status_received = DocumentStatus.objects.filter(status="Received").first()
        type_evidence = DocumentType.objects.filter(
            the_type="Evidence").first()

        created_document = Document.objects.create(
            create_user_id=create_user.id,
            compliance_period_id=compliance_period.id,
            status_id=status_received.id,
            title="Test Title",
            type_id=type_evidence.id
        )

        payload = {
            'document': created_document.id,
            'comment': 'test',
            'privilegedAccess': False
        }

        response = self.clients['fs_user_1'].post(
            "/api/documents_comments",
            content_type='application/json',
            data=json.dumps(payload)
        )

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_add_comments_on_archived(self):
        """
        Test adding a comment on archived documents
        (this should fail)
        """
        create_user = self.users['fs_user_1']
        compliance_period = CompliancePeriod.objects.first()
        status_archived = DocumentStatus.objects.filter(status="Archived").first()
        type_evidence = DocumentType.objects.filter(
            the_type="Evidence").first()

        created_document = Document.objects.create(
            create_user_id=create_user.id,
            compliance_period_id=compliance_period.id,
            status_id=status_archived.id,
            title="Test Title",
            type_id=type_evidence.id
        )

        payload = {
            'document': created_document.id,
            'comment': 'test',
            'privilegedAccess': False
        }

        response = self.clients['fs_user_1'].post(
            "/api/documents_comments",
            content_type='application/json',
            data=json.dumps(payload)
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
