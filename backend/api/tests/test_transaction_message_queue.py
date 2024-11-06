# api/tests/test_transaction_message_queue.py

import json
from decimal import Decimal
from unittest.mock import patch

from django.utils import timezone
from rest_framework import status

from api.models import (
    ComplianceReport,
    ComplianceReportStatus,
    ComplianceReportType,
    CompliancePeriod,
    CreditTrade,
    CreditTradeStatus,
    CreditTradeType,
    Organization,
    User,
)
from api.services.TransactionMessageService import TransactionMessageService
from api.services.CreditTradeService import CreditTradeService
from api.services.ComplianceReportService import ComplianceReportService

from .base_test_case import BaseTestCase

class TestTransactionMessageQueue(BaseTestCase):
    """
    Tests to confirm that transaction messages are sent appropriately when
    balance changes occur in TFRS.
    """
    extra_fixtures = [
        'test/test_compliance_reporting.json',
        'test/test_fuel_codes.json',
        'test/test_unit_of_measures.json',
        'test/test_carbon_intensity_limits.json',
        'test/test_default_carbon_intensities.json',
        'test/test_energy_densities.json',
        'test/test_energy_effectiveness_ratio.json',
        'test/test_petroleum_carbon_intensities.json',
        'test/test_transaction_types.json',
        'test/test_organizations.json',
        'test/test_users.json',
    ]

    def setUp(self):
        super().setUp()
        # Set up necessary objects like organizations and users
        self.gov_org = Organization.objects.get(type=1)
        self.fuel_supplier_org = Organization.objects.get_by_natural_key("Test Org 1")
        self.director_user = self.users['gov_director']
        self.analyst_user = self.users['gov_analyst']
        self.manager_user = self.users['gov_manager']
        self.fuel_supplier_user = self.users['fs_user_1']

        # Create clients for the users if not already created
        if not hasattr(self, 'clients'):
            self.clients = {}
        self.clients['gov_director'] = self.create_client(username='gov_director', password='password')
        self.clients['gov_manager'] = self.create_client(username='gov_manager', password='password')
        self.clients['gov_analyst'] = self.create_client(username='gov_analyst', password='password')
        self.clients['fs_user_1'] = self.create_client(username='fs_user_1', password='password')

    def _create_compliance_report(self, report_type="Compliance Report"):
        """
        Helper method to create a compliance report in Draft status.
        """
        report = ComplianceReport()
        report.status = ComplianceReportStatus.objects.create(
            fuel_supplier_status='Draft'
        )
        report.organization = self.fuel_supplier_org
        report.compliance_period = CompliancePeriod.objects.get(description='2020')
        report.type = ComplianceReportType.objects.get(the_type=report_type)
        report.create_user = self.fuel_supplier_user
        report.update_user = self.fuel_supplier_user
        report.save()
        return report.id

    @patch('api.services.TransactionMessageService.send_transaction_message')
    def test_message_sent_on_director_approval(self, mock_send_transaction_message):
        """
        Test that a transaction message is sent when the director approves a compliance report
        that results in a balance change.
        """
        # Create a compliance report and set it up to be approved
        compliance_report_id = self._create_compliance_report()
        compliance_report = ComplianceReport.objects.get(id=compliance_report_id)

        # Simulate the process of submitting and approving the compliance report
        # 1. Fuel Supplier submits the report
        response = self.clients['fs_user_1'].patch(
            f'/api/compliance_reports/{compliance_report_id}',
            content_type='application/json',
            data=json.dumps({'status': {'fuelSupplierStatus': 'Submitted'}})
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # 2. Analyst recommends the report
        response = self.clients['gov_analyst'].patch(
            f'/api/compliance_reports/{compliance_report_id}',
            content_type='application/json',
            data=json.dumps({'status': {'analystStatus': 'Recommended'}})
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # 3. Manager recommends the report
        response = self.clients['gov_manager'].patch(
            f'/api/compliance_reports/{compliance_report_id}',
            content_type='application/json',
            data=json.dumps({'status': {'managerStatus': 'Recommended'}})
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # 4. Director accepts the report
        response = self.clients['gov_director'].patch(
            f'/api/compliance_reports/{compliance_report_id}',
            content_type='application/json',
            data=json.dumps({'status': {'directorStatus': 'Accepted'}})
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Verify that send_transaction_message was called
        self.assertTrue(mock_send_transaction_message.called)

        # Retrieve the compliance report after approval to access any updated fields
        compliance_report.refresh_from_db()

        # Retrieve the required_credit_transaction value from the compliance report logic
        # For this test, we'll assume it's stored in the compliance_report.credit_transaction
        required_credit_transaction = compliance_report.credit_transaction.number_of_credits

        expected_tfrs_id = compliance_report_id
        expected_organization_id = compliance_report.organization.id
        expected_compliance_units_amount = required_credit_transaction

        # Verify that send_transaction_message was called with the correct arguments
        mock_send_transaction_message.assert_called_with(
            tfrs_id=expected_tfrs_id,
            organization_id=expected_organization_id,
            compliance_units_amount=expected_compliance_units_amount
        )

    @patch('api.services.TransactionMessageService.send_transaction_message')
    def test_message_sent_on_credit_transfer(self, mock_send_transaction_message):
        """
        Test that transaction messages are sent when credits are transferred between organizations.
        """
        # Create a credit trade between two organizations
        credit_trade = CreditTrade.objects.create(
            initiator=self.fuel_supplier_org,
            respondent=self.gov_org,
            status=CreditTradeStatus.objects.get(status="Draft"),
            type=CreditTradeType.objects.get(the_type="Sell"),
            number_of_credits=500,
            compliance_period=CompliancePeriod.objects.get(description="2020"),
            trade_effective_date=timezone.now(),
            create_user=self.fuel_supplier_user,
            update_user=self.fuel_supplier_user,
        )

        # Approve the credit trade, which should trigger the transfer and message sending
        CreditTradeService.approve(credit_trade, update_user=self.director_user)

        # Verify that send_transaction_message was called twice
        self.assertEqual(mock_send_transaction_message.call_count, 2)

        # Check calls for both organizations
        expected_calls = [
            # Message for the 'from' organization (balance decrease)
            (('tfrs_id', credit_trade.id),
             ('organization_id', self.fuel_supplier_org.id),
             ('compliance_units_amount', -500)),
            # Message for the 'to' organization (balance increase)
            (('tfrs_id', credit_trade.id),
             ('organization_id', self.gov_org.id),
             ('compliance_units_amount', 500))
        ]

        # Convert the mock call args to a comparable format
        actual_calls = []
        for call in mock_send_transaction_message.call_args_list:
            args, kwargs = call
            actual_call = (
                ('tfrs_id', kwargs.get('tfrs_id', args[0] if args else None)),
                ('organization_id', kwargs.get('organization_id', args[1] if len(args) > 1 else None)),
                ('compliance_units_amount', kwargs.get('compliance_units_amount', args[2] if len(args) > 2 else None))
            )
            actual_calls.append(actual_call)

        # Verify that expected calls are in actual calls
        for expected_call in expected_calls:
            self.assertIn(expected_call, actual_calls)

    @patch('api.services.TransactionMessageService.send_transaction_message')
    def test_no_message_sent_when_no_balance_change(self, mock_send_transaction_message):
        """
        Test that no transaction message is sent when there is no balance change.
        """
        # Create a compliance report that doesn't result in a balance change
        compliance_report_id = self._create_compliance_report()
        compliance_report = ComplianceReport.objects.get(id=compliance_report_id)

        # Set up the compliance report snapshot to result in zero required_credit_transaction
        # Assuming that lines['25'] in the snapshot determines the balance change
        compliance_report.snapshot = {
            'compliance_period': {'description': '2020'},
            'summary': {
                'lines': {
                    '25': '0.0',  # Net balance change is zero
                }
            }
        }
        compliance_report.save()

        # Simulate the process of submitting and approving the compliance report
        # 1. Fuel Supplier submits the report
        response = self.clients['fs_user_1'].patch(
            f'/api/compliance_reports/{compliance_report_id}',
            content_type='application/json',
            data=json.dumps({'status': {'fuelSupplierStatus': 'Submitted'}})
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # 2. Analyst recommends the report
        response = self.clients['gov_analyst'].patch(
            f'/api/compliance_reports/{compliance_report_id}',
            content_type='application/json',
            data=json.dumps({'status': {'analystStatus': 'Recommended'}})
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # 3. Manager recommends the report
        response = self.clients['gov_manager'].patch(
            f'/api/compliance_reports/{compliance_report_id}',
            content_type='application/json',
            data=json.dumps({'status': {'managerStatus': 'Recommended'}})
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # 4. Director accepts the report
        response = self.clients['gov_director'].patch(
            f'/api/compliance_reports/{compliance_report_id}',
            content_type='application/json',
            data=json.dumps({'status': {'directorStatus': 'Accepted'}})
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Verify that send_transaction_message was not called
        mock_send_transaction_message.assert_not_called()

    @patch('api.services.TransactionMessageService.send_transaction_message')
    def test_message_sent_on_admin_adjustment(self, mock_send_transaction_message):
        """
        Test that transaction messages are sent when an administrative adjustment occurs.
        """
        # Create an administrative adjustment credit trade
        credit_trade = CreditTrade.objects.create(
            initiator=self.gov_org,
            respondent=self.fuel_supplier_org,
            status=CreditTradeStatus.objects.get(status="Draft"),
            type=CreditTradeType.objects.get(the_type="Administrative Adjustment"),
            number_of_credits=Decimal('200'),
            compliance_period=CompliancePeriod.objects.get(description="2020"),
            trade_effective_date=timezone.now(),
            create_user=self.director_user,
            update_user=self.director_user,
        )

        # Approve the credit trade
        CreditTradeService.approve(credit_trade, update_user=self.director_user)

        # Verify that send_transaction_message was called once (since it's a single-organization adjustment)
        self.assertEqual(mock_send_transaction_message.call_count, 1)

        # Check the call for the respondent organization
        expected_call = (
            ('tfrs_id', credit_trade.id),
            ('organization_id', self.fuel_supplier_org.id),
            ('compliance_units_amount', 200)
        )

        # Convert the mock call args to a comparable format
        args, kwargs = mock_send_transaction_message.call_args
        actual_call = (
            ('tfrs_id', kwargs.get('tfrs_id', args[0] if args else None)),
            ('organization_id', kwargs.get('organization_id', args[1] if len(args) > 1 else None)),
            ('compliance_units_amount', kwargs.get('compliance_units_amount', args[2] if len(args) > 2 else None))
        )

        # Verify that the expected call matches the actual call
        self.assertEqual(expected_call, actual_call)
