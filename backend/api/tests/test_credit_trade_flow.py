# -*- coding: utf-8 -*-
# pylint: disable=no-member
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

from rest_framework import status

from api.models.OrganizationBalance import OrganizationBalance
from api.tests.base_test_case import BaseTestCase


class TestCreditTradeFlow(BaseTestCase):

    def test_approved_buy(self):
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

        # submit

        payload = {
            'fairMarketValuePerCredit': 1000,
            'initiator': fs1user.organization.id,
            'numberOfCredits': num_of_credits,
            'respondent': fs2user.organization.id,
            'status': self.statuses['submitted'].id,
            'tradeEffectiveDate': datetime.datetime.today().strftime('%Y-%m-%d'),
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

        id = json.loads(response.content.decode('utf-8'))['id']

        # accept

        payload = {
            'fairMarketValuePerCredit': 1,
            'initiator': fs1user.organization.id,
            'numberOfCredits': num_of_credits,
            'respondent': fs2user.organization.id,
            'status': self.statuses['accepted'].id,
            'tradeEffectiveDate': datetime.datetime.today().strftime('%Y-%m-%d'),
            'type': self.credit_trade_types['buy'].id,
            'is_rescinded': False,
            'zeroReason': None
        }

        response = self.clients[fs2user.username].put(
            '/api/credit_trades/{}'.format(id),
            content_type='application/json',
            data=json.dumps(payload)
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # approve

        response = self.clients['gov_director'].put(
            "/api/credit_trades/{}/approve".format(id),
            content_type='application/json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # TODO: Make sure two credit histories are created

        ct_completed = self.clients['fs_user_1'].get(
            '/api/credit_trades/{}'.format(id),
            content_type='application/json')

        completed_response = json.loads(
            ct_completed.content.decode("utf-8"))

        # Status of Credit Trade should be 'completed'
        self.assertEqual(completed_response['status']['id'],
                         self.statuses['completed'].id)

        initiator_bal_after = OrganizationBalance.objects.get(
            organization_id=fs1user.organization.id,
            expiration_date=None)

        respondent_bal_after = OrganizationBalance.objects.get(
            organization_id=self.users['fs_user_2'].organization.id,
            expiration_date=None)

        init_final_bal = initiator_bal.validated_credits + num_of_credits
        resp_final_bal = respondent_bal.validated_credits - num_of_credits

        # Effective date should be today
        today = datetime.datetime.today().strftime('%Y-%m-%d')

        self.assertEqual(
            initiator_bal_after.effective_date.strftime('%Y-%m-%d'),
            today)

        self.assertEqual(
            respondent_bal_after.effective_date.strftime('%Y-%m-%d'),
            today)

        # Credits should be subtracted/added
        self.assertEqual(init_final_bal,
                         initiator_bal_after.validated_credits)
        self.assertEqual(resp_final_bal,
                         respondent_bal_after.validated_credits)

    def test_respondent_cannot_modify_the_trade(self):
        fs1user = self.users['fs_user_1']
        fs2user = self.users['fs_user_2']

        # Todo also check other fields that should be immutable

        # submit

        payload = {
            'fairMarketValuePerCredit': 1000,
            'initiator': fs1user.organization.id,
            'numberOfCredits': 100,
            'respondent': fs2user.organization.id,
            'status': self.statuses['submitted'].id,
            'tradeEffectiveDate': datetime.datetime.today().strftime('%Y-%m-%d'),
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

        id = json.loads(response.content.decode('utf-8'))['id']

        # I am altering the deal. Pray I do not alter it further.

        payload = {
            'fairMarketValuePerCredit': 750,  # <---
            'initiator': fs1user.organization.id,
            'numberOfCredits': 100,
            'respondent': fs2user.organization.id,
            'status': self.statuses['accepted'].id,
            'tradeEffectiveDate': datetime.datetime.today().strftime('%Y-%m-%d'),
            'type': self.credit_trade_types['buy'].id,
            'is_rescinded': False,
            'zeroReason': None
        }

        response = self.clients[fs2user.username].put(
            '/api/credit_trades/{}'.format(id),
            content_type='application/json',
            data=json.dumps(payload)
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        ct_accepted = self.clients['fs_user_1'].get(
            '/api/credit_trades/{}'.format(id),
            content_type='application/json')

        accepted_response = json.loads(
            ct_accepted.content.decode("utf-8"))

        # Status of Credit Trade should be 'accepted'
        self.assertEqual(accepted_response['status']['id'],
                         self.statuses['accepted'].id)

        # fairMarketValuePerCredit should not have changed
        self.assertEqual(accepted_response['fairMarketValuePerCredit'],
                         1000)
