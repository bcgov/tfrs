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

from api.exceptions import PositiveIntegerException
from api.models.CreditTrade import CreditTrade
from api.models.OrganizationBalance import OrganizationBalance
from api.models.SigningAuthorityAssertion import SigningAuthorityAssertion
from api.services.CreditTradeService import CreditTradeService
from api.tests.base_test_case import BaseTestCase
from api.tests.data_creation_utilities import DataCreationUtilities


class TestCreditTradeOperations(BaseTestCase):
    """
    This will test all credit trade related things such as:
    status changes and checking permissions when those
    status changes happen
    """

    extra_fixtures = ['test_credit_trades.json']

    def test_initiator_should_see_appropriate_credit_trades(self):
        """
        As a fuel supplier, I should see all credit trades where:
        I'm the initiator, regardless of status
        I'm the respondent, if the status is "submitted" or greater
        """

        # setup some test data
        DataCreationUtilities.create_possible_credit_trades(
            self.users['fs_user_1'].organization,
            self.users['fs_user_2'].organization
        )

        response = self.clients['fs_user_1'].get('/api/credit_trades')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        fs_credit_trades = response.json()
        for credit_trade in fs_credit_trades:
            correct_view = False

            if credit_trade['initiator']['id'] == \
               self.users['fs_user_1'].organization.id:
                correct_view = True
            elif (credit_trade['respondent']['id'] ==
                  self.users['fs_user_1'].organization.id and
                  credit_trade['status']['id'] >=
                  self.statuses['submitted'].id):
                correct_view = True

            self.assertTrue(correct_view)

    def test_government_user_should_see_appropriate_credit_trades(self):
        """
        As a government user, I should see all credit trades where:
        I'm the initiator, regardless of status
        Government will never be the respondent
        All other credit trades that have the status "Accepted" or greater
        """
        response = self.clients['gov_analyst'].get('/api/credit_trades')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        gov_credit_trades = response.json()
        for credit_trade in gov_credit_trades:
            correct_view = False

            if credit_trade['initiator']['id'] == \
               self.users['gov_analyst'].organization.id:
                correct_view = True

            elif (credit_trade['status']['id'] >=
                  self.statuses['accepted'].id and
                  credit_trade['status'] != self.statuses['cancelled']):
                correct_view = True

            self.assertTrue(correct_view)

    def test_government_user_add_credit_transfer(self):
        """
        As a government user, I should be able to add an approved
        credit transfer
        """
        payload = {
            'fairMarketValuePerCredit': '1.00',
            'initiator': 2,
            'numberOfCredits': 1,
            'respondent': 3,
            'status': self.statuses['approved'].id,
            'tradeEffectiveDate': datetime.datetime.today().strftime(
                '%Y-%m-%d'
            ),
            'type': self.credit_trade_types['sell'].id,
            'zeroReason': None
        }

        response = self.clients['gov_director'].post(
            '/api/credit_trades',
            content_type='application/json',
            data=json.dumps(payload))

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_government_user_add_approved_zero_credit_transfer(self):
        """
        As a government user, I should be able to add an approved
        credit transfer with 0 fair market value:
        If the type is 'Sell', Fair Market Value needs to be greater than 0
        or zero dollar reason must be provided
        This tests if we try to submit a 0 dollar credit transaction with no
        reason
        """
        payload = {
            'fairMarketValuePerCredit': '0.00',
            'initiator': 2,
            'numberOfCredits': 1,
            'respondent': 3,
            'status': self.statuses['approved'].id,
            'tradeEffectiveDate': datetime.datetime.today().strftime(
                '%Y-%m-%d'
            ),
            'type': self.credit_trade_types['sell'].id,
            'zeroReason': None
        }

        response = self.clients['gov_analyst'].post(
            '/api/credit_trades',
            content_type='application/json',
            data=json.dumps(payload))

        # 400 since zero reason was set to None
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_government_user_add_approved_valid_zero_credit_transfer(self):
        """
        As a government user, I should be able to add an approved
        credit transfer with 0 fair market value:
        If the type is 'Sell', Fair Market Value needs to be greater than 0
        or zero dollar reason must be provided
        """
        payload = {
            'fairMarketValuePerCredit': '0.00',
            'initiator': 2,
            'numberOfCredits': 1,
            'respondent': 3,
            'status': self.statuses['approved'].id,
            'tradeEffectiveDate': datetime.datetime.today().strftime(
                '%Y-%m-%d'
            ),
            'type': self.credit_trade_types['sell'].id,
            'zeroReason': self.zero_reason['other'].id
        }

        response = self.clients['gov_director'].post(
            '/api/credit_trades',
            content_type='application/json',
            data=json.dumps(payload))

        # 201 since a zero reason was provided
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_validate_credit(self):
        """
        As a government user, I should be able to validate approved credit
        transfers:
        It should raise an exception if it sees any fuel suppliers with
        insufficient funds
        """
        CreditTrade.objects.create(
            status=self.statuses['approved'],
            initiator=self.users['fs_user_2'].organization,
            respondent=self.users['fs_user_3'].organization,
            type=self.credit_trade_types['sell'],
            number_of_credits=1000000000,
            fair_market_value_per_credit=0,
            zero_reason=self.zero_reason['other'],
            trade_effective_date=datetime.datetime.today().strftime(
                '%Y-%m-%d'
            )
        )

        credit_trades = CreditTrade.objects.filter(
            status_id=self.statuses['approved'].id)

        with self.assertRaises(PositiveIntegerException):
            CreditTradeService.validate_credits(credit_trades)

    def test_validate_credit_complex(self):
        """
        As a government user, I should be able to validate approved credit
        transfers:
        It should raise an exception if it sees any fuel suppliers with
        insufficient funds
        This is a slightly more complex test where we have multi credit
        trades with new organizations that bounces the number of credits
        up and down
        """

        initial_balance = OrganizationBalance.objects.get(
            organization_id=self.organizations['from'].id,
            expiration_date=None).validated_credits

        # Transfer initial balance from Test 1 to Test 2
        CreditTrade.objects.create(
            status=self.statuses['approved'],
            initiator=self.organizations['from'],
            respondent=self.organizations['to'],
            type=self.credit_trade_types['sell'],
            number_of_credits=initial_balance,
            fair_market_value_per_credit=0,
            zero_reason=self.zero_reason['other'],
            trade_effective_date=datetime.datetime.today().strftime(
                '%Y-%m-%d'
            )
        )

        # Transfer 1 from Test 1 to Test 2
        CreditTrade.objects.create(
            status=self.statuses['approved'],
            initiator=self.organizations['from'],
            respondent=self.organizations['to'],
            type=self.credit_trade_types['sell'],
            number_of_credits=1,
            fair_market_value_per_credit=0,
            zero_reason=self.zero_reason['other'],
            trade_effective_date=datetime.datetime.today().strftime(
                '%Y-%m-%d'
            )
        )

        credit_trades = CreditTrade.objects.filter(
            status_id=self.statuses['approved'].id)

        # this should now raise an exception since we tried transferring
        # 1200 credits when only 1000 are available
        with self.assertRaises(PositiveIntegerException):
            CreditTradeService.validate_credits(credit_trades)

    def test_validate_credit_success(self):
        """
        As a government user, I should be able to validate approved credit
        transfers:
        It should raise an exception if it sees any fuel suppliers with
        insufficient funds
        This test is similar to the one above, but should succeed as we're
        going to allocate the right amount of credits this time
        """
        credit_trades = []

        # Award Test 1 with 1000 credits (new organizations start
        # with 0 credits)
        # (Please note in most cases we should use a different type
        # but to reduce the number of things to keep track, lets just
        # transfer from organization: 1 (BC Government))
        credit_trades.append(
            CreditTrade.objects.create(
                status=self.statuses['approved'],
                initiator=self.users['gov_analyst'].organization,
                respondent=self.organizations['from'],
                type=self.credit_trade_types['sell'],
                number_of_credits=1000,
                fair_market_value_per_credit=0,
                zero_reason=self.zero_reason['other'],
                trade_effective_date=datetime.datetime.today().strftime(
                    '%Y-%m-%d'
                )
            )
        )

        # Transfer 500 from Test 1 to Test 2
        credit_trades.append(
            CreditTrade.objects.create(
                status=self.statuses['approved'],
                initiator=self.organizations['from'],
                respondent=self.organizations['to'],
                type=self.credit_trade_types['sell'],
                number_of_credits=500,
                fair_market_value_per_credit=0,
                zero_reason=self.zero_reason['other'],
                trade_effective_date=datetime.datetime.today().strftime(
                    '%Y-%m-%d'
                )
            )
        )

        # Transfer 300 from Test 1 to Test 2
        credit_trades.append(
            CreditTrade.objects.create(
                status=self.statuses['approved'],
                initiator=self.organizations['from'],
                respondent=self.organizations['to'],
                type=self.credit_trade_types['sell'],
                number_of_credits=300,
                fair_market_value_per_credit=0,
                zero_reason=self.zero_reason['other'],
                trade_effective_date=datetime.datetime.today().strftime(
                    '%Y-%m-%d'
                )
            )
        )

        # no exceptions should be raised
        CreditTradeService.validate_credits(credit_trades)

    def test_batch_process(self):
        """
        As a government user, I should be able to process all the approved
        credit transfers
        This test is similar to the one above, but a functional test to check
        if the commit actually works
        """
        initial_balance = OrganizationBalance.objects.get(
            organization_id=self.organizations['from'].id,
            expiration_date=None).validated_credits

        CreditTrade.objects.create(
            status=self.statuses['approved'],
            initiator=self.users['gov_director'].organization,
            respondent=self.organizations['from'],
            type=self.credit_trade_types['sell'],
            number_of_credits=1000,
            fair_market_value_per_credit=0,
            zero_reason=self.zero_reason['other'],
            trade_effective_date=datetime.datetime.today().strftime(
                '%Y-%m-%d'
            )
        )

        CreditTrade.objects.create(
            status=self.statuses['approved'],
            initiator=self.organizations['from'],
            respondent=self.organizations['to'],
            type=self.credit_trade_types['sell'],
            number_of_credits=500,
            fair_market_value_per_credit=0,
            zero_reason=self.zero_reason['other'],
            trade_effective_date=datetime.datetime.today().strftime(
                '%Y-%m-%d'
            )
        )

        CreditTrade.objects.create(
            status=self.statuses['approved'],
            initiator=self.organizations['from'],
            respondent=self.organizations['to'],
            type=self.credit_trade_types['sell'],
            number_of_credits=400,
            fair_market_value_per_credit=0,
            zero_reason=self.zero_reason['other'],
            trade_effective_date=datetime.datetime.today().strftime(
                '%Y-%m-%d'
            )
        )

        response = self.clients['gov_director'].put('/api/credit_trades/batch_process')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        organization_balance = OrganizationBalance.objects.get(
            organization_id=self.organizations['from'].id,
            expiration_date=None)

        self.assertEqual(organization_balance.validated_credits-initial_balance, 100)

    def test_delete(self):
        """
        As a government user, I should be able to delete credit transfers
        (Not a hard delete, just sets the status to Cancelled)
        """
        credit_trade = CreditTrade.objects.create(
            status=self.statuses['approved'],
            initiator=self.users['gov_analyst'].organization,
            respondent=self.organizations['from'],
            type=self.credit_trade_types['sell'],
            number_of_credits=1000,
            fair_market_value_per_credit=0,
            zero_reason=self.zero_reason['other'],
            trade_effective_date=datetime.datetime.today().strftime(
                '%Y-%m-%d'
            )
        )

        response = self.clients['gov_analyst'].put(
            '/api/credit_trades/{}/delete'.format(credit_trade.id)
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        credit_trade = CreditTrade.objects.get(id=credit_trade.id)
        self.assertEqual(credit_trade.status_id, self.statuses['cancelled'].id)

        # Trying to access this page should now result in a 404 as it's now
        # been cancelled
        response = self.clients['gov_analyst'].get(
            '/api/credit_trades/{}'.format(credit_trade.id)
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_get_organization_credit_trades_gov(self):
        """
        As a government user
        I shouldn't see drafts unless I'm the initiator
        I shouldn't see cancelled transfers as they're considered (deleted)
        """
        # the function shouldn't see this as it's only a draft and the
        # initiator is not government
        draft_credit_trade = CreditTrade.objects.create(
            status=self.statuses['draft'],
            initiator=self.organizations['from'],
            respondent=self.organizations['to'],
            type=self.credit_trade_types['sell'],
            number_of_credits=1000,
            fair_market_value_per_credit=1,
            zero_reason=None,
            trade_effective_date=datetime.datetime.today().strftime(
                '%Y-%m-%d'
            )
        )

        # the function should see this as it's a draft from the government
        draft_credit_trade_from_gov = CreditTrade.objects.create(
            status=self.statuses['draft'],
            initiator=self.users['gov_analyst'].organization,
            respondent=self.organizations['to'],
            type=self.credit_trade_types['sell'],
            number_of_credits=1000,
            fair_market_value_per_credit=1,
            zero_reason=None,
            trade_effective_date=datetime.datetime.today().strftime(
                '%Y-%m-%d'
            )
        )

        # the function should see this as it's completed
        completed_credit_trade = CreditTrade.objects.create(
            status=self.statuses['completed'],
            initiator=self.organizations['from'],
            respondent=self.organizations['to'],
            type=self.credit_trade_types['sell'],
            number_of_credits=1000,
            fair_market_value_per_credit=1,
            zero_reason=None,
            trade_effective_date=datetime.datetime.today().strftime(
                '%Y-%m-%d'
            )
        )

        credit_trades = CreditTradeService.get_organization_credit_trades(
            self.users['gov_analyst'].organization
        )

        self.assertNotIn(draft_credit_trade, credit_trades)
        self.assertIn(draft_credit_trade_from_gov, credit_trades)
        self.assertIn(completed_credit_trade, credit_trades)

    def test_get_organization_credit_trades_fuel_supplier(self):
        """
        As a fuel supplier
        I shouldn't see drafts unless I'm the initiator
        I shouldn't see cancelled transfers as they're considered (deleted)
        I shouldn't see submitted transfers unless I'm involved somehow
        """
        # the function shouldn't see this as it's only a draft and the
        # initiator is not fuel_supplier
        # (even though the fuel supplier is the respondent)
        draft_credit_trade = CreditTrade.objects.create(
            status=self.statuses['draft'],
            initiator=self.organizations['to'],
            respondent=self.organizations['from'],
            type=self.credit_trade_types['sell'],
            number_of_credits=1000,
            fair_market_value_per_credit=1,
            zero_reason=None,
            trade_effective_date=datetime.datetime.today().strftime(
                '%Y-%m-%d'
            )
        )

        # the function should see this as it's a draft from the fuel supplier
        draft_from_fuel_supplier = CreditTrade.objects.create(
            status=self.statuses['draft'],
            initiator=self.organizations['from'],
            respondent=self.organizations['to'],
            type=self.credit_trade_types['sell'],
            number_of_credits=1000,
            fair_market_value_per_credit=1,
            zero_reason=None,
            trade_effective_date=datetime.datetime.today().strftime(
                '%Y-%m-%d'
            )
        )

        # the function shouldn't see this as it's a submitted transaction
        # not involving the fuel supplier
        submitted_credit_trade = CreditTrade.objects.create(
            status=self.statuses['submitted'],
            initiator=self.organizations['to'],
            respondent=self.users['fs_user_3'].organization,
            type=self.credit_trade_types['sell'],
            number_of_credits=1000,
            fair_market_value_per_credit=1,
            zero_reason=None,
            trade_effective_date=datetime.datetime.today().strftime(
                '%Y-%m-%d'
            )
        )

        # the function should see this as it's a submitted transaction
        # involving the fuel supplier
        credit_trade_as_respondent = CreditTrade.objects.create(
            status=self.statuses['submitted'],
            initiator=self.organizations['to'],
            respondent=self.organizations['from'],
            type=self.credit_trade_types['sell'],
            number_of_credits=1000,
            fair_market_value_per_credit=1,
            zero_reason=None,
            trade_effective_date=datetime.datetime.today().strftime(
                '%Y-%m-%d'
            )
        )

        # the function should see this as it's completed
        completed_credit_trade = CreditTrade.objects.create(
            status=self.statuses['completed'],
            initiator=self.organizations['from'],
            respondent=self.organizations['to'],
            type=self.credit_trade_types['sell'],
            number_of_credits=1000,
            fair_market_value_per_credit=1,
            zero_reason=None,
            trade_effective_date=datetime.datetime.today().strftime(
                '%Y-%m-%d'
            )
        )

        credit_trades = CreditTradeService.get_organization_credit_trades(
            self.organizations['from']
        )

        self.assertNotIn(draft_credit_trade, credit_trades)
        self.assertIn(draft_from_fuel_supplier, credit_trades)
        self.assertNotIn(submitted_credit_trade, credit_trades)
        self.assertIn(credit_trade_as_respondent, credit_trades)
        self.assertIn(completed_credit_trade, credit_trades)

    def test_sell_with_insufficient_credits(self):
        """
        This will test submitting a draft with insufficient credit
        It should return a Validation Error and tell you that your
        organization has insufficient credits
        """
        payload = {
            'fairMarketValuePerCredit': '1.00',
            'initiator': self.users['fs_user_1'].organization_id,
            'numberOfCredits': 200000,
            'respondent': 3,
            'status': self.statuses['draft'].id,
            'tradeEffectiveDate': datetime.datetime.today().strftime(
                '%Y-%m-%d'
            ),
            'type': self.credit_trade_types['sell'].id,
            'zeroReason': None
        }

        response = self.clients['fs_user_1'].post(
            '/api/credit_trades',
            content_type='application/json',
            data=json.dumps(payload))

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('insufficientCredits',
                      json.loads(response.content.decode('utf-8')))

    def test_sell_update_with_insufficient_credits(self):
        """
        This will test proposing a draft that doesn't have sufficient credits
        This is an edge case. You normally shouldn't be able to create a
        record with more number of credits than your organization has.
        But it can happen if a previous transaction gets in first and
        you now have less credits than it was.
        """
        credit_trade = CreditTrade.objects.create(
            status=self.statuses['draft'],
            initiator=self.users['fs_user_1'].organization,
            respondent=self.users['fs_user_2'].organization,
            type=self.credit_trade_types['sell'],
            number_of_credits=200000,
            fair_market_value_per_credit=1,
            zero_reason=None,
            trade_effective_date=datetime.datetime.today().strftime('%Y-%m-%d')
        )

        payload = {
            'initiator': credit_trade.initiator_id,
            'is_rescinded': credit_trade.is_rescinded,
            'fair_market_value_per_credit':
            credit_trade.fair_market_value_per_credit,
            'number_of_credits': credit_trade.number_of_credits,
            'respondent': credit_trade.respondent_id,
            'status': self.statuses['submitted'].id,
            'trade_effective_date': credit_trade.trade_effective_date,
            'type': credit_trade.type_id
        }

        response = self.clients['fs_user_1'].put(
            '/api/credit_trades/{}'.format(
                credit_trade.id
            ),
            content_type='application/json',
            data=json.dumps(payload))

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('insufficientCredits',
                      json.loads(response.content.decode('utf-8')))

    def test_buy_from_org_with_insufficient_credits(self):
        """
        This will test two things:
        1. Propose a Buy from someone with insufficient credits.
        This should work. As the user proposing to buy from shouldn't be
        given any information or hint on how much the respondent has.
        2. Accepting the proposal should show a validation error.
        """
        payload = {
            'fairMarketValuePerCredit': '1.00',
            'initiator': self.users['fs_user_1'].organization_id,
            'numberOfCredits': 200000,
            'respondent': self.users['fs_user_2'].organization_id,
            'status': self.statuses['submitted'].id,
            'tradeEffectiveDate': datetime.datetime.today().strftime(
                '%Y-%m-%d'
            ),
            'type': self.credit_trade_types['buy'].id,
            'zeroReason': None
        }

        response = self.clients['fs_user_1'].post(
            '/api/credit_trades',
            content_type='application/json',
            data=json.dumps(payload))

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        credit_trade = json.loads(response.content.decode('utf-8'))

        payload = {
            'initiator': credit_trade['initiator'],
            'is_rescinded': credit_trade['isRescinded'],
            'fair_market_value_per_credit':
            credit_trade['fairMarketValuePerCredit'],
            'number_of_credits': credit_trade['numberOfCredits'],
            'respondent': credit_trade['respondent'],
            'status': self.statuses['accepted'].id,
            'trade_effective_date': credit_trade['tradeEffectiveDate'],
            'type': credit_trade['type']
        }

        response = self.clients['fs_user_2'].put(
            '/api/credit_trades/{}'.format(
                credit_trade['id']
            ),
            content_type='application/json',
            data=json.dumps(payload))

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('insufficientCredits',
                      json.loads(response.content.decode('utf-8')))

    def test_signing_history(self):
        """
        This will test if the signatures and reviewed attributes for the
        credit trades are present depending on the status of the trade
        """
        # Request for Fuel Supplier 1 to propose a trade
        payload = {
            'fairMarketValuePerCredit': '1.00',
            'initiator': self.users['fs_user_1'].organization_id,
            'numberOfCredits': 1,
            'respondent': self.users['fs_user_2'].organization_id,
            'status': self.statuses['submitted'].id,
            'tradeEffectiveDate': datetime.datetime.today().strftime(
                '%Y-%m-%d'
            ),
            'type': self.credit_trade_types['sell'].id,
            'zeroReason': None
        }

        response = self.clients['fs_user_1'].post(
            '/api/credit_trades',
            content_type='application/json',
            data=json.dumps(payload))

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        credit_trade = json.loads(response.content.decode('utf-8'))

        # Request for Fuel Supplier 1 to sign the proposal
        payload = []

        assertions = SigningAuthorityAssertion.objects.all()
        for assertion in assertions:
            payload.append({
                'creditTrade': credit_trade['id'],
                'hasAccepted': True,
                'signingAuthorityAssertion': assertion.id
            })

        response = self.clients['fs_user_1'].post(
            '/api/signing_authority_confirmations',
            content_type='application/json',
            data=json.dumps(payload))
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Check and see if the signature is present
        response = self.clients['fs_user_1'].get(
            '/api/credit_trades/{}'.format(
                credit_trade['id']
            ), content_type='application/json')

        credit_trade = json.loads(response.content.decode('utf-8'))

        # We should see the signature from the user proposing
        self.assertEqual(credit_trade['signatures'][0]['user']['id'],
                         self.users['fs_user_1'].id)

        # Fuel Supplier 2 accepts the proposal
        payload = {
            'initiator': credit_trade['initiator']['id'],
            'is_rescinded': credit_trade['isRescinded'],
            'fair_market_value_per_credit':
            credit_trade['fairMarketValuePerCredit'],
            'number_of_credits': credit_trade['numberOfCredits'],
            'respondent': credit_trade['respondent']['id'],
            'status': self.statuses['accepted'].id,
            'trade_effective_date': credit_trade['tradeEffectiveDate'],
            'type': credit_trade['type']['id']
        }

        response = self.clients['fs_user_2'].put(
            '/api/credit_trades/{}'.format(
                credit_trade['id']
            ),
            content_type='application/json',
            data=json.dumps(payload))

        # Request for Fuel Supplier 2 to sign the proposal
        payload = []

        assertions = SigningAuthorityAssertion.objects.all()
        for assertion in assertions:
            payload.append({
                'creditTrade': credit_trade['id'],
                'hasAccepted': True,
                'signingAuthorityAssertion': assertion.id
            })

        response = self.clients['fs_user_2'].post(
            '/api/signing_authority_confirmations',
            content_type='application/json',
            data=json.dumps(payload))
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Check if the signatures are present
        response = self.clients['fs_user_1'].get(
            '/api/credit_trades/{}'.format(
                credit_trade['id']
            ), content_type='application/json')

        credit_trade = json.loads(response.content.decode('utf-8'))

        # We should see the signature from the user proposing
        self.assertEqual(credit_trade['signatures'][0]['user']['id'],
                         self.users['fs_user_1'].id)
        # and the user that accepted
        self.assertEqual(credit_trade['signatures'][1]['user']['id'],
                         self.users['fs_user_2'].id)

        # Gov User recommends a decision for the proposal
        payload = {
            'initiator': credit_trade['initiator']['id'],
            'is_rescinded': credit_trade['isRescinded'],
            'fair_market_value_per_credit':
            credit_trade['fairMarketValuePerCredit'],
            'number_of_credits': credit_trade['numberOfCredits'],
            'respondent': credit_trade['respondent']['id'],
            'status': self.statuses['recommended'].id,
            'trade_effective_date': credit_trade['tradeEffectiveDate'],
            'type': credit_trade['type']['id']
        }

        response = self.clients['gov_analyst'].put(
            '/api/credit_trades/{}'.format(
                credit_trade['id']
            ),
            content_type='application/json',
            data=json.dumps(payload))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Check and see if the signature is present
        response = self.clients['gov_analyst'].get(
            '/api/credit_trades/{}'.format(
                credit_trade['id']
            ), content_type='application/json')

        credit_trade = json.loads(response.content.decode('utf-8'))

        # We should see the signature from the user proposing
        self.assertEqual(credit_trade['signatures'][0]['user']['id'],
                         self.users['fs_user_1'].id)
        # and the user that accepted
        self.assertEqual(credit_trade['signatures'][1]['user']['id'],
                         self.users['fs_user_2'].id)

        # first entry should be submitted
        self.assertEqual(credit_trade['history'][0]['status']['id'],
                         self.statuses['submitted'].id)

        # second entry should be submitted
        self.assertEqual(credit_trade['history'][1]['status']['id'],
                         self.statuses['accepted'].id)

        # third entry should be recommended
        self.assertEqual(credit_trade['history'][2]['status']['id'],
                         self.statuses['recommended'].id)
