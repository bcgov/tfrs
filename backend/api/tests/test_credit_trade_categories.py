from datetime import datetime, timedelta
import pytz
from api.models.CreditTradeCategory import CreditTradeCategory
from api.services.CreditTradeService import CreditTradeService
from unittest import mock
from .base_test_case import BaseTestCase

class TestCreditTradeService(BaseTestCase):
    
    def test_calculate_transfer_category(self):
        """
        Test the calculate_transfer_category method
        """
        category_a = CreditTradeCategory.objects.get(category='A')
        category_b = CreditTradeCategory.objects.get(category='B')
        category_c = CreditTradeCategory.objects.get(category='C')
        category_d = CreditTradeCategory.objects.get(category='D')

        now = datetime.now(pytz.UTC)

        # Test category D
        result = CreditTradeService.calculate_transfer_category(now, now, True)
        self.assertEqual(result, category_d)

        # Test category A
        agreement_date = now - timedelta(days=6*30) # approximately 6 months
        proposal_date = now
        result = CreditTradeService.calculate_transfer_category(agreement_date, proposal_date, False)
        self.assertEqual(result, category_a)

        # Test category B
        agreement_date = now - timedelta(days=8*30)  # more than 6 months but less than 12
        proposal_date = now
        result = CreditTradeService.calculate_transfer_category(agreement_date, proposal_date, False)
        self.assertEqual(result, category_b)

        # Test category C
        agreement_date = now - timedelta(days=14*30)  # more than 12 months
        proposal_date = now
        result = CreditTradeService.calculate_transfer_category(agreement_date, proposal_date, False)
        self.assertEqual(result, category_c)

        # Test incorrect case
        agreement_date = now - timedelta(days=14*30)  # more than 12 months
        proposal_date = now
        result = CreditTradeService.calculate_transfer_category(agreement_date, proposal_date, False)
        self.assertNotEqual(result, category_a)

        # Test null agreement date
        agreement_date = None
        proposal_date = now
        result = CreditTradeService.calculate_transfer_category(agreement_date, proposal_date, False)
        self.assertEqual(result, category_a)
