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

from django.test import TestCase, Client
from rest_framework import status

from api.models.CreditTrade import CreditTrade
from api.models.CreditTradeStatus import CreditTradeStatus
from api.models.CreditTradeType import CreditTradeType
from api.models.Role import Role
from api.models.User import User
from api.models.UserRole import UserRole


class TestCreditTrades(TestCase):
    """
    This will test all credit trade related to the rescinded status
    """
    fixtures = ['organization_types.json',
                'organization_government.json',
                'organization_balance_gov.json',
                'credit_trade_statuses.json',
                'credit_trade_statuses_refused.json',
                'organization_actions_types.json',
                'organization_statuses.json',
                'test_users.json',
                'credit_trade_types.json',
                'test_credit_trades.json',
                'test_organization_fuel_suppliers.json',
                'test_organization_balances.json',
                'roles.json',
                'permissions.json',
                'roles_permissions.json']

    def setUp(self):
        # Initialize Foreign keys
        self.test_url = "/api/credit_trades"

        self.gov_user = User.objects.filter(organization__id=1).first()
        self.gov_client = Client(
            HTTP_SMGOV_USERGUID=str(self.gov_user.authorization_guid),
            HTTP_SMGOV_USERDISPLAYNAME=self.gov_user.display_name,
            HTTP_SMGOV_USEREMAIL=self.gov_user.email,
            HTTP_SM_UNIVERSALID=self.gov_user.authorization_id,
            HTTP_SMGOV_USERTYPE='Internal',
            HTTP_SM_AUTHDIRNAME='IDIR')

        # Apply a government role to Teperson
        username = "_".join(['internal',
                             self.gov_user.authorization_id.lower()])
        gov_user = User.objects.get(username=username)
        gov_role = Role.objects.get(name='GovDirector')
        UserRole.objects.create(user_id=gov_user.id, role_id=gov_role.id)

        self.user_1 = User.objects.filter(organization__id=2).first()
        self.fs_client_1 = Client(
            HTTP_SMGOV_USERGUID=str(self.user_1.authorization_guid),
            HTTP_SMGOV_USERDISPLAYNAME=self.user_1.display_name,
            HTTP_SMGOV_USEREMAIL=self.user_1.email,
            HTTP_SM_UNIVERSALID=self.user_1.authorization_id)

        self.user_2 = User.objects.filter(organization__id=3).first()
        self.fs_client_2 = Client(
            HTTP_SMGOV_USERGUID=str(self.user_2.authorization_guid),
            HTTP_SMGOV_USERDISPLAYNAME=self.user_2.display_name,
            HTTP_SMGOV_USEREMAIL=self.user_2.email,
            HTTP_SM_UNIVERSALID=self.user_2.authorization_id)

    def test_rescind_credit_transfer(self):
        """
        As a fuel supplier
        When I submit a credit transfer proposal
        And I rescinded the proposal
        Then I should see the credit transfer as rescinded
        """
        submitted_status, _ = CreditTradeStatus.objects.get_or_create(
            status='Submitted')

        credit_trade_type, _ = CreditTradeType.objects.get_or_create(
            the_type='Sell')

        role = Role.objects.get(name='FSManager')
        UserRole.objects.create(user_id=self.user_1.id, role_id=role.id)

        credit_trade = CreditTrade.objects.create(
            status=submitted_status,
            initiator=self.user_1.organization,
            respondent=self.user_2.organization,
            type=credit_trade_type,
            number_of_credits=1000,
            fair_market_value_per_credit=1,
            zero_reason=None,
            trade_effective_date=datetime.datetime.today().strftime(
                '%Y-%m-%d'
            )
        )

        payload = {
            'rescinded': True
        }

        response = self.fs_client_1.patch(
            '/api/credit_trades/{}'.format(credit_trade.id),
            content_type='application/json',
            data=json.dumps(payload)
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        updated_credit_trade = CreditTrade.objects.get(id=credit_trade.id)
        self.assertTrue(updated_credit_trade.rescinded)

    def test_rescind_approved_credit_transfer(self):
        """
        As a fuel supplier
        When I submit a credit transfer proposal
        And the proposal had been 'Approved'
        And I try to rescind the proposal (through a hack)
        Then I should get an error message since I shouldn't see
        approved proposals
        """
        approved_status, _ = CreditTradeStatus.objects.get_or_create(
            status='Approved')

        credit_trade_type, _ = CreditTradeType.objects.get_or_create(
            the_type='Sell')

        role = Role.objects.get(name='FSManager')
        UserRole.objects.create(user_id=self.user_1.id, role_id=role.id)

        credit_trade = CreditTrade.objects.create(
            status=approved_status,
            initiator=self.user_1.organization,
            respondent=self.user_2.organization,
            type=credit_trade_type,
            number_of_credits=1000,
            fair_market_value_per_credit=1,
            zero_reason=None,
            trade_effective_date=datetime.datetime.today().strftime(
                '%Y-%m-%d'
            )
        )

        # Respondent 'refused'
        payload = {
            'rescinded': True
        }

        response = self.fs_client_2.patch(
            '/api/credit_trades/{}'.format(credit_trade.id),
            content_type='application/json',
            data=json.dumps(payload)
        )
        # Should return a validation error as the proposal has already been
        # completed
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        updated_credit_trade = CreditTrade.objects.get(id=credit_trade.id)
        self.assertEqual(updated_credit_trade.rescinded, False)
        self.assertEqual(updated_credit_trade.status_id, approved_status.id)

    def test_rescind_completed_credit_transfer(self):
        """
        As a fuel supplier
        When I submit a credit transfer proposal
        And the proposal had been 'Completed'
        And I try to rescind the proposal (through a hack)
        Then I should get an error message since the proposal
        was already completed
        """
        completed_status, _ = CreditTradeStatus.objects.get_or_create(
            status='Completed')

        credit_trade_type, _ = CreditTradeType.objects.get_or_create(
            the_type='Sell')

        role = Role.objects.get(name='FSManager')
        UserRole.objects.create(user_id=self.user_1.id, role_id=role.id)

        credit_trade = CreditTrade.objects.create(
            status=completed_status,
            initiator=self.user_1.organization,
            respondent=self.user_2.organization,
            type=credit_trade_type,
            number_of_credits=1000,
            fair_market_value_per_credit=1,
            zero_reason=None,
            trade_effective_date=datetime.datetime.today().strftime(
                '%Y-%m-%d'
            )
        )

        # Respondent 'refused'
        payload = {
            'rescinded': True
        }

        response = self.fs_client_2.patch(
            '/api/credit_trades/{}'.format(credit_trade.id),
            content_type='application/json',
            data=json.dumps(payload)
        )
        # Should return a validation error as the proposal has already been
        # completed
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        updated_credit_trade = CreditTrade.objects.get(id=credit_trade.id)
        self.assertEqual(updated_credit_trade.rescinded, False)
        self.assertEqual(updated_credit_trade.status_id, completed_status.id)

    def test_rescind_refused_credit_transfer(self):
        """
        As a fuel supplier
        When I submit a credit transfer proposal
        And the proposal had been 'Refused'
        And I try to rescind the proposal
        Then I should get an error message since the proposal
        was already refused
        """
        refused_status, _ = CreditTradeStatus.objects.get_or_create(
            status='Refused')

        submitted_status, _ = CreditTradeStatus.objects.get_or_create(
            status='Submitted')

        credit_trade_type, _ = CreditTradeType.objects.get_or_create(
            the_type='Sell')

        role = Role.objects.get(name='FSManager')
        UserRole.objects.create(user_id=self.user_1.id, role_id=role.id)
        UserRole.objects.create(user_id=self.user_2.id, role_id=role.id)

        credit_trade = CreditTrade.objects.create(
            status=submitted_status,
            initiator=self.user_1.organization,
            respondent=self.user_2.organization,
            type=credit_trade_type,
            number_of_credits=1000,
            fair_market_value_per_credit=1,
            zero_reason=None,
            trade_effective_date=datetime.datetime.today().strftime(
                '%Y-%m-%d'
            )
        )

        # Respondent 'refused'
        payload = {
            'status': refused_status.id
        }

        response = self.fs_client_2.patch(
            '/api/credit_trades/{}'.format(credit_trade.id),
            content_type='application/json',
            data=json.dumps(payload)
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Initiator attempting to 'rescind'
        payload = {
            'rescinded': True
        }

        response = self.fs_client_1.patch(
            '/api/credit_trades/{}'.format(credit_trade.id),
            content_type='application/json',
            data=json.dumps(payload)
        )
        # Should return a validation error as the proposal has already been
        # refused
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        updated_credit_trade = CreditTrade.objects.get(id=credit_trade.id)
        self.assertEqual(updated_credit_trade.rescinded, False)
        self.assertEqual(updated_credit_trade.status_id, refused_status.id)
