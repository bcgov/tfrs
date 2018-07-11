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

import datetime
import json

from rest_framework import status

from api.models.CreditTrade import CreditTrade
from api.tests.base_test_case import BaseTestCase


class TestUserHistory(BaseTestCase):
    """
    This will test the user history and make sure that depending on the
    user role, the user can only see certain activity
    """

    def setUp(self):
        super().setUp()
        payload = {
            'fairMarketValuePerCredit': '10.00',
            'initiator': self.users['fs_user_1'].organization_id,
            'numberOfCredits': 1,
            'respondent': self.users['fs_user_2'].organization_id,
            'status': self.statuses['submitted'].id,
            'tradeEffectiveDate': datetime.datetime.today().strftime(
                '%Y-%m-%d'
            ),
            'type': self.credit_trade_types['sell'].id
        }

        # Propose a trade
        self.clients['fs_user_1'].post(
            '/api/credit_trades',
            content_type='application/json',
            data=json.dumps(payload))

        # Accept a proposal
        credit_trade = CreditTrade.objects.create(
            status=self.statuses['submitted'],
            initiator=self.users['fs_user_2'].organization,
            respondent=self.users['fs_user_1'].organization,
            type=self.credit_trade_types['sell'],
            number_of_credits=10,
            fair_market_value_per_credit=1,
            zero_reason=None,
            trade_effective_date=datetime.datetime.today().strftime(
                '%Y-%m-%d'
            )
        )

        payload = {
            'fairMarketValuePerCredit':
            credit_trade.fair_market_value_per_credit,
            'initiator': credit_trade.initiator.id,
            'numberOfCredits': credit_trade.number_of_credits,
            'respondent': credit_trade.respondent.id,
            'status': self.statuses['accepted'].id,
            'tradeEffectiveDate': credit_trade.trade_effective_date,
            'type': credit_trade.type.id
        }

        self.clients['fs_user_1'].put(
            '/api/credit_trades/{}'.format(
                credit_trade.id
            ),
            content_type='application/json',
            data=json.dumps(payload))

        # After accepting let the government user recommend this
        payload = {
            'fairMarketValuePerCredit':
            credit_trade.fair_market_value_per_credit,
            'initiator': credit_trade.initiator.id,
            'numberOfCredits': credit_trade.number_of_credits,
            'respondent': credit_trade.respondent.id,
            'status': self.statuses['recommended'].id,
            'tradeEffectiveDate': credit_trade.trade_effective_date,
            'type': credit_trade.type.id
        }

        self.clients['gov_director'].put(
            '/api/credit_trades/{}'.format(
                credit_trade.id
            ),
            content_type='application/json',
            data=json.dumps(payload))

        # Rescind the proposal at this point
        payload = {
            'fairMarketValuePerCredit':
            credit_trade.fair_market_value_per_credit,
            'initiator': credit_trade.initiator.id,
            'is_rescinded': True,
            'numberOfCredits': credit_trade.number_of_credits,
            'respondent': credit_trade.respondent.id,
            'status': credit_trade.status.id,
            'tradeEffectiveDate': credit_trade.trade_effective_date,
            'type': credit_trade.type.id
        }

        self.clients['fs_user_1'].put(
            '/api/credit_trades/{}'.format(
                credit_trade.id
            ),
            content_type='application/json',
            data=json.dumps(payload))

        # Refuse a proposal
        credit_trade = CreditTrade.objects.create(
            status=self.statuses['submitted'],
            initiator=self.users['fs_user_2'].organization,
            respondent=self.users['fs_user_1'].organization,
            type=self.credit_trade_types['sell'],
            number_of_credits=10,
            fair_market_value_per_credit=1,
            zero_reason=None,
            trade_effective_date=datetime.datetime.today().strftime(
                '%Y-%m-%d'
            )
        )

        payload = {
            'fairMarketValuePerCredit':
            credit_trade.fair_market_value_per_credit,
            'initiator': credit_trade.initiator.id,
            'numberOfCredits': credit_trade.number_of_credits,
            'respondent': credit_trade.respondent.id,
            'status': self.statuses['refused'].id,
            'tradeEffectiveDate': credit_trade.trade_effective_date,
            'type': credit_trade.type.id
        }

        self.clients['fs_user_1'].put(
            '/api/credit_trades/{}'.format(
                credit_trade.id
            ),
            content_type='application/json',
            data=json.dumps(payload))

    def test_user_history_as_fuel_supplier(self):
        """
        As a fuel supplier, I should the activities I was involved with:
        I should see Accepted, Refused, Submitted and Rescinded proposals
        """
        response = self.clients['fs_user_1'].get(
            '/api/users/{}'.format(
                self.users['fs_user_1']
            )
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        user = response.json()

        for activity in user['history']:
            correct_view = False
            credit_trade = CreditTrade.objects.get(
                id=activity['creditTradeId']
            )

            # make sure that the status is correct and we don't see anything
            # that's not submitted, accepted or refused
            # unless it's rescinded (even if it's rescinded we shouldn't see
            # the recommended or not recommended status)
            if activity['statusId'] == self.statuses['submitted'].id or \
                activity['statusId'] == self.statuses['accepted'].id or \
                activity['statusId'] == self.statuses['refused'].id or \
                (activity['statusId'] is None and
                 activity['isRescinded'] is True):
                # make sure we don't see any entries that our organization is
                # not a part of
                if credit_trade.initiator.id == \
                    self.users['fs_user_1'].organization.id or \
                    credit_trade.respondent.id == \
                        self.users['fs_user_1'].organization.id:
                    correct_view = True

            self.assertTrue(correct_view)

    def test_user_history_as_government_user(self):
        """
        As a government admin, I can view the activities of a person:
        I should not see submitted and refused proposals
        """
        response = self.clients['gov_admin'].get(
            '/api/users/{}'.format(
                self.users['fs_user_1']
            )
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        user = response.json()

        for activity in user['history']:
            correct_view = False
            # make sure that the status is correct and we don't see anything
            # that's not submitted, accepted or refused
            # unless it's rescinded (even if it's rescinded we shouldn't see
            # the recommended or not recommended status)
            if activity['statusId'] == self.statuses['not_recommended'].id or \
                activity['statusId'] == self.statuses['recommended'].id or \
                    activity['statusId'] == self.statuses['accepted'].id:
                correct_view = True

            self.assertTrue(correct_view)
