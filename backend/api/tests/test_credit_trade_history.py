# -*- coding: utf-8 -*-
# pylint: disable=no-member,invalid-name
"""
    REST API Documentation for the NRS TFRS Credit Trading Application

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
import datetime

from collections import OrderedDict
from rest_framework import status

from api.models.CreditTradeHistory import CreditTradeHistory
from .base_test_case import BaseTestCase


class TestCreditTradeHistory(BaseTestCase):
    """
    Test that credit trade histories are maintained through status changes
    """

    def test_create_and_create_trade_history(self):
        """Test that creating a credit trade creates a history of length 1"""

        fs1user = self.users['fs_user_1']
        fs2user = self.users['fs_user_2']

        payload = {
            'fairMarketValuePerCredit': 1000,
            'initiator': fs1user.organization.id,
            'numberOfCredits': 100,
            'respondent': fs2user.organization.id,
            'status': self.statuses['approved'].id,
            'tradeEffectiveDate': datetime.datetime.today().strftime(
                '%Y-%m-%d'),
            'type': self.credit_trade_types['buy'].id,
            'is_rescinded': False,
            'zeroReason': None
        }

        response = self.clients['gov_director'].post(
            '/api/credit_trades',
            content_type='application/json',
            data=json.dumps(payload))

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        ct_id = response.data['id']

        history = CreditTradeHistory.objects.filter(credit_trade__id=ct_id)
        self.assertEqual(len(history), 1)

    def test_update_create_trade_history(self):
        """
        Test that updating a credit trade several times maintains a history
        """

        fs1user = self.users['fs_user_1']
        fs2user = self.users['fs_user_2']

        payload = {
            'fairMarketValuePerCredit': 1000,
            'initiator': fs1user.organization.id,
            'numberOfCredits': 100,
            'respondent': fs2user.organization.id,
            'status': self.statuses['submitted'].id,
            'tradeEffectiveDate': datetime.datetime.today().strftime(
                '%Y-%m-%d'),
            'type': self.credit_trade_types['sell'].id,
            'is_rescinded': False,
            'zeroReason': None
        }

        response = self.clients['fs_user_1'].post(
            '/api/credit_trades',
            content_type='application/json',
            data=json.dumps(payload))

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        ct_id = response.data['id']

        payload['status'] = self.statuses['accepted'].id

        response = self.clients['fs_user_2'].put(
            '/api/credit_trades/{}'.format(ct_id),
            content_type='application/json',
            data=json.dumps(payload))

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        payload['status'] = self.statuses['recommended'].id

        response = self.clients['gov_analyst'].put(
            '/api/credit_trades/{}'.format(ct_id),
            content_type='application/json',
            data=json.dumps(payload))

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        payload['status'] = self.statuses['approved'].id

        response = self.clients['gov_director'].put(
            '/api/credit_trades/{}'.format(ct_id),
            content_type='application/json',
            data=json.dumps(payload))

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        history = CreditTradeHistory.objects.filter(credit_trade__id=ct_id)

        self.assertEqual(len(history), 4)

    def test_credit_trade_history(self):
        """
        Tests and verifies that the history for the list of government users
        load properly
        """
        # Create a row from a non-government user (Propose)
        payload = {
            'fairMarketValuePerCredit': 10,
            'initiator': self.users['fs_user_1'].organization.id,
            'numberOfCredits': 10,
            'respondent': self.users['fs_user_2'].organization.id,
            'status': self.statuses['submitted'].id,
            'tradeEffectiveDate': datetime.datetime.today().strftime(
                '%Y-%m-%d'),
            'type': self.credit_trade_types['sell'].id,
            'is_rescinded': False,
            'zeroReason': None
        }

        response = self.clients['fs_user_1'].post(
            '/api/credit_trades',
            content_type='application/json',
            data=json.dumps(payload))

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        credit_trade_id = response.data['id']

        # Update a row from a different non-government user
        payload['status'] = self.statuses['accepted'].id

        response = self.clients['fs_user_2'].put(
            '/api/credit_trades/{}'.format(credit_trade_id),
            content_type='application/json',
            data=json.dumps(payload))

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Update a row with a government analyst
        payload['status'] = self.statuses['recommended'].id

        response = self.clients['gov_analyst'].put(
            '/api/credit_trades/{}'.format(credit_trade_id),
            content_type='application/json',
            data=json.dumps(payload))

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Update another row with a government director
        payload['status'] = self.statuses['approved'].id

        response = self.clients['gov_director'].put(
            '/api/credit_trades/{}'.format(credit_trade_id),
            content_type='application/json',
            data=json.dumps(payload))

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Get the credit trade history for government users
        response = self.clients['gov_admin'].get(
            '/api/credit_trades_history')

        # We should see a record from the government analyst
        self.assertIn('"id":' + str(self.users['gov_analyst'].id),
                      response.content.decode('utf-8'))

        # We should see a record from the government director
        self.assertIn('"id":' + str(self.users['gov_director'].id),
                      response.content.decode('utf-8'))

        # We should not see a record from the fuel suppliers
        self.assertNotIn('"id":' + str(self.users['fs_user_1'].id),
                         response.content.decode('utf-8'))

        self.assertNotIn('"id":' + str(self.users['fs_user_2'].id),
                         response.content.decode('utf-8'))
