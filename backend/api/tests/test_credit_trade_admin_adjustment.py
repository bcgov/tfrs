import datetime
import json

from rest_framework import status

from django.db.models import Sum
from api.models.CreditTrade import CreditTrade
from api.tests.base_test_case import BaseTestCase
from api.models.OrganizationBalance import OrganizationBalance


class TestAdministrativeAdjustmentOperations(BaseTestCase):

    extra_fixtures = ['test/test_credit_trades.json']

    def test_administrative_adjustment_positive(self):
        """
        Testing positive administrative adjustment
        """

        initial_balance = OrganizationBalance.objects.get(
            organization_id=self.users['fs_user_1'].organization.id,
            expiration_date=None).validated_credits

        payload = {
            'initiator': self.users['gov_director'].organization.id,
            'respondent': self.users['fs_user_1'].organization.id,
            'numberOfCredits': 10,
            'status': self.statuses['recorded'].id,
            'tradeEffectiveDate': datetime.datetime.today().strftime('%Y-%m-%d'),
            'type': self.credit_trade_types['adminAdjustment'].id
        }
        response = self.clients['gov_director'].post(
            '/api/credit_trades',
            content_type='application/json',
            data=json.dumps(payload)
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        payload = {
            'initiator': self.users['gov_director'].organization.id,
            'respondent': self.users['fs_user_1'].organization.id,
            'numberOfCredits': 10,
            'status': self.statuses['recorded'].id,
            'tradeEffectiveDate': datetime.datetime.today().strftime('%Y-%m-%d'),
            'type': self.credit_trade_types['adminAdjustment'].id
        }
        response = self.clients['gov_director'].post(
            '/api/credit_trades',
            content_type='application/json',
            data=json.dumps(payload)
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        response = self.clients['gov_director'].put('/api/credit_trades/batch_process')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        orgBalances = OrganizationBalance.objects.filter(
            organization_id=self.users['fs_user_1'].organization.id,
            expiration_date=None)
        for org in orgBalances:
            print("ORG BALANCE")
            print(vars(org))

        new_balance = OrganizationBalance.objects.get(
            organization_id=self.users['fs_user_1'].organization.id,
            expiration_date=None).validated_credits

        self.assertEqual(new_balance, initial_balance + 20)


    def test_administrative_adjustment_negative(self):
        """
        Testing negative administrative adjustment
        """

        initial_balance = OrganizationBalance.objects.get(
            organization_id=self.users['fs_user_1'].organization.id,
            expiration_date=None).validated_credits
        print('INITIAL BALANCE')
        print(initial_balance)

        payload = {
            'initiator': self.users['gov_director'].organization.id,
            'respondent': self.users['fs_user_1'].organization.id,
            'numberOfCredits': -10,
            'status': self.statuses['recorded'].id,
            'tradeEffectiveDate': datetime.datetime.today().strftime('%Y-%m-%d'),
            'type': self.credit_trade_types['adminAdjustment'].id
        }
        response = self.clients['gov_director'].post(
            '/api/credit_trades',
            content_type='application/json',
            data=json.dumps(payload)
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        payload = {
            'initiator': self.users['gov_director'].organization.id,
            'respondent': self.users['fs_user_1'].organization.id,
            'numberOfCredits': -10,
            'status': self.statuses['recorded'].id,
            'tradeEffectiveDate': datetime.datetime.today().strftime('%Y-%m-%d'),
            'type': self.credit_trade_types['adminAdjustment'].id
        }
        response = self.clients['gov_director'].post(
            '/api/credit_trades',
            content_type='application/json',
            data=json.dumps(payload)
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        response = self.clients['gov_director'].put('/api/credit_trades/batch_process')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        new_balance = OrganizationBalance.objects.get(
            organization_id=self.users['fs_user_1'].organization.id,
            expiration_date=None).validated_credits

        self.assertEqual(new_balance, initial_balance - 20)


    def test_administrative_adjustment_insufficient_funds(self):
        """
        Testing administrative adjustment with insufficient funds
        """

        # Set a very high negative administrative adjustment value
        payload = {
            'initiator': self.users['gov_director'].organization.id,
            'respondent': self.users['fs_user_1'].organization.id,
            'numberOfCredits': -100000000000,
            'status': self.statuses['recorded'].id,
            'tradeEffectiveDate': datetime.datetime.today().strftime('%Y-%m-%d'),
            'type': self.credit_trade_types['adminAdjustment'].id
        }

        response = self.clients['gov_director'].post(
            '/api/credit_trades',
            content_type='application/json',
            data=json.dumps(payload)
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
