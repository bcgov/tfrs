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
from api.models.CreditTrade import CreditTrade
from api.models.CreditTradeStatus import CreditTradeStatus
from api.models.Document import Document
from api.models.DocumentMilestone import DocumentMilestone
from api.models.DocumentStatus import DocumentStatus
from api.models.DocumentType import DocumentType
from api.tests.data_creation_utilities import DataCreationUtilities

from .base_test_case import BaseTestCase


class TestDocuments(BaseTestCase):
    """Tests for the documents endpoint"""
    extra_fixtures = ['test/test_secure_documents.json']

    def test_get_document_list_as_gov(self):
        """
        Test that the documents list loads properly for gov
        """
        # View the organization that fs_user_1 belongs to
        response = self.clients['gov_analyst'].get(
            "/api/documents"
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response_data = json.loads(response.content.decode("utf-8"))

        self.assertGreaterEqual(len(response_data), 1)

    def test_get_document_list_as_fs(self):
        """
        Test that the documents list loads properly for fs
        """
        # View the organization that fs_user_1 belongs to
        response = self.clients['fs_user_1'].get(
            "/api/documents"
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response_data = json.loads(response.content.decode("utf-8"))

        self.assertGreaterEqual(len(response_data), 1)

    def test_gov_sees_no_drafts(self):
        """
        Test that the documents list loads properly and contains no drafts
        """
        # View the organization that fs_user_1 belongs to
        response = self.clients['gov_analyst'].get(
            "/api/documents"
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response_data = json.loads(response.content.decode("utf-8"))

        for doc in response_data:
            self.assertNotEqual(doc['status']['status'],
                                'Draft')

    def test_get_document_as_creator(self):
        """
        Test that the documents load as the creator
        """
        response = self.clients['fs_user_1'].get(
            "/api/documents/1"
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_document_as_other(self):
        """
        Test that the documents don't load as another fs
        """
        response = self.clients['fs_user_2'].get(
            "/api/documents/1"
        )

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_get_draft_document_as_gov(self):
        """
        Test that draft documents don't load for gov
        """

        response = self.clients['gov_analyst'].get(
            "/api/documents/1"
        )

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_get_submitted_document_as_gov(self):
        """
        Test that submitted docs are visible to gov
        """

        response = self.clients['gov_analyst'].get(
            "/api/documents/3"
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_add_document_evidence_as_fuel_supplier(self):
        """
        Test adding a document as a fuel supplier
        """
        compliance_period = CompliancePeriod.objects.first()
        status_draft = DocumentStatus.objects.filter(status="Draft").first()
        type_evidence = DocumentType.objects.filter(
            the_type="Evidence").first()

        document_title = 'Test Title'
        document_milestone = 'Document Milestone'

        payload = {
            'compliancePeriod': compliance_period.id,
            'title': document_title,
            'status': status_draft.id,
            'type': type_evidence.id,
            'milestone': document_milestone
        }

        response = self.clients['fs_user_1'].post(
            "/api/documents",
            content_type='application/json',
            data=json.dumps(payload)
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        response_data = json.loads(response.content.decode("utf-8"))

        document = Document.objects.get(id=response_data['id'])

        self.assertEqual(document.title, document_title)
        self.assertEqual(document.milestone.milestone, document_milestone)

    def test_update_document_evidence_as_fuel_supplier(self):
        """
        Test updating a document as a fuel supplier
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

        document_title = "Different Title"

        payload = {
            'compliancePeriod': compliance_period.id,
            'status': status_draft.id,
            'title': document_title,
            'type': type_evidence.id
        }

        response = self.clients['fs_user_1'].patch(
            "/api/documents/{}".format(created_document.id),
            content_type='application/json',
            data=json.dumps(payload)
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        document = Document.objects.get(id=created_document.id)

        self.assertEqual(document.title, document_title)

    def test_update_document_status_and_title(self):
        """
        Test updating a document status to submitted and attempt to
        modify the title (this should fail)
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

        status_submitted = DocumentStatus.objects.filter(status="Submitted").first()

        payload = {
            'compliancePeriod': compliance_period.id,
            'status': status_submitted.id,
            'title': "Different Title",
            'type': type_evidence.id
        }

        response = self.clients['fs_user_1'].patch(
            "/api/documents/{}".format(created_document.id),
            content_type='application/json',
            data=json.dumps(payload)
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_link_document_to_credit_transaction(self):
        """
        Test updating a document status to submitted and attempt to
        modify the title (this should fail)
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

        credit_trade = DataCreationUtilities.create_credit_trade(
            initiating_organization=self.users['fs_user_1'].organization,
            responding_organization=self.users['fs_user_2'].organization,
            status=CreditTradeStatus.objects.get_by_natural_key('Approved'),
            is_rescinded=False
        )

        payload = {
            'creditTrade': credit_trade['id']
        }

        # Link the credit transfer

        response = self.clients['fs_user_1'].put(
            "/api/documents/{}/link".format(created_document.id),
            content_type='application/json',
            data=json.dumps(payload)
        )

        self.assertEqual(response.status_code, status.HTTP_202_ACCEPTED)

        response = self.clients['fs_user_1'].get(
            "/api/documents/{}".format(created_document.id)
        )
        response_data = json.loads(response.content.decode("utf-8"))

        # Confirm link
        self.assertEqual(len(response_data['creditTrades']), 1)

        # Unlink it
        payload = {
            'creditTrade': credit_trade['id']
        }

        response = self.clients['fs_user_1'].put(
            "/api/documents/{}/unlink".format(created_document.id),
            content_type='application/json',
            data=json.dumps(payload)
        )

        self.assertEqual(response.status_code, status.HTTP_202_ACCEPTED)

        # Confirm unlinked

        response = self.clients['fs_user_1'].get(
            "/api/documents/{}".format(created_document.id)
        )
        response_data = json.loads(response.content.decode("utf-8"))

        self.assertEqual(len(response_data['creditTrades']), 0)



