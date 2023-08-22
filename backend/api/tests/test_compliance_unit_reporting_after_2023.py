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
import logging
from decimal import Decimal

from django.utils import timezone
from rest_framework import status

from api.models.CompliancePeriod import CompliancePeriod
from api.models.ComplianceReport import ComplianceReport, ComplianceReportStatus, ComplianceReportType, \
    ComplianceReportWorkflowState
from api.models.Organization import Organization
from .base_test_case import BaseTestCase
from .payloads.compliance_unit_payloads import *

logger = logging.getLogger('supplemental_reporting')
logger.setLevel(logging.INFO)
handler = logging.StreamHandler()
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
handler.setFormatter(formatter)
logger.addHandler(handler)
COMPLIANCE_YEAR = '2023'

class TestComplianceUnitReporting(BaseTestCase):
    """Tests for the compliance unit reporting and supplemental reporting endpoints"""
    extra_fixtures = [
        'test/test_post_compliance_unit_reporting.json',
        'test/test_fuel_codes.json',
        'test/test_unit_of_measures.json',
        'test/test_carbon_intensity_limits.json',
        'test/test_default_carbon_intensities.json',
        'test/test_petroleum_carbon_intensities.json',
        'test/test_transaction_types.json'
    ]

    def _create_draft_compliance_report(self, report_type="Compliance Report"):
        report = ComplianceReport()
        report.status = ComplianceReportWorkflowState.objects.create(
            fuel_supplier_status=ComplianceReportStatus.objects.get_by_natural_key('Draft')
        )
        report.organization = Organization.objects.get_by_natural_key(
            "Test Org 1")
        report.compliance_period = CompliancePeriod.objects.get_by_natural_key(COMPLIANCE_YEAR)
        report.type = ComplianceReportType.objects.get_by_natural_key(report_type)
        report.create_timestamp = timezone.now()
        report.update_timestamp = timezone.now()

        report.save()
        report.refresh_from_db()
        return report.id

    def _add_part3_awards_to_org(self, add_credits):
        # Create a recommended credit trade request
        payload = {
            "compliancePeriod": CompliancePeriod.objects.get_by_natural_key(COMPLIANCE_YEAR).id,
            "initiator": self.users['gov_director'].organization.id,
            "numberOfCredits": add_credits,
            "respondent": self.users['fs_user_1'].organization.id,
            "status": self.statuses['recommended'].id,
            "tradeEffectiveDate": "2021-01-01",
            "type": self.credit_trade_types['part3award'].id,
            "is_rescinded": False,
            "zeroReason": None,
            "comment": "testing"
        }
        response = self.clients['gov_multi_role'].post(
            '/api/credit_trades',
            content_type='application/json',
            data=json.dumps(payload))
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        ct_id = response.data['id']
        # Approve the credit trade
        payload['status'] = self.statuses['approved'].id
        response = self.clients['gov_multi_role'].put(
            '/api/credit_trades/{}'.format(ct_id),
            content_type='application/json',
            data=json.dumps(payload))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def _create_supplemental_report(self, rid):
        payload = {
            'supplements': rid,
            'status': {'fuelSupplierStatus': 'Draft'},
            'type': 'Compliance Report',
            'compliancePeriod': COMPLIANCE_YEAR
        }
        response = self.clients['fs_user_1'].post(
            '/api/compliance_reports',
            content_type='application/json',
            data=json.dumps(payload)
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        sid = response.data['id']
        return sid

    def _patch_fs_user_for_compliance_report(self, payload, cr_id):
        response = self.clients['fs_user_1'].patch(
            '/api/compliance_reports/{id}'.format(id=cr_id),
            content_type='application/json',
            data=json.dumps(payload)
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        return response

    def _acceptance_from_director(self, cr_id):
        # we are only allowed to change one status at a time so this
        # loops the statuses in order to get to accepted by director
        status_payloads = [
            {'user': 'gov_analyst', 'payload': {'status': {'analystStatus': 'Recommended'}}},
            {'user': 'gov_manager', 'payload': {'status': {'managerStatus': 'Recommended'}}},
            {'user': 'gov_director', 'payload': {'status': {'directorStatus': 'Accepted'}}}
        ]
        for obj in status_payloads:
            response = self.clients[obj['user']].patch(
                '/api/compliance_reports/{id}'.format(id=cr_id),
                content_type='application/json',
                data=json.dumps(obj['payload'])
            )
            self.assertEqual(response.status_code, 200)

    """
    | Scenario 1: Initial Report - positive net balance                     |
    |-----------------------------------------------------------------------|---------------|-------------|-----------------|
    | Low Carbon Fuel Requirement Summary                                   |               |Calculations | Example Values  |
    |-----------------------------------------------------------------------|---------------|-------------|-----------------|
    | Net compliance unit balance for compliance period                     | Line 25       | Z           | 100             |
    | Available compliance unit balance on March 31, YYYY                   |               | A           | 800             |
    | Compliance unit balance change from assessment                        |               | X           | 100             |
    |                                      If Z>0, then Z; If Z<0 & A+Z>0, then Z; If Z<0 & A+Z<0, then -A|                 |               
    | Available compliance unit balance after assessment on March 31, YYYY  |               | A+X         | 900             |
    |-----------------------------------------------------------------------|---------------|-------------|-----------------|
    """
    def test_initial_report_positive_net_balance(self):
        self._add_part3_awards_to_org(800)
        rid = self._create_draft_compliance_report()
        # patch compliance report info
        payload = compliance_unit_positive_offset_payload
        payload['status']['fuelSupplierStatus'] = 'Draft'
        payload['scheduleB']['records'][0]['quantity'] = 117933  # credits of fuel supplied (from Schedule B)
        self._patch_fs_user_for_compliance_report(payload, rid)
        # Submit the compliance report
        payload = {'status': {'fuelSupplierStatus': 'Submitted'}}
        self._patch_fs_user_for_compliance_report(payload, rid)
        # retrieve the compliance report and validate the Summary report fields
        response = self.clients['fs_user_1'].get('/api/compliance_reports/{id}'.format(id=rid))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data.get('summary').get('lines').get('25'), 100)
        self.assertEqual(response.data.get('summary').get('lines').get('29A'), 800)
        self.assertEqual(response.data.get('summary').get('lines').get('29B'), 100)
        self.assertEqual(response.data.get('summary').get('lines').get('28'), 0)
        self.assertEqual(response.data.get('summary').get('lines').get('29C'), 900)

    """
    | Scenario 2: Initial Report - negative net balance, no penalty         |
    |-----------------------------------------------------------------------|---------------|-------------|-----------------|
    | Low Carbon Fuel Requirement Summary                                   |               |Calculations | Example Values  |
    |-----------------------------------------------------------------------|---------------|-------------|-----------------|
    | Net compliance unit balance for compliance period                     | Line 25       | Z           | -200            |
    | Available compliance unit balance on March 31, YYYY                   |               | A           | 700             |
    | Compliance unit balance change from assessment                        |               | X           | -200            |
    |                                      If Z>0, then Z; If Z<0 & A+Z>0, then Z; If Z<0 & A+Z<0, then -A|                 |
    | Available compliance unit balance after assessment on March 31, YYYY  |               | A+X         | 500             |
    |-----------------------------------------------------------------------|---------------|-------------|-----------------|
    """
    def test_initial_report_negative_net_balance_no_penalty(self):
        self._add_part3_awards_to_org(700)
        rid = self._create_draft_compliance_report()
        # patch compliance report info
        payload = compliance_unit_negative_offset_payload
        payload['status']['fuelSupplierStatus'] = 'Draft'
        payload['scheduleB']['records'][0]['quantity'] = 342238  # debits of fuel supplied (from Schedule B)
        payload['summary']['creditsOffset'] = -200  # credits of fuel supplied (from Schedule B)
        self._patch_fs_user_for_compliance_report(payload, rid)
        # Submit the compliance report
        payload = {
            'status': {'fuelSupplierStatus': 'Submitted'},
        }
        self._patch_fs_user_for_compliance_report(payload, rid)
        # retrieve the compliance report and validate the Summary report fields
        response = self.clients['fs_user_1'].get('/api/compliance_reports/{id}'.format(id=rid))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data.get('summary').get('lines').get('25'), -200)
        self.assertEqual(response.data.get('summary').get('lines').get('29A'), 700)
        self.assertEqual(response.data.get('summary').get('lines').get('29B'), -200)
        self.assertEqual(response.data.get('summary').get('lines').get('28'), 0)
        self.assertEqual(response.data.get('summary').get('lines').get('29C'), 500)

    """
    | Scenario 3: Initial Report - negative net balance with penalty        |
    |-----------------------------------------------------------------------|---------------|-------------|-----------------|
    | Low Carbon Fuel Requirement Summary                                   |               |Calculations | Example Values  |
    |-----------------------------------------------------------------------|---------------|-------------|-----------------|
    | Net compliance unit balance for compliance period                     | Line 25       | Z           | -400            |
    | Available compliance unit balance on March 31, YYYY                   |               | A           | 300             |
    | Compliance unit balance change from assessment                        |               | X           | -300            |
    |                               ^----  If Z>0, then Z; If Z<0 & A+Z>0, then Z; If Z<0 & A+Z<0, then -A|                 |
    | Non-compliance penalty payable (100 units * $600 CAD per unit)        | Line 28       |             | 60,000          |
    |                                                                           ^---- (abs(Z) - A) * $600 |                 |
    | Available compliance unit balance after assessment on March 31, YYYY  |               | A+X         | 0               |
    |-----------------------------------------------------------------------|---------------|-------------|-----------------|
    """
    def test_initial_report_negative_net_balance_with_penalty(self):
        self._add_part3_awards_to_org(300)
        rid = self._create_draft_compliance_report()
        # patch compliance report info
        payload = compliance_unit_negative_offset_payload
        payload['status']['fuelSupplierStatus'] = 'Draft'
        payload['scheduleB']['records'][0]['quantity'] = 684477  # debits of fuel supplied (from Schedule B)
        payload['summary']['creditsOffset'] = -300
        self._patch_fs_user_for_compliance_report(payload, rid)

        # Submit the compliance report
        payload = {
            'status': {'fuelSupplierStatus': 'Submitted'},
        }
        self._patch_fs_user_for_compliance_report(payload, rid)
        # retrieve the compliance report and validate the Summary report fields
        response = self.clients['fs_user_1'].get('/api/compliance_reports/{id}'.format(id=rid))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data.get('summary').get('lines').get('25'), -400)
        self.assertEqual(response.data.get('summary').get('lines').get('29A'), 300)
        self.assertEqual(response.data.get('summary').get('lines').get('29B'), -300)
        self.assertEqual(response.data.get('summary').get('lines').get('28'), 60000)
        self.assertEqual(response.data.get('summary').get('lines').get('29C'), 0)

    """
    | Scenario 4: Supplemental Report Submission #1, increasing, positive net balance, previous report was assessed             |
    |-----------------------------------------------------------------------|---------------|-------------|---------------------|--------------------|-----------------------|
    | Low Carbon Fuel Requirement Summary                                   |               |Calculations | Example Old Values  | Example New Values | Example Change Values |
    |-----------------------------------------------------------------------|---------------|-------------|---------------------|--------------------|-----------------------|
    | Net compliance unit balance for compliance period                     | Line 25       | Z           | 100                 | 250                | 150                   |
    | Available compliance unit balance on March 31, YYYY                   |               | A           | 800                 | 900                | 100                   |
    | Compliance unit balance change from assessment                        |               | X           | 100                 | 150                |                       |
    |                               ^----  If Z>0, then Z; If Z<0 & A+Z>0, then Z; If Z<0 & A+Z<0, then -A|                     |                    |                       |
    | Available compliance unit balance after assessment on March 31, YYYY  |               | A+X         | 900                 | 1,050              | 150                   |
    |-----------------------------------------------------------------------|---------------|-------------|---------------------|--------------------|-----------------------|
    """
    def test_supplemental_report_1_increasing_positive_net_balance_previous_report_assessed(self):
        self._add_part3_awards_to_org(800)
        rid = self._create_draft_compliance_report()
        # patch compliance report info
        payload = compliance_unit_positive_offset_payload
        payload['status']['fuelSupplierStatus'] = 'Draft'
        payload['scheduleB']['records'][0]['quantity'] = 117933  # credits of fuel supplied (from Schedule B)
        self._patch_fs_user_for_compliance_report(payload, rid)
        # Submit the compliance report
        payload = {
            'status': {'fuelSupplierStatus': 'Submitted'},
        }
        self._patch_fs_user_for_compliance_report(payload, rid)
        # Successful director acceptance
        self._acceptance_from_director(rid)
        # retrieve the compliance report and validate the Summary report fields
        response = self.clients['fs_user_1'].get('/api/compliance_reports/{id}/snapshot'.format(id=rid))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Decimal(response.data.get('summary').get('lines').get('25')), Decimal(100))
        self.assertEqual(Decimal(response.data.get('summary').get('lines').get('29A')), Decimal(800))
        self.assertEqual(Decimal(response.data.get('summary').get('lines').get('29B')), Decimal(100))
        self.assertEqual(Decimal(response.data.get('summary').get('lines').get('28')), Decimal(0))
        self.assertEqual(Decimal(response.data.get('summary').get('lines').get('29C')), Decimal(900))
        # Create supplemental report #1
        sid = self._create_supplemental_report(rid)
        payload = compliance_unit_positive_supplemental_payload
        payload['scheduleB']['records'][0]['quantity'] = 294833  # credits of fuel supplied (from Schedule B)
        self._patch_fs_user_for_compliance_report(payload, sid)
        # Successful director acceptance
        self._acceptance_from_director(rid)
        # retrieve the supplemental compliance report and validate the Summary report fields
        response = self.clients['fs_user_1'].get('/api/compliance_reports/{id}'.format(id=sid))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Decimal(response.data.get('summary').get('lines').get('25')), Decimal(250))
        self.assertEqual(Decimal(response.data.get('summary').get('lines').get('29A')), Decimal(900))
        self.assertEqual(Decimal(response.data.get('summary').get('lines').get('29B')), Decimal(150))
        self.assertEqual(Decimal(response.data.get('summary').get('lines').get('28')), Decimal(0))
        self.assertEqual(Decimal(response.data.get('summary').get('lines').get('29C')), Decimal(1050))

    """
    | Scenario 5: Supplemental Report Submission #4, decreasing, positive net balance, no penalty, previous report was assessed |
    |-----------------------------------------------------------------------|---------------|-------------|---------------------|--------------------|-----------------------|
    | Low Carbon Fuel Requirement Summary                                   |               |Calculations | Example Old Values  | Example New Values | Example Change Values |
    |-----------------------------------------------------------------------|---------------|-------------|---------------------|--------------------|-----------------------|
    | Net compliance unit balance for compliance period                     | Line 25       | Z           | 100                 | 50                 | -50                   |
    | Available compliance unit balance on March 31, YYYY                   |               | A           | 800                 | 900                | 100                   |
    | Compliance unit balance change from assessment                        |               | X           | 100                 | -50                |                       |
    |                               ^----  If Z>0, then Z; If Z<0 & A+Z>0, then Z; If Z<0 & A+Z<0, then -A|                     |                    |                       |
    | Available compliance unit balance after assessment on March 31, YYYY  |               | A+X         | 900                 | 850                | -50                   |
    |-----------------------------------------------------------------------|---------------|-------------|---------------------|--------------------|-----------------------|
    """
    def test_supplemental_report_4_decreasing_positive_net_balance_previous_report_assessed(self):
        self._add_part3_awards_to_org(800)
        rid = self._create_draft_compliance_report()
        # patch compliance report info
        payload = compliance_unit_positive_offset_payload
        payload['status']['fuelSupplierStatus'] = 'Draft'
        payload['scheduleB']['records'][0]['quantity'] = 117933  # credits of fuel supplied (from Schedule B)
        self._patch_fs_user_for_compliance_report(payload, rid)
        # Submit the compliance report
        payload = {
            'status': {'fuelSupplierStatus': 'Submitted'},
        }
        self._patch_fs_user_for_compliance_report(payload, rid)
        # Debug
        response = self.clients['fs_user_1'].get('/api/compliance_reports/{id}'.format(id=rid))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Debug
        # Successful director acceptance
        self._acceptance_from_director(rid)
        # retrieve the compliance report and validate the Summary report fields
        response = self.clients['fs_user_1'].get('/api/compliance_reports/{id}/snapshot'.format(id=rid))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Decimal(response.data.get('summary').get('lines').get('25')), Decimal(100))
        self.assertEqual(Decimal(response.data.get('summary').get('lines').get('29A')), Decimal(800))
        self.assertEqual(Decimal(response.data.get('summary').get('lines').get('29B')), Decimal(100))
        self.assertEqual(Decimal(response.data.get('summary').get('lines').get('28')), Decimal(0))
        self.assertEqual(Decimal(response.data.get('summary').get('lines').get('29C')), Decimal(900))
        # Create supplemental report #1
        sid = self._create_supplemental_report(rid)
        payload = compliance_unit_positive_supplemental_payload
        payload['scheduleB']['records'][0]['quantity'] = 58967  # credits of fuel supplied (from Schedule B)
        self._patch_fs_user_for_compliance_report(payload, sid)
        response = self.clients['fs_user_1'].get('/api/compliance_reports/{id}'.format(id=sid))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Decimal(response.data.get('summary').get('lines').get('25')), Decimal(50))
        self.assertEqual(Decimal(response.data.get('summary').get('lines').get('29A')), Decimal(900))
        self.assertEqual(Decimal(response.data.get('summary').get('lines').get('29B')), Decimal(-50))
        self.assertEqual(Decimal(response.data.get('summary').get('lines').get('28')), Decimal(0))
        self.assertEqual(Decimal(response.data.get('summary').get('lines').get('29C')), Decimal(850))

    """
    | Scenario 7: Supplemental Report Submission #1, increasing, negative net balance, no penalty, previous report was assessed |
    |-----------------------------------------------------------------------|---------------|-------------|---------------------|--------------------|-----------------------|
    | Low Carbon Fuel Requirement Summary                                   |               |Calculations | Example Old Values  | Example New Values | Example Change Values |
    |-----------------------------------------------------------------------|---------------|-------------|---------------------|--------------------|-----------------------|
    | Net compliance unit balance for compliance period                     | Line 25       | Z           | -200                | -100               | 100                   |
    | Available compliance unit balance on March 31, YYYY                   |               | A           | 800                 | 600                | -200                  |
    | Compliance unit balance change from assessment                        |               | X           | -200                | 100                |                       |
    |                               ^----  If Z>0, then Z; If Z<0 & A+Z>0, then Z; If Z<0 & A+Z<0, then -A|                     |                    |                       |
    | Available compliance unit balance after assessment on March 31, YYYY  |               | A+X         | 600                 | 700                | 100                   |
    |-----------------------------------------------------------------------|---------------|-------------|---------------------|--------------------|-----------------------|
    """
    def test_supplemental_report_1_increasing_negative_net_balance_no_penalty_previous_report_assessed(self):
        self._add_part3_awards_to_org(800)
        rid = self._create_draft_compliance_report()
        # patch compliance report info
        payload = compliance_unit_negative_offset_payload
        payload['status']['fuelSupplierStatus'] = 'Draft'
        payload['scheduleB']['records'][0]['quantity'] = 342238  # debits of fuel supplied (from Schedule B)
        payload['summary']['creditsOffset'] = -200
        self._patch_fs_user_for_compliance_report(payload, rid)
        # Submit the compliance report
        payload = {
            'status': {'fuelSupplierStatus': 'Submitted'},
        }
        self._patch_fs_user_for_compliance_report(payload, rid)
        # Debug
        response = self.clients['fs_user_1'].get('/api/compliance_reports/{id}'.format(id=rid))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Debug
        # Successful director acceptance
        self._acceptance_from_director(rid)
        # retrieve the compliance report and validate the Summary report fields
        response = self.clients['fs_user_1'].get('/api/compliance_reports/{id}/snapshot'.format(id=rid))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Decimal(response.data.get('summary').get('lines').get('25')), Decimal(-200))
        self.assertEqual(Decimal(response.data.get('summary').get('lines').get('29A')), Decimal(800))
        self.assertEqual(Decimal(response.data.get('summary').get('lines').get('29B')), Decimal(-200))
        self.assertEqual(Decimal(response.data.get('summary').get('lines').get('28')), Decimal(0))
        self.assertEqual(Decimal(response.data.get('summary').get('lines').get('29C')), Decimal(600))
        # Create supplemental report #1
        sid = self._create_supplemental_report(rid)
        payload = compliance_unit_negative_supplemental_payload
        payload['scheduleB']['records'][0]['quantity'] = 171119  # debits of fuel supplied (from Schedule B)
        payload['summary']['creditsOffset'] = -100
        self._patch_fs_user_for_compliance_report(payload, sid)
        response = self.clients['fs_user_1'].get('/api/compliance_reports/{id}'.format(id=sid))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Decimal(response.data.get('summary').get('lines').get('25')), Decimal(-100))
        self.assertEqual(Decimal(response.data.get('summary').get('lines').get('29A')), Decimal(600))
        self.assertEqual(Decimal(response.data.get('summary').get('lines').get('29B')), Decimal(100))
        self.assertEqual(Decimal(response.data.get('summary').get('lines').get('28')), Decimal(0))
        self.assertEqual(Decimal(response.data.get('summary').get('lines').get('29C')), Decimal(700))

    """
    | Scenario 8: Supplemental Report Submission #1, increasing, negative net balance, with penalty, previous report was assessed                    |
    |-----------------------------------------------------------------------|---------------|-------------|---------------------|--------------------|-----------------------|
    | Low Carbon Fuel Requirement Summary                                   |               |Calculations | Example Old Values  | Example New Values | Example Change Values |
    |-----------------------------------------------------------------------|---------------|-------------|---------------------|--------------------|-----------------------|
    | Net compliance unit balance for compliance period                     | Line 25       | Z           | -400                | -350               | 50                    |
    | Available compliance unit balance on March 31, YYYY                   |               | A           | 100                 | 0                  | -100                  |
    | Compliance unit balance change from assessment                        |               | X           | -100                | 50                 |                       |
    |                               ^----  If Z>0, then Z; If Z<0 & A+Z>0, then Z; If Z<0 & A+Z<0, then -A|                     |                    |                       |
    | Non-compliance penalty payable (250 units * $600 CAD per unit)        | Line 28       |             | $180,000            | $150,000           | -$30,000              |
    |                                                                           ^---- (abs(Z) - A) * $600 |                     |                    |                       |
    | Available compliance unit balance after assessment on March 31, YYYY  |               | A+X         | 0                   | 0                  | 0                     |
    |-----------------------------------------------------------------------|---------------|-------------|---------------------|--------------------|-----------------------|
    """
    def test_supplemental_report_1_increasing_negative_net_balance_penalty_previous_report_assessed(self):
        self._add_part3_awards_to_org(100)
        rid = self._create_draft_compliance_report()
        # patch compliance report info
        payload = compliance_unit_negative_offset_payload
        payload['status']['fuelSupplierStatus'] = 'Draft'
        payload['scheduleB']['records'][0]['quantity'] = 684477  # debits of fuel supplied (from Schedule B)
        payload['summary']['creditsOffset'] = -400
        self._patch_fs_user_for_compliance_report(payload, rid)
        # Submit the compliance report
        payload = {
            'status': {'fuelSupplierStatus': 'Submitted'},
        }
        self._patch_fs_user_for_compliance_report(payload, rid)
        # Debug
        response = self.clients['fs_user_1'].get('/api/compliance_reports/{id}'.format(id=rid))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Debug
        # Successful director acceptance
        self._acceptance_from_director(rid)
        # retrieve the compliance report and validate the Summary report fields
        response = self.clients['fs_user_1'].get('/api/compliance_reports/{id}/snapshot'.format(id=rid))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Decimal(response.data.get('summary').get('lines').get('25')), Decimal(-400))
        self.assertEqual(Decimal(response.data.get('summary').get('lines').get('29A')), Decimal(100))
        self.assertEqual(Decimal(response.data.get('summary').get('lines').get('29B')), Decimal(-100))
        self.assertEqual(Decimal(response.data.get('summary').get('lines').get('28')), Decimal(180000))
        self.assertEqual(Decimal(response.data.get('summary').get('lines').get('29C')), Decimal(0))
        # Create supplemental report #1
        sid = self._create_supplemental_report(rid)
        payload = compliance_unit_negative_supplemental_payload
        payload['scheduleB']['records'][0]['quantity'] = 598917  # debits of fuel supplied (from Schedule B)
        payload['summary']['creditsOffset'] = -350
        self._patch_fs_user_for_compliance_report(payload, sid)
        response = self.clients['fs_user_1'].get('/api/compliance_reports/{id}'.format(id=sid))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Decimal(response.data.get('summary').get('lines').get('25')), Decimal(-350))
        self.assertEqual(Decimal(response.data.get('summary').get('lines').get('29A')), Decimal(0))
        self.assertEqual(Decimal(response.data.get('summary').get('lines').get('29B')), Decimal(50))
        self.assertEqual(Decimal(response.data.get('summary').get('lines').get('28')), Decimal(150000))
        self.assertEqual(Decimal(response.data.get('summary').get('lines').get('29C')), Decimal(0))

    """
    | Scenario 9: Supplemental Report Submission #1, decreasing, negative net balance, no penalty, previous report was assessed |
    |-----------------------------------------------------------------------|---------------|-------------|---------------------|--------------------|-----------------------|
    | Low Carbon Fuel Requirement Summary                                   |               |Calculations | Example Old Values  | Example New Values | Example Change Values |
    |-----------------------------------------------------------------------|---------------|-------------|---------------------|--------------------|-----------------------|
    | Net compliance unit balance for compliance period                     | Line 25       | Z           | -200                | -300               | -100                  |
    | Available compliance unit balance on March 31, YYYY                   |               | A           | 800                 | 600                | -200                  |
    | Compliance unit balance change from assessment                        |               | X           | -200                | -100               |                       |
    |                               ^----  If Z>0, then Z; If Z<0 & A+Z>0, then Z; If Z<0 & A+Z<0, then -A|                     |                    |                       |
    | Available compliance unit balance after assessment on March 31, YYYY  |               | A+X         | 600                 | 500                | -100                  |
    |-----------------------------------------------------------------------|---------------|-------------|---------------------|--------------------|-----------------------|
    """
    def test_supplemental_report_1_decreasing_negative_net_balance_no_penalty_previous_report_assessed(self):
        self._add_part3_awards_to_org(800)
        rid = self._create_draft_compliance_report()
        # patch compliance report info
        payload = compliance_unit_negative_offset_payload
        payload['status']['fuelSupplierStatus'] = 'Draft'
        payload['scheduleB']['records'][0]['quantity'] = 342238  # debits of fuel supplied (from Schedule B)
        payload['summary']['creditsOffset'] = -200
        self._patch_fs_user_for_compliance_report(payload, rid)
        # Submit the compliance report
        payload = {
            'status': {'fuelSupplierStatus': 'Submitted'},
        }
        self._patch_fs_user_for_compliance_report(payload, rid)
        # Debug
        response = self.clients['fs_user_1'].get('/api/compliance_reports/{id}'.format(id=rid))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Debug
        # Successful director acceptance
        self._acceptance_from_director(rid)
        # retrieve the compliance report and validate the Summary report fields
        response = self.clients['fs_user_1'].get('/api/compliance_reports/{id}/snapshot'.format(id=rid))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Decimal(response.data.get('summary').get('lines').get('25')), Decimal(-200))
        self.assertEqual(Decimal(response.data.get('summary').get('lines').get('29A')), Decimal(800))
        self.assertEqual(Decimal(response.data.get('summary').get('lines').get('29B')), Decimal(-200))
        self.assertEqual(Decimal(response.data.get('summary').get('lines').get('28')), Decimal(0))
        self.assertEqual(Decimal(response.data.get('summary').get('lines').get('29C')), Decimal(600))
        # Create supplemental report #1
        sid = self._create_supplemental_report(rid)
        payload = compliance_unit_negative_supplemental_payload
        payload['scheduleB']['records'][0]['quantity'] = 513358  # debits of fuel supplied (from Schedule B)
        payload['summary']['creditsOffset'] = -300
        self._patch_fs_user_for_compliance_report(payload, sid)
        response = self.clients['fs_user_1'].get('/api/compliance_reports/{id}'.format(id=sid))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Decimal(response.data.get('summary').get('lines').get('25')), Decimal(-300))
        self.assertEqual(Decimal(response.data.get('summary').get('lines').get('29A')), Decimal(600))
        self.assertEqual(Decimal(response.data.get('summary').get('lines').get('29B')), Decimal(-100))
        self.assertEqual(Decimal(response.data.get('summary').get('lines').get('28')), Decimal(0))
        self.assertEqual(Decimal(response.data.get('summary').get('lines').get('29C')), Decimal(500))

    """
    | Scenario 11: Supplemental Report Submission #1, increasing, negative net balance to positive net balance, no penalty, previous report was assessed                     |
    |-----------------------------------------------------------------------|---------------|-------------|---------------------|--------------------|-----------------------|
    | Low Carbon Fuel Requirement Summary                                   |               |Calculations | Example Old Values  | Example New Values | Example Change Values |
    |-----------------------------------------------------------------------|---------------|-------------|---------------------|--------------------|-----------------------|
    | Net compliance unit balance for compliance period                     | Line 25       | Z           | -300                | 200                | 500                   |
    | Available compliance unit balance on March 31, YYYY                   |               | A           | 500                 | 200                | -300                  |
    | Compliance unit balance change from assessment                        |               | X           | -300                | 500                |                       |
    |                               ^----  If Z>0, then Z; If Z<0 & A+Z>0, then Z; If Z<0 & A+Z<0, then -A|                     |                    |                       |
    | Available compliance unit balance after assessment on March 31, YYYY  |               | A+X         | 200                 | 700                | 500                   |
    |-----------------------------------------------------------------------|---------------|-------------|---------------------|--------------------|-----------------------|
    """
    def test_supplemental_report_1_increasing_negative_net_balance_to_positive_no_penalty_previous_report_assessed(self):
        self._add_part3_awards_to_org(500)
        rid = self._create_draft_compliance_report()
        # patch compliance report info
        payload = compliance_unit_negative_offset_payload
        payload['status']['fuelSupplierStatus'] = 'Draft'
        payload['scheduleB']['records'][0]['quantity'] = 513358  # debits of fuel supplied (from Schedule B)
        payload['summary']['creditsOffset'] = -300
        self._patch_fs_user_for_compliance_report(payload, rid)
        # Submit the compliance report
        payload = {
            'status': {'fuelSupplierStatus': 'Submitted'},
        }
        self._patch_fs_user_for_compliance_report(payload, rid)
        # Debug
        response = self.clients['fs_user_1'].get('/api/compliance_reports/{id}'.format(id=rid))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Debug
        # Successful director acceptance
        self._acceptance_from_director(rid)
        # retrieve the compliance report and validate the Summary report fields
        response = self.clients['fs_user_1'].get('/api/compliance_reports/{id}/snapshot'.format(id=rid))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Decimal(response.data.get('summary').get('lines').get('25')), Decimal(-300))
        self.assertEqual(Decimal(response.data.get('summary').get('lines').get('29A')), Decimal(500))
        self.assertEqual(Decimal(response.data.get('summary').get('lines').get('29B')), Decimal(-300))
        self.assertEqual(Decimal(response.data.get('summary').get('lines').get('28')), Decimal(0))
        self.assertEqual(Decimal(response.data.get('summary').get('lines').get('29C')), Decimal(200))
        # Create supplemental report #1
        sid = self._create_supplemental_report(rid)
        payload = compliance_unit_positive_supplemental_payload
        payload['scheduleB']['records'][0]['quantity'] = 235867  # credits of fuel supplied (from Schedule B)
        self._patch_fs_user_for_compliance_report(payload, sid)
        response = self.clients['fs_user_1'].get('/api/compliance_reports/{id}'.format(id=sid))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Decimal(response.data.get('summary').get('lines').get('25')), Decimal(200))
        self.assertEqual(Decimal(response.data.get('summary').get('lines').get('29A')), Decimal(200))
        self.assertEqual(Decimal(response.data.get('summary').get('lines').get('29B')), Decimal(500))
        self.assertEqual(Decimal(response.data.get('summary').get('lines').get('28')), Decimal(0))
        self.assertEqual(Decimal(response.data.get('summary').get('lines').get('29C')), Decimal(700))

    """
    | Scenario 12: Supplemental Report Submission #1, decreasing, positive net balance to negative net balance, with penalty, previous report was assessed                   |
    |-----------------------------------------------------------------------|---------------|-------------|---------------------|--------------------|-----------------------|
    | Low Carbon Fuel Requirement Summary                                   |               |Calculations | Example Old Values  | Example New Values | Example Change Values |
    |-----------------------------------------------------------------------|---------------|-------------|---------------------|--------------------|-----------------------|
    | Net compliance unit balance for compliance period                     | Line 25       | Z           | 200                 | -100               | -300                  |
    | Available compliance unit balance on March 31, YYYY                   |               | A           | 0                   | 200                | 200                   |
    | Compliance unit balance change from assessment                        |               | X           | 200                 | -200               |                       |
    |                               ^----  If Z>0, then Z; If Z<0 & A+Z>0, then Z; If Z<0 & A+Z<0, then -A|                     |                    |                       |
    | Non-compliance penalty payable (250 units * $600 CAD per unit)        | Line 28       |             |                     | $60,000            | $60,000               |
    |                                                                           ^---- (abs(Z) - A) * $600 |                     |                    |                       |
    | Available compliance unit balance after assessment on March 31, YYYY  |               | A+X         | 200                 | 0                  | -200                  |
    |-----------------------------------------------------------------------|---------------|-------------|---------------------|--------------------|-----------------------|
    """
    def test_supplemental_report_1_decreasing_positive_net_balance_to_negative_penalty_previous_report_assessed(self):
        rid = self._create_draft_compliance_report()
        # patch compliance report info
        payload = compliance_unit_positive_offset_payload
        payload['status']['fuelSupplierStatus'] = 'Draft'
        payload['scheduleB']['records'][0]['quantity'] = 235867  # credits of fuel supplied (from Schedule B)
        self._patch_fs_user_for_compliance_report(payload, rid)
        # Submit the compliance report
        payload = {
            'status': {'fuelSupplierStatus': 'Submitted'},
        }
        self._patch_fs_user_for_compliance_report(payload, rid)
        # Debug
        response = self.clients['fs_user_1'].get('/api/compliance_reports/{id}'.format(id=rid))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Debug
        # Successful director acceptance
        self._acceptance_from_director(rid)
        # retrieve the compliance report and validate the Summary report fields
        response = self.clients['fs_user_1'].get('/api/compliance_reports/{id}/snapshot'.format(id=rid))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Decimal(response.data.get('summary').get('lines').get('25')), Decimal(200))
        self.assertEqual(Decimal(response.data.get('summary').get('lines').get('29A')), Decimal(0))
        self.assertEqual(Decimal(response.data.get('summary').get('lines').get('29B')), Decimal(200))
        self.assertEqual(Decimal(response.data.get('summary').get('lines').get('28')), Decimal(0))
        self.assertEqual(Decimal(response.data.get('summary').get('lines').get('29C')), Decimal(200))
        # Create supplemental report #1
        sid = self._create_supplemental_report(rid)
        payload = compliance_unit_negative_supplemental_payload
        payload['scheduleB']['records'][0]['quantity'] = 171119  # debits of fuel supplied (from Schedule B)
        payload['summary']['creditsOffset'] = -100
        self._patch_fs_user_for_compliance_report(payload, sid)
        response = self.clients['fs_user_1'].get('/api/compliance_reports/{id}'.format(id=sid))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Decimal(response.data.get('summary').get('lines').get('25')), Decimal(-100))
        self.assertEqual(Decimal(response.data.get('summary').get('lines').get('29A')), Decimal(200))
        self.assertEqual(Decimal(response.data.get('summary').get('lines').get('29B')), Decimal(-200))
        self.assertEqual(Decimal(response.data.get('summary').get('lines').get('28')), Decimal(60000))
        self.assertEqual(Decimal(response.data.get('summary').get('lines').get('29C')), Decimal(0))
