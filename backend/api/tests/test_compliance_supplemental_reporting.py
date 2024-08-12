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

from django.utils import timezone
from rest_framework import status
import logging

from api.models import OrganizationBalance
from api.models.CompliancePeriod import CompliancePeriod
from api.models.ComplianceReport import ComplianceReport, ComplianceReportStatus, ComplianceReportType, \
    ComplianceReportWorkflowState
from api.models.NotificationMessage import NotificationMessage
from api.models.Organization import Organization
from .base_test_case import BaseTestCase
from .payloads.supplemental_payloads import *
from decimal import Decimal
from unittest.mock import Mock, PropertyMock
from api.models.ComplianceReport import ComplianceReport
from api.serializers.ComplianceReport import ComplianceReportBaseSerializer


logger = logging.getLogger('supplemental_reporting')
logger.setLevel(logging.INFO)
handler = logging.StreamHandler()
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
handler.setFormatter(formatter)
logger.addHandler(handler)

class TestComplianceReporting(BaseTestCase):
    """Tests for the compliance reporting supplemental endpoints"""
    extra_fixtures = [
        'test/test_compliance_reporting.json',
        'test/test_fuel_codes.json',
        'test/test_unit_of_measures.json',
        'test/test_carbon_intensity_limits.json',
        'test/test_default_carbon_intensities.json',
        'test/test_energy_densities.json',
        'test/test_energy_effectiveness_ratio.json',
        'test/test_petroleum_carbon_intensities.json',
        'test/test_transaction_types.json'
    ]

    def _create_compliance_report(self, report_type="Compliance Report"):
        report = ComplianceReport()
        report.status = ComplianceReportWorkflowState.objects.create(
            fuel_supplier_status=ComplianceReportStatus.objects.get_by_natural_key('Draft')
        )
        report.organization = Organization.objects.get_by_natural_key(
            "Test Org 1")
        report.compliance_period = CompliancePeriod.objects.get_by_natural_key('2020')
        report.type = ComplianceReportType.objects.get_by_natural_key(report_type)
        report.create_timestamp = timezone.now()
        report.update_timestamp = timezone.now()

        report.save()
        report.refresh_from_db()
        return report.id

    def _create_supplemental_report(self):
        rid = self._create_compliance_report()
        # patch compliance report info
        response = self.clients['fs_user_1'].patch(
            '/api/compliance_reports/{id}'.format(id=rid),
            content_type='application/json',
            data=json.dumps(initial_submission_payload)
        )
        payload = {
            'supplements': rid,
            'status': {'fuelSupplierStatus': 'Draft'},
            'type': 'Compliance Report',
            'compliancePeriod': '2020'
        }
        response = self.clients['fs_user_1'].post(
            '/api/compliance_reports',
            content_type='application/json',
            data=json.dumps(payload)
        )
        sid = response.data['id']
        # logger.info("Supplemental ID: " + str(sid))
        return sid

    def test_supplemental_create(self):
        sid = self._create_supplemental_report()
        # patch supplemental #1
        response = self.clients['fs_user_1'].patch(
            '/api/compliance_reports/{id}'.format(id=sid),
            content_type='application/json',
            data=json.dumps(patch_supplemental_1_payload)
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_supplemental_submit_failed(self):
        sid = self._create_supplemental_report()
        # submit supplemental #1 failure, needs supplemental note
        payload = {
            'status': {'fuelSupplierStatus': 'Submitted'},
        }
        response = self.clients['fs_user_1'].patch(
            '/api/compliance_reports/{id}'.format(id=sid),
            content_type='application/json',
            data=json.dumps(payload)
        )
        self.assertEqual(response.status_code, 400)
        json_data = json.loads(response.content)
        self.assertEqual(json_data[0], 'supplemental note is required when submitting a supplemental report')

    def test_supplemental_submit_success(self):
        sid = self._create_supplemental_report()
        # submit supplemental #1 failure, needs supplemental note
        payload = {
            'status': {'fuelSupplierStatus': 'Submitted'},
            'supplemental_note': 'test supplemental note'
        }
        response = self.clients['fs_user_1'].patch(
            '/api/compliance_reports/{id}'.format(id=sid),
            content_type='application/json',
            data=json.dumps(payload)
        )
        self.assertEqual(response.status_code, 200)
        return sid

    def test_supplemental_accept_by_director_failed(self):
        sid = self.test_supplemental_submit_success()
        payload = {'status': {'directorStatus': 'Accepted'}}
        response = self.clients['fs_user_1'].patch(
            '/api/compliance_reports/{id}'.format(id=sid),
            content_type='application/json',
            data=json.dumps(payload)
        )
        self.assertEqual(response.status_code, 403)

    def test_supplemental_accepted_by_director_success(self):
        sid = self.test_supplemental_submit_success()
        # we are only allowed to change one status at a time so this
        # loops the statuses in order to get to accepted by director
        status_payloads = [
            { 'user': 'gov_analyst', 'payload': {'status': {'analystStatus': 'Recommended'}}},
            { 'user': 'gov_manager', 'payload': {'status': {'managerStatus': 'Recommended'}}},
            { 'user': 'gov_director', 'payload': {'status': {'directorStatus': 'Accepted'}}}
        ]
        for obj in status_payloads:
            response = self.clients[obj['user']].patch(
                '/api/compliance_reports/{id}'.format(id=sid),
                content_type='application/json',
                data=json.dumps(obj['payload'])
            )
            self.assertEqual(response.status_code, 200)

    def create_mock_report(self, credit_transaction=None, director_status="Accepted", supplements=None):
        report = Mock(spec=ComplianceReport)
        report.credit_transaction = credit_transaction
        report.status = Mock()
        type(report.status).director_status_id = PropertyMock(return_value=director_status)
        report.supplements = supplements
        return report

    def create_mock_transaction(self, transaction_type, number_of_credits):
        transaction = Mock()
        transaction.type = Mock()
        type(transaction.type).the_type = PropertyMock(return_value=transaction_type)
        transaction.number_of_credits = number_of_credits
        return transaction

    def test_get_total_previous_credit_reductions_no_supplements(self):
        report = self.create_mock_report(supplements=None)
        assert ComplianceReportBaseSerializer.get_total_previous_credit_reductions(report) == Decimal('0.0')

    def test_get_total_previous_credit_reductions_single_reduction(self):
        transaction = self.create_mock_transaction('Credit Reduction', Decimal('10.0'))
        supplement = self.create_mock_report(credit_transaction=transaction, supplements=None)
        report = self.create_mock_report(supplements=supplement)
        
        assert ComplianceReportBaseSerializer.get_total_previous_credit_reductions(report) == Decimal('10.0')

    def test_get_total_previous_credit_reductions_multiple_reductions(self):
        transaction1 = self.create_mock_transaction('Credit Reduction', Decimal('10.0'))
        transaction2 = self.create_mock_transaction('Credit Reduction', Decimal('5.0'))
        supplement2 = self.create_mock_report(credit_transaction=transaction2, supplements=None)
        supplement1 = self.create_mock_report(credit_transaction=transaction1, supplements=supplement2)
        report = self.create_mock_report(supplements=supplement1)
        
        assert ComplianceReportBaseSerializer.get_total_previous_credit_reductions(report) == Decimal('15.0')

    def test_get_total_previous_credit_reductions_with_validation(self):
        transaction1 = self.create_mock_transaction('Credit Reduction', Decimal('10.0'))
        transaction2 = self.create_mock_transaction('Credit Validation', Decimal('3.0'))
        supplement2 = self.create_mock_report(credit_transaction=transaction2, supplements=None)
        supplement1 = self.create_mock_report(credit_transaction=transaction1, supplements=supplement2)
        report = self.create_mock_report(supplements=supplement1)
        
        assert ComplianceReportBaseSerializer.get_total_previous_credit_reductions(report) == Decimal('7.0')

    def test_get_total_previous_credit_reductions_ignore_non_accepted(self):
        transaction1 = self.create_mock_transaction('Credit Reduction', Decimal('10.0'))
        transaction2 = self.create_mock_transaction('Credit Reduction', Decimal('5.0'))
        supplement2 = self.create_mock_report(credit_transaction=transaction2, director_status="Rejected", supplements=None)
        supplement1 = self.create_mock_report(credit_transaction=transaction1, supplements=supplement2)
        report = self.create_mock_report(supplements=supplement1)
        
        assert ComplianceReportBaseSerializer.get_total_previous_credit_reductions(report) == Decimal('10.0')

    def test_get_supplemental_number_no_supplements(self):
        report = self.create_mock_report(supplements=None)
        assert ComplianceReportBaseSerializer.get_supplemental_number(report) == 0

    def test_get_supplemental_number_single_supplement(self):
        supplement = self.create_mock_report(supplements=None)
        report = self.create_mock_report(supplements=supplement)
        assert ComplianceReportBaseSerializer.get_supplemental_number(report) == 1

    def test_get_supplemental_number_multiple_supplements(self):
        supplement2 = self.create_mock_report(supplements=None)
        supplement1 = self.create_mock_report(supplements=supplement2)
        report = self.create_mock_report(supplements=supplement1)
        assert ComplianceReportBaseSerializer.get_supplemental_number(report) == 2