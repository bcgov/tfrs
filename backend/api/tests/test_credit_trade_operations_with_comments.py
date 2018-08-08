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

from rest_framework import status

from api.models.CreditTrade import CreditTrade
from api.models.CreditTradeComment import CreditTradeComment
from api.models.CreditTradeStatus import CreditTradeStatus
from api.models.OrganizationBalance import OrganizationBalance
from api.tests.mixins.credit_trade_relationship import CreditTradeRelationshipMixin, CreditTradeFlowHooksMixin
from .base_test_case import BaseTestCase


class TestCreditTradeOperationsWithComments(BaseTestCase,
                                            CreditTradeRelationshipMixin,
                                            CreditTradeFlowHooksMixin):
    """Test creating and updating credit trades while concurrently adding a comment"""

    def test_create_with_comment(self):
        """Test creating a credit trade with a comment included"""

        payload = {
            'fairMarketValuePerCredit': 1000,
            'initiator': self.users[self.user_map[self.UserRelationship.INITIATOR]].organization.id,
            'numberOfCredits': 1,
            'respondent': self.users[self.user_map[self.UserRelationship.RESPONDENT]].organization.id,
            'status': self.statuses['submitted'].id,
            'tradeEffectiveDate': datetime.datetime.today().strftime('%Y-%m-%d'),
            'type': self.credit_trade_types['sell'].id,
            'is_rescinded': False,
            'zeroReason': None,
            'comment': 'Initial comment'
        }

        response = self.clients[self.user_map[self.UserRelationship.INITIATOR]].post(
            '/api/credit_trades',
            content_type='application/json',
            data=json.dumps(payload)
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        ct_id = json.loads(response.content.decode('utf-8'))['id']

        response = self.clients[self.user_map[self.UserRelationship.INITIATOR]].get(
            '/api/credit_trades/{}'.format(ct_id)
        )

        data = json.loads(response.content.decode('utf-8'))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(len(data['comments']), 0, "Expecting a comment")

    def test_edit_with_comment(self):

        state = {
            'count_before_status_change': 0
        }

        def add_comment_callback(payload):
            payload['comment'] = 'Adding a comment'

        def path_end_callback():
            state['count_before_status_change'] = 0

        def before_change_callback(pcr: self.PreChangeRecord):
            if pcr.trade_id is not None:
                state['count_before_status_change'] = \
                    CreditTradeComment.objects.filter(credit_trade_id=pcr.trade_id).count()

        def after_change_callback(cr: self.ChangeRecord):
            with self.subTest("Test that adding a comment works",
                              relationship=cr.relationship,
                              requesting_username=cr.requesting_username,
                              trade_id=cr.trade_id,
                              expected_to_be_successful=cr.expected_to_be_successful,
                              previous_comment_count=state['count_before_status_change'],
                              state_after=CreditTradeStatus.objects.get(id=cr.data_after_request['status']).status,
                              rescinded=CreditTrade.objects.get(id=cr.trade_id).is_rescinded):
                self.assertTrue(cr.expected_to_be_successful, status.is_success(cr.response_code))

                comment_count_after = CreditTradeComment.objects.filter(credit_trade_id=cr.trade_id).count()

                self.assertEqual(comment_count_after,
                                 state['count_before_status_change'] + 1,
                                 "Comment count should have increased by one")

        self.check_credit_trade_workflow(modify_request_payload=add_comment_callback,
                                         after_change_callback=after_change_callback,
                                         before_change_callback=before_change_callback,
                                         path_end_callback=path_end_callback)
