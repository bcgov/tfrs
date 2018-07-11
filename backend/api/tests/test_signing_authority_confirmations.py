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
from collections import defaultdict
from itertools import product

from rest_framework import status

from api.models.CreditTrade import CreditTrade
from api.models.SigningAuthorityAssertion import SigningAuthorityAssertion
from api.tests.data_creation_utilities import DataCreationUtilities
from api.tests.mixins.credit_trade_relationship import CreditTradeRelationshipMixin
from .base_test_case import BaseTestCase


class TestSigningAuthorityConfirmations(BaseTestCase, CreditTradeRelationshipMixin):
    """Test /api/signing_authority_confirmations"""

    def test_signing_authority_confirmations(self):
        """Test permissions for signing authority confirmations """

        initiator = \
            self.users[self.user_map[TestSigningAuthorityConfirmations.UserRelationship.INITIATOR]]
        respondent = \
            self.users[self.user_map[TestSigningAuthorityConfirmations.UserRelationship.RESPONDENT]]

        trades = DataCreationUtilities.create_possible_credit_trades(
            initiator.organization,
            respondent.organization
        )

        expected_results = defaultdict(lambda: False)

        # key (relationship, status, rescinded?)

        expected_results[(
            TestSigningAuthorityConfirmations.UserRelationship.INITIATOR,
            self.statuses['draft'].status,
            False
        )] = True

        expected_results[(
            TestSigningAuthorityConfirmations.UserRelationship.INITIATOR,
            self.statuses['submitted'].status,
            False
        )] = True

        expected_results[(
            TestSigningAuthorityConfirmations.UserRelationship.RESPONDENT,
            self.statuses['accepted'].status,
            False
        )] = True

        expected_results[(
            TestSigningAuthorityConfirmations.UserRelationship.RESPONDENT,
            self.statuses['submitted'].status,
            False
        )] = True

        for (trade, relationship) in \
                product(trades, TestSigningAuthorityConfirmations.UserRelationship):

            # Sign an array of assertions, like the frontend does
            with self.subTest(
                "Testing signing confirmation permissions as array",
                relationship=relationship,
                status=trade['status'],
                rescinded=trade['rescinded']
            ):
                payload = list(map(lambda assertion, trade_id=trade['id']: {
                    'hasAccepted': True,
                    'signingAuthorityAssertion': assertion.id,
                    'creditTrade': trade_id
                }, SigningAuthorityAssertion.objects.all()))

                response = self.clients[self.user_map[relationship]].post(
                    '/api/signing_authority_confirmations',
                    content_type='application/json',
                    data=json.dumps(payload)
                )

                valid = status.is_success(response.status_code)

                self.assertEqual(
                    valid,
                    expected_results[(relationship, trade['status'], trade['rescinded'])]
                )

            # also try one at a time (not a JSON array)
            with self.subTest(
                "Testing signing confirmation permissions one at a time",
                relationship=relationship,
                status=trade['status'],
                rescinded=trade['rescinded']
            ):
                assertion_id = SigningAuthorityAssertion.objects.first().id

                payload = {
                    'hasAccepted': True,
                    'signingAuthorityAssertion': assertion_id,
                    'creditTrade': trade['id']
                }

                response = self.clients[self.user_map[relationship]].post(
                    '/api/signing_authority_confirmations',
                    content_type='application/json',
                    data=json.dumps(payload)
                )

                valid = status.is_success(response.status_code)

                self.assertEqual(
                    valid,
                    expected_results[(relationship, trade['status'], trade['rescinded'])]
                )

    def test_signing_authority_confirmations_empty_array(self):
        """"Test signing an empty array returns error status"""

        payload = []

        response = self.clients[
            self.user_map[TestSigningAuthorityConfirmations.UserRelationship.INITIATOR]
        ].post(
            '/api/signing_authority_confirmations',
            content_type='application/json',
            data=json.dumps(payload)
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN
        )

    def test_signing_nonexistent_credit_trade(self):
        """Test signing invalid credit trade"""

        assertion_id = SigningAuthorityAssertion.objects.first().id

        bad_id = 50000
        self.assertFalse(CreditTrade.objects.filter(id=bad_id).exists())

        payload = {
            'hasAccepted': True,
            'signingAuthorityAssertion': assertion_id,
            'creditTrade': bad_id
        }

        response = self.clients[self.user_map[
            TestSigningAuthorityConfirmations.UserRelationship.INITIATOR
        ]].post(
            '/api/signing_authority_confirmations',
            content_type='application/json',
            data=json.dumps(payload)
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN
        )
