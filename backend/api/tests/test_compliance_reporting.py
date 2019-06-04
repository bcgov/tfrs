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

from .base_test_case import BaseTestCase


class TestComplianceReporting(BaseTestCase):
    """Tests for the compliance reporting endpoint"""
    extra_fixtures = [
        'test/test_compliance_reporting.json'
    ]

    def test_list_compliance_reports_fs1(self):
        response = self.clients['fs_user_1'].get('/api/compliance_reports')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        compliance_reports = response.json()
        self.assertEqual(len(compliance_reports), 3)

    def test_list_compliance_reports_unauthorized(self):
        response = self.clients['fs_user_2'].get('/api/compliance_reports')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_list_compliance_gov(self):
        response = self.clients['gov_analyst'].get('/api/compliance_reports')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        compliance_reports = response.json()
        self.assertEqual(len(compliance_reports), 1)

    def test_get_compliance_report_details_authorized(self):
        response = self.clients['fs_user_1'].get('/api/compliance_reports/1')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_compliance_report_details_unauthorized(self):
        response = self.clients['fs_user_2'].get('/api/compliance_reports/1')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_get_compliance_report_details_gov_authorized(self):
        response = self.clients['gov_analyst'].get('/api/compliance_reports/2')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_compliance_report_details_gov_unauthorized(self):
        response = self.clients['gov_analyst'].get('/api/compliance_reports/3')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_create_draft_compliance_report_authorized(self):
        payload = {
            'status': 'Draft',
            'type': 'Compliance Report',
            'compliance_period': '2017'
        }

        response = self.clients['fs_user_1'].post(
            '/api/compliance_reports',
            content_type='application/json',
            data=json.dumps(payload)
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        response = self.clients['fs_user_1'].get('/api/compliance_reports')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        compliance_reports = response.json()
        self.assertEqual(len(compliance_reports), 4)

    def test_create_submitted_compliance_report_authorized(self):
        payload = {
            'status': 'Submitted',
            'type': 'Compliance Report',
            'compliancePeriod': '2019',
            'scheduleC': {
                'records': [
                    {
                        'fuelType': 'LNG',
                        'fuelClass': 'Diesel',
                        'quantity': 40,
                        'expectedUse': 'Other',
                        'rationale': 'Test rationale'
                    }
                ]
            }
        }

        response = self.clients['fs_user_1'].post(
            '/api/compliance_reports',
            content_type='application/json',
            data=json.dumps(payload)
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_draft_compliance_report_authorized_with_schedule_c(self):
        payload = {
            'status': 'Draft',
            'type': 'Compliance Report',
            'compliancePeriod': '2019',
            'scheduleC': {
                'records': [
                    {
                        'fuelType': 'LNG',
                        'fuelClass': 'Diesel',
                        'quantity': 10,
                        'expectedUse': 'Other',
                        'rationale': 'Test rationale 1'
                    },
                    {
                        'fuelType': 'LNG',
                        'fuelClass': 'Diesel',
                        'quantity': 20,
                        'expectedUse': 'Other',
                        'rationale': 'Test rationale 2 '
                    },
                    {
                        'fuelType': 'LNG',
                        'fuelClass': 'Diesel',
                        'quantity': 30,
                        'expectedUse': 'Other',
                        'rationale': 'Test rationale 3'
                    },
                    {
                        'fuelType': 'LNG',
                        'fuelClass': 'Diesel',
                        'quantity': 40,
                        'expectedUse': 'Other',
                        'rationale': 'Test rationale 4 '
                    }
                ]
            }
        }

        response = self.clients['fs_user_1'].post(
            '/api/compliance_reports',
            content_type='application/json',
            data=json.dumps(payload)
        )

        response_data = json.loads(response.content.decode("utf-8"))

        self.assertIsNotNone(response_data['scheduleC'])
        self.assertEqual(len(response_data['scheduleC']['records']), 4)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_patch_compliance_report(self):
        payload = {
            'scheduleC': {
                'records': [
                    {
                        'fuelType': 'LNG',
                        'fuelClass': 'Diesel',
                        'quantity': 88.1,
                        'expectedUse': 'Other',
                        'rationale': 'Patched'
                    }
                ]
            }
        }

        response = self.clients['fs_user_1'].patch(
            '/api/compliance_reports/1',
            content_type='application/json',
            data=json.dumps(payload)
        )

        response_data = json.loads(response.content.decode("utf-8"))

        self.assertIsNotNone(response_data['scheduleC'])
        self.assertEqual(len(response_data['scheduleC']['records']), 1)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        payload = {
            'scheduleC': {
                'records': [
                    {
                        'fuelType': 'LNG',
                        'fuelClass': 'Diesel',
                        'quantity': 88.1,
                        'expectedUse': 'Other',
                        'rationale': 'Patched'
                    },
                    {
                        'fuelType': 'LNG',
                        'fuelClass': 'Diesel',
                        'quantity': 88.1,
                        'expectedUse': 'Other',
                        'rationale': 'Patched Again'
                    }
                ]
            }
        }

        response = self.clients['fs_user_1'].patch(
            '/api/compliance_reports/1',
            content_type='application/json',
            data=json.dumps(payload)
        )

        response_data = json.loads(response.content.decode("utf-8"))

        self.assertIsNotNone(response_data['scheduleC'])
        self.assertEqual(len(response_data['scheduleC']['records']), 2)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_draft_compliance_report_authorized(self):
        # for now, 'Submitted' reports are not possible
        payload = {
            'status': 'Submitted'  # currently invalid status
        }

        response = self.clients['fs_user_1'].patch(
            '/api/compliance_reports/1',
            content_type='application/json',
            data=json.dumps(payload)
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_draft_compliance_report_unauthorized(self):
        payload = {
            'status': 'Draft',
            'type': 'Compliance Report',
            'compliance_period': '2019'
        }

        response = self.clients['fs_user_2'].post(
            '/api/compliance_reports',
            content_type='application/json',
            data=json.dumps(payload)
        )

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_draft_compliance_report_gov_unauthorized(self):
        payload = {
            'status': 'Draft',
            'type': 'Compliance Report',
            'compliance_period': '2019'
        }

        response = self.clients['gov_analyst'].post(
            '/api/compliance_reports',
            content_type='application/json',
            data=json.dumps(payload)
        )

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
