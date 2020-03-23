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

from api.models import OrganizationBalance
from api.models.CompliancePeriod import CompliancePeriod
from api.models.ComplianceReport import ComplianceReport, ComplianceReportStatus, ComplianceReportType, \
    ComplianceReportWorkflowState
from api.models.NotificationMessage import NotificationMessage
from api.models.Organization import Organization
from .base_test_case import BaseTestCase


class TestComplianceReporting(BaseTestCase):
    """Tests for the compliance reporting endpoint"""
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
        report.compliance_period = CompliancePeriod.objects.get_by_natural_key('2018')
        report.type = ComplianceReportType.objects.get_by_natural_key(report_type)
        report.create_timestamp = timezone.now()
        report.update_timestamp = timezone.now()

        report.save()
        report.refresh_from_db()
        return report.id

    def test_list_compliance_reports_fs1(self):
        response = self.clients['fs_user_1'].get('/api/compliance_reports')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        compliance_reports = response.json()
        self.assertEqual(len(compliance_reports), 3)

    def test_list_compliance_reports_unauthorized(self):
        response = self.clients['fs_user_2'].get('/api/compliance_reports')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_list_compliance_gov(self):
        response = self.clients['gov_analyst'].get('/api/compliance_reports')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        compliance_reports = response.json()
        self.assertEqual(len(compliance_reports), 1)

    def test_get_compliance_report_details_authorized(self):
        rid = self._create_compliance_report()
        response = self.clients['fs_user_1'].get('/api/compliance_reports/{id}'.format(id=rid))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_compliance_report_details_unauthorized(self):
        rid = self._create_compliance_report()
        response = self.clients['fs_user_2'].get('/api/compliance_reports/{id}'.format(id=rid))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_get_compliance_report_details_gov_authorized(self):
        response = self.clients['gov_analyst'].get('/api/compliance_reports/2')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_compliance_report_details_gov_unauthorized(self):
        response = self.clients['gov_analyst'].get('/api/compliance_reports/3')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_create_draft_compliance_report_authorized(self):
        payload = {
            'status': {'fuelSupplierStatus': 'Draft'},
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
                        'fuelType': 'CNG',
                        'fuelClass': 'Diesel',
                        'quantity': 10,
                        'provisionOfTheAct': 'Section 6 (5) (d) (ii) (B)',
                        'fuelCode': None,
                        'intensity': 12
                    },
                    {
                        'fuelType': 'CNG',
                        'fuelClass': 'Diesel',
                        'quantity': 5,
                        'provisionOfTheAct': 'Section 6 (5) (d) (ii) (B)',
                        'fuelCode': None,
                        'intensity': 13
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
                        'quantity': 98
                    },
                    {
                        'tradingPartner': 'AB',
                        'postalAddress': '123 Main St\nVictoria, BC',
                        'fuelClass': 'Diesel',
                        'transferType': 'Received',
                        'quantity': 99
                    },
                    {
                        'tradingPartner': 'EF',
                        'postalAddress': '123 Main St\nVictoria, BC',
                        'fuelClass': 'Diesel',
                        'transferType': 'Received',
                        'quantity': 100
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
                        'outputs': [
                            {'description': 'Fuel Dispensing', 'intensity': '1.3'},
                            {'description': 'Fuel Distribution and Storage', 'intensity': '1.3'},
                            {'description': 'Fuel Production', 'intensity': '1.3'},
                            {'description': 'Feedstock Transmission', 'intensity': '1.3'},
                            {'description': 'Feedstock Recovery', 'intensity': '1.3'},
                            {'description': 'Feedstock Upgrading', 'intensity': '1.3'},
                            {'description': 'Land Use Change', 'intensity': '1.3'},
                            {'description': 'Fertilizer Manufacture', 'intensity': '1.3'},
                            {'description': 'Gas Leaks and Flares', 'intensity': '1.3'},
                            {'description': 'CO₂ and H₂S Removed', 'intensity': '1.3'},
                            {'description': 'Emissions Displaced', 'intensity': '1.3'},
                            {'description': 'Fuel Use (High Heating Value)', 'intensity': '1.3'}
                        ]
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
                        'outputs': [
                            {'description': 'Fuel Dispensing', 'intensity': '1.3'},
                            {'description': 'Fuel Distribution and Storage', 'intensity': '1.3'},
                            {'description': 'Fuel Production', 'intensity': '1.3'},
                            {'description': 'Feedstock Transmission', 'intensity': '1.3'},
                            {'description': 'Feedstock Recovery', 'intensity': '1.3'},
                            {'description': 'Feedstock Upgrading', 'intensity': '1.3'},
                            {'description': 'Land Use Change', 'intensity': '1.3'},
                            {'description': 'Fertilizer Manufacture', 'intensity': '1.3'},
                            {'description': 'Gas Leaks and Flares', 'intensity': '1.3'},
                            {'description': 'CO₂ and H₂S Removed', 'intensity': '1.3'},
                            {'description': 'Emissions Displaced', 'intensity': '1.3'},
                            {'description': 'Fuel Use (High Heating Value)', 'intensity': '1.3'}
                        ]
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
                        'outputs': [
                            {'description': 'Fuel Dispensing', 'intensity': '1.3'},
                            {'description': 'Fuel Distribution and Storage', 'intensity': '1.3'},
                            {'description': 'Fuel Production', 'intensity': '1.3'},
                            {'description': 'Feedstock Transmission', 'intensity': '1.3'},
                            {'description': 'Feedstock Recovery', 'intensity': '1.3'},
                            {'description': 'Feedstock Upgrading', 'intensity': '1.3'},
                            {'description': 'Land Use Change', 'intensity': '1.3'},
                            {'description': 'Fertilizer Manufacture', 'intensity': '1.3'},
                            {'description': 'Gas Leaks and Flares', 'intensity': '1.3'},
                            {'description': 'CO₂ and H₂S Removed', 'intensity': '1.3'},
                            {'description': 'Emissions Displaced', 'intensity': '1.3'},
                            {'description': 'Fuel Use (High Heating Value)', 'intensity': '1.3'}
                        ]
                    }
                ]
            },
        }
        rid = self._create_compliance_report()

        response = self.clients['fs_user_1'].patch(
            '/api/compliance_reports/{id}'.format(id=rid),
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
                        'intensity': '23.50'
                    }
                ]
            }
        }
        rid = self._create_compliance_report()

        response = self.clients['fs_user_1'].patch(
            '/api/compliance_reports/{id}'.format(id=rid),
            content_type='application/json',
            data=json.dumps(payload)
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response_data = json.loads(response.content.decode("utf-8"))

        self.assertEqual(response_data['scheduleB']['records'][0]['intensity'], '23.50')

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
        rid = self._create_compliance_report()

        response = self.clients['fs_user_1'].patch(
            '/api/compliance_reports/{id}'.format(id=rid),
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
        rid = self._create_compliance_report()

        response = self.clients['fs_user_1'].patch(
            '/api/compliance_reports/{id}'.format(id=rid),
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
        rid = self._create_compliance_report()

        response = self.clients['fs_user_1'].patch(
            '/api/compliance_reports/{id}'.format(id=rid),
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
                        'outputs': [
                            {'description': 'Fuel Dispensing', 'intensity': '1.3'},
                            {'description': 'Fuel Distribution and Storage', 'intensity': '1.3'},
                            {'description': 'Fuel Production', 'intensity': '1.3'},
                            {'description': 'Feedstock Transmission', 'intensity': '1.3'},
                            {'description': 'Feedstock Recovery', 'intensity': '1.3'},
                            {'description': 'Feedstock Upgrading', 'intensity': '1.3'},
                            {'description': 'Land Use Change', 'intensity': '1.3'},
                            {'description': 'Fertilizer Manufacture', 'intensity': '1.3'},
                            {'description': 'Gas Leaks and Flares', 'intensity': '1.3'},
                            {'description': 'CO₂ and H₂S Removed', 'intensity': '1.3'},
                            {'description': 'Emissions Displaced', 'intensity': '1.3'},
                            {'description': 'Fuel Use (High Heating Value)', 'intensity': '1.3'}
                        ]
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
                        'outputs': [
                            {'description': 'Fuel Dispensing', 'intensity': '1.3'},
                            {'description': 'Fuel Distribution and Storage', 'intensity': '1.3'},
                            {'description': 'Fuel Production', 'intensity': '1.3'},
                            {'description': 'Feedstock Transmission', 'intensity': '1.3'},
                            {'description': 'Feedstock Recovery', 'intensity': '1.3'},
                            {'description': 'Feedstock Upgrading', 'intensity': '1.3'},
                            {'description': 'Land Use Change', 'intensity': '1.3'},
                            {'description': 'Fertilizer Manufacture', 'intensity': '1.3'},
                            {'description': 'Gas Leaks and Flares', 'intensity': '1.3'},
                            {'description': 'CO₂ and H₂S Removed', 'intensity': '1.3'},
                            {'description': 'Emissions Displaced', 'intensity': '1.3'},
                            {'description': 'Fuel Use (High Heating Value)', 'intensity': '1.3'}
                        ]
                    }
                ]
            },
        }
        rid = self._create_compliance_report()

        response = self.clients['fs_user_1'].patch(
            '/api/compliance_reports/{id}'.format(id=rid),
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
                        'outputs': [
                            {'description': 'Fuel Dispensing', 'intensity': '1.3'},
                            {'description': 'Fuel Distribution and Storage', 'intensity': '1.3'},
                            {'description': 'Fuel Production', 'intensity': '1.3'},
                            {'description': 'Feedstock Transmission', 'intensity': '1.3'},
                            {'description': 'Feedstock Recovery', 'intensity': '1.3'},
                            {'description': 'Feedstock Upgrading', 'intensity': '1.3'},
                            {'description': 'Land Use Change', 'intensity': '1.3'},
                            {'description': 'Fertilizer Manufacture', 'intensity': '1.3'},
                            {'description': 'Gas Leaks and Flares', 'intensity': '1.3'},
                            {'description': 'CO₂ and H₂S Removed', 'intensity': '1.3'},
                            {'description': 'Emissions Displaced', 'intensity': '1.3'},
                            {'description': 'Fuel Use (High Heating Value)', 'intensity': '1.3'}
                        ]
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
                        'outputs': [
                            {'description': 'Fuel Dispensing', 'intensity': '1.3'},
                            {'description': 'Fuel Distribution and Storage', 'intensity': '1.3'},
                            {'description': 'Fuel Production', 'intensity': '1.3'},
                            {'description': 'Feedstock Transmission', 'intensity': '1.3'},
                            {'description': 'Feedstock Recovery', 'intensity': '1.3'},
                            {'description': 'Feedstock Upgrading', 'intensity': '1.3'},
                            {'description': 'Land Use Change', 'intensity': '1.3'},
                            {'description': 'Fertilizer Manufacture', 'intensity': '1.3'},
                            {'description': 'Gas Leaks and Flares', 'intensity': '1.3'},
                            {'description': 'CO₂ and H₂S Removed', 'intensity': '1.3'},
                            {'description': 'Emissions Displaced', 'intensity': '1.3'},
                            {'description': 'Fuel Use (High Heating Value)', 'intensity': '1.3'}
                        ]
                    }
                ]
            },
        }
        rid = self._create_compliance_report()

        response = self.clients['fs_user_1'].patch(
            '/api/compliance_reports/{id}'.format(id=rid),
            content_type='application/json',
            data=json.dumps(payload)
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_submitted_compliance_report_authorized(self):
        payload = {
            'status': {'fuelSupplierStatus': 'Submitted'},
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
                        'quantity': 88,
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
        rid = self._create_compliance_report()

        response = self.clients['fs_user_1'].patch(
            '/api/compliance_reports/{id}'.format(id=rid),
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
                        'quantity': 4
                    }
                ]
            },
            'scheduleB': {
                'records': [
                    {
                        'fuelType': 'LNG',
                        'fuelClass': 'Diesel',
                        'quantity': 11,
                        'provisionOfTheAct': 'Section 6 (5) (d) (ii) (B)',
                        'intensity': 33.2,
                    },
                    {
                        'fuelType': 'LNG',
                        'fuelClass': 'Diesel',
                        'quantity': 44,
                        'provisionOfTheAct': 'Section 6 (5) (d) (ii) (B)',
                        'intensity': 77.6,
                    }
                ]
            },
            'scheduleC': {
                'records': [
                    {
                        'fuelType': 'LNG',
                        'fuelClass': 'Diesel',
                        'quantity': 89,
                        'expectedUse': 'Other',
                        'rationale': 'Patched'
                    },
                    {
                        'fuelType': 'LNG',
                        'fuelClass': 'Diesel',
                        'quantity': 88,
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
                            {'description': 'Fuel Dispensing', 'intensity': '1.3'},
                            {'description': 'Fuel Distribution and Storage', 'intensity': '1.3'},
                            {'description': 'Fuel Production', 'intensity': '1.3'},
                            {'description': 'Feedstock Transmission', 'intensity': '1.3'},
                            {'description': 'Feedstock Recovery', 'intensity': '1.3'},
                            {'description': 'Feedstock Upgrading', 'intensity': '1.3'},
                            {'description': 'Land Use Change', 'intensity': '1.3'},
                            {'description': 'Fertilizer Manufacture', 'intensity': '1.3'},
                            {'description': 'Gas Leaks and Flares', 'intensity': '1.3'},
                            {'description': 'CO₂ and H₂S Removed', 'intensity': '1.3'},
                            {'description': 'Emissions Displaced', 'intensity': '1.3'},
                            {'description': 'Fuel Use (High Heating Value)', 'intensity': '1.3'}
                        ]
                    }
                ]
            },
        }

        response = self.clients['fs_user_1'].patch(
            '/api/compliance_reports/{id}'.format(id=rid),
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
        self.assertEqual(len(response_data['scheduleD']['sheets'][0]['outputs']), 12)

        self.assertIsNotNone(response_data['summary'])

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.clients['fs_user_1'].get('/api/compliance_reports/{id}'
                                                 .format(id=rid))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response_data = json.loads(response.content.decode("utf-8"))

        self.assertIsNotNone(response_data['scheduleC'])
        self.assertEqual(len(response_data['scheduleC']['records']), 2)
        self.assertIsNotNone(response_data['scheduleA'])
        self.assertEqual(len(response_data['scheduleA']['records']), 1)
        self.assertIsNotNone(response_data['scheduleD'])
        self.assertEqual(len(response_data['scheduleD']['sheets']), 1)
        self.assertEqual(len(response_data['scheduleD']['sheets'][0]['inputs']), 2)
        self.assertEqual(len(response_data['scheduleD']['sheets'][0]['outputs']), 12)

        payload = {
            'scheduleC': {
                'records': [
                    {
                        'fuelType': 'LNG',
                        'fuelClass': 'Diesel',
                        'quantity': 88,
                        'expectedUse': 'Other',
                        'rationale': 'Patched'
                    },
                    {
                        'fuelType': 'LNG',
                        'fuelClass': 'Diesel',
                        'quantity': 88,
                        'expectedUse': 'Other',
                        'rationale': 'Patched Again'
                    }
                ]
            }
        }

        response = self.clients['fs_user_1'].patch(
            '/api/compliance_reports/{id}'.format(id=rid),
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
        self.assertEqual(len(response_data['scheduleD']['sheets'][0]['outputs']), 12)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_draft_compliance_report_authorized(self):
        payload = {
            'status': {'fuelSupplierStatus': 'Submitted'},
        }
        rid = self._create_compliance_report()

        response = self.clients['fs_user_1'].patch(
            '/api/compliance_reports/{id}'.format(id=rid),
            content_type='application/json',
            data=json.dumps(payload)
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_revert_submitted_compliance_report_fails(self):
        payload = {
            'status': {'fuelSupplierStatus': 'Submitted'},
        }

        rid = self._create_compliance_report()

        response = self.clients['fs_user_1'].patch(
            '/api/compliance_reports/{id}'.format(id=rid),
            content_type='application/json',
            data=json.dumps(payload)
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        payload = {
            'status': {'fuelSupplierStatus': 'Draft'},
        }

        response = self.clients['fs_user_1'].patch(
            '/api/compliance_reports/{id}'.format(id=rid),
            content_type='application/json',
            data=json.dumps(payload)
        )

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_patch_submitted_fails(self):
        payload = {
            'status': {'fuelSupplierStatus': 'Submitted'},
        }

        rid = self._create_compliance_report()

        response = self.clients['fs_user_1'].patch(
            '/api/compliance_reports/{id}'.format(id=rid),
            content_type='application/json',
            data=json.dumps(payload)
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        payload = {
            'scheduleB': {
                'records': [
                    {
                        'fuelType': 'LNG',
                        'fuelClass': 'Diesel',
                        'quantity': 211,
                        'provisionOfTheAct': 'Section 6 (5) (d) (ii) (B)',
                        'intensity': 88.8,
                    },
                    {
                        'fuelType': 'LNG',
                        'fuelClass': 'Diesel',
                        'quantity': 500,
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
                        'quantity': 400,
                        'expectedUse': 'Other',
                        'rationale': 'Patched'
                    },
                    {
                        'fuelType': 'LNG',
                        'fuelClass': 'Diesel',
                        'quantity': 200,
                        'expectedUse': 'Other',
                        'rationale': 'Patched Again'
                    }
                ]
            },
        }

        response = self.clients['fs_user_1'].patch(
            '/api/compliance_reports/{id}'.format(id=rid),
            content_type='application/json',
            data=json.dumps(payload)
        )

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_draft_compliance_report_unauthorized(self):
        payload = {
            'status': {'fuelSupplierStatus': 'Draft'},
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
            'status': {'fuelSupplierStatus': 'Draft'},
            'type': 'Compliance Report',
            'compliance_period': '2019'
        }

        response = self.clients['gov_analyst'].post(
            '/api/compliance_reports',
            content_type='application/json',
            data=json.dumps(payload)
        )

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_happy_signing_path_results_in_reduction(self):
        initial_balance = self.users['fs_user_1'].organization.organization_balance['validated_credits']

        rid = self._create_compliance_report()

        payload = {
            'status': {
                'fuelSupplierStatus': 'Submitted'
            },
            'scheduleB': {
                'records': [
                    {
                        'fuelType': 'LNG',
                        'fuelClass': 'Diesel',
                        'quantity': 10000,
                        'provisionOfTheAct': 'Section 6 (5) (d) (ii) (B)',
                        'intensity': 100,
                    },
                ]
            },
            'summary': {
                'creditsOffset': 3,
            }
        }

        response = self.clients['fs_user_1'].patch(
            '/api/compliance_reports/{id}'.format(id=rid),
            content_type='application/json',
            data=json.dumps(payload)
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        payload = {
            'status': {
                'analystStatus': 'Recommended'
            }
        }

        response = self.clients['gov_analyst'].patch(
            '/api/compliance_reports/{id}'.format(id=rid),
            content_type='application/json',
            data=json.dumps(payload)
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        payload = {
            'status': {
                'managerStatus': 'Recommended'
            }
        }

        response = self.clients['gov_manager'].patch(
            '/api/compliance_reports/{id}'.format(id=rid),
            content_type='application/json',
            data=json.dumps(payload)
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        payload = {
            'status': {
                'directorStatus': 'Accepted'
            }
        }

        response = self.clients['gov_director'].patch(
            '/api/compliance_reports/{id}'.format(id=rid),
            content_type='application/json',
            data=json.dumps(payload)
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.clients['fs_user_1'].get(
            '/api/compliance_reports/{id}'.format(id=rid)
        )

        response_data = json.loads(response.content.decode("utf-8"))
        self.assertEqual(response_data['status']['fuelSupplierStatus'], 'Submitted')
        self.assertEqual(response_data['status']['analystStatus'], None)  # hidden
        self.assertEqual(response_data['status']['managerStatus'], None)  # hidden
        self.assertEqual(response_data['status']['directorStatus'], 'Accepted')
        self.assertEqual(response_data['actor'], 'FUEL_SUPPLIER')
        self.assertListEqual(response_data['actions'], ['CREATE_SUPPLEMENTAL'])

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        final_balance = self.users['fs_user_1'].organization.organization_balance['validated_credits']

        self.assertLess(final_balance, initial_balance)

    def test_happy_signing_path_results_in_validation(self):
        initial_balance = self.users['fs_user_1'].organization.organization_balance['validated_credits']

        rid = self._create_compliance_report()

        payload = {
            'status': {
                'fuelSupplierStatus': 'Submitted'
            },
            'scheduleB': {
                'records': [
                    {
                        'fuelType': 'LNG',
                        'fuelClass': 'Diesel',
                        'quantity': 1000000,
                        'provisionOfTheAct': 'Section 6 (5) (d) (ii) (A)',
                        'fuelCode': None,
                        'scheduleDSheetIndex': 0
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
                        'outputs': [
                            {'description': 'Fuel Dispensing', 'intensity': '1.3'},
                            {'description': 'Fuel Distribution and Storage', 'intensity': '1.3'},
                            {'description': 'Fuel Production', 'intensity': '1.3'},
                            {'description': 'Feedstock Transmission', 'intensity': '1.3'},
                            {'description': 'Feedstock Recovery', 'intensity': '1.3'},
                            {'description': 'Feedstock Upgrading', 'intensity': '1.3'},
                            {'description': 'Land Use Change', 'intensity': '1.3'},
                            {'description': 'Fertilizer Manufacture', 'intensity': '1.3'},
                            {'description': 'Gas Leaks and Flares', 'intensity': '1.3'},
                            {'description': 'CO₂ and H₂S Removed', 'intensity': '1.3'},
                            {'description': 'Emissions Displaced', 'intensity': '1.3'},
                            {'description': 'Fuel Use (High Heating Value)', 'intensity': '1.3'}
                        ]
                    }
                ]
            },
            'summary': {
                'creditsOffset': 0,
            }
        }

        response = self.clients['fs_user_1'].patch(
            '/api/compliance_reports/{id}'.format(id=rid),
            content_type='application/json',
            data=json.dumps(payload)
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        payload = {
            'status': {
                'analystStatus': 'Recommended'
            }
        }

        response = self.clients['gov_analyst'].patch(
            '/api/compliance_reports/{id}'.format(id=rid),
            content_type='application/json',
            data=json.dumps(payload)
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        payload = {
            'status': {
                'managerStatus': 'Recommended'
            }
        }

        response = self.clients['gov_manager'].patch(
            '/api/compliance_reports/{id}'.format(id=rid),
            content_type='application/json',
            data=json.dumps(payload)
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        payload = {
            'status': {
                'directorStatus': 'Accepted'
            }
        }

        response = self.clients['gov_director'].patch(
            '/api/compliance_reports/{id}'.format(id=rid),
            content_type='application/json',
            data=json.dumps(payload)
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.clients['fs_user_1'].get(
            '/api/compliance_reports/{id}'.format(id=rid)
        )

        response_data = json.loads(response.content.decode("utf-8"))
        self.assertEqual(response_data['status']['fuelSupplierStatus'], 'Submitted')
        self.assertEqual(response_data['status']['analystStatus'], None)  # hidden
        self.assertEqual(response_data['status']['managerStatus'], None)  # hidden
        self.assertEqual(response_data['status']['directorStatus'], 'Accepted')
        self.assertEqual(response_data['actor'], 'FUEL_SUPPLIER')
        self.assertListEqual(response_data['actions'], ['CREATE_SUPPLEMENTAL'])

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        final_balance = self.users['fs_user_1'].organization.organization_balance['validated_credits']

        self.assertGreater(final_balance, initial_balance)

    def test_happy_signing_path_results_in_validation(self):
        initial_balance = self.users['fs_user_1'].organization.organization_balance['validated_credits']

        rid = self._create_compliance_report()

        payload = {
            'status': {
                'fuelSupplierStatus': 'Submitted'
            },
            'scheduleB': {
                'records': [
                    {
                        'fuelType': 'LNG',
                        'fuelClass': 'Diesel',
                        'quantity': 20,
                        'provisionOfTheAct': 'Section 6 (5) (d) (ii) (A)',
                        'fuelCode': None,
                        'scheduleDSheetIndex': 0
                    },
                    {
                        'fuelType': 'LNG',
                        'fuelClass': 'Diesel',
                        'quantity': 3000000,
                        'provisionOfTheAct': 'Section 6 (5) (d) (ii) (B)',
                        'intensity': 120,
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
                        'outputs': [
                            {'description': 'Fuel Dispensing', 'intensity': '1.3'},
                            {'description': 'Fuel Distribution and Storage', 'intensity': '1.3'},
                            {'description': 'Fuel Production', 'intensity': '1.3'},
                            {'description': 'Feedstock Transmission', 'intensity': '1.3'},
                            {'description': 'Feedstock Recovery', 'intensity': '1.3'},
                            {'description': 'Feedstock Upgrading', 'intensity': '1.3'},
                            {'description': 'Land Use Change', 'intensity': '1.3'},
                            {'description': 'Fertilizer Manufacture', 'intensity': '1.3'},
                            {'description': 'Gas Leaks and Flares', 'intensity': '1.3'},
                            {'description': 'CO₂ and H₂S Removed', 'intensity': '1.3'},
                            {'description': 'Emissions Displaced', 'intensity': '1.3'},
                            {'description': 'Fuel Use (High Heating Value)', 'intensity': '1.3'}
                        ]
                    }
                ]
            },
            'summary': {
                'creditsOffset': 5,
            }
        }

        response = self.clients['fs_user_1'].patch(
            '/api/compliance_reports/{id}'.format(id=rid),
            content_type='application/json',
            data=json.dumps(payload)
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        payload = {
            'status': {
                'analystStatus': 'Recommended'
            }
        }

        response = self.clients['gov_analyst'].patch(
            '/api/compliance_reports/{id}'.format(id=rid),
            content_type='application/json',
            data=json.dumps(payload)
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        payload = {
            'status': {
                'managerStatus': 'Recommended'
            }
        }

        response = self.clients['gov_manager'].patch(
            '/api/compliance_reports/{id}'.format(id=rid),
            content_type='application/json',
            data=json.dumps(payload)
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        payload = {
            'status': {
                'directorStatus': 'Accepted'
            }
        }

        response = self.clients['gov_director'].patch(
            '/api/compliance_reports/{id}'.format(id=rid),
            content_type='application/json',
            data=json.dumps(payload)
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.clients['fs_user_1'].get(
            '/api/compliance_reports/{id}'.format(id=rid)
        )

        response_data = json.loads(response.content.decode("utf-8"))
        self.assertEqual(response_data['status']['fuelSupplierStatus'], 'Submitted')
        self.assertEqual(response_data['status']['analystStatus'], None)  # hidden
        self.assertEqual(response_data['status']['managerStatus'], None)  # hidden
        self.assertEqual(response_data['status']['directorStatus'], 'Accepted')
        self.assertEqual(response_data['actor'], 'FUEL_SUPPLIER')
        self.assertListEqual(response_data['actions'], ['CREATE_SUPPLEMENTAL'])

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        intermediate_balance = self.users['fs_user_1'].organization.organization_balance['validated_credits']

        self.assertLess(intermediate_balance, initial_balance)

        # create a supplemental

        payload = {
            'supplements': rid,
            'status': {'fuelSupplierStatus': 'Draft'},
            'type': 'Compliance Report',
            'compliancePeriod': '2019'
        }

        response = self.clients['fs_user_1'].post(
            '/api/compliance_reports',
            content_type='application/json',
            data=json.dumps(payload)
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        sid = response.json()['id']

        payload = {
            'status': {
                'fuelSupplierStatus': 'Submitted'
            },
            'scheduleB': {
                'records': [
                    {
                        'fuelType': 'LNG',
                        'fuelClass': 'Diesel',
                        'quantity': 40000000,
                        'provisionOfTheAct': 'Section 6 (5) (d) (ii) (A)',
                        'fuelCode': None,
                        'scheduleDSheetIndex': 0
                    },
                    {
                        'fuelType': 'LNG',
                        'fuelClass': 'Diesel',
                        'quantity': 30,
                        'provisionOfTheAct': 'Section 6 (5) (d) (ii) (B)',
                        'intensity': 120,
                    }
                ]
            },
            'summary': {
                'creditsOffset': 0,
            },
            'supplementalNote': 'Forgot a railcar or two'
        }

        response = self.clients['fs_user_1'].patch(
            '/api/compliance_reports/{id}'.format(id=sid),
            content_type='application/json',
            data=json.dumps(payload)
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        payload = {
            'status': {
                'analystStatus': 'Recommended'
            }
        }

        response = self.clients['gov_analyst'].patch(
            '/api/compliance_reports/{id}'.format(id=sid),
            content_type='application/json',
            data=json.dumps(payload)
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        payload = {
            'status': {
                'managerStatus': 'Recommended'
            }
        }

        response = self.clients['gov_manager'].patch(
            '/api/compliance_reports/{id}'.format(id=sid),
            content_type='application/json',
            data=json.dumps(payload)
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        payload = {
            'status': {
                'directorStatus': 'Accepted'
            }
        }

        response = self.clients['gov_director'].patch(
            '/api/compliance_reports/{id}'.format(id=sid),
            content_type='application/json',
            data=json.dumps(payload)
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.clients['fs_user_1'].get(
            '/api/compliance_reports/{id}'.format(id=sid)
        )

        response_data = json.loads(response.content.decode("utf-8"))
        self.assertEqual(response_data['status']['fuelSupplierStatus'], 'Submitted')
        self.assertEqual(response_data['status']['analystStatus'], None)  # hidden
        self.assertEqual(response_data['status']['managerStatus'], None)  # hidden
        self.assertEqual(response_data['status']['directorStatus'], 'Accepted')
        self.assertEqual(response_data['status']['directorStatus'], 'Accepted')
        self.assertListEqual(response_data['actions'], ['CREATE_SUPPLEMENTAL'])

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        final_balance = self.users['fs_user_1'].organization.organization_balance['validated_credits']
        self.assertGreater(final_balance, initial_balance)
        self.assertGreater(final_balance, intermediate_balance)

    def test_create_supplemental(self):
        rid = self._create_compliance_report()

        payload = {
            'status': {
                'fuelSupplierStatus': 'Submitted'
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
                        'quantity': 98
                    },
                    {
                        'tradingPartner': 'AB',
                        'postalAddress': '123 Main St\nVictoria, BC',
                        'fuelClass': 'Diesel',
                        'transferType': 'Received',
                        'quantity': 99
                    },
                    {
                        'tradingPartner': 'EF',
                        'postalAddress': '123 Main St\nVictoria, BC',
                        'fuelClass': 'Diesel',
                        'transferType': 'Received',
                        'quantity': 100
                    }
                ]
            },
            'scheduleB': {
                'records': [
                    {
                        'fuelType': 'LNG',
                        'fuelClass': 'Diesel',
                        'quantity': 1000000,
                        'provisionOfTheAct': 'Section 6 (5) (d) (ii) (A)',
                        'fuelCode': None,
                        'scheduleDSheetIndex': 0
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
                        'outputs': [
                            {'description': 'Fuel Dispensing', 'intensity': '1.3'},
                            {'description': 'Fuel Distribution and Storage', 'intensity': '1.3'},
                            {'description': 'Fuel Production', 'intensity': '1.3'},
                            {'description': 'Feedstock Transmission', 'intensity': '1.3'},
                            {'description': 'Feedstock Recovery', 'intensity': '1.3'},
                            {'description': 'Feedstock Upgrading', 'intensity': '1.3'},
                            {'description': 'Land Use Change', 'intensity': '1.3'},
                            {'description': 'Fertilizer Manufacture', 'intensity': '1.3'},
                            {'description': 'Gas Leaks and Flares', 'intensity': '1.3'},
                            {'description': 'CO₂ and H₂S Removed', 'intensity': '1.3'},
                            {'description': 'Emissions Displaced', 'intensity': '1.3'},
                            {'description': 'Fuel Use (High Heating Value)', 'intensity': '1.3'}
                        ]
                    }
                ]
            },
            'summary': {
                'creditsOffset': 0,
            }
        }

        response = self.clients['fs_user_1'].patch(
            '/api/compliance_reports/{id}'.format(id=rid),
            content_type='application/json',
            data=json.dumps(payload)
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        payload = {
            'supplements': rid,
            'status': {'fuelSupplierStatus': 'Draft'},
            'type': 'Compliance Report',
            'compliancePeriod': '2019'
        }

        response = self.clients['fs_user_1'].post(
            '/api/compliance_reports',
            content_type='application/json',
            data=json.dumps(payload)
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_draft_exclusion_report_authorized(self):
        payload = {
            'status': {'fuelSupplierStatus': 'Draft'},
            'type': 'Exclusion Report',
            'compliance_period': '2019'
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

    def test_patch_exclusion_report(self):
        payload = {
            'exclusionAgreement': {
                'records': [{
                    'fuelType': "LNG",
                    'postalAddress':
                        "P.O. Box 294   Harrison Hot Springs, BC V0M 1K0",
                    'quantity': 1000,
                    'quantityNotSold': 500,
                    'transactionPartner': "Burden Propane Inc.",
                    'transactionType': "Purchased"
                }]
            }
        }
        compliance_report_id = self._create_compliance_report("Exclusion Report")

        response = self.clients['fs_user_1'].patch(
            '/api/compliance_reports/{id}'.format(id=compliance_report_id),
            content_type='application/json',
            data=json.dumps(payload)
        )

        response_data = json.loads(response.content.decode("utf-8"))

        self.assertIsNotNone(response_data['exclusionAgreement'])
        self.assertEqual(len(response_data['exclusionAgreement']['records']), 1)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        payload = {
            'exclusionAgreement': {
                'records': [{
                    'fuelType': "LNG",
                    'postalAddress':
                        "P.O. Box 294   Harrison Hot Springs, BC V0M 1K0",
                    'quantity': 1000,
                    'quantityNotSold': 500,
                    'transactionPartner': "Burden Propane Inc.",
                    'transactionType': "Purchased"
                }, {
                    'fuelType': "Ethanol",
                    'postalAddress':
                        "1375 Hastings Street   Victoria, BC V8Z 2W5",
                    'quantity': 2000,
                    'quantityNotSold': 750,
                    'transactionPartner': "Vancouver Island Propane Services Ltd.",
                    'transactionType': "Sold"
                }]
            }
        }

        response = self.clients['fs_user_1'].patch(
            '/api/compliance_reports/{id}'.format(id=compliance_report_id),
            content_type='application/json',
            data=json.dumps(payload)
        )

        response_data = json.loads(response.content.decode("utf-8"))

        self.assertIsNotNone(response_data['exclusionAgreement'])
        self.assertEqual(len(response_data['exclusionAgreement']['records']), 2)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.clients['fs_user_1'].get(
            '/api/compliance_reports/{id}'.format(id=compliance_report_id))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response_data = json.loads(response.content.decode("utf-8"))

        self.assertIsNotNone(response_data['exclusionAgreement'])
        self.assertEqual(len(response_data['exclusionAgreement']['records']), 2)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_actions(self):
        compliance_report_id = self._create_compliance_report()

        reports_to_check = {
            'Draft': compliance_report_id
        }

        compliance_report_id = self._create_compliance_report()
        report = ComplianceReport.objects.get(id=compliance_report_id)
        report.status.fuel_supplier_status = ComplianceReportStatus.objects.get_by_natural_key('Deleted')
        report.status.save()
        reports_to_check['Deleted'] = compliance_report_id

        compliance_report_id = self._create_compliance_report()
        report = ComplianceReport.objects.get(id=compliance_report_id)
        report.status.fuel_supplier_status = ComplianceReportStatus.objects.get_by_natural_key('Submitted')
        report.status.save()
        reports_to_check['Submitted'] = compliance_report_id

        compliance_report_id = self._create_compliance_report()
        report = ComplianceReport.objects.get(id=compliance_report_id)
        report.status.fuel_supplier_status = ComplianceReportStatus.objects.get_by_natural_key('Submitted')
        report.status.analyst_status = ComplianceReportStatus.objects.get_by_natural_key('Recommended')
        report.status.save()
        reports_to_check['Approved1'] = compliance_report_id

        compliance_report_id = self._create_compliance_report()
        report = ComplianceReport.objects.get(id=compliance_report_id)
        report.status.fuel_supplier_status = ComplianceReportStatus.objects.get_by_natural_key('Submitted')
        report.status.analyst_status = ComplianceReportStatus.objects.get_by_natural_key('Recommended')
        report.status.manager_status = ComplianceReportStatus.objects.get_by_natural_key('Recommended')
        report.status.save()
        reports_to_check['Approved2'] = compliance_report_id

        compliance_report_id = self._create_compliance_report()
        report = ComplianceReport.objects.get(id=compliance_report_id)
        report.status.fuel_supplier_status = ComplianceReportStatus.objects.get_by_natural_key('Submitted')
        report.status.analyst_status = ComplianceReportStatus.objects.get_by_natural_key('Recommended')
        report.status.manager_status = ComplianceReportStatus.objects.get_by_natural_key('Recommended')
        report.status.director_status = ComplianceReportStatus.objects.get_by_natural_key('Accepted')
        report.status.save()
        reports_to_check['ApprovedFinal'] = compliance_report_id

        expected_actions = {
            'Draft': {
                'fs_user_1': {
                    'status': 200,
                    'actor': 'FUEL_SUPPLIER',
                    'actions': ['SUBMIT', 'DELETE']
                },
                'gov_analyst': {
                    'status': 404,
                },
                'gov_manager': {
                    'status': 404,
                },
                'gov_director': {
                    'status': 404,
                }
            },
            'Deleted': {
                'fs_user_1': {
                    'status': 404,
                },
                'gov_analyst': {
                    'status': 404,
                },
                'gov_manager': {
                    'status': 404,
                },
                'gov_director': {
                    'status': 404,
                }
            },
            'Submitted': {
                'fs_user_1': {
                    'status': 200,
                    'actor': 'FUEL_SUPPLIER',
                    'actions': ['CREATE_SUPPLEMENTAL']
                },
                'gov_analyst': {
                    'status': 200,
                    'actor': 'ANALYST',
                    'actions': ['RECOMMEND', 'DISCOMMEND', 'REQUEST_SUPPLEMENTAL']
                },
                'gov_manager': {
                    'status': 200,
                    'actor': 'MANAGER',
                    'actions': ['REQUEST_SUPPLEMENTAL']
                },
                'gov_director': {
                    'status': 200,
                    'actor': 'DIRECTOR',
                    'actions': []
                }
            },
            'Approved1': {
                'fs_user_1': {
                    'status': 200,
                    'actor': 'FUEL_SUPPLIER',
                    'actions': ['CREATE_SUPPLEMENTAL']
                },
                'gov_analyst': {
                    'status': 200,
                    'actor': 'ANALYST',
                    'actions': ['RETRACT', 'REQUEST_SUPPLEMENTAL']
                },
                'gov_manager': {
                    'status': 200,
                    'actor': 'MANAGER',
                    'actions': ['RECOMMEND', 'DISCOMMEND', 'RETURN', 'REQUEST_SUPPLEMENTAL']
                },
                'gov_director': {
                    'status': 200,
                    'actor': 'DIRECTOR',
                    'actions': []
                }
            },
            'Approved2': {
                'fs_user_1': {
                    'status': 200,
                    'actor': 'FUEL_SUPPLIER',
                    'actions': ['CREATE_SUPPLEMENTAL']
                },
                'gov_analyst': {
                    'status': 200,
                    'actor': 'ANALYST',
                    'actions': ['REQUEST_SUPPLEMENTAL']
                },
                'gov_manager': {
                    'status': 200,
                    'actor': 'MANAGER',
                    'actions': ['RETRACT', 'REQUEST_SUPPLEMENTAL']
                },
                'gov_director': {
                    'status': 200,
                    'actor': 'DIRECTOR',
                    'actions': ['ACCEPT', 'REJECT', 'RETURN']
                }
            },
            'ApprovedFinal': {
                'fs_user_1': {
                    'status': 200,
                    'actor': 'FUEL_SUPPLIER',
                    'actions': ['CREATE_SUPPLEMENTAL']
                },
                'gov_analyst': {
                    'status': 200,
                    'actor': 'ANALYST',
                    'actions': ['REQUEST_SUPPLEMENTAL']
                },
                'gov_manager': {
                    'status': 200,
                    'actor': 'MANAGER',
                    'actions': ['REQUEST_SUPPLEMENTAL']
                },
                'gov_director': {
                    'status': 200,
                    'actor': 'DIRECTOR',
                    'actions': []
                }
            },
        }

        for state, report_id in reports_to_check.items():
            users_to_check = expected_actions[state]
            for user, expected_result in users_to_check.items():
                with self.subTest("Check actions for report in state {} with client {}".format(state, user)):
                    response = self.clients[user].get('/api/compliance_reports/{id}'.format(id=report_id))
                    response_data = json.loads(response.content.decode("utf-8"))
                    self.assertEqual(response.status_code, expected_result['status'])
                    if response.status_code == 200:
                        self.assertEqual(response_data['actor'], expected_result['actor'])
                        self.assertListEqual(response_data['actions'], expected_result['actions'])
