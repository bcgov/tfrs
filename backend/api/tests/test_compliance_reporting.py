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
        'test/test_compliance_reporting.json',
        'test/test_fuel_codes.json'
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

    def test_row_ordering(self):
        payload = {
            'scheduleB': {
                'records': [
                    {
                        'fuelType': 'LNG',
                        'fuelClass': 'Diesel',
                        'quantity': 10,
                        'provisionOfTheAct': 'Section 6 (5) (d) (ii) (B)',
                        'fuelCode': None,
                        'intensity': 12.1
                    },
                    {
                        'fuelType': 'LNG',
                        'fuelClass': 'Diesel',
                        'quantity': 5,
                        'provisionOfTheAct': 'Section 6 (5) (c)',
                        'fuelCode': 1
                    }
                ]
            },
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
            },
            'scheduleA': {
                'records': [
                    {
                        'tradingPartner': 'CD',
                        'postalAddress': '123 Main St\nVictoria, BC',
                        'fuelClass': 'Diesel',
                        'transferType': 'Received',
                        'quantity': 98.1
                    },
                    {
                        'tradingPartner': 'AB',
                        'postalAddress': '123 Main St\nVictoria, BC',
                        'fuelClass': 'Diesel',
                        'transferType': 'Received',
                        'quantity': 98.1
                    },
                    {
                        'tradingPartner': 'EF',
                        'postalAddress': '123 Main St\nVictoria, BC',
                        'fuelClass': 'Diesel',
                        'transferType': 'Received',
                        'quantity': 98.1
                    }
                ]
            },
            'scheduleD': {
                'sheets': [
                    {
                        'fuelType': 'LNG',
                        'fuelClass': 'Diesel',
                        'feedstock': 'Corn',
                        'inputs': [
                            {
                                'worksheet_name': 'GHG Inputs',
                                'cell': 'A1',
                                'value': '10',
                                'units': 'tonnes',
                                'description': 'test',
                            },
                            {
                                'worksheet_name': 'GHG Inputs',
                                'cell': 'A1',
                                'value': '20',
                                'units': 'percent',
                            }
                        ],
                        'outputs': []
                    },
                    {
                        'fuelType': 'CNG',
                        'fuelClass': 'Diesel',
                        'feedstock': 'Corn',
                        'inputs': [
                            {
                                'worksheet_name': 'GHG Inputs',
                                'cell': 'B1',
                                'value': '10',
                                'units': 'tonnes',
                                'description': 'test',
                            },
                            {
                                'worksheet_name': 'GHG Inputs',
                                'cell': 'B1',
                                'value': '20',
                                'units': 'percent',
                            }
                        ],
                        'outputs': []
                    }
                    ,
                    {
                        'fuelType': 'CNG',
                        'fuelClass': 'Diesel',
                        'feedstock': 'Wheat',
                        'inputs': [
                            {
                                'worksheet_name': 'GHG Inputs',
                                'cell': 'B1',
                                'value': '10',
                                'units': 'tonnes',
                                'description': 'test',
                            },
                            {
                                'worksheet_name': 'GHG Inputs',
                                'cell': 'B1',
                                'value': '20',
                                'units': 'percent',
                            }
                        ],
                        'outputs': []
                    }
                ]
            },
        }

        response = self.clients['fs_user_1'].patch(
            '/api/compliance_reports/1',
            content_type='application/json',
            data=json.dumps(payload)
        )

        response_data = json.loads(response.content.decode("utf-8"))
        self.assertEqual(response_data['scheduleA']['records'][0]['tradingPartner'], 'CD')
        self.assertEqual(response_data['scheduleA']['records'][1]['tradingPartner'], 'AB')
        self.assertEqual(response_data['scheduleA']['records'][2]['tradingPartner'], 'EF')

        self.assertEqual(response_data['scheduleB']['records'][0]['quantity'], '10.00')
        self.assertEqual(response_data['scheduleB']['records'][1]['quantity'], '5.00')

        self.assertEqual(response_data['scheduleC']['records'][0]['quantity'], '10.00')
        self.assertEqual(response_data['scheduleC']['records'][1]['quantity'], '20.00')
        self.assertEqual(response_data['scheduleC']['records'][2]['quantity'], '30.00')
        self.assertEqual(response_data['scheduleC']['records'][3]['quantity'], '40.00')

        self.assertEqual(response_data['scheduleD']['sheets'][0]['fuelType'], 'LNG')
        self.assertEqual(response_data['scheduleD']['sheets'][0]['feedstock'], 'Corn')
        self.assertEqual(response_data['scheduleD']['sheets'][0]['inputs'][0]['value'], '10')
        self.assertEqual(response_data['scheduleD']['sheets'][0]['inputs'][1]['value'], '20')

        self.assertEqual(response_data['scheduleD']['sheets'][1]['fuelType'], 'CNG')
        self.assertEqual(response_data['scheduleD']['sheets'][1]['feedstock'], 'Corn')
        self.assertEqual(response_data['scheduleD']['sheets'][1]['inputs'][0]['value'], '10')
        self.assertEqual(response_data['scheduleD']['sheets'][1]['inputs'][1]['value'], '20')

        self.assertEqual(response_data['scheduleD']['sheets'][2]['fuelType'], 'CNG')
        self.assertEqual(response_data['scheduleD']['sheets'][2]['feedstock'], 'Wheat')
        self.assertEqual(response_data['scheduleD']['sheets'][2]['inputs'][0]['value'], '10')
        self.assertEqual(response_data['scheduleD']['sheets'][2]['inputs'][1]['value'], '20')

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_schedule_b_alternative_method(self):
        payload = {
            'scheduleB': {
                'records': [
                    {
                        'fuelType': 'LNG',
                        'fuelClass': 'Diesel',
                        'quantity': 10,
                        'provisionOfTheAct': 'Section 6 (5) (d) (ii) (B)',
                        'intensity': '23.5'
                    }
                ]
            }
        }

        response = self.clients['fs_user_1'].patch(
            '/api/compliance_reports/1',
            content_type='application/json',
            data=json.dumps(payload)
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response_data = json.loads(response.content.decode("utf-8"))

        self.assertEqual(response_data['scheduleB']['records'][0]['intensity'], 23.5)

    def test_schedule_b_altnerative_method_no_intensity(self):
        payload = {
            'scheduleB': {
                'records': [
                    {
                        'fuelType': 'LNG',
                        'fuelClass': 'Diesel',
                        'quantity': 10,
                        'provisionOfTheAct': 'Section 6 (5) (d) (ii) (B)'
                        # no intensity
                    }
                ]
            }
        }

        response = self.clients['fs_user_1'].patch(
            '/api/compliance_reports/1',
            content_type='application/json',
            data=json.dumps(payload)
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_schedule_b_alternative_method_fuel_code(self):
        payload = {
            'scheduleB': {
                'records': [
                    {
                        'fuelType': 'LNG',
                        'fuelClass': 'Diesel',
                        'quantity': 10,
                        'provisionOfTheAct': 'Section 6 (5) (d) (ii) (B)',
                        'intensity': 1,
                        'fuelCode': 1  # invalid to supply fuel code
                    }
                ]
            }
        }

        response = self.clients['fs_user_1'].patch(
            '/api/compliance_reports/1',
            content_type='application/json',
            data=json.dumps(payload)
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_schedule_b_fuel_code_method_intensity(self):
        payload = {
            'scheduleB': {
                'records': [
                    {
                        'fuelType': 'LNG',
                        'fuelClass': 'Diesel',
                        'quantity': 10,
                        'provisionOfTheAct': 'Section 6 (5) (c)',
                        'intensity': 1,  # invalid to supply intensity
                        'fuelCode': 1
                    }
                ]
            }
        }

        response = self.clients['fs_user_1'].patch(
            '/api/compliance_reports/1',
            content_type='application/json',
            data=json.dumps(payload)
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_schedule_b_d_integration_valid(self):
        payload = {
            'scheduleB': {
                'records': [
                    {
                        'fuelType': 'LNG',
                        'fuelClass': 'Diesel',
                        'quantity': 10,
                        'provisionOfTheAct': 'Section 6 (5) (d) (ii) (A)',
                        'fuelCode': None,
                        'scheduleDSheetIndex': 1
                    }
                ]
            },
            'scheduleD': {
                'sheets': [
                    {
                        'fuelType': 'LNG',
                        'fuelClass': 'Diesel',
                        'feedstock': 'Corn',
                        'inputs': [
                            {
                                'worksheet_name': 'GHG Inputs',
                                'cell': 'A1',
                                'value': '10',
                                'units': 'tonnes',
                                'description': 'test',
                            },
                            {
                                'worksheet_name': 'GHG Inputs',
                                'cell': 'A1',
                                'value': '20',
                                'units': 'percent',
                            }
                        ],
                        'outputs': []
                    },
                    {
                        'fuelType': 'CNG',
                        'fuelClass': 'Diesel',
                        'feedstock': 'Corn',
                        'inputs': [
                            {
                                'worksheet_name': 'GHG Inputs',
                                'cell': 'B1',
                                'value': '10',
                                'units': 'tonnes',
                                'description': 'test',
                            },
                            {
                                'worksheet_name': 'GHG Inputs',
                                'cell': 'B1',
                                'value': '20',
                                'units': 'percent',
                            }
                        ],
                        'outputs': []
                    }
                ]
            },
        }

        response = self.clients['fs_user_1'].patch(
            '/api/compliance_reports/1',
            content_type='application/json',
            data=json.dumps(payload)
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response_data = json.loads(response.content.decode("utf-8"))

        # I don't understand why the Django serializer doesn't call it scheduleDSheetIndex
        self.assertEqual(response_data['scheduleB']['records'][0]['scheduleD_sheetIndex'], 1)
        self.assertEqual(response_data['scheduleB']['records'][0]['intensity'], None)

    def test_schedule_b_d_integration_invalid_null(self):
        payload = {
            'scheduleB': {
                'records': [
                    {
                        'fuelType': 'LNG',
                        'fuelClass': 'Diesel',
                        'quantity': 10,
                        'provisionOfTheAct': 'Section 6 (5) (d) (ii) (A)',
                        'fuelCode': None,
                        'scheduleDSheetIndex': None
                    }
                ]
            },
            'scheduleD': {
                'sheets': [
                    {
                        'fuelType': 'LNG',
                        'fuelClass': 'Diesel',
                        'feedstock': 'Corn',
                        'inputs': [
                            {
                                'worksheet_name': 'GHG Inputs',
                                'cell': 'A1',
                                'value': '10',
                                'units': 'tonnes',
                                'description': 'test',
                            },
                            {
                                'worksheet_name': 'GHG Inputs',
                                'cell': 'A1',
                                'value': '20',
                                'units': 'percent',
                            }
                        ],
                        'outputs': []
                    },
                    {
                        'fuelType': 'CNG',
                        'fuelClass': 'Diesel',
                        'feedstock': 'Corn',
                        'inputs': [
                            {
                                'worksheet_name': 'GHG Inputs',
                                'cell': 'B1',
                                'value': '10',
                                'units': 'tonnes',
                                'description': 'test',
                            },
                            {
                                'worksheet_name': 'GHG Inputs',
                                'cell': 'B1',
                                'value': '20',
                                'units': 'percent',
                            }
                        ],
                        'outputs': []
                    }
                ]
            },
        }

        response = self.clients['fs_user_1'].patch(
            '/api/compliance_reports/1',
            content_type='application/json',
            data=json.dumps(payload)
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_submitted_compliance_report_authorized(self):
        payload = {
            'status': 'Submitted',
            'type': 'Compliance Report',
            'compliancePeriod': '2019'
        }

        response = self.clients['fs_user_1'].post(
            '/api/compliance_reports',
            content_type='application/json',
            data=json.dumps(payload)
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

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
            },
            'summary': {
                'dieselClassRetained': '100',
                'dieselClassDeferred': '200',
                'gasolineClassRetained': '300',
                'gasolineClassDeferred': '400'
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
        self.assertIsNotNone(response_data['summary'])
        self.assertEqual(response_data['summary']['dieselClassRetained'], '100.00')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        payload = {
            'scheduleA': {
                'records': [
                    {
                        'tradingPartner': 'Test 2',
                        'postalAddress': '123 Main St\nVictoria, BC',
                        'fuelClass': 'Diesel',
                        'transferType': 'Received',
                        'quantity': 98.1
                    }
                ]
            },
            'scheduleB': {
                'records': [
                    {
                        'fuelType': 'LNG',
                        'fuelClass': 'Diesel',
                        'quantity': 11.11,
                        'provisionOfTheAct': 'Section 6 (5) (d) (ii) (B)',
                        'intensity': 88.8,
                    },
                    {
                        'fuelType': 'LNG',
                        'fuelClass': 'Diesel',
                        'quantity': 12.12,
                        'provisionOfTheAct': 'Section 6 (5) (c)',
                        'fuelCode': 1
                    }
                ]
            },
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
            },
            'scheduleD': {
                'sheets': [
                    {
                        'fuelType': 'LNG',
                        'fuelClass': 'Diesel',
                        'feedstock': 'Corn',
                        'inputs': [
                            {
                                'worksheet_name': 'GHG Inputs',
                                'cell': 'A2',
                                'value': '12.04',
                                'units': 'tonnes',
                                'description': 'test',
                            },
                            {
                                'worksheet_name': 'GHG Inputs',
                                'cell': 'ZZ9ZZA',
                                'value': 'about 98',
                                'units': 'percent',
                            }
                        ],
                        'outputs': [
                            {
                                'description': 'CO₂ and H₂S Removed',
                                'intensity': 3.01
                            }
                        ]
                    }
                ]
            },
        }

        response = self.clients['fs_user_1'].patch(
            '/api/compliance_reports/1',
            content_type='application/json',
            data=json.dumps(payload)
        )

        response_data = json.loads(response.content.decode("utf-8"))

        self.assertIsNotNone(response_data['scheduleC'])
        self.assertEqual(len(response_data['scheduleC']['records']), 2)

        self.assertIsNotNone(response_data['scheduleA'])
        self.assertEqual(len(response_data['scheduleA']['records']), 1)

        self.assertIsNotNone(response_data['scheduleD'])
        self.assertEqual(len(response_data['scheduleD']['sheets']), 1)
        self.assertEqual(len(response_data['scheduleD']['sheets'][0]['inputs']), 2)
        self.assertEqual(len(response_data['scheduleD']['sheets'][0]['outputs']), 1)

        self.assertIsNotNone(response_data['summary'])

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.clients['fs_user_1'].get('/api/compliance_reports/1')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response_data = json.loads(response.content.decode("utf-8"))

        self.assertIsNotNone(response_data['scheduleC'])
        self.assertEqual(len(response_data['scheduleC']['records']), 2)
        self.assertIsNotNone(response_data['scheduleA'])
        self.assertEqual(len(response_data['scheduleA']['records']), 1)
        self.assertIsNotNone(response_data['scheduleD'])
        self.assertEqual(len(response_data['scheduleD']['sheets']), 1)
        self.assertEqual(len(response_data['scheduleD']['sheets'][0]['inputs']), 2)
        self.assertEqual(len(response_data['scheduleD']['sheets'][0]['outputs']), 1)

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
        self.assertIsNotNone(response_data['scheduleA'])
        self.assertEqual(len(response_data['scheduleA']['records']), 1)
        self.assertIsNotNone(response_data['scheduleD'])
        self.assertEqual(len(response_data['scheduleD']['sheets']), 1)
        self.assertEqual(len(response_data['scheduleD']['sheets'][0]['inputs']), 2)
        self.assertEqual(len(response_data['scheduleD']['sheets'][0]['outputs']), 1)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_draft_compliance_report_authorized(self):
        payload = {
            'status': 'Submitted'
        }

        response = self.clients['fs_user_1'].patch(
            '/api/compliance_reports/1',
            content_type='application/json',
            data=json.dumps(payload)
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

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
