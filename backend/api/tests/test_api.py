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


import json
from collections import defaultdict
from enum import Enum
from itertools import product

from django.test import TestCase, Client

from rest_framework import status
import datetime

from api import fake_api_calls
from api.models.CreditTradeStatus import CreditTradeStatus
from api.models.CreditTradeType import CreditTradeType
from api.models.Organization import Organization
from api.models.Permission import Permission
from api.models.CreditTrade import CreditTrade
from api.models.OrganizationBalance import OrganizationBalance
from api.models.Role import Role
from api.models.RolePermission import RolePermission
from api.models.User import User
from api.models.UserRole import UserRole

from api.tests.base_test_case import BaseTestCase


class _StateTransition:

    class UserRelationship(Enum):
        INITIATOR = 1
        RESPONDENT = 2
        THIRD_PARTY = 3
        GOVERNMENT_ANALYST = 4
        GOVERNMENT_DIRECTOR = 5

    initial_state_id = None
    initial_state_rescinded_flag = False
    # initial_state_user_relationship = None

    next_state_id = None
    next_state_rescinded_flag = False
    next_state_user_relationship = None

    expect_state_change_to_be_valid = False


class TestAPI(BaseTestCase):

    user_map = {
        _StateTransition.UserRelationship.INITIATOR: 'fs_user_1',
        _StateTransition.UserRelationship.RESPONDENT: 'fs_user_2',
        _StateTransition.UserRelationship.THIRD_PARTY: 'fs_user_3',
        _StateTransition.UserRelationship.GOVERNMENT_ANALYST: 'gov_analyst',
        _StateTransition.UserRelationship.GOVERNMENT_DIRECTOR: 'gov_director'
    }

    def check_state_change(self, state_change: _StateTransition):
        """
        Validate that a given credit trade state transition is processed as expected
        Inputs with no initial status will be created with POST
        Inputs with an initial status will be created via the Model API and updated with PUT
        """

        payload = {
            'fairMarketValuePerCredit': 1,
            'initiator': self.users[self.user_map[_StateTransition.UserRelationship.INITIATOR]].organization.id,
            'numberOfCredits': 1,
            'respondent': self.users[self.user_map[_StateTransition.UserRelationship.RESPONDENT]].organization.id,
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
                initiator_id=self.users[self.user_map[_StateTransition.UserRelationship.INITIATOR]].organization.id,
                respondent_id=self.users[self.user_map[_StateTransition.UserRelationship.RESPONDENT]].organization.id,
                trade_effective_date=datetime.datetime.today(),
                type_id=self.credit_trade_types['sell'].id,
                status_id=state_change.initial_state_id,
                is_rescinded=state_change.initial_state_rescinded_flag
            )
            created_trade.save()
            created_trade.refresh_from_db()

            id = created_trade.id

            response = self.clients[self.user_map[state_change.next_state_user_relationship]].put(
                '/api/credit_trades/{}'.format(id),
                content_type='application/json',
                data=json.dumps(payload)
            )
            valid = status.is_success(response.status_code)
            self.assertEqual(valid, state_change.expect_state_change_to_be_valid)

    def check_all(self, to_check: list):
        for sc in to_check:
            with self.subTest("Testing state transition",
                              initial_state=CreditTradeStatus.objects.get(id=sc.initial_state_id)
                              .status if sc.initial_state_id is not None else None,
                              initial_state_is_rescinded=sc.initial_state_rescinded_flag,
                              next_state=CreditTradeStatus.objects.get(id=sc.next_state_id).status,
                              next_state_is_rescinded=sc.next_state_rescinded_flag,
                              next_state_user_relationship=sc.next_state_user_relationship,
                              expected_to_be_valid=sc.expect_state_change_to_be_valid
                              ):
                self.check_state_change(sc)

    def test_credit_trade_creation(self) -> list:
        to_check = []
        expected_result = defaultdict(lambda: False)

        expected_result[_StateTransition.UserRelationship.INITIATOR, 'draft', False] = True
        expected_result[_StateTransition.UserRelationship.INITIATOR, 'submitted', False] = True
        expected_result[_StateTransition.UserRelationship.GOVERNMENT_DIRECTOR, 'approved', False] = True

        for (relationship, trade_status, rescinded) in product(
                _StateTransition.UserRelationship,
                self.statuses.keys(),
                [True, False]):
            sc = _StateTransition()
            sc.next_state_id = self.statuses[trade_status].id
            sc.next_state_user_relationship = relationship
            sc.next_state_rescinded_flag = rescinded
            sc.expect_state_change_to_be_valid = expected_result[relationship, trade_status, rescinded]
            to_check.append(sc)

        self.check_all(to_check)

    def test_initiator_status_changes(self) -> list:
        to_check = []

        expected_result = defaultdict(lambda: False)

        expected_result[('draft', 'submitted')] = True
        expected_result[('draft', 'cancelled')] = True
        expected_result[('draft', 'draft')] = True

        for (initial_status, next_status) in product(self.statuses.keys(), self.statuses.keys()):
            sc = _StateTransition()
            sc.initial_state_id = self.statuses[initial_status].id
            sc.next_state_id = self.statuses[next_status].id
            sc.next_state_user_relationship = _StateTransition.UserRelationship.INITIATOR
            sc.expect_state_change_to_be_valid = expected_result[(initial_status, next_status)]
            to_check.append(sc)

        self.check_all(to_check)

    def test_initiator_status_changes_initially_rescinded(self) -> list:
        to_check = []

        expected_result = defaultdict(lambda: False)

        for (initial_status, next_status) in product(self.statuses.keys(), self.statuses.keys()):
            sc = _StateTransition()
            sc.initial_state_id = self.statuses[initial_status].id
            sc.initial_state_rescinded_flag = True
            sc.next_state_id = self.statuses[next_status].id
            sc.next_state_user_relationship = _StateTransition.UserRelationship.INITIATOR
            sc.expect_state_change_to_be_valid = expected_result[(initial_status, next_status)]
            to_check.append(sc)

        self.check_all(to_check)

    def test_initiator_status_changes_finally_rescinded(self) -> list:
        to_check = []

        expected_result = defaultdict(lambda: False)
        expected_result[('submitted', 'submitted')] = True
        expected_result[('accepted', 'accepted')] = True
        expected_result[('recommended', 'recommended')] = True
        expected_result[('not_recommended', 'not_recommended')] = True

        for (initial_status, next_status) in product(self.statuses.keys(), self.statuses.keys()):
            sc = _StateTransition()
            sc.initial_state_id = self.statuses[initial_status].id
            sc.next_state_id = self.statuses[next_status].id
            sc.next_state_user_relationship = _StateTransition.UserRelationship.INITIATOR
            sc.expect_state_change_to_be_valid = expected_result[(initial_status, next_status)]
            sc.next_state_rescinded_flag = True
            to_check.append(sc)

        self.check_all(to_check)

    def test_initiator_status_changes_unrescind(self) -> list:
        to_check = []

        expected_result = defaultdict(lambda: False)

        for (initial_status, next_status) in product(self.statuses.keys(), self.statuses.keys()):
            sc = _StateTransition()
            sc.initial_state_id = self.statuses[initial_status].id
            sc.initial_state_rescinded_flag = True
            sc.next_state_id = self.statuses[next_status].id
            sc.next_state_user_relationship = _StateTransition.UserRelationship.INITIATOR
            sc.expect_state_change_to_be_valid = expected_result[(initial_status, next_status)]
            sc.next_state_rescinded_flag = False
            to_check.append(sc)

        self.check_all(to_check)

    def test_respondent_status_changes(self) -> list:
        to_check = []

        expected_result = defaultdict(lambda: False)

        expected_result[('submitted', 'accepted')] = True
        expected_result[('submitted', 'refused')] = True

        for (initial_status, next_status) in product(self.statuses.keys(), self.statuses.keys()):
            sc = _StateTransition()
            sc.initial_state_id = self.statuses[initial_status].id
            sc.next_state_id = self.statuses[next_status].id
            sc.next_state_user_relationship = _StateTransition.UserRelationship.RESPONDENT
            sc.expect_state_change_to_be_valid = expected_result[(initial_status, next_status)]
            to_check.append(sc)

        self.check_all(to_check)

    def test_respondent_status_changes_initially_rescinded(self) -> list:
        to_check = []

        expected_result = defaultdict(lambda: False)

        for (initial_status, next_status) in product(self.statuses.keys(), self.statuses.keys()):
            sc = _StateTransition()
            sc.initial_state_id = self.statuses[initial_status].id
            sc.initial_state_rescinded_flag = True
            sc.next_state_id = self.statuses[next_status].id
            sc.next_state_user_relationship = _StateTransition.UserRelationship.RESPONDENT
            sc.expect_state_change_to_be_valid = expected_result[(initial_status, next_status)]
            to_check.append(sc)

        self.check_all(to_check)

    def test_respondent_status_changes_finally_rescinded(self) -> list:
        to_check = []

        expected_result = defaultdict(lambda: False)
        expected_result[('accepted', 'accepted')] = True
        expected_result[('recommended', 'recommended')] = True
        expected_result[('not_recommended', 'not_recommended')] = True

        for (initial_status, next_status) in product(self.statuses.keys(), self.statuses.keys()):
            sc = _StateTransition()
            sc.initial_state_id = self.statuses[initial_status].id
            sc.next_state_id = self.statuses[next_status].id
            sc.next_state_user_relationship = _StateTransition.UserRelationship.RESPONDENT
            sc.expect_state_change_to_be_valid = expected_result[(initial_status, next_status)]
            sc.next_state_rescinded_flag = True
            to_check.append(sc)

        self.check_all(to_check)

    def test_respondent_status_changes_unrescind(self) -> list:
        to_check = []

        expected_result = defaultdict(lambda: False)

        for (initial_status, next_status) in product(self.statuses.keys(), self.statuses.keys()):
            sc = _StateTransition()
            sc.initial_state_id = self.statuses[initial_status].id
            sc.initial_state_rescinded_flag = True
            sc.next_state_id = self.statuses[next_status].id
            sc.next_state_user_relationship = _StateTransition.UserRelationship.RESPONDENT
            sc.expect_state_change_to_be_valid = expected_result[(initial_status, next_status)]
            sc.next_state_rescinded_flag = False
            to_check.append(sc)

        self.check_all(to_check)

    def test_government_analyst_status_changes(self) -> list:
        to_check = []

        expected_result = defaultdict(lambda: False)

        expected_result[('accepted', 'recommended')] = True
        expected_result[('accepted', 'not_recommended')] = True

        for (initial_status, next_status) in product(self.statuses.keys(), self.statuses.keys()):
            sc = _StateTransition()
            sc.initial_state_id = self.statuses[initial_status].id
            sc.next_state_id = self.statuses[next_status].id
            sc.next_state_user_relationship = _StateTransition.UserRelationship.GOVERNMENT_ANALYST
            sc.expect_state_change_to_be_valid = expected_result[(initial_status, next_status)]
            to_check.append(sc)

        self.check_all(to_check)

    def test_government_analyst_status_changes_initially_rescinded(self) -> list:
        to_check = []

        expected_result = defaultdict(lambda: False)

        for (initial_status, next_status) in product(self.statuses.keys(), self.statuses.keys()):
            sc = _StateTransition()
            sc.initial_state_id = self.statuses[initial_status].id
            sc.initial_state_rescinded_flag = True
            sc.next_state_id = self.statuses[next_status].id
            sc.next_state_user_relationship = _StateTransition.UserRelationship.GOVERNMENT_ANALYST
            sc.expect_state_change_to_be_valid = expected_result[(initial_status, next_status)]
            to_check.append(sc)

        self.check_all(to_check)

    def test_government_analyst_status_changes_finally_rescinded(self) -> list:
        to_check = []

        expected_result = defaultdict(lambda: False)

        for (initial_status, next_status) in product(self.statuses.keys(), self.statuses.keys()):
            sc = _StateTransition()
            sc.initial_state_id = self.statuses[initial_status].id
            sc.next_state_id = self.statuses[next_status].id
            sc.next_state_user_relationship = _StateTransition.UserRelationship.GOVERNMENT_ANALYST
            sc.expect_state_change_to_be_valid = expected_result[(initial_status, next_status)]
            sc.next_state_rescinded_flag = True
            to_check.append(sc)

        self.check_all(to_check)

    def test_government_analyst_status_changes_unrescind(self) -> list:
        to_check = []

        expected_result = defaultdict(lambda: False)

        for (initial_status, next_status) in product(self.statuses.keys(), self.statuses.keys()):
            sc = _StateTransition()
            sc.initial_state_id = self.statuses[initial_status].id
            sc.initial_state_rescinded_flag = True
            sc.next_state_id = self.statuses[next_status].id
            sc.next_state_user_relationship = _StateTransition.UserRelationship.GOVERNMENT_ANALYST
            sc.expect_state_change_to_be_valid = expected_result[(initial_status, next_status)]
            sc.next_state_rescinded_flag = False
            to_check.append(sc)

        self.check_all(to_check)

    def test_government_director_status_changes(self) -> list:
        to_check = []

        expected_result = defaultdict(lambda: False)

        expected_result[('recommended', 'approved')] = True
        expected_result[('recommended', 'declined')] = True
        expected_result[('not_recommended', 'approved')] = True
        expected_result[('not_recommended', 'declined')] = True

        for (initial_status, next_status) in product(self.statuses.keys(), self.statuses.keys()):
            sc = _StateTransition()
            sc.initial_state_id = self.statuses[initial_status].id
            sc.next_state_id = self.statuses[next_status].id
            sc.next_state_user_relationship = _StateTransition.UserRelationship.GOVERNMENT_DIRECTOR
            sc.expect_state_change_to_be_valid = expected_result[(initial_status, next_status)]
            to_check.append(sc)

        self.check_all(to_check)

    def test_government_director_status_changes_initially_rescinded(self) -> list:
        to_check = []

        expected_result = defaultdict(lambda: False)

        for (initial_status, next_status) in product(self.statuses.keys(), self.statuses.keys()):
            sc = _StateTransition()
            sc.initial_state_id = self.statuses[initial_status].id
            sc.initial_state_rescinded_flag = True
            sc.next_state_id = self.statuses[next_status].id
            sc.next_state_user_relationship = _StateTransition.UserRelationship.GOVERNMENT_DIRECTOR
            sc.expect_state_change_to_be_valid = expected_result[(initial_status, next_status)]
            to_check.append(sc)

        self.check_all(to_check)

    def test_government_director_status_changes_finally_rescinded(self) -> list:
        to_check = []

        expected_result = defaultdict(lambda: False)

        for (initial_status, next_status) in product(self.statuses.keys(), self.statuses.keys()):
            sc = _StateTransition()
            sc.initial_state_id = self.statuses[initial_status].id
            sc.next_state_id = self.statuses[next_status].id
            sc.next_state_user_relationship = _StateTransition.UserRelationship.GOVERNMENT_DIRECTOR
            sc.expect_state_change_to_be_valid = expected_result[(initial_status, next_status)]
            sc.next_state_rescinded_flag = True
            to_check.append(sc)

        self.check_all(to_check)

    def test_government_director_status_changes_unrescind(self) -> list:
        to_check = []

        expected_result = defaultdict(lambda: False)

        for (initial_status, next_status) in product(self.statuses.keys(), self.statuses.keys()):
            sc = _StateTransition()
            sc.initial_state_id = self.statuses[initial_status].id
            sc.initial_state_rescinded_flag = True
            sc.next_state_id = self.statuses[next_status].id
            sc.next_state_user_relationship = _StateTransition.UserRelationship.GOVERNMENT_DIRECTOR
            sc.expect_state_change_to_be_valid = expected_result[(initial_status, next_status)]
            sc.next_state_rescinded_flag = False
            to_check.append(sc)

        self.check_all(to_check)

    def test_third_party_status_changes(self) -> list:
        to_check = []

        expected_result = defaultdict(lambda: False)

        for (initial_status, next_status) in product(self.statuses.keys(), self.statuses.keys()):
            sc = _StateTransition()
            sc.initial_state_id = self.statuses[initial_status].id
            sc.next_state_id = self.statuses[next_status].id
            sc.next_state_user_relationship = _StateTransition.UserRelationship.THIRD_PARTY
            sc.expect_state_change_to_be_valid = expected_result[(initial_status, next_status)]
            to_check.append(sc)

        self.check_all(to_check)

    def test_third_party_status_changes_initially_rescinded(self) -> list:
        to_check = []

        expected_result = defaultdict(lambda: False)

        for (initial_status, next_status) in product(self.statuses.keys(), self.statuses.keys()):
            sc = _StateTransition()
            sc.initial_state_id = self.statuses[initial_status].id
            sc.initial_state_rescinded_flag = True
            sc.next_state_id = self.statuses[next_status].id
            sc.next_state_user_relationship = _StateTransition.UserRelationship.THIRD_PARTY
            sc.expect_state_change_to_be_valid = expected_result[(initial_status, next_status)]
            to_check.append(sc)

        self.check_all(to_check)

    def test_third_party_status_changes_finally_rescinded(self) -> list:
        to_check = []

        expected_result = defaultdict(lambda: False)

        for (initial_status, next_status) in product(self.statuses.keys(), self.statuses.keys()):
            sc = _StateTransition()
            sc.initial_state_id = self.statuses[initial_status].id
            sc.next_state_id = self.statuses[next_status].id
            sc.next_state_user_relationship = _StateTransition.UserRelationship.THIRD_PARTY
            sc.expect_state_change_to_be_valid = expected_result[(initial_status, next_status)]
            sc.next_state_rescinded_flag = True
            to_check.append(sc)

        self.check_all(to_check)

    def test_third_party_director_status_changes_unrescind(self) -> list:
        to_check = []

        expected_result = defaultdict(lambda: False)

        for (initial_status, next_status) in product(self.statuses.keys(), self.statuses.keys()):
            sc = _StateTransition()
            sc.initial_state_id = self.statuses[initial_status].id
            sc.initial_state_rescinded_flag = True
            sc.next_state_id = self.statuses[next_status].id
            sc.next_state_user_relationship = _StateTransition.UserRelationship.THIRD_PARTY
            sc.expect_state_change_to_be_valid = expected_result[(initial_status, next_status)]
            sc.next_state_rescinded_flag = False
            to_check.append(sc)

        self.check_all(to_check)



    # Todo incorporate
    #
    # def test_create_and_create_trade_history(self):
    #     credit_trades = self.test_data_success
    #
    #     for tests in credit_trades:
    #         response =self.clients['gov_analyst'].post(
    #             self.test_url,
    #             content_type='application/json',
    #             data=json.dumps(tests['data']))
    #
    #         ct_id = response.data['id']
    #         response =self.clients['fs_user_1'].get(
    #             "{}/{}/history".format(self.test_url, ct_id),
    #             content_type='application/json')
    #
    #         self.assertEqual(response.status_code, status.HTTP_200_OK)
    #

    # def test_update_create_trade_history(self):
    #     self.test_update(num_of_credits=1)
    #     self.test_update(num_of_credits=2)
    #
    #     response =self.clients['gov_analyst'].get(
    #         "{}/{}/history".format(self.test_url, self.credit_trade['id']),
    #         content_type='application/json')
    #
    #     response_data = json.loads(response.content.decode("utf-8"))
    #
    #     self.assertEqual(3, len(response_data))
    #
    #     self.assertEqual(response.status_code, status.HTTP_200_OK)
    #
    # # TODO: possibly move the next set of tests to another file;
    # # They test the business logic & not the API itself.
    # def test_is_internal_history_false(self):
    #     self.test_update(credit_trade_status=self.statuses['submitted'].id)
    #
    #     data = {
    #         'number_of_credits': 4,
    #         'status': self.statuses['accepted'].id,
    #         'initiator': 2,
    #         'respondent': self.users['fs_user_1'].organization.id,
    #         'type': self.credit_trade_types['buy'].id,
    #         'fair_market_value_per_credit': 1
    #     }
    #
    #     response = self.respondent_client.put(
    #         "{}/{}".format(self.test_url, self.credit_trade['id']),
    #         content_type='application/json',
    #         data=json.dumps(data))
    #
    #     # self.test_update(credit_trade_status=STATUS_ACCEPTED)
    #     # TODO: Change this to /id/propose and /id/accept
    #     response =self.clients['fs_user_1'].get(
    #         "{}/{}/history".format(self.test_url, self.credit_trade['id']),
    #         content_type='application/json')
    #     response_data = json.loads(response.content.decode("utf-8"))
    #     self.assertFalse(response_data[0]['isInternalHistoryRecord'])
    #
    # def test_is_internal_history_draft(self):
    #     # Initially created credit trade is "Draft"
    #     response =self.clients['fs_user_1'].get(
    #         "{}/{}/history".format(self.test_url, self.credit_trade['id']),
    #         content_type='application/json')
    #
    #     response_data = json.loads(response.content.decode("utf-8"))
    #     self.assertTrue(response_data[0]['isInternalHistoryRecord'])
    #
    # def test_is_internal_history_draft_then_cancelled(self):
    #     # Initially created credit trade is "Draft"
    #
    #     # Update the status to "Cancelled"
    #     self.test_update(credit_trade_status=self.statuses['cancelled'].id)
    #
    #     credit_trade = CreditTrade.objects.get(id=self.credit_trade['id'])
    #     self.assertEqual(credit_trade.status_id, self.statuses['cancelled'].id)
    #
    # def test_nested_credit_trade(self):
    #     response =self.clients['fs_user_1'].get(
    #         "{}/{}".format(self.test_url, self.credit_trade['id']),
    #         content_type='application/json')
    #     response_data = json.loads(response.content.decode("utf-8"))
    #
    #     credit_trade_status = {
    #         "id": self.statuses['draft'].id,
    #         "status": "Draft"
    #     }
    #     self.assertTrue(
    #         set(credit_trade_status).issubset(
    #             response_data['status']))
    #
    # def test_nested_credit_trade_history(self):
    #     response =self.clients['fs_user_1'].get(
    #         "{}/{}/history".format(self.test_url, self.credit_trade['id']),
    #         content_type='application/json')
    #     response_data = json.loads(response.content.decode("utf-8"))[0]
    #
    #     credit_trade_status = {
    #         "id": self.statuses['draft'].id,
    #         "status": "Draft"
    #     }
    #     self.assertTrue(
    #         set(credit_trade_status).issubset(
    #             response_data['status']))
    #

