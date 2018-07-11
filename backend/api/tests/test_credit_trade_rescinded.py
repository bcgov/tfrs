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

import datetime
import json

from rest_framework import status

from api.models.CreditTrade import CreditTrade
from .base_test_case import BaseTestCase


class TestCreditTradeRescind(BaseTestCase):
    """
    This will test all credit trade related to the rescinded status
    """

    def test_rescind_credit_transfer(self):
        """
        As a fuel supplier
        When I submit a credit transfer proposal
        And I rescinded the proposal
        Then I should see the credit transfer as rescinded
        """
        credit_trade = CreditTrade.objects.create(
            status=self.statuses['submitted'],
            initiator=self.users['fs_user_1'].organization,
            respondent=self.users['fs_user_2'].organization,
            type=self.credit_trade_types['sell'],
            number_of_credits=1000,
            fair_market_value_per_credit=1,
            zero_reason=None,
            trade_effective_date=datetime.datetime.today().strftime(
                '%Y-%m-%d'
            )
        )

        payload = {
            'initiator': credit_trade.initiator_id,
            'is_rescinded': True,
            'fair_market_value_per_credit':
            credit_trade.fair_market_value_per_credit,
            'note': credit_trade.note,
            'number_of_credits': credit_trade.number_of_credits,
            'respondent': credit_trade.respondent_id,
            'status': credit_trade.status_id,
            'trade_effective_date': credit_trade.trade_effective_date,
            'type': credit_trade.type_id
        }

        response = self.clients['fs_user_1'].put(
            '/api/credit_trades/{}'.format(credit_trade.id),
            content_type='application/json',
            data=json.dumps(payload)
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        updated_credit_trade = CreditTrade.objects.get(id=credit_trade.id)
        self.assertTrue(updated_credit_trade.is_rescinded)

    def test_rescind_approved_credit_transfer(self):
        """
        As a fuel supplier
        When I submit a credit transfer proposal
        And the proposal had been 'Approved'
        And I try to rescind the proposal (through a hack)
        Then I should get an error message since I shouldn't see
        approved proposals
        """
        credit_trade = CreditTrade.objects.create(
            status=self.statuses['approved'],
            initiator=self.users['fs_user_1'].organization,
            respondent=self.users['fs_user_2'].organization,
            type=self.credit_trade_types['sell'],
            number_of_credits=1000,
            fair_market_value_per_credit=1,
            zero_reason=None,
            trade_effective_date=datetime.datetime.today().strftime(
                '%Y-%m-%d'
            )
        )

        payload = {
            'initiator': credit_trade.initiator_id,
            'is_rescinded': True,
            'fair_market_value_per_credit':
            credit_trade.fair_market_value_per_credit,
            'note': credit_trade.note,
            'number_of_credits': credit_trade.number_of_credits,
            'respondent': credit_trade.respondent_id,
            'status': credit_trade.status_id,
            'trade_effective_date': credit_trade.trade_effective_date,
            'type': credit_trade.type_id
        }

        response = self.clients['fs_user_2'].put(
            '/api/credit_trades/{}'.format(credit_trade.id),
            content_type='application/json',
            data=json.dumps(payload)
        )
        # Should return a validation error as the proposal is approved
        # (but not completed)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        updated = CreditTrade.objects.get(id=credit_trade.id)
        self.assertEqual(updated.is_rescinded, False)
        self.assertEqual(updated.status_id, self.statuses['approved'].id)

    def test_rescind_completed_credit_transfer(self):
        """
        As a fuel supplier
        When I submit a credit transfer proposal
        And the proposal had been 'Completed'
        And I try to rescind the proposal (through a hack)
        Then I should get an error message since the proposal
        was already completed
        """
        credit_trade = CreditTrade.objects.create(
            status=self.statuses['completed'],
            initiator=self.users['fs_user_1'].organization,
            respondent=self.users['fs_user_2'].organization,
            type=self.credit_trade_types['sell'],
            number_of_credits=1000,
            fair_market_value_per_credit=1,
            zero_reason=None,
            trade_effective_date=datetime.datetime.today().strftime(
                '%Y-%m-%d'
            )
        )

        payload = {
            'initiator': credit_trade.initiator_id,
            'is_rescinded': True,
            'fair_market_value_per_credit':
            credit_trade.fair_market_value_per_credit,
            'note': credit_trade.note,
            'number_of_credits': credit_trade.number_of_credits,
            'respondent': credit_trade.respondent_id,
            'status': credit_trade.status_id,
            'trade_effective_date': credit_trade.trade_effective_date,
            'type': credit_trade.type_id
        }

        response = self.clients['fs_user_2'].put(
            '/api/credit_trades/{}'.format(credit_trade.id),
            content_type='application/json',
            data=json.dumps(payload)
        )
        # Should return a validation error as the proposal has already been
        # completed
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        updated = CreditTrade.objects.get(id=credit_trade.id)
        self.assertEqual(updated.is_rescinded, False)
        self.assertEqual(updated.status_id, self.statuses['completed'].id)

    def test_rescind_refused_credit_transfer(self):
        """
        As a fuel supplier
        When I submit a credit transfer proposal
        And the proposal had been 'Refused'
        And I try to rescind the proposal
        Then I should get an error message since the proposal
        was already refused
        """
        credit_trade = CreditTrade.objects.create(
            status=self.statuses['submitted'],
            initiator=self.users['fs_user_1'].organization,
            respondent=self.users['fs_user_2'].organization,
            type=self.credit_trade_types['sell'],
            number_of_credits=1000,
            fair_market_value_per_credit=1,
            zero_reason=None,
            trade_effective_date=datetime.datetime.today().strftime(
                '%Y-%m-%d'
            )
        )

        # Respondent 'refused'
        payload = {
            'initiator': credit_trade.initiator_id,
            'is_rescinded': credit_trade.is_rescinded,
            'fair_market_value_per_credit':
            credit_trade.fair_market_value_per_credit,
            'note': credit_trade.note,
            'number_of_credits': credit_trade.number_of_credits,
            'respondent': credit_trade.respondent_id,
            'status': self.statuses['refused'].id,
            'trade_effective_date': credit_trade.trade_effective_date,
            'type': credit_trade.type_id
        }

        response = self.clients['fs_user_2'].put(
            '/api/credit_trades/{}'.format(credit_trade.id),
            content_type='application/json',
            data=json.dumps(payload)
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Initiator attempting to 'rescind'
        payload = {
            'initiator': credit_trade.initiator_id,
            'is_rescinded': True,
            'fair_market_value_per_credit':
            credit_trade.fair_market_value_per_credit,
            'note': credit_trade.note,
            'number_of_credits': credit_trade.number_of_credits,
            'respondent': credit_trade.respondent_id,
            'status': self.statuses['refused'].id,
            'trade_effective_date': credit_trade.trade_effective_date,
            'type': credit_trade.type_id
        }

        response = self.clients['fs_user_1'].put(
            '/api/credit_trades/{}'.format(credit_trade.id),
            content_type='application/json',
            data=json.dumps(payload)
        )
        # Should return a validation error as the proposal has already been
        # refused
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        updated = CreditTrade.objects.get(id=credit_trade.id)
        self.assertEqual(updated.is_rescinded, False)
        self.assertEqual(updated.status_id, self.statuses['refused'].id)
