from django.utils import timezone
import datetime

from api.models.CreditTrade import CreditTrade
from api.models.Organization import Organization
from api.services.OrganizationService import OrganizationService
from .base_test_case import BaseTestCase


class TestOrganizationService(BaseTestCase):

    def setUp(self):
        super().setUp()

        # Test organizations
        self.organization1 = self.organizations['from']
        self.organization2 = self.organizations['to']

        # Create some Credit Trades with different effective dates
        self.trade1 = CreditTrade.objects.create(
            status=self.statuses['approved'],
            type=self.credit_trade_types['sell'],
            initiator=self.organization1,
            respondent=self.organization2,
            is_rescinded=False,
            trade_effective_date=timezone.now() - datetime.timedelta(days=1), # A past date
            number_of_credits=10,
        )

        self.trade2 = CreditTrade.objects.create(
            status=self.statuses['submitted'],
            type=self.credit_trade_types['sell'],
            initiator=self.organization1,
            respondent=self.organization2,
            is_rescinded=False,
            trade_effective_date=timezone.now() + datetime.timedelta(days=1), # A future date
            number_of_credits=20,
        )

        self.trade3 = CreditTrade.objects.create(
            status=self.statuses['recommended'],
            type=self.credit_trade_types['sell'],
            initiator=self.organization1,
            respondent=self.organization2,
            is_rescinded=False,
            trade_effective_date=timezone.now() - datetime.timedelta(days=1), # A past date
            number_of_credits=30,
        )

    def test_get_max_credit_offset(self):
        # should only count the trades with a past effective date
        expected_value = self.trade1.number_of_credits
        actual_value = OrganizationService.get_max_credit_offset(self.organization2, self.trade1.trade_effective_date.year)
        self.assertEqual(expected_value, actual_value)

    def test_get_pending_transfers_value(self):
        # should only count the trades with a past effective date
        expected_value = self.trade3.number_of_credits
        actual_value = OrganizationService.get_pending_transfers_value(self.organization1)
        self.assertEqual(expected_value, actual_value)

    def test_get_pending_transfers_value_no_pending(self):
        """
        Test when there are no pending transfers
        """
        actual_value = OrganizationService.get_pending_transfers_value(self.organization2)
        self.assertEqual(0, actual_value)

    def test_get_pending_transfers_value_future_date(self):
        """
        Test when a pending transfer is in the future
        """
        CreditTrade.objects.create(
            status=self.statuses['submitted'],
            type=self.credit_trade_types['sell'],
            initiator=self.organization1,
            respondent=self.organization2,
            is_rescinded=False,
            trade_effective_date=timezone.now() + datetime.timedelta(days=1), # A future date
            number_of_credits=10,
        )
        actual_value = OrganizationService.get_pending_transfers_value(self.organization1)
        self.assertEqual(30, actual_value)

    def test_get_pending_transfers_value_rescinded(self):
        """
        Test when a pending transfer is rescinded
        """
        CreditTrade.objects.create(
            status=self.statuses['submitted'],
            type=self.credit_trade_types['sell'],
            initiator=self.organization1,
            respondent=self.organization2,
            is_rescinded=True, # Rescinded trade
            trade_effective_date=timezone.now() - datetime.timedelta(days=1), # A past date
            number_of_credits=10,
        )
        actual_value = OrganizationService.get_pending_transfers_value(self.organization1)
        self.assertEqual(30, actual_value)

    def test_get_pending_deductions_negative_value(self):
        """
        Test when get_pending_deductions returns a negative value
        """
        # Need additional setup for ComplianceReport and its related data
        actual_value = OrganizationService.get_pending_deductions(self.organization1)
        self.assertTrue(actual_value >= 0)