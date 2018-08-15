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

from collections import defaultdict
from itertools import product

from rest_framework import status

from api.models.CreditTradeStatus import CreditTradeStatus
from api.models.CreditTrade import CreditTrade
from api.tests.mixins.credit_trade_relationship import CreditTradeRelationshipMixin

from .base_test_case import BaseTestCase


class TestCreditTradeStatuses(BaseTestCase, CreditTradeRelationshipMixin):
    """Exhaustively test all possible credit trade status transitions from all possible parties"""

    class _StateTransition:
        """Internal helper class to model the potential status transitions to test"""

        initial_state_id = None
        initial_state_rescinded_flag = False

        next_state_id = None
        next_state_rescinded_flag = False
        next_state_user_relationship = None

        expect_state_change_to_be_valid = False

    def check_state_change(self, state_change: _StateTransition):
        """
        Validate that a given credit trade state transition is processed as expected
        Inputs with no initial status will be created with POST
        Inputs with an initial status will be created via the Model API and updated with PUT
        """

        initiator_org = \
            self.users[self.user_map[TestCreditTradeStatuses.UserRelationship.INITIATOR]].organization
        respondent_org = \
            self.users[self.user_map[TestCreditTradeStatuses.UserRelationship.RESPONDENT]].organization

        payload = {
            'fairMarketValuePerCredit': 1,
            'initiator': initiator_org.id,
            'numberOfCredits': 1,
            'respondent': respondent_org.id,
            'status': state_change.next_state_id,
            'tradeEffectiveDate': datetime.datetime.today().strftime('%Y-%m-%d'),
            'type': self.credit_trade_types['sell'].id,
            'is_rescinded': state_change.next_state_rescinded_flag,
            'zeroReason': None
        }

        if state_change.initial_state_id is None:
            response = self.clients[self.user_map[state_change.next_state_user_relationship]].post(
                '/api/credit_trades',
                content_type='application/json',
                data=json.dumps(payload)
            )
            valid = status.is_success(response.status_code)
            self.assertEqual(valid, state_change.expect_state_change_to_be_valid)
            return
        else:
            created_trade = CreditTrade.objects.create(
                fair_market_value_per_credit=1,
                number_of_credits=1,
                initiator_id=self.users
                [self.user_map[TestCreditTradeStatuses.UserRelationship.INITIATOR]].organization.id,
                respondent_id=self.users
                [self.user_map[TestCreditTradeStatuses.UserRelationship.RESPONDENT]].organization.id,
                trade_effective_date=datetime.datetime.today(),
                type_id=self.credit_trade_types['sell'].id,
                status_id=state_change.initial_state_id,
                is_rescinded=state_change.initial_state_rescinded_flag
            )
            created_trade.save()
            created_trade.refresh_from_db()

            ct_id = created_trade.id

            response = self.clients[self.user_map[state_change.next_state_user_relationship]].put(
                '/api/credit_trades/{}'.format(ct_id),
                content_type='application/json',
                data=json.dumps(payload)
            )

            valid = status.is_success(response.status_code)
            self.assertEqual(valid, state_change.expect_state_change_to_be_valid)

    def check_all(self, to_check: list):
        """Construct a subtest context for each item in the list"""
        for sch in to_check:
            with self.subTest(
                    "Testing state transition",
                    initial_state=CreditTradeStatus.objects.get(
                        id=sch.initial_state_id
                    ).status if sch.initial_state_id is not None else None,
                    initial_state_is_rescinded=sch.initial_state_rescinded_flag,
                    next_state=CreditTradeStatus.objects.get(id=sch.next_state_id).status,
                    next_state_is_rescinded=sch.next_state_rescinded_flag,
                    next_state_user_relationship=sch.next_state_user_relationship,
                    expected_to_be_valid=sch.expect_state_change_to_be_valid
            ):
                self.check_state_change(sch)

    def test_credit_trade_creation(self):
        """Test credit trade creation"""
        to_check = []
        expected_result = defaultdict(lambda: False)

        expected_result[
            (TestCreditTradeStatuses.UserRelationship.INITIATOR, 'draft', False)
        ] = True
        expected_result[
            (TestCreditTradeStatuses.UserRelationship.INITIATOR, 'submitted', False)
        ] = True
        expected_result[
            (TestCreditTradeStatuses.UserRelationship.GOVERNMENT_ANALYST, 'recommended', False)
        ] = True
        expected_result[
            (TestCreditTradeStatuses.UserRelationship.GOVERNMENT_ANALYST, 'approved', False)
        ] = True
        expected_result[
            (TestCreditTradeStatuses.UserRelationship.GOVERNMENT_DIRECTOR, 'approved', False)
        ] = True
        expected_result[
            (TestCreditTradeStatuses.UserRelationship.GOVERNMENT_ANALYST, 'draft', False)
        ] = True

        for (relationship, trade_status, rescinded) in product(
                TestCreditTradeStatuses.UserRelationship,
                self.statuses.keys(),
                [True, False]):
            sch = TestCreditTradeStatuses._StateTransition()
            sch.next_state_id = self.statuses[trade_status].id
            sch.next_state_user_relationship = relationship
            sch.next_state_rescinded_flag = rescinded
            sch.expect_state_change_to_be_valid = \
                expected_result[(relationship, trade_status, rescinded)]
            to_check.append(sch)

        self.check_all(to_check)

    def test_initiator_status_changes(self):
        """Test initiator status changes"""
        to_check = []

        expected_result = defaultdict(lambda: False)

        expected_result[('draft', 'submitted')] = True
        expected_result[('draft', 'cancelled')] = True
        expected_result[('draft', 'draft')] = True

        for (initial_status, next_status) in product(self.statuses.keys(), self.statuses.keys()):
            sch = TestCreditTradeStatuses._StateTransition()
            sch.initial_state_id = self.statuses[initial_status].id
            sch.next_state_id = self.statuses[next_status].id
            sch.next_state_user_relationship = TestCreditTradeStatuses.UserRelationship.INITIATOR
            sch.expect_state_change_to_be_valid = expected_result[(initial_status, next_status)]
            to_check.append(sch)

        self.check_all(to_check)

    def test_initiator_status_changes_initially_rescinded(self):
        """Test initiator status changes when rescinded initially set"""

        to_check = []

        expected_result = defaultdict(lambda: False)

        for (initial_status, next_status) in product(self.statuses.keys(), self.statuses.keys()):
            sch = TestCreditTradeStatuses._StateTransition()
            sch.initial_state_id = self.statuses[initial_status].id
            sch.initial_state_rescinded_flag = True
            sch.next_state_id = self.statuses[next_status].id
            sch.next_state_user_relationship = TestCreditTradeStatuses.UserRelationship.INITIATOR
            sch.expect_state_change_to_be_valid = expected_result[(initial_status, next_status)]
            to_check.append(sch)

        self.check_all(to_check)

    def test_initiator_status_changes_finally_rescinded(self):
        """Test initiator status changes when rescinded is set"""

        to_check = []

        expected_result = defaultdict(lambda: False)
        expected_result[('submitted', 'submitted')] = True
        expected_result[('accepted', 'accepted')] = True
        expected_result[('recommended', 'recommended')] = True
        expected_result[('not_recommended', 'not_recommended')] = True

        for (initial_status, next_status) in product(self.statuses.keys(), self.statuses.keys()):
            sch = TestCreditTradeStatuses._StateTransition()
            sch.initial_state_id = self.statuses[initial_status].id
            sch.next_state_id = self.statuses[next_status].id
            sch.next_state_user_relationship = TestCreditTradeStatuses.UserRelationship.INITIATOR
            sch.expect_state_change_to_be_valid = expected_result[(initial_status, next_status)]
            sch.next_state_rescinded_flag = True
            to_check.append(sch)

        self.check_all(to_check)

    def test_initiator_status_changes_unrescind(self):
        """Test initiator status changes when attempting to un-rescind"""

        to_check = []

        expected_result = defaultdict(lambda: False)

        for (initial_status, next_status) in product(self.statuses.keys(), self.statuses.keys()):
            sch = TestCreditTradeStatuses._StateTransition()
            sch.initial_state_id = self.statuses[initial_status].id
            sch.initial_state_rescinded_flag = True
            sch.next_state_id = self.statuses[next_status].id
            sch.next_state_user_relationship = TestCreditTradeStatuses.UserRelationship.INITIATOR
            sch.expect_state_change_to_be_valid = expected_result[(initial_status, next_status)]
            sch.next_state_rescinded_flag = False
            to_check.append(sch)

        self.check_all(to_check)

    def test_respondent_status_changes(self):
        """Test respondent status changes"""

        to_check = []

        expected_result = defaultdict(lambda: False)

        expected_result[('submitted', 'accepted')] = True
        expected_result[('submitted', 'refused')] = True

        for (initial_status, next_status) in product(self.statuses.keys(), self.statuses.keys()):
            sch = TestCreditTradeStatuses._StateTransition()
            sch.initial_state_id = self.statuses[initial_status].id
            sch.next_state_id = self.statuses[next_status].id
            sch.next_state_user_relationship = TestCreditTradeStatuses.UserRelationship.RESPONDENT
            sch.expect_state_change_to_be_valid = expected_result[(initial_status, next_status)]
            to_check.append(sch)

        self.check_all(to_check)

    def test_respondent_status_changes_initially_rescinded(self):
        """Test respondent status changes when initially rescinded"""

        to_check = []

        expected_result = defaultdict(lambda: False)

        for (initial_status, next_status) in product(self.statuses.keys(), self.statuses.keys()):
            sch = TestCreditTradeStatuses._StateTransition()
            sch.initial_state_id = self.statuses[initial_status].id
            sch.initial_state_rescinded_flag = True
            sch.next_state_id = self.statuses[next_status].id
            sch.next_state_user_relationship = TestCreditTradeStatuses.UserRelationship.RESPONDENT
            sch.expect_state_change_to_be_valid = expected_result[(initial_status, next_status)]
            to_check.append(sch)

        self.check_all(to_check)

    def test_respondent_status_changes_finally_rescinded(self):
        """Test respondent status changes when rescinded is set"""

        to_check = []

        expected_result = defaultdict(lambda: False)
        expected_result[('accepted', 'accepted')] = True
        expected_result[('recommended', 'recommended')] = True
        expected_result[('not_recommended', 'not_recommended')] = True

        for (initial_status, next_status) in product(self.statuses.keys(), self.statuses.keys()):
            sch = TestCreditTradeStatuses._StateTransition()
            sch.initial_state_id = self.statuses[initial_status].id
            sch.next_state_id = self.statuses[next_status].id
            sch.next_state_user_relationship = TestCreditTradeStatuses.UserRelationship.RESPONDENT
            sch.expect_state_change_to_be_valid = expected_result[(initial_status, next_status)]
            sch.next_state_rescinded_flag = True
            to_check.append(sch)

        self.check_all(to_check)

    def test_respondent_status_changes_unrescind(self):
        """Test respondent status changes when attempting to un-rescind"""

        to_check = []

        expected_result = defaultdict(lambda: False)

        for (initial_status, next_status) in product(self.statuses.keys(), self.statuses.keys()):
            sch = TestCreditTradeStatuses._StateTransition()
            sch.initial_state_id = self.statuses[initial_status].id
            sch.initial_state_rescinded_flag = True
            sch.next_state_id = self.statuses[next_status].id
            sch.next_state_user_relationship = TestCreditTradeStatuses.UserRelationship.RESPONDENT
            sch.expect_state_change_to_be_valid = expected_result[(initial_status, next_status)]
            sch.next_state_rescinded_flag = False
            to_check.append(sch)

        self.check_all(to_check)

    def test_government_analyst_status_changes(self):
        """Test government analyst status changes"""

        to_check = []

        expected_result = defaultdict(lambda: False)

        expected_result[('accepted', 'recommended')] = True
        expected_result[('accepted', 'not_recommended')] = True
        expected_result[('approved', 'approved')] = True

        for (initial_status, next_status) in product(self.statuses.keys(), self.statuses.keys()):
            sch = TestCreditTradeStatuses._StateTransition()
            sch.initial_state_id = self.statuses[initial_status].id
            sch.next_state_id = self.statuses[next_status].id
            sch.next_state_user_relationship = \
                TestCreditTradeStatuses.UserRelationship.GOVERNMENT_ANALYST
            sch.expect_state_change_to_be_valid = expected_result[(initial_status, next_status)]
            to_check.append(sch)

        self.check_all(to_check)

    def test_government_analyst_status_changes_initially_rescinded(self):
        """Test government analyst status changes when initially rescinded"""

        to_check = []

        expected_result = defaultdict(lambda: False)

        for (initial_status, next_status) in product(self.statuses.keys(), self.statuses.keys()):
            sch = TestCreditTradeStatuses._StateTransition()
            sch.initial_state_id = self.statuses[initial_status].id
            sch.initial_state_rescinded_flag = True
            sch.next_state_id = self.statuses[next_status].id
            sch.next_state_user_relationship = \
                TestCreditTradeStatuses.UserRelationship.GOVERNMENT_ANALYST
            sch.expect_state_change_to_be_valid = expected_result[(initial_status, next_status)]
            to_check.append(sch)

        self.check_all(to_check)

    def test_government_analyst_status_changes_finally_rescinded(self):
        """Test government analyst status changes" when rescinded is set"""

        to_check = []

        expected_result = defaultdict(lambda: False)

        for (initial_status, next_status) in product(self.statuses.keys(), self.statuses.keys()):
            sch = TestCreditTradeStatuses._StateTransition()
            sch.initial_state_id = self.statuses[initial_status].id
            sch.next_state_id = self.statuses[next_status].id
            sch.next_state_user_relationship = \
                TestCreditTradeStatuses.UserRelationship.GOVERNMENT_ANALYST
            sch.expect_state_change_to_be_valid = expected_result[(initial_status, next_status)]
            sch.next_state_rescinded_flag = True
            to_check.append(sch)

        self.check_all(to_check)

    def test_government_analyst_status_changes_unrescind(self):
        """Test government analyst status changes when attempting to un-rescind"""

        to_check = []

        expected_result = defaultdict(lambda: False)

        for (initial_status, next_status) in product(self.statuses.keys(), self.statuses.keys()):
            sch = TestCreditTradeStatuses._StateTransition()
            sch.initial_state_id = self.statuses[initial_status].id
            sch.initial_state_rescinded_flag = True
            sch.next_state_id = self.statuses[next_status].id
            sch.next_state_user_relationship = \
                TestCreditTradeStatuses.UserRelationship.GOVERNMENT_ANALYST
            sch.expect_state_change_to_be_valid = expected_result[(initial_status, next_status)]
            sch.next_state_rescinded_flag = False
            to_check.append(sch)

        self.check_all(to_check)

    def test_government_director_status_changes(self):
        """Test government director status changes"""

        to_check = []

        expected_result = defaultdict(lambda: False)

        expected_result[('recommended', 'approved')] = True
        expected_result[('recommended', 'declined')] = True
        expected_result[('not_recommended', 'approved')] = True
        expected_result[('not_recommended', 'declined')] = True
        expected_result[('approved', 'approved')] = True

        for (initial_status, next_status) in product(self.statuses.keys(), self.statuses.keys()):
            sch = TestCreditTradeStatuses._StateTransition()
            sch.initial_state_id = self.statuses[initial_status].id
            sch.next_state_id = self.statuses[next_status].id
            sch.next_state_user_relationship = \
                TestCreditTradeStatuses.UserRelationship.GOVERNMENT_DIRECTOR
            sch.expect_state_change_to_be_valid = expected_result[(initial_status, next_status)]
            to_check.append(sch)

        self.check_all(to_check)

    def test_government_director_status_changes_initially_rescinded(self):
        """Test government director status changes when initially rescinded"""

        to_check = []

        expected_result = defaultdict(lambda: False)

        for (initial_status, next_status) in product(self.statuses.keys(), self.statuses.keys()):
            sch = TestCreditTradeStatuses._StateTransition()
            sch.initial_state_id = self.statuses[initial_status].id
            sch.initial_state_rescinded_flag = True
            sch.next_state_id = self.statuses[next_status].id
            sch.next_state_user_relationship = \
                TestCreditTradeStatuses.UserRelationship.GOVERNMENT_DIRECTOR
            sch.expect_state_change_to_be_valid = expected_result[(initial_status, next_status)]
            to_check.append(sch)

        self.check_all(to_check)

    def test_government_director_status_changes_finally_rescinded(self):
        """Test government director status changes when rescinded is set"""

        to_check = []

        expected_result = defaultdict(lambda: False)

        for (initial_status, next_status) in product(self.statuses.keys(), self.statuses.keys()):
            sch = TestCreditTradeStatuses._StateTransition()
            sch.initial_state_id = self.statuses[initial_status].id
            sch.next_state_id = self.statuses[next_status].id
            sch.next_state_user_relationship = \
                TestCreditTradeStatuses.UserRelationship.GOVERNMENT_DIRECTOR
            sch.expect_state_change_to_be_valid = expected_result[(initial_status, next_status)]
            sch.next_state_rescinded_flag = True
            to_check.append(sch)

        self.check_all(to_check)

    def test_government_director_status_changes_unrescind(self):
        """Test government director status changes when attempting to un-rescind"""

        to_check = []

        expected_result = defaultdict(lambda: False)

        for (initial_status, next_status) in product(self.statuses.keys(), self.statuses.keys()):
            sch = TestCreditTradeStatuses._StateTransition()
            sch.initial_state_id = self.statuses[initial_status].id
            sch.initial_state_rescinded_flag = True
            sch.next_state_id = self.statuses[next_status].id
            sch.next_state_user_relationship = \
                TestCreditTradeStatuses.UserRelationship.GOVERNMENT_DIRECTOR
            sch.expect_state_change_to_be_valid = expected_result[(initial_status, next_status)]
            sch.next_state_rescinded_flag = False
            to_check.append(sch)

        self.check_all(to_check)

    def test_third_party_status_changes(self):
        """Test third-party status changes"""

        to_check = []

        expected_result = defaultdict(lambda: False)

        for (initial_status, next_status) in product(self.statuses.keys(), self.statuses.keys()):
            sch = TestCreditTradeStatuses._StateTransition()
            sch.initial_state_id = self.statuses[initial_status].id
            sch.next_state_id = self.statuses[next_status].id
            sch.next_state_user_relationship = TestCreditTradeStatuses.UserRelationship.THIRD_PARTY
            sch.expect_state_change_to_be_valid = expected_result[(initial_status, next_status)]
            to_check.append(sch)

        self.check_all(to_check)

    def test_third_party_status_changes_initially_rescinded(self):
        """Test third-party status changes when initially rescinded"""

        to_check = []

        expected_result = defaultdict(lambda: False)

        for (initial_status, next_status) in product(self.statuses.keys(), self.statuses.keys()):
            sch = TestCreditTradeStatuses._StateTransition()
            sch.initial_state_id = self.statuses[initial_status].id
            sch.initial_state_rescinded_flag = True
            sch.next_state_id = self.statuses[next_status].id
            sch.next_state_user_relationship = TestCreditTradeStatuses.UserRelationship.THIRD_PARTY
            sch.expect_state_change_to_be_valid = expected_result[(initial_status, next_status)]
            to_check.append(sch)

        self.check_all(to_check)

    def test_third_party_status_changes_finally_rescinded(self):
        """Test third-party status changes when rescinded is set"""

        to_check = []

        expected_result = defaultdict(lambda: False)

        for (initial_status, next_status) in product(self.statuses.keys(), self.statuses.keys()):
            sch = TestCreditTradeStatuses._StateTransition()
            sch.initial_state_id = self.statuses[initial_status].id
            sch.next_state_id = self.statuses[next_status].id
            sch.next_state_user_relationship = TestCreditTradeStatuses.UserRelationship.THIRD_PARTY
            sch.expect_state_change_to_be_valid = expected_result[(initial_status, next_status)]
            sch.next_state_rescinded_flag = True
            to_check.append(sch)

        self.check_all(to_check)

    def test_third_party_status_changes_unrescind(self):
        """Test third-party status changes when attempting to un-rescind"""

        to_check = []

        expected_result = defaultdict(lambda: False)

        for (initial_status, next_status) in product(self.statuses.keys(), self.statuses.keys()):
            sch = TestCreditTradeStatuses._StateTransition()
            sch.initial_state_id = self.statuses[initial_status].id
            sch.initial_state_rescinded_flag = True
            sch.next_state_id = self.statuses[next_status].id
            sch.next_state_user_relationship = TestCreditTradeStatuses.UserRelationship.THIRD_PARTY
            sch.expect_state_change_to_be_valid = expected_result[(initial_status, next_status)]
            sch.next_state_rescinded_flag = False
            to_check.append(sch)

        self.check_all(to_check)
