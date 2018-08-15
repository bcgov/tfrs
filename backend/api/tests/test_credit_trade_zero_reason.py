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

import json
import datetime

from collections import defaultdict, namedtuple
from itertools import product

from rest_framework import status

from api.models import CreditTradeZeroReason
from api.models.CreditTradeStatus import CreditTradeStatus
from api.models.CreditTrade import CreditTrade
from api.tests.mixins.credit_trade_relationship import CreditTradeRelationshipMixin

from .base_test_case import BaseTestCase


class TestCreditTradeZeroReason(BaseTestCase, CreditTradeRelationshipMixin):
    """Confirm behaviours associated zero-dollar trades"""

    def test_initiator_zero_reason_behaviours(self):
        """Evaluate whether trades with zero value are properly accepted
        and commenting rules enforced"""

        Scenario = namedtuple('Scenario',
                              ['create_draft_first', 'zero_reason', 'create_a_comment'])
        Results = namedtuple('Results', ['saving_draft_succeeds', 'proposing_trade_succeeds'])

        expected_results = {}

        expected_results[Scenario(True, self.zero_reason['other'], False)] = Results(True, False)
        expected_results[Scenario(True, self.zero_reason['other'], True)] = Results(True, True)
        expected_results[Scenario(False, self.zero_reason['other'], None)] = Results(None, False)

        expected_results[Scenario(False, self.zero_reason['affiliate'], None)]\
            = Results(None, True)
        expected_results[Scenario(True, self.zero_reason['affiliate'], False)]\
            = Results(True, True)
        expected_results[Scenario(True, self.zero_reason['affiliate'], True)]\
            = Results(True, True)

        expected_results[Scenario(False, None, None)] = Results(None, False)
        expected_results[Scenario(True, None, False)] = Results(False, False)
        expected_results[Scenario(True, None, True)] = Results(False, False)

        initiating_org = self.users[
            self.user_map[
                self.UserRelationship.INITIATOR
            ]].organization

        responding_org = self.users[
            self.user_map[
                self.UserRelationship.RESPONDENT
            ]].organization

        for scenario, result in expected_results.items():
            with self.subTest("evaluating scenario",
                              scenario=scenario,
                              res=result):
                payload = {
                    'fairMarketValuePerCredit': 0.0,
                    'initiator': initiating_org.id,
                    'numberOfCredits': 1,
                    'respondent': responding_org.id,
                    'tradeEffectiveDate': datetime.datetime.today().strftime('%Y-%m-%d'),
                    'type': self.credit_trade_types['sell'].id,
                    'zeroReason': scenario.zero_reason.id if scenario.zero_reason else None,
                }

                if scenario.create_draft_first:
                    payload['status'] = self.statuses['draft'].id
                    response = self.clients[self.user_map[self.UserRelationship.INITIATOR]].post(
                        '/api/credit_trades',
                        content_type='application/json',
                        data=json.dumps(payload)
                    )
                    self.assertEqual(status.is_success(response.status_code),
                                     result.saving_draft_succeeds)

                    ct_id = response.data['id'] if 'id' in response.data else None

                    if scenario.create_a_comment and result.saving_draft_succeeds:
                        response = self.clients[self.user_map[self.UserRelationship.INITIATOR]]. \
                            post(
                            '/api/comments',
                            content_type='application/json',
                            data=json.dumps({
                                "comment": "explanatory comment",
                                "creditTrade": ct_id,
                                "privilegedAccess": False
                            })
                        )
                        self.assertTrue(status.is_success(response.status_code))

                    if result.saving_draft_succeeds:

                        payload['status'] = self.statuses['submitted'].id

                        response = self.clients[self.user_map[self.UserRelationship.INITIATOR]]. \
                            put(
                            '/api/credit_trades/{}'.format(ct_id),
                            content_type='application/json',
                            data=json.dumps(payload)
                            )
                        self.assertEqual(status.is_success(response.status_code),
                                         result.proposing_trade_succeeds)
                else:
                    payload['status'] = self.statuses['submitted'].id
                    response = self.clients[self.user_map[self.UserRelationship.INITIATOR]].post(
                        '/api/credit_trades',
                        content_type='application/json',
                        data=json.dumps(payload)
                    )
                    self.assertEqual(status.is_success(response.status_code),
                                     result.proposing_trade_succeeds)
