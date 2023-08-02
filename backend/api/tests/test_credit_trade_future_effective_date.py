# -*- coding: utf-8 -*-
# pylint: disable=no-member,invalid-name
"""
    REST API Documentation for the NRS TFRS Credit Trading Application

    The Transportation Fuels Reporting System is being designed to streamline compliance reporting
    for transportation fuel suppliers in accordance with the Renewable & Low Carbon Fuel
    Requirements Regulation.

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
import datetime
import json
from collections import namedtuple
from unittest import mock

from rest_framework import status

from api.models.CompliancePeriod import CompliancePeriod
from api.models.CreditTrade import CreditTrade
from api.models.OrganizationBalance import OrganizationBalance
from api.services.CreditTradeService import CreditTradeService
from .base_test_case import BaseTestCase


class TestCreditTradeFutureEffectiveDate(BaseTestCase):
    """Test complex credit trade scenarios related to future effective dates"""

    def test_credit_transfer(self):
        """Test the transfer_credits function"""

        fs1user = self.users['fs_user_1']
        fs2user = self.users['fs_user_2']

        # get fuel supplier balance for fs 1 and 2

        initiator_bal = OrganizationBalance.objects.get(
            organization_id=fs1user.organization.id,
            expiration_date=None)

        respondent_bal = OrganizationBalance.objects.get(
            organization_id=fs2user.organization.id,
            expiration_date=None)

        num_of_credits = 50

        credit_trade = CreditTrade.objects.create(
            status=self.statuses['approved'],
            initiator=fs1user.organization,
            respondent=fs2user.organization,
            number_of_credits=num_of_credits,
            type=self.credit_trade_types['buy']
        )

        # call transfer_credits
        CreditTradeService.transfer_credits(
            _from=fs1user.organization,
            _to=fs2user.organization,
            num_of_credits=num_of_credits,
            effective_date=datetime.date.today(),
            credit_trade_id=credit_trade.id
        )

        # check if balances have been updated correctly
        initiator_bal_after = OrganizationBalance.objects.get(
            organization_id=fs1user.organization.id,
            expiration_date=None)

        respondent_bal_after = OrganizationBalance.objects.get(
            organization_id=fs2user.organization.id,
            expiration_date=None)

        self.assertEqual(
            initiator_bal_after.validated_credits, 
            initiator_bal.validated_credits - num_of_credits
        )
        self.assertEqual(
            respondent_bal_after.validated_credits, 
            respondent_bal.validated_credits + num_of_credits
        )

    def test_future_effective_date(self):
        """Test a scenario with a future effective date"""
        
        fs1user = self.users['fs_user_1']
        fs2user = self.users['fs_user_2']

        # get fuel supplier balance for fs 1 and 2

        initiator_bal = OrganizationBalance.objects.get(
            organization_id=fs1user.organization.id,
            expiration_date=None)

        respondent_bal = OrganizationBalance.objects.get(
            organization_id=self.users['fs_user_2'].organization.id,
            expiration_date=None)

        num_of_credits = 50

        # Future effective date
        future_date = (datetime.datetime.today() + datetime.timedelta(days=30)).strftime('%Y-%m-%d')

        # submit

        payload = {
            'fairMarketValuePerCredit': 1000,
            'initiator': fs1user.organization.id,
            'numberOfCredits': num_of_credits,
            'respondent': fs2user.organization.id,
            'status': self.statuses['submitted'].id,
            'tradeEffectiveDate': future_date,
            'type': self.credit_trade_types['buy'].id,
            'is_rescinded': False,
            'zeroReason': None
        }

        response = self.clients[fs1user.username].post(
            '/api/credit_trades',
            content_type='application/json',
            data=json.dumps(payload)
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        ct_id = json.loads(response.content.decode('utf-8'))['id']

        ct_created = self.clients[fs1user.username].get(
            '/api/credit_trades/{}'.format(ct_id),
            content_type='application/json')

        created_response = json.loads(
            ct_created.content.decode("utf-8"))

        # Effective date should be the future date
        self.assertEqual(
            created_response['tradeEffectiveDate'],
            future_date)

    def test_transfer_credits_with_pending_trades(self):
        """Test the process_future_effective_dates function with pending trades"""

        fs1user = self.users['fs_user_1']
        fs2user = self.users['fs_user_2']

        # get fuel supplier balance for fs 1 and 2

        initiator_bal = OrganizationBalance.objects.get(
            organization_id=fs1user.organization.id,
            expiration_date=None)

        respondent_bal = OrganizationBalance.objects.get(
            organization_id=fs2user.organization.id,
            expiration_date=None)

        num_of_credits = 50

        future_date = datetime.date.today() + datetime.timedelta(days=10)

        # create a future dated trade
        future_trade = CreditTrade.objects.create(
            status=self.statuses['approved'],
            initiator=fs1user.organization,
            respondent=fs2user.organization,
            number_of_credits=num_of_credits,
            type=self.credit_trade_types['buy'],
            trade_effective_date=future_date
        )

        # call process_future_effective_dates
        CreditTradeService.process_future_effective_dates(fs1user.organization)

        # check if balances have not been updated
        initiator_bal_after = OrganizationBalance.objects.get(
            organization_id=fs1user.organization.id,
            expiration_date=None)

        respondent_bal_after = OrganizationBalance.objects.get(
            organization_id=fs2user.organization.id,
            expiration_date=None)

        self.assertEqual(initiator_bal_after.validated_credits, initiator_bal.validated_credits)
        self.assertEqual(respondent_bal_after.validated_credits, respondent_bal.validated_credits)

        # fast forward time to future date
        with mock.patch('django.utils.timezone.now', mock.Mock(return_value=future_date)):
            # call process_future_effective_dates again
            CreditTradeService.process_future_effective_dates(fs1user.organization)

            # check if balances have been updated correctly
            initiator_bal_after = OrganizationBalance.objects.get(
                organization_id=fs1user.organization.id,
                expiration_date=None)

            respondent_bal_after = OrganizationBalance.objects.get(
                organization_id=fs2user.organization.id,
                expiration_date=None)

            self.assertEqual(
                initiator_bal_after.validated_credits, 
                initiator_bal.validated_credits - num_of_credits
            )
            self.assertEqual(
                respondent_bal_after.validated_credits, 
                respondent_bal.validated_credits + num_of_credits
            )
