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

from django.utils import timezone
from rest_framework import status

from api.models.CompliancePeriod import CompliancePeriod
from api.models.ComplianceReport import ComplianceReport, ComplianceReportStatus, ComplianceReportType, \
    ComplianceReportWorkflowState
from api.models.Organization import Organization
from .base_test_case import BaseTestCase
from .payloads.compliance_unit_payloads import *
from ..services.OrganizationService import OrganizationService

logger = logging.getLogger('supplemental_reporting')
logger.setLevel(logging.INFO)
handler = logging.StreamHandler()
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
handler.setFormatter(formatter)
logger.addHandler(handler)


class TestComplianceUnitReporting(BaseTestCase):
    """Tests for the compliance unit reporting and supplemental reporting endpoints"""
    extra_fixtures = [
        'test/test_pre_compliance_unit_reporting.json',
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
        report.compliance_period = CompliancePeriod.objects.get_by_natural_key('2022')
        report.type = ComplianceReportType.objects.get_by_natural_key(report_type)
        report.create_timestamp = timezone.now()
        report.update_timestamp = timezone.now()

        report.save()
        report.refresh_from_db()
        return report.id

    def _add_part3_awards_to_org(self, add_credits):
        # Create a recommended credit trade request
        payload = {
            "compliancePeriod": CompliancePeriod.objects.get_by_natural_key('2022').id,
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
            'compliancePeriod': '2022'
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
    | Scenario 0: Initial Report in a net credit position                                              |
    |--------------------------------------------------------------------------------------------------|
    | Line | Description                                                 | Units       | Example Value |
    |------|-------------------------------------------------------------|-------------|---------------|
    | 23   | Total credits from fuel supplied (from Schedule B)          | Credits     | 100,000       |
    | 24   | Total debits from fuel supplied (from Schedule B)           | (Debits)    | 80,000        |
    | 25   | Net credit or debit balance for the compliance period       | Credits     | 20,000        |
    | 26   | Total banked credits used to offset outstanding debits      | Credits     |               |
    | 27   | Outstanding debit balance                                   | (Debits)    |               |
    | 28   | Part 3 non-compliance penalty payable                       | $CAD        |               |
    |------|-------------------------------------------------------------|-------------|---------------|
    |      | Corresponding Compliance Unit conversion / transaction      |             | +20,000       |
    """
    def test_initial_report_in_net_credit_position(self):
        rid = self._create_draft_compliance_report()
        # patch compliance report info
        payload = compliance_unit_initial_payload.copy()
        payload['status']['fuelSupplierStatus'] = 'Submitted'
        self._patch_fs_user_for_compliance_report(payload, rid)
        # Successful director acceptance
        self._acceptance_from_director(rid)
        response = self.clients['fs_user_1'].get('/api/compliance_reports/{id}'.format(id=rid))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # compliance unit balance check
        self.assertEqual(min(response.data.get('max_credit_offset'), response.data.get('max_credit_offset_exclude_reserved')), 20000)
        self.assertEqual(response.data.get('summary').get('lines').get('25'), 20000.0)

    """
    | Scenario 1: Initial Report in a net debit position                                               |
    |--------------------------------------------------------------------------------------------------|
    | Line | Description                                                 | Units       | Example Value |
    |------|-------------------------------------------------------------|-------------|---------------|
    | 23   | Total credits from fuel supplied (from Schedule B)          | Credits     | 105,000       |
    | 24   | Total debits from fuel supplied (from Schedule B)           | (Debits)    | 150,000       |
    | 25   | Net credit or debit balance for the compliance period       | (Debits)    | -45,000       |
    | 26   | Total banked credits used to offset outstanding debits      | Credits     |  45,000       |
    | 27   | Outstanding debit balance                                   | (Debits)    |       0       |
    | 28   | Part 3 non-compliance penalty payable                       | $CAD        |               |
    |------|-------------------------------------------------------------|-------------|---------------|
    |      | Corresponding Compliance Unit conversion / transaction      |             | -45,000       |
    """
    def test_initial_report_in_net_debit_position(self):
        rid = self._create_draft_compliance_report()
        # patch compliance report info
        payload = compliance_unit_initial_payload
        payload['status']['fuelSupplierStatus'] = 'Draft'
        payload['scheduleB']['records'][0]['quantity'] = 123830000  # credits of fuel supplied (from Schedule B)
        payload['scheduleB']['records'][1]['quantity'] = 256679000  # debits of fuel supplied (from Schedule B)
        self._patch_fs_user_for_compliance_report(payload, rid)
        self._add_part3_awards_to_org(50000)
        # Submit the compliance report
        payload = {
            'status': {'fuelSupplierStatus': 'Submitted'},
            'summary': {
                'creditsOffset': 45000,
            }
        }
        self._patch_fs_user_for_compliance_report(payload, rid)
        # Successful director acceptance
        self._acceptance_from_director(rid)
        # retrieve the compliance report and validate the Summary report fields
        response = self.clients['fs_user_1'].get('/api/compliance_reports/{id}'.format(id=rid))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # compliance unit balance check (50,000 - 45,000) [50,000 from org balance)
        self.assertEqual(min(response.data.get('max_credit_offset'), response.data.get('max_credit_offset_exclude_reserved')), 5000)
        self.assertEqual(response.data.get('summary').get('lines').get('25'), -45000.0)
        self.assertEqual(response.data.get('summary').get('lines').get('26'), 45000.0)

    """
    | Scenario 2: Supplemental Report Submission #1 that increases debit obligation                                                                                                                                     |
    |-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
    | Part 3 - Low Carbon Fuel Requirement Summary                              | Line    |              | Units                               | Example Values - Initial Submission | Example Values - Supplemental #1 |
    |---------------------------------------------------------------------------|---------|--------------|-------------------------------------|-------------------------------------|----------------------------------|
    | Total credits from fuel supplied (from Schedule B)                        | Line 23 | X            | Credits                             | 100,000                             | 100,000                          |
    | Total debits from fuel supplied (from Schedule B)                         | Line 24 | Y            | (Debits)                            | 145,000                             | 150,000                          |
    | Net credit or debit balance for compliance period                         | Line 25 | Z            | Credits (Debits)                    | -45,000                             | -50,000                          |
    | Total banked credits used to offset outstanding debits (if applicable)    | Line 26 | A+B          | Credits                             | 45,000                              | 50,000                           |
    | Banked credits used to offset outstanding debits - Previous Reports       | Line 26a| A            | Credits                             | n/a                                 | 45,000                           |
    | Banked credits used to offset outstanding debits - Supplemental Report #1 | Line 26b| B (editable) | Credits                             | n/a                                 | 5,000                            |
    | Outstanding debit balance                                                 | Line 27 | Z - (A+B)    | (Debits)                            | 0                                   | 0                                |
    | Part 3 non-compliance penalty payable                                     | Line 28 |              | $CAD                                |                                     |                                  |
    |---------------------------------------------------------------------------|---------|--------------|-------------------------------------|-------------------------------------|----------------------------------|
    | Report Status (for compliance units conversion)                           |         |              |                                     | Accepted                            | Accepted                         |
    | Corresponding Compliance Unit conversion / transaction                    |         |              |                                     | -45,000                             | -5,000                           |
    """
    def test_supplemental_report_submission_increasing_debit_obligation(self):
        rid = self._create_draft_compliance_report()
        # patch compliance report info
        payload = compliance_unit_initial_payload
        payload['status']['fuelSupplierStatus'] = 'Draft'
        payload['scheduleB']['records'][0]['quantity'] = 117933318  # credits of fuel supplied (from Schedule B)
        payload['scheduleB']['records'][1]['quantity'] = 248122823  # debits of fuel supplied (from Schedule B)
        self._patch_fs_user_for_compliance_report(payload, rid)
        self._add_part3_awards_to_org(50000)
        # Submit the compliance report
        payload = {
            'status': {'fuelSupplierStatus': 'Submitted'},
            'summary': {
                'creditsOffset': 45000,
            }
        }
        self._patch_fs_user_for_compliance_report(payload, rid)
        # Successful director acceptance
        self._acceptance_from_director(rid)
        # retrieve the compliance report and validate the Summary report fields
        response = self.clients['fs_user_1'].get('/api/compliance_reports/{id}'.format(id=rid))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # compliance unit balance check (50,000 - 45,000) [50,000 from org balance)
        self.assertEqual(min(response.data.get('max_credit_offset'), response.data.get('max_credit_offset_exclude_reserved')), 5000)
        self.assertEqual(response.data.get('summary').get('lines').get('25'), -45000.0)
        self.assertEqual(response.data.get('summary').get('lines').get('26'), 45000.0)
        # Create supplemental report #1
        sid = self._create_supplemental_report(rid)
        payload = compliance_unit_supplemental_payload
        payload['scheduleB']['records'][0]['quantity'] = 117933318  # credits of fuel supplied (from Schedule B)
        payload['scheduleB']['records'][1]['quantity'] = 256678782  # debits of fuel supplied (from Schedule B)
        payload['summary']['creditsOffset'] = 50000
        payload['summary']['creditsOffsetA'] = 45000
        payload['summary']['creditsOffsetB'] = 5000
        self._patch_fs_user_for_compliance_report(payload, sid)
        response = self.clients['fs_user_1'].get('/api/compliance_reports/{id}'.format(id=sid))
        # Successful director acceptance for supplemental report #1
        self._acceptance_from_director(sid)
        # retrieve the compliance report and validate the Summary report fields
        response = self.clients['fs_user_1'].get('/api/compliance_reports/{id}'.format(id=sid))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # compliance unit balance check (5000 - 5000) [5000 from org balance)
        self.assertEqual(
            min(response.data.get('max_credit_offset'), response.data.get('max_credit_offset_exclude_reserved')), 0)
        self.assertEqual(response.data['summary']['lines']['25'], -50000.0)
        self.assertEqual(response.data['summary']['lines']['26'], 50000.0)
        self.assertEqual(response.data['summary']['lines']['26A'], 45000.0)
        self.assertEqual(response.data['summary']['lines']['26B'], 5000.0)

    """
    | Scenario 3: Supplemental Report Submission #2 that increases debit obligation - Example 1                                            |
    |--------------------------------------------------------------------------------------------------------------------------------------|
    | Part 3 - Low Carbon Fuel Requirement Summary                              | Line     |               | Units                         | Initial Submission - Accepted          | Example 1 - Supplemental #1 - Accepted | Example 1 - Supplemental #2 - Accepted |
    |---------------------------------------------------------------------------|----------|---------------|-------------------------------|----------------------------------------|----------------------------------------|----------------------------------------|
    | Total credits from fuel supplied (from Schedule B)                        | Line 23  | X             | Credits                       | 100,000                                | 100,000                                | 100,000                                |
    | Total debits from fuel supplied (from Schedule B)                         | Line 24  | Y             | (Debits)                      | 145,000                                | 148,000                                | 150,000                                |
    | Net credit or debit balance for compliance period                         | Line 25  | Z             | Credits (Debits)              | -45,000                                | -48,000                                | -50,000                                |
    | Total banked credits used to offset outstanding debits (if applicable)    | Line 26  | A+B+C+D       | Credits                       | 45,000                                 | 48,000                                 | 50,000                                 |
    | Banked credits used to offset outstanding debits - Previous Reports       | Line 26a | A+B+C         | Credits                       | n/a                                    | 45,000                                 | 48,000                                 |
    | Banked credits used to offset outstanding debits - Supplemental Report #2 | Line 26b | D (editable)  | Credits                       | n/a                                    | 3,000                                  | 2,000                                  |
    | Outstanding debit balance                                                 | Line 27  | Z - (A+B+C+D) | (Debits)                      | 0                                      | 0                                      | 0                                      |
    | Part 3 non-compliance penalty payable                                     | Line 28  |               | $CAD                          | $-                                     | $-                                     | $-                                     |
    | Report Status (for compliance units conversion)                           |          |               |                               | Accepted                               | Accepted                               | Accepted                               |
    | Corresponding Compliance Unit conversion / transaction                    |          |               |                               | -45,000                                | -3,000                                 | -2,000                                 |
    """
    def test_supplemental_report_submission_2_ex1_increasing_debit_obligation(self):
        rid = self._create_draft_compliance_report()
        # patch compliance report info
        payload = compliance_unit_initial_payload
        payload['status']['fuelSupplierStatus'] = 'Draft'
        payload['scheduleB']['records'][0]['quantity'] = 117933318  # credits of fuel supplied (from Schedule B)
        payload['scheduleB']['records'][1]['quantity'] = 248122823  # debits of fuel supplied (from Schedule B)
        self._patch_fs_user_for_compliance_report(payload, rid)
        self._add_part3_awards_to_org(50000)
        # Submit the compliance report
        payload = {
            'status': {'fuelSupplierStatus': 'Submitted'},
            'summary': {
                'creditsOffset': 45000,
            }
        }
        self._patch_fs_user_for_compliance_report(payload, rid)
        # Successful director acceptance
        self._acceptance_from_director(rid)
        # retrieve the compliance report and validate the Summary report fields
        response = self.clients['fs_user_1'].get('/api/compliance_reports/{id}'.format(id=rid))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # compliance unit balance check (50,000 - 45,000) [50,000 from org balance]
        self.assertEqual(min(response.data.get('max_credit_offset'), response.data.get('max_credit_offset_exclude_reserved')), 5000)
        self.assertEqual(response.data.get('summary').get('lines').get('25'), -45000.0)
        self.assertEqual(response.data.get('summary').get('lines').get('26'), 45000.0)
        # Create supplemental report #1
        sid1 = self._create_supplemental_report(rid)
        payload = compliance_unit_supplemental_payload
        payload['scheduleB']['records'][0]['quantity'] = 117933318  # credits of fuel supplied (from Schedule B)
        payload['scheduleB']['records'][1]['quantity'] = 253256398  # debits of fuel supplied (from Schedule B)
        payload['summary']['creditsOffset'] = 48000
        payload['summary']['creditsOffsetA'] = 45000
        payload['summary']['creditsOffsetB'] = 3000
        self._patch_fs_user_for_compliance_report(payload, sid1)
        # Successful director acceptance for supplemental report #1
        self._acceptance_from_director(sid1)
        # retrieve the compliance report and validate the Summary report fields
        response = self.clients['fs_user_1'].get('/api/compliance_reports/{id}'.format(id=sid1))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['summary']['lines']['25'], -48000.0)
        self.assertEqual(response.data['summary']['lines']['26'], 48000.0)
        self.assertEqual(response.data['summary']['lines']['26A'], 45000.0)
        self.assertEqual(response.data['summary']['lines']['26B'], 3000.0)
        # compliance unit balance check (5000 - 3000) [5000 from org balance]
        self.assertEqual(min(response.data.get('max_credit_offset'), response.data.get('max_credit_offset_exclude_reserved')), 2000)
        # Create supplemental report #2
        sid2 = self._create_supplemental_report(sid1)
        payload['scheduleB']['records'][0]['quantity'] = 117933318  # credits of fuel supplied (from Schedule B)
        payload['scheduleB']['records'][1]['quantity'] = 256678782  # debits of fuel supplied (from Schedule B)
        payload['summary']['creditsOffset'] = 50000
        payload['summary']['creditsOffsetA'] = 48000
        payload['summary']['creditsOffsetB'] = 2000
        self._patch_fs_user_for_compliance_report(payload, sid2)
        response = self.clients['fs_user_1'].get('/api/compliance_reports/{id}'.format(id=sid2))
        # Successful director acceptance for supplemental report #1
        self._acceptance_from_director(sid2)
        # retrieve the compliance report and validate the Summary report fields
        response = self.clients['fs_user_1'].get('/api/compliance_reports/{id}'.format(id=sid2))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['summary']['lines']['25'], -50000.0)
        self.assertEqual(response.data['summary']['lines']['26'], 50000.0)
        self.assertEqual(response.data['summary']['lines']['26A'], 48000.0)
        self.assertEqual(response.data['summary']['lines']['26B'], 2000.0)
        # compliance unit balance check (2000 - 2000) [2000 from org balance]
        self.assertEqual(min(response.data.get('max_credit_offset'), response.data.get('max_credit_offset_exclude_reserved')), 0)

    """
    | Scenario 3: Supplemental Report Submission #2 that increases debit obligation - Example 2                                            |
    |--------------------------------------------------------------------------------------------------------------------------------------|
    | Part 3 - Low Carbon Fuel Requirement Summary                              | Line     |               | Units                         | Initial Submission - Accepted  | Example 2 - Supplemental #1 - Submitted | Example 2 - Supplemental #2 - Accepted |
    |---------------------------------------------------------------------------|----------|---------------|-------------------------------|--------------------------------|-----------------------------------------|----------------------------------------|
    | Total credits from fuel supplied (from Schedule B)                        | Line 23  | X             | Credits                       | 100,000                        | 100,000                                 | 100,000
    | Total debits from fuel supplied (from Schedule B)                         | Line 24  | Y             | (Debits)                      | 144,000                        | 148,000                                 | 150,000
    | Net credit or debit balance for compliance period                         | Line 25  | Z             | Credits (Debits)              | -44,000                        | -48,000                                 | -50,000
    | Total banked credits used to offset outstanding debits (if applicable)    | Line 26  | A+B+C+D       | Credits                       | 44,000                         | 46,000                                  | 46,000
    | Banked credits used to offset outstanding debits - Previous Reports       | Line 26a | A+B+C         | Credits                       | n/a                            | 44,000                                  | 44,000
    | Banked credits used to offset outstanding debits - Supplemental Report #2 | Line 26b | D (editable)  | Credits                       | n/a                            | 2,000                                   | 2,000
    | Outstanding debit balance                                                 | Line 27  | Z - (A+B+C+D) | (Debits)                      | 0                              | 2,000                                   | 4,000
    | Part 3 non-compliance penalty payable                                     | Line 28  |               | $CAD                          | $-                             | $400,000                                | $800,000
    |---------------------------------------------------------------------------|----------|---------------|-------------------------------|--------------------------------|-----------------------------------------|----------------------------------------|
    | Report Status (for compliance units conversion)                           |          |               |                               | Accepted                       | Submitted (not Accepted)                | Accepted                                
    |---------------------------------------------------------------------------|----------|---------------|-------------------------------|--------------------------------|-----------------------------------------|----------------------------------------|                             
    | Corresponding Compliance Unit conversion / transaction                    |          |               |                               | -44,000                        |                                         | -2,000
    """
    def test_supplemental_report_submission_2_ex2_increasing_debit_obligation(self):
        rid = self._create_draft_compliance_report()
        # patch compliance report information
        payload = compliance_unit_initial_payload
        payload['status']['fuelSupplierStatus'] = 'Draft'
        payload['scheduleB']['records'][0]['quantity'] = 117933318 # credits of fuel supplied (from Schedule B)
        payload['scheduleB']['records'][1]['quantity'] = 246411631 # debits of fuel supplied (from Schedule B)
        self._patch_fs_user_for_compliance_report(payload, rid)
        self._add_part3_awards_to_org(50000)
        # Submit the compliance report
        payload = {
            'status': {'fuelSupplierStatus': 'Submitted'},
            'summary': {
                'creditsOffset': 44000,
            }
        }
        self._patch_fs_user_for_compliance_report(payload, rid)
        # Successful director acceptance
        self._acceptance_from_director(rid)
        # retrieve the compliance report and validate the Summary report fields
        response = self.clients['fs_user_1'].get('/api/compliance_reports/{id}'.format(id=rid))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data.get('summary').get('lines').get('25'), -44000.0)
        self.assertEqual(response.data.get('summary').get('lines').get('26'), 44000.0)
        # compliance unit balance check
        self.assertEqual(min(response.data.get('max_credit_offset'), response.data.get('max_credit_offset_exclude_reserved')), 6000)
        # Create supplemental report #1
        sid1 = self._create_supplemental_report(rid)
        payload = compliance_unit_supplemental_payload
        payload['scheduleB']['records'][0]['quantity'] = 117933318  # credits of fuel supplied (from Schedule B)
        payload['scheduleB']['records'][1]['quantity'] = 253256398  # debits of fuel supplied (from Schedule B)
        payload['summary']['creditsOffset'] = 46000
        payload['summary']['creditsOffsetA'] = 44000
        payload['summary']['creditsOffsetB'] = 2000
        self._patch_fs_user_for_compliance_report(payload, sid1)
        # retrieve the compliance report and validate the Summary report fields
        response = self.clients['fs_user_1'].get('/api/compliance_reports/{id}'.format(id=sid1))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['summary']['lines']['25'], -48000.0)
        self.assertEqual(response.data['summary']['lines']['26'], 46000.0)
        self.assertEqual(response.data['summary']['lines']['26A'], 44000.0)
        self.assertEqual(response.data['summary']['lines']['26B'], 2000.0)
        self.assertEqual(response.data['summary']['lines']['27'], -2000.0)
        self.assertEqual(response.data['summary']['lines']['28'], 400000.0)
        # compliance unit balance check
        self.assertEqual(min(response.data.get('max_credit_offset'), response.data.get('max_credit_offset_exclude_reserved')), 6000)
        # Create supplemental report #2
        sid2 = self._create_supplemental_report(sid1)
        payload = compliance_unit_supplemental_payload
        payload['scheduleB']['records'][0]['quantity'] = 117933318  # credits of fuel supplied (from Schedule B)
        payload['scheduleB']['records'][1]['quantity'] = 256678782  # debits of fuel supplied (from Schedule B)
        payload['summary']['creditsOffset'] = 46000
        payload['summary']['creditsOffsetA'] = 44000
        payload['summary']['creditsOffsetB'] = 2000
        self._patch_fs_user_for_compliance_report(payload, sid2)
        # Successful director acceptance for supplemental report #1
        self._acceptance_from_director(sid2)
        # retrieve the compliance report and validate the Summary report fields
        response = self.clients['fs_user_1'].get('/api/compliance_reports/{id}'.format(id=sid2))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['summary']['lines']['25'], -50000.0)
        self.assertEqual(response.data['summary']['lines']['26'], 46000.0)
        self.assertEqual(response.data['summary']['lines']['26A'], 44000.0)
        self.assertEqual(response.data['summary']['lines']['26B'], 2000.0)
        self.assertEqual(response.data['summary']['lines']['27'], -4000.0)
        self.assertEqual(response.data['summary']['lines']['28'], 800000.0)
        # compliance unit balance check
        self.assertEqual(min(response.data.get('max_credit_offset'), response.data.get('max_credit_offset_exclude_reserved')), 4000)

    """
    | Scenario 4: Supplemental Report Submission #1 that decreases debit obligation and still in a net debit position overall (Line 25) |
    |-----------------------------------------------------------------------------------------------------------------------------------|
    | Part 3 - Low Carbon Fuel Requirement Summary                                        | Line     |              | Units           | Initial Submission - Accepted | Example 1 - Supplemental #1 - Accepted |
    |-------------------------------------------------------------------------------------|----------|--------------|-----------------|-------------------------------|----------------------------------------|
    | Total credits from fuel supplied (from Schedule B)                                  | Line 23  | X            | Credits         | 100,000                       | 100,000                                |
    | Total debits from fuel supplied (from Schedule B)                                   | Line 24  | Y            | (Debits)        | 160,000                       | 150,000                                |
    | Net credit or debit balance for compliance period                                   | Line 25  | Z            | Credits (Debits)| -60,000                       | -50,000                                |
    | Total banked credits used to offset outstanding debits (if applicable)              | Line 26  | A-R          | Credits         | 60,000                        | 50,000                                 |
    | Banked credits used to offset outstanding debits - Previous Reports                 | Line 26a | A            | Credits         | n/a                           | 60,000                                 |
    | Banked credits used to offset outstanding debits - Supplemental Report #1           | Line 26b | Not editable | Credits         | n/a                           | n/a                                    |
    | Outstanding debit balance                                                           | Line 27  |              | (Debits)        | 0                             | 0                                      |
    | Part 3 non-compliance penalty payable                                               | Line 28  |              | $CAD            |                               |                                        |
    |-------------------------------------------------------------------------------------|----------|--------------|-----------------|-------------------------------|----------------------------------------|
    | Banked credits to be returned as a result of supplemental reporting (if applicable) |          | R            |                 |                               | 10,000                                 |
    |-------------------------------------------------------------------------------------|----------|--------------|-----------------|-------------------------------|----------------------------------------|
    | Report Status (for compliance units conversion)                                     |          |              |                 | Accepted                      | Accepted                               |
    |-------------------------------------------------------------------------------------|----------|--------------|-----------------|-------------------------------|----------------------------------------|
    | Corresponding Compliance Unit conversion / transaction                              |          |              |                 | -60,000                       | +10,000                                |
    """
    def test_supplemental_report_submission_1_ex1_decreasing_debit_obligation_under_net_debit_position(self):
        rid = self._create_draft_compliance_report()
        # patch compliance report info
        payload = compliance_unit_initial_payload
        payload['status']['fuelSupplierStatus'] = 'Draft'
        payload['scheduleB']['records'][0]['quantity'] = 117933318  # credits of fuel supplied (from Schedule B)
        payload['scheduleB']['records'][1]['quantity'] = 273790701  # debits of fuel supplied (from Schedule B)
        self._patch_fs_user_for_compliance_report(payload, rid)
        self._add_part3_awards_to_org(100000)
        # Submit the compliance report
        payload = {
            'status': {'fuelSupplierStatus': 'Submitted'},
            'summary': {
                'creditsOffset': 60000,
            }
        }
        self._patch_fs_user_for_compliance_report(payload, rid)
        # Successful director acceptance
        self._acceptance_from_director(rid)
        # retrieve the compliance report and validate the Summary report fields
        response = self.clients['fs_user_1'].get('/api/compliance_reports/{id}'.format(id=rid))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # compliance unit balance check
        self.assertEqual(min(response.data.get('max_credit_offset'), response.data.get('max_credit_offset_exclude_reserved')), 40000)
        self.assertEqual(response.data.get('summary').get('lines').get('25'), -60000.0)
        self.assertEqual(response.data.get('summary').get('lines').get('26'), 60000.0)
        # Create supplemental report #1
        sid1 = self._create_supplemental_report(rid)
        payload = compliance_unit_supplemental_payload
        payload['scheduleB']['records'][0]['quantity'] = 117933318  # credits of fuel supplied (from Schedule B)
        payload['scheduleB']['records'][1]['quantity'] = 256678782  # debits of fuel supplied (from Schedule B)
        payload['summary']['creditsOffset'] = 50000
        payload['summary']['creditsOffsetA'] = 60000
        payload['summary']['creditsOffsetB'] = 0
        self._patch_fs_user_for_compliance_report(payload, sid1)
        # Successful director acceptance for supplemental report #1
        self._acceptance_from_director(sid1)
        # retrieve the compliance report and validate the Summary report fields
        response = self.clients['fs_user_1'].get('/api/compliance_reports/{id}'.format(id=sid1))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['summary']['lines']['25'], -50000.0)
        self.assertEqual(response.data['summary']['lines']['26'], 50000.0)
        self.assertEqual(response.data['summary']['lines']['26A'], 60000.0)
        self.assertEqual(response.data['summary']['lines']['27'], 0)
        # compliance unit balance check
        self.assertEqual(min(response.data.get('max_credit_offset'), response.data.get('max_credit_offset_exclude_reserved')), 50000)

    """
    | Scenario 4: Supplemental Report Submission #1 that decreases debit obligation and still in a net debit position overall (Line 25) |
    |-----------------------------------------------------------------------------------------------------------------------------------|
    | Part 3 - Low Carbon Fuel Requirement Summary                                        | Line     |              | Units           | Example 2 - Initial Submission - Accepted | Example 2 - Supplemental #1 - Accepted |
    |-------------------------------------------------------------------------------------|----------|--------------|-----------------|-------------------------------------------|----------------------------------------|
    | Total credits from fuel supplied (from Schedule B)                                  | Line 23  | X            | Credits         | 100,000                                   | 100,000
    | Total debits from fuel supplied (from Schedule B)                                   | Line 24  | Y            | (Debits)        | 160,000                                   | 150,000
    | Net credit or debit balance for compliance period                                   | Line 25  | Z            | Credits (Debits)| -60,000                                   | -50,000
    | Total banked credits used to offset outstanding debits (if applicable)              | Line 26  | A-R          | Credits         | 60,000                                    | 50,000
    | Banked credits used to offset outstanding debits - Previous Reports                 | Line 26a | A            | Credits         | n/a                                       | 60,000
    | Banked credits used to offset outstanding debits - Supplemental Report #1           | Line 26b | Not editable | Credits         | n/a                                       | 
    | Outstanding debit balance                                                           | Line 27  |              | (Debits)        | 0                                         | 0
    | Part 3 non-compliance penalty payable                                               | Line 28  |              | $CAD            |                                           | 
    |-------------------------------------------------------------------------------------|----------|--------------|-----------------|-------------------------------------------|----------------------------------------|
    | Banked credits to be returned as a result of supplemental reporting (if applicable) |          | R            |                 |                                           | 
    |-------------------------------------------------------------------------------------|----------|--------------|-----------------|-------------------------------------------|----------------------------------------|
    | Report Status (for compliance units conversion)                                     |          |              |                 | Submitted (not Accepted)                  | Accepted
    |-------------------------------------------------------------------------------------|----------|--------------|-----------------|-------------------------------------------|----------------------------------------|
    | Corresponding Compliance Unit conversion / transaction                              |          |              |                 |                                           | -50,000
    """
    def test_supplemental_report_submission_1_ex2_decreasing_debit_obligation_under_net_debit_position(self):
        rid = self._create_draft_compliance_report()
        # patch compliance report info
        payload = compliance_unit_initial_payload
        payload['status']['fuelSupplierStatus'] = 'Draft'
        payload['scheduleB']['records'][0]['quantity'] = 117933318  # credits of fuel supplied (from Schedule B)
        payload['scheduleB']['records'][1]['quantity'] = 273790701  # debits of fuel supplied (from Schedule B)
        self._patch_fs_user_for_compliance_report(payload, rid)
        self._add_part3_awards_to_org(100000)
        # Submit the compliance report
        payload = {
            'status': {'fuelSupplierStatus': 'Submitted'},
            'summary': {
                'creditsOffset': 60000,
            }
        }
        self._patch_fs_user_for_compliance_report(payload, rid)
        # retrieve the compliance report and validate the Summary report fields
        response = self.clients['fs_user_1'].get('/api/compliance_reports/{id}'.format(id=rid))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # compliance unit balance check
        self.assertEqual(
            min(response.data.get('max_credit_offset'), response.data.get('max_credit_offset_exclude_reserved')), 40000)
        # exclude the reserved amount as in this case report is not submitted.
        self.assertEqual(response.data.get('max_credit_offset_exclude_reserved'), 100000)
        self.assertEqual(response.data.get('summary').get('lines').get('25'), -60000.0)
        self.assertEqual(response.data.get('summary').get('lines').get('26'), 60000.0)
        # Create supplemental report #1
        sid1 = self._create_supplemental_report(rid)
        payload = compliance_unit_supplemental_payload
        payload['scheduleB']['records'][0]['quantity'] = 117933318  # credits of fuel supplied (from Schedule B)
        payload['scheduleB']['records'][1]['quantity'] = 256678782  # debits of fuel supplied (from Schedule B)
        payload['summary']['creditsOffset'] = 50000
        payload['summary']['creditsOffsetA'] = 60000
        payload['summary']['creditsOffsetB'] = 0
        self._patch_fs_user_for_compliance_report(payload, sid1)
        # Successful director acceptance for supplemental report #1
        self._acceptance_from_director(sid1)
        # retrieve the compliance report and validate the Summary report fields
        response = self.clients['fs_user_1'].get('/api/compliance_reports/{id}'.format(id=sid1))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['summary']['lines']['25'], -50000.0)
        self.assertEqual(response.data['summary']['lines']['26'], 50000.0)
        self.assertEqual(response.data['summary']['lines']['26A'], 60000.0)
        self.assertEqual(response.data['summary']['lines']['27'], 0)
        # compliance unit balance check
        self.assertEqual(
            min(response.data.get('max_credit_offset'), response.data.get('max_credit_offset_exclude_reserved')), 50000)

    """
    | Scenario 5: Supplemental Report Submission #2 that decreases debit obligation and still in a net debit position overall (Line 25) |
    |-----------------------------------------------------------------------------------------------------------------------------------|
    | Part 3 - Low Carbon Fuel Requirement Summary                                        | Line     | Units        | Example 1 - Initial Submission - Accepted | Example 1 - Supplemental #1 - Accepted |
    |-------------------------------------------------------------------------------------|----------|--------------|-------------------------------------------|----------------------------------------|
    | Total credits from fuel supplied (from Schedule B)                                  | Line 23  | X            | Credits                                   | 100,000                                |
    | Total debits from fuel supplied (from Schedule B)                                   | Line 24  | Y            | (Debits)                                  | 170,000                                |
    | Net credit or debit balance for compliance period                                   | Line 25  | Z            | Credits (Debits)                          | -70,000                                |
    | Total banked credits used to offset outstanding debits (if applicable)              | Line 26  | A+B+C-R      | Credits                                   | 70,000                                 |
    | Banked credits used to offset outstanding debits - Previous Reports                 | Line 26a | A+B+C        | Credits                                   | n/a                                    |
    | Banked credits used to offset outstanding debits - Supplemental Report #2           | Line 26b | Not editable | Credits                                   | n/a                                    |
    | Outstanding debit balance                                                           | Line 27  |              | (Debits)                                  | 0                                      |
    | Part 3 non-compliance penalty payable                                               | Line 28  |              | $CAD                                      |                                        |
    |-------------------------------------------------------------------------------------|----------|--------------|-------------------------------------------|----------------------------------------|
    | Banked credits to be returned as a result of supplemental reporting (if applicable) |          | R            |                                           |                                        |
    |-------------------------------------------------------------------------------------|----------|--------------|-------------------------------------------|----------------------------------------|
    | Report Status (for compliance units conversion)                                     |          |              | Accepted                                  | Accepted                               |
    |-------------------------------------------------------------------------------------|----------|--------------|-------------------------------------------|----------------------------------------|
    | Corresponding Compliance Unit conversion / transaction                              |          |              |                                           | -70,000                                |
    """
    def test_supplemental_report_submission_2_ex1_decreasing_debit_obligation_under_net_debit_position(self):
        rid = self._create_draft_compliance_report()
        # patch compliance report info
        payload = compliance_unit_initial_payload
        payload['status']['fuelSupplierStatus'] = 'Draft'
        payload['scheduleB']['records'][0]['quantity'] = 117933318  # credits of fuel supplied (from Schedule B)
        payload['scheduleB']['records'][1]['quantity'] = 290902619  # debits of fuel supplied (from Schedule B)
        self._patch_fs_user_for_compliance_report(payload, rid)
        self._add_part3_awards_to_org(100000)
        # Submit the compliance report
        payload = {
            'status': {'fuelSupplierStatus': 'Submitted'},
            'summary': {
                'creditsOffset': 70000,
            }
        }
        self._patch_fs_user_for_compliance_report(payload, rid)
        # Successful director acceptance
        self._acceptance_from_director(rid)
        # retrieve the compliance report and validate the Summary report fields
        response = self.clients['fs_user_1'].get('/api/compliance_reports/{id}'.format(id=rid))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # compliance unit balance check
        self.assertEqual(min(response.data.get('max_credit_offset'), response.data.get('max_credit_offset_exclude_reserved')), 30000)
        self.assertEqual(response.data.get('summary').get('lines').get('25'), -70000.0)
        self.assertEqual(response.data.get('summary').get('lines').get('26'), 70000.0)
        # Create supplemental report #1
        sid1 = self._create_supplemental_report(rid)
        payload = compliance_unit_supplemental_payload
        payload['scheduleB']['records'][0]['quantity'] = 117933318  # credits of fuel supplied (from Schedule B)
        payload['scheduleB']['records'][1]['quantity'] = 256678782  # debits of fuel supplied (from Schedule B)
        payload['summary']['creditsOffset'] = 50000
        payload['summary']['creditsOffsetA'] = 70000
        payload['summary']['creditsOffsetB'] = 0
        self._patch_fs_user_for_compliance_report(payload, sid1)
        # Successful director acceptance for supplemental report #1
        self._acceptance_from_director(sid1)
        # retrieve the compliance report and validate the Summary report fields
        response = self.clients['fs_user_1'].get('/api/compliance_reports/{id}'.format(id=sid1))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['summary']['lines']['25'], -50000.0)
        self.assertEqual(response.data['summary']['lines']['26'], 50000.0)
        self.assertEqual(response.data['summary']['lines']['26A'], 70000.0)
        self.assertEqual(response.data['summary']['lines']['27'], 0)
        # compliance unit balance check
        self.assertEqual(min(response.data.get('max_credit_offset'), response.data.get('max_credit_offset_exclude_reserved')), 50000)

    """
    | Scenario 5: Supplemental Report Submission #2 that decreases debit obligation and still in a net debit position overall (Line 25) |
    |-----------------------------------------------------------------------------------------------------------------------------------|
    | Part 3 - Low Carbon Fuel Requirement Summary                                        | Line     | Units        | Example 2 - Initial Submission - Accepted | Example 2 - Supplemental #1 - Accepted |
    |-------------------------------------------------------------------------------------|----------|--------------|-------------------------------------------|----------------------------------------|
    | Total credits from fuel supplied (from Schedule B)                                  | Line 23  | X            | 100,000                                   | 100,000                                |
    | Total debits from fuel supplied (from Schedule B)                                   | Line 24  | Y            | 150,000                                   | 170,000                                |
    | Net credit or debit balance for compliance period                                   | Line 25  | Z            | -50,000                                   | -70,000                                |
    | Total banked credits used to offset outstanding debits (if applicable)              | Line 26  | A+B+C-R      | 50,000                                    | 70,000                                 |
    | Banked credits used to offset outstanding debits - Previous Reports                 | Line 26a | A+B+C        | 70,000                                    | n/a                                    |
    | Banked credits used to offset outstanding debits - Supplemental Report #2           | Line 26b | Not editable | 0                                         | n/a                                    |
    | Outstanding debit balance                                                           | Line 27  |              | 0                                         | 0                                      |
    | Part 3 non-compliance penalty payable                                               | Line 28  |              |                                           |                                        |
    |-------------------------------------------------------------------------------------|----------|--------------|-------------------------------------------|----------------------------------------|
    | Banked credits to be returned as a result of supplemental reporting (if applicable) |          | R            | 20,000                                    |                                        |
    |-------------------------------------------------------------------------------------|----------|--------------|-------------------------------------------|----------------------------------------|
    | Report Status (for compliance units conversion)                                     |          |              | Submitted (not Accepted)                  | Accepted                               |
    |-------------------------------------------------------------------------------------|----------|--------------|-------------------------------------------|----------------------------------------|
    | Corresponding Compliance Unit conversion / transaction                              |          |              | +20,000                                   |                                        |
    """
    def test_supplemental_report_submission_2_ex2_decreasing_debit_obligation_under_net_debit_position(self):
        rid = self._create_draft_compliance_report()
        # patch compliance report info
        payload = compliance_unit_initial_payload
        payload['status']['fuelSupplierStatus'] = 'Draft'
        payload['scheduleB']['records'][0]['quantity'] = 117933318  # credits of fuel supplied (from Schedule B)
        payload['scheduleB']['records'][1]['quantity'] = 290902619  # debits of fuel supplied (from Schedule B)
        self._patch_fs_user_for_compliance_report(payload, rid)
        self._add_part3_awards_to_org(100000)
        # Submit the compliance report
        payload = {
            'status': {'fuelSupplierStatus': 'Submitted'},
            'summary': {
                'creditsOffset': 70000,
            }
        }
        self._patch_fs_user_for_compliance_report(payload, rid)
        # retrieve the compliance report and validate the Summary report fields
        response = self.clients['fs_user_1'].get('/api/compliance_reports/{id}'.format(id=rid))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # compliance unit balance check
        self.assertEqual(
            min(response.data.get('max_credit_offset'), response.data.get('max_credit_offset_exclude_reserved')), 30000)
        # exclude the reserved amount as in this case report is not submitted.
        self.assertEqual(response.data.get('max_credit_offset_exclude_reserved'), 100000)
        self.assertEqual(response.data.get('summary').get('lines').get('25'), -70000.0)
        self.assertEqual(response.data.get('summary').get('lines').get('26'), 70000.0)
        # Create supplemental report #1
        sid1 = self._create_supplemental_report(rid)
        payload = compliance_unit_supplemental_payload
        payload['scheduleB']['records'][0]['quantity'] = 117933318  # credits of fuel supplied (from Schedule B)
        payload['scheduleB']['records'][1]['quantity'] = 256678782  # debits of fuel supplied (from Schedule B)
        payload['summary']['creditsOffset'] = 50000
        payload['summary']['creditsOffsetA'] = 70000
        payload['summary']['creditsOffsetB'] = 0
        self._patch_fs_user_for_compliance_report(payload, sid1)
        # Successful director acceptance for supplemental report #1
        self._acceptance_from_director(sid1)
        # retrieve the compliance report and validate the Summary report fields
        response = self.clients['fs_user_1'].get('/api/compliance_reports/{id}'.format(id=sid1))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['summary']['lines']['25'], -50000.0)
        self.assertEqual(response.data['summary']['lines']['26'], 50000.0)
        self.assertEqual(response.data['summary']['lines']['26A'], 70000.0)
        self.assertEqual(response.data['summary']['lines']['27'], 0)
        # compliance unit balance check
        self.assertEqual(
            min(response.data.get('max_credit_offset'), response.data.get('max_credit_offset_exclude_reserved')), 50000)

    """
    | Scenario 6: Supplemental Report Submission #2 that decreases debit obligation and is now in a net credit position (Line 25) |
    |-----------------------------------------------------------------------------------------------------------------------------|
    | Part 3 - Low Carbon Fuel Requirement Summary                                        | Line     |              | Units            | Example 1 - Initial Submission - Accepted | Example 1 - Supplemental #1 - Accepted |
    |-------------------------------------------------------------------------------------|----------|--------------|------------------|-------------------------------------------|----------------------------------------|
    | Total credits from fuel supplied (from Schedule B)                                  | Line 23  | X            | Credits          | 80,000                                    | 105,000                                |
    | Total debits from fuel supplied (from Schedule B)                                   | Line 24  | Y            | (Debits)         | 100,000                                   | 100,000                                |
    | Net credit or debit balance for compliance period                                   | Line 25  | Z            | Credits (Debits) | -20,000                                   | 5,000                                  |
    | Total banked credits used to offset outstanding debits (if applicable)              | Line 26  | A+B+C-R      | Credits          | 20,000                                    | 0                                      |
    | Banked credits used to offset outstanding debits - Previous Reports                 | Line 26a | A+B+C        | Credits          | n/a                                       | 20,000                                 |
    | Banked credits used to offset outstanding debits - Supplemental Report #2           | Line 26b | Not editable | Credits          | n/a                                       | 0                                      |
    | Outstanding debit balance                                                           | Line 27  |              | (Debits)         |                                           |                                        |
    | Part 3 non-compliance penalty payable                                               | Line 28  |              | $CAD             |                                           |                                        |
    |-------------------------------------------------------------------------------------|----------|--------------|------------------|-------------------------------------------|----------------------------------------|
    | Banked credits to be returned as a result of supplemental reporting (if applicable) |          | R            |                  |                                           | 25,000                                 |
    |-------------------------------------------------------------------------------------|----------|--------------|------------------|-------------------------------------------|----------------------------------------|
    | Report Status (for compliance units conversion)                                     |          |              |                  | Accepted                                  | Accepted                               |
    |-------------------------------------------------------------------------------------|----------|--------------|------------------|-------------------------------------------|----------------------------------------|
    | Corresponding Compliance Unit conversion / transaction                              |          |              |                  | -20,000                                   | +25,000                                |
    """
    def test_supplemental_report_submission_2_ex1_decreasing_debit_obligation_now_in_net_credit_position(self):
        rid = self._create_draft_compliance_report()
        # patch compliance report info
        payload = compliance_unit_initial_payload
        payload['status']['fuelSupplierStatus'] = 'Draft'
        payload['scheduleB']['records'][0]['quantity'] = 94346654  # credits of fuel supplied (from Schedule B)
        payload['scheduleB']['records'][1]['quantity'] = 171119188  # debits of fuel supplied (from Schedule B)
        self._patch_fs_user_for_compliance_report(payload, rid)
        self._add_part3_awards_to_org(100000)
        # Submit the compliance report
        payload = {
            'status': {'fuelSupplierStatus': 'Submitted'},
            'summary': {
                'creditsOffset': 20000,
            }
        }
        self._patch_fs_user_for_compliance_report(payload, rid)
        # Successful director acceptance
        self._acceptance_from_director(rid)
        # retrieve the compliance report and validate the Summary report fields
        response = self.clients['fs_user_1'].get('/api/compliance_reports/{id}'.format(id=rid))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # compliance unit balance check
        self.assertEqual(min(response.data.get('max_credit_offset'), response.data.get('max_credit_offset_exclude_reserved')), 80000)
        self.assertEqual(response.data.get('summary').get('lines').get('25'), -20000.0)
        self.assertEqual(response.data.get('summary').get('lines').get('26'), 20000.0)
        # Create supplemental report #1
        sid1 = self._create_supplemental_report(rid)
        payload = compliance_unit_supplemental_payload
        payload['scheduleB']['records'][0]['quantity'] = 123829984  # credits of fuel supplied (from Schedule B)
        payload['scheduleB']['records'][1]['quantity'] = 171119188  # debits of fuel supplied (from Schedule B)
        payload['summary']['creditsOffset'] = 0
        payload['summary']['creditsOffsetA'] = 20000
        payload['summary']['creditsOffsetB'] = 0
        self._patch_fs_user_for_compliance_report(payload, sid1)
        # Successful director acceptance for supplemental report #1
        self._acceptance_from_director(sid1)
        # retrieve the compliance report and validate the Summary report fields
        response = self.clients['fs_user_1'].get('/api/compliance_reports/{id}'.format(id=sid1))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['summary']['lines']['25'], 5000.0)
        self.assertEqual(response.data['summary']['lines']['26'], 0)
        self.assertEqual(response.data['summary']['lines']['26A'], 20000.0)
        self.assertEqual(response.data['summary']['lines']['27'], 0)
        # compliance unit balance check
        self.assertEqual(min(response.data.get('max_credit_offset'), response.data.get('max_credit_offset_exclude_reserved')), 105000)

    """
    | Scenario 6: Supplemental Report Submission #2 that decreases debit obligation and is now in a net credit position (Line 25) |
    |-----------------------------------------------------------------------------------------------------------------------------|
    | Part 3 - Low Carbon Fuel Requirement Summary                                        | Line     |              | Units            | Example 2 - Initial Submission - Accepted | Example 2 - Supplemental #1 - Accepted |
    |-------------------------------------------------------------------------------------|----------|--------------|------------------|-------------------------------------------|----------------------------------------|
    | Total credits from fuel supplied (from Schedule B)                                  | Line 23  | X            | Credits          | 80,000                                    | 105,000
    | Total debits from fuel supplied (from Schedule B)                                   | Line 24  | Y            | (Debits)         | 100,000                                   | 100,000
    | Net credit or debit balance for compliance period                                   | Line 25  | Z            | Credits (Debits) | -20,000                                   | 5,000
    | Total banked credits used to offset outstanding debits (if applicable)              | Line 26  | A+B+C-R      | Credits          | 20,000                                    | 0
    | Banked credits used to offset outstanding debits - Previous Reports                 | Line 26a | A+B+C        | Credits          | n/a                                       | 20,000
    | Banked credits used to offset outstanding debits - Supplemental Report #2           | Line 26b | Not editable | Credits          | n/a                                       | 0
    | Outstanding debit balance                                                           | Line 27  |              | (Debits)         |                                           |
    | Part 3 non-compliance penalty payable                                               | Line 28  |              | $CAD             |                                           |
    |-------------------------------------------------------------------------------------|----------|--------------|------------------|-------------------------------------------|----------------------------------------|
    | Banked credits to be returned as a result of supplemental reporting (if applicable) |          | R            |                  |                                           | 5,000 
    |-------------------------------------------------------------------------------------|----------|--------------|------------------|-------------------------------------------|----------------------------------------|
    | Report Status (for compliance units conversion)                                     |          |              |                  | Submitted (not Accepted)                  | Accepted
    |-------------------------------------------------------------------------------------|----------|--------------|------------------|-------------------------------------------|----------------------------------------|
    | Corresponding Compliance Unit conversion / transaction                              |          |              |                  |                                           | +5,000 
    """
    def test_supplemental_report_submission_2_ex2_decreasing_debit_obligation_now_in_net_credit_position(self):
        rid = self._create_draft_compliance_report()
        # patch compliance report info
        payload = compliance_unit_initial_payload
        payload['status']['fuelSupplierStatus'] = 'Draft'
        payload['scheduleB']['records'][0]['quantity'] = 94346654  # credits of fuel supplied (from Schedule B)
        payload['scheduleB']['records'][1]['quantity'] = 171119188  # debits of fuel supplied (from Schedule B)
        self._patch_fs_user_for_compliance_report(payload, rid)
        self._add_part3_awards_to_org(100000)
        # Submit the compliance report
        payload = {
            'status': {'fuelSupplierStatus': 'Submitted'},
            'summary': {
                'creditsOffset': 20000,
            }
        }
        self._patch_fs_user_for_compliance_report(payload, rid)
        # retrieve the compliance report and validate the Summary report fields
        response = self.clients['fs_user_1'].get('/api/compliance_reports/{id}'.format(id=rid))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # compliance unit balance check
        self.assertEqual(
            min(response.data.get('max_credit_offset'), response.data.get('max_credit_offset_exclude_reserved')), 80000)
        # exclude the reserved amount as in this case report is not submitted.
        self.assertEqual(response.data.get('max_credit_offset_exclude_reserved'), 100000)
        self.assertEqual(response.data.get('summary').get('lines').get('25'), -20000.0)
        self.assertEqual(response.data.get('summary').get('lines').get('26'), 20000.0)
        # Create supplemental report #1
        sid1 = self._create_supplemental_report(rid)
        payload = compliance_unit_supplemental_payload
        payload['scheduleB']['records'][0]['quantity'] = 123829984  # credits of fuel supplied (from Schedule B)
        payload['scheduleB']['records'][1]['quantity'] = 171119188  # debits of fuel supplied (from Schedule B)
        payload['summary']['creditsOffset'] = 0
        payload['summary']['creditsOffsetA'] = 20000
        payload['summary']['creditsOffsetB'] = 0
        self._patch_fs_user_for_compliance_report(payload, sid1)
        # Successful director acceptance for supplemental report #1
        self._acceptance_from_director(sid1)
        # retrieve the compliance report and validate the Summary report fields
        response = self.clients['fs_user_1'].get('/api/compliance_reports/{id}'.format(id=sid1))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['summary']['lines']['25'], 5000.0)
        self.assertEqual(response.data['summary']['lines']['26'], 0)
        self.assertEqual(response.data['summary']['lines']['26A'], 20000)
        self.assertEqual(response.data['summary']['lines']['27'], 0)
        # compliance unit balance check
        self.assertEqual(
            min(response.data.get('max_credit_offset'), response.data.get('max_credit_offset_exclude_reserved')), 105000)
