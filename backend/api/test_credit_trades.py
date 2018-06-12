import datetime
import json

from django.test import TestCase, Client
from rest_framework import status

from api.exceptions import PositiveIntegerException

from api.models.CreditTrade import CreditTrade
from api.models.CreditTradeStatus import CreditTradeStatus
from api.models.CreditTradeType import CreditTradeType
from api.models.CreditTradeZeroReason import CreditTradeZeroReason
from api.models.Organization import Organization
from api.models.OrganizationBalance import OrganizationBalance
from api.models.Role import Role
from api.models.User import User
from api.models.UserRole import UserRole

from api.services.CreditTradeService import CreditTradeService

# Credit Trade Statuses
STATUS_DRAFT = 1
STATUS_SUBMITTED = 2
STATUS_ACCEPTED = 3
STATUS_RECOMMENDED = 4
STATUS_APPROVED = 6
STATUS_COMPLETED = 7
STATUS_CANCELLED = 8
STATUS_DECLINED = 9


class TestCreditTrades(TestCase):
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
                'roles_permissions.json',
                ]

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

        '''
        Apply a government role to Teperson
        '''
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

        self.user_3 = User.objects.filter(organization__id=4).first()
        self.fs_client_3 = Client(
            HTTP_SMGOV_USERGUID=str(self.user_3.authorization_guid),
            HTTP_SMGOV_USERDISPLAYNAME=self.user_3.display_name,
            HTTP_SMGOV_USEREMAIL=self.user_3.email,
            HTTP_SM_UNIVERSALID=self.user_3.authorization_id)

    # As a fuel supplier, I should see all credit trades where:
    # I'm the initiator, regardless of status
    # I'm the respondent, if the status is "submitted" or greater
    def test_initiator_should_see_appropriate_credit_trades(self):
        response = self.fs_client_1.get('/api/credit_trades')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        fs_credit_trades = response.json()
        for ct in fs_credit_trades:
            correct_view = False
            if ct['initiator']['id'] == self.user_1.organization.id:
                correct_view = True
            elif (ct['respondent']['id'] == self.user_1.organization.id and
                  ct['status']['id'] >= STATUS_SUBMITTED):
                correct_view = True
            self.assertTrue(correct_view)

    # As a fuel supplier, I should be able to refuse credit transfers where:
    # I'm the respondent
    def test_respondent_can_refuse_credit_trades(self):
        # Assign FSManager role to user 1
        role = Role.objects.get(name='FSManager')
        UserRole.objects.create(user_id=self.user_1.id, role_id=role.id)

        refused_status, created = CreditTradeStatus.objects.get_or_create(
            status='Refused')

        submitted_status, created = CreditTradeStatus.objects.get_or_create(
            status='Submitted')

        credit_trade_type, created = CreditTradeType.objects.get_or_create(
            the_type='Sell')

        credit_trade = CreditTrade.objects.create(
            status=submitted_status,
            initiator=self.user_2.organization,
            respondent=self.user_1.organization,
            type=credit_trade_type,
            number_of_credits=100,
            fair_market_value_per_credit=1,
            zero_reason=None,
            trade_effective_date=datetime.datetime.today().strftime('%Y-%m-%d')
        )

        payload = {
            'fairMarketValuePerCredit':
                credit_trade.fair_market_value_per_credit,
            'initiator': credit_trade.initiator_id,
            'numberOfCredits': credit_trade.number_of_credits,
            'respondent': credit_trade.respondent_id,
            'status': refused_status.id,
            'tradeEffectiveDate': credit_trade.trade_effective_date,
            'type': credit_trade.type_id,
            'zeroReason': credit_trade.zero_reason_id
        }

        response = self.fs_client_1.put(
            '/api/credit_trades/{}'.format(
                credit_trade.id
            ),
            content_type='application/json',
            data=json.dumps(payload))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        credit_trade = CreditTrade.objects.get(id=credit_trade.id)
        self.assertEqual(credit_trade.status, refused_status)

    # As a government user, I should see all credit trades where:
    # I'm the initiator, regardless of status
    # Government will never be the respondent
    # All other credit trades that have the status "Accepted" or greater
    def test_government_user_should_see_appropriate_credit_trades(self):
        response = self.gov_client.get('/api/credit_trades')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        gov_credit_trades = response.json()
        for ct in gov_credit_trades:
            correct_view = False
            if ct['initiator']['id'] == self.gov_user.organization.id:
                correct_view = True
            elif ct['status']['id'] >= STATUS_ACCEPTED and \
                    ct['status']['id'] != STATUS_CANCELLED:
                correct_view = True
            self.assertTrue(correct_view)

    # As a government user, I should be able to add an approved
    # credit transfer
    def test_government_user_add_credit_transfer(self):
        credit_trade_status, created = CreditTradeStatus.objects.get_or_create(
            status='Approved')

        credit_trade_type, created = CreditTradeType.objects.get_or_create(
            the_type='Sell')

        payload = {
            'fairMarketValuePerCredit': '1.00',
            'initiator': 2,
            'numberOfCredits': 1,
            'respondent': 3,
            'status': credit_trade_status.id,
            'tradeEffectiveDate': datetime.datetime.today()
            .strftime('%Y-%m-%d'),
            'type': credit_trade_type.id,
            'zeroReason': None
        }

        response = self.gov_client.post(
            '/api/credit_trades',
            content_type='application/json',
            data=json.dumps(payload))

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    # As a government user, I should be able to add an approved
    # credit transfer with 0 fair market value:
    # If the type is 'Sell', Fair Market Value needs to be greater than 0
    # or zero dollar reason must be provided
    # This tests if we try to submit a 0 dollar credit transaction with no
    # reason
    def test_government_user_add_credit_transfer(self):
        credit_trade_status, created = CreditTradeStatus.objects.get_or_create(
            status='Approved')

        credit_trade_type, created = CreditTradeType.objects.get_or_create(
            the_type='Sell')

        payload = {
            'fairMarketValuePerCredit': '0.00',
            'initiator': 2,
            'numberOfCredits': 1,
            'respondent': 3,
            'status': credit_trade_status.id,
            'tradeEffectiveDate': datetime.datetime.today()
            .strftime('%Y-%m-%d'),
            'type': credit_trade_type.id,
            'zeroReason': None
        }

        response = self.gov_client.post(
            '/api/credit_trades',
            content_type='application/json',
            data=json.dumps(payload))

        # 400 since zero reason was set to None
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    # As a government user, I should be able to add an approved
    # credit transfer with 0 fair market value:
    # If the type is 'Sell', Fair Market Value needs to be greater than 0
    # or zero dollar reason must be provided
    def test_government_user_add_credit_transfer(self):
        credit_trade_status, created = CreditTradeStatus.objects.get_or_create(
            status='Approved')

        credit_trade_type, created = CreditTradeType.objects.get_or_create(
            the_type='Sell')

        credit_trade_zero_reason, created = CreditTradeZeroReason.objects \
            .get_or_create(reason='Other', display_order=2)

        payload = {
            'fairMarketValuePerCredit': '0.00',
            'initiator': 2,
            'numberOfCredits': 1,
            'respondent': 3,
            'status': credit_trade_status.id,
            'tradeEffectiveDate': datetime.datetime.today()
            .strftime('%Y-%m-%d'),
            'type': credit_trade_type.id,
            'zeroReason': credit_trade_zero_reason.id
        }

        response = self.gov_client.post(
            '/api/credit_trades',
            content_type='application/json',
            data=json.dumps(payload))

        # 400 since zero reason was set to None
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    # As a government user, I should be able to validate approved credit
    # transfers:
    # It should raise an exception if it sees any fuel suppliers with
    # insufficient funds
    def test_validate_credit(self):
        credit_trade_status, created = CreditTradeStatus.objects.get_or_create(
            status='Approved')

        credit_trade_type, created = CreditTradeType.objects.get_or_create(
            the_type='Sell')

        credit_trade_zero_reason, created = CreditTradeZeroReason.objects \
            .get_or_create(reason='Other', display_order=2)

        CreditTrade.objects.create(status=credit_trade_status,
                                   initiator=self.user_2.organization,
                                   respondent=self.user_3.organization,
                                   type=credit_trade_type,
                                   number_of_credits=1000000000,
                                   fair_market_value_per_credit=0,
                                   zero_reason=credit_trade_zero_reason,
                                   trade_effective_date=datetime.datetime
                                   .today().strftime('%Y-%m-%d'))

        credit_trades = CreditTrade.objects.filter(
            status_id=credit_trade_status.id)

        with self.assertRaises(PositiveIntegerException):
            CreditTradeService.validate_credits(credit_trades)

    # As a government user, I should be able to validate approved credit
    # transfers:
    # It should raise an exception if it sees any fuel suppliers with
    # insufficient funds
    # This is a slightly more complex test where we have multi credit trades
    # with new organizations that bounces the number of credits up and down
    def test_validate_credit_complex(self):
        credit_trade_status, created = CreditTradeStatus.objects.get_or_create(
            status='Approved')

        credit_trade_type, created = CreditTradeType.objects.get_or_create(
            the_type='Sell')

        credit_trade_zero_reason, created = CreditTradeZeroReason.objects \
            .get_or_create(reason='Other', display_order=2)

        from_organization = Organization.objects.create(
            name="Test 1",
            actions_type_id=1,
            status_id=1)
        to_organization = Organization.objects.create(
            name="Test 2",
            actions_type_id=1,
            status_id=1)

        # Award Test 1 with 1000 credits (new organizations start
        # with 0 credits)
        # (Please note in most cases we should use a different type
        # but to reduce the number of things to keep track, lets just
        # transfer from organization: 1 (BC Government))
        CreditTrade.objects.create(status=credit_trade_status,
                                   initiator=self.gov_user.organization,
                                   respondent=from_organization,
                                   type=credit_trade_type,
                                   number_of_credits=1000,
                                   fair_market_value_per_credit=0,
                                   zero_reason=credit_trade_zero_reason,
                                   trade_effective_date=datetime.datetime
                                   .today().strftime('%Y-%m-%d'))

        # Transfer 500 from Test 1 to Test 2
        CreditTrade.objects.create(status=credit_trade_status,
                                   initiator=from_organization,
                                   respondent=to_organization,
                                   type=credit_trade_type,
                                   number_of_credits=500,
                                   fair_market_value_per_credit=0,
                                   zero_reason=credit_trade_zero_reason,
                                   trade_effective_date=datetime.datetime
                                   .today().strftime('%Y-%m-%d'))

        # Transfer 700 from Test 1 to Test 2
        CreditTrade.objects.create(status=credit_trade_status,
                                   initiator=from_organization,
                                   respondent=to_organization,
                                   type=credit_trade_type,
                                   number_of_credits=700,
                                   fair_market_value_per_credit=0,
                                   zero_reason=credit_trade_zero_reason,
                                   trade_effective_date=datetime.datetime
                                   .today().strftime('%Y-%m-%d'))

        credit_trades = CreditTrade.objects.filter(
            status_id=credit_trade_status.id)

        # this should now raise an exception since we tried transferring
        # 1200 credits when only 1000 are available
        with self.assertRaises(PositiveIntegerException):
            CreditTradeService.validate_credits(credit_trades)

    # As a government user, I should be able to validate approved credit
    # transfers:
    # It should raise an exception if it sees any fuel suppliers with
    # insufficient funds
    # This test is similar to the one above, but should succeed as we're going
    # to allocate the right amount of credits this time
    def test_validate_credit_success(self):
        credit_trade_status, created = CreditTradeStatus.objects.get_or_create(
            status='Approved')

        credit_trade_type, created = CreditTradeType.objects.get_or_create(
            the_type='Sell')

        credit_trade_zero_reason, created = CreditTradeZeroReason.objects \
            .get_or_create(reason='Other', display_order=2)

        from_organization = Organization.objects.create(
            name="Test 1",
            actions_type_id=1,
            status_id=1)
        to_organization = Organization.objects.create(
            name="Test 2",
            actions_type_id=1,
            status_id=1)

        # Award Test 1 with 1000 credits (new organizations start
        # with 0 credits)
        # (Please note in most cases we should use a different type
        # but to reduce the number of things to keep track, lets just
        # transfer from organization: 1 (BC Government))
        CreditTrade.objects.create(status=credit_trade_status,
                                   initiator=self.gov_user.organization,
                                   respondent=from_organization,
                                   type=credit_trade_type,
                                   number_of_credits=1000,
                                   fair_market_value_per_credit=0,
                                   zero_reason=credit_trade_zero_reason,
                                   trade_effective_date=datetime.datetime
                                   .today().strftime('%Y-%m-%d'))

        # Transfer 500 from Test 1 to Test 2
        CreditTrade.objects.create(status=credit_trade_status,
                                   initiator=from_organization,
                                   respondent=to_organization,
                                   type=credit_trade_type,
                                   number_of_credits=500,
                                   fair_market_value_per_credit=0,
                                   zero_reason=credit_trade_zero_reason,
                                   trade_effective_date=datetime.datetime
                                   .today().strftime('%Y-%m-%d'))

        # Transfer 300 from Test 1 to Test 2
        CreditTrade.objects.create(status=credit_trade_status,
                                   initiator=from_organization,
                                   respondent=to_organization,
                                   type=credit_trade_type,
                                   number_of_credits=500,
                                   fair_market_value_per_credit=0,
                                   zero_reason=credit_trade_zero_reason,
                                   trade_effective_date=datetime.datetime
                                   .today().strftime('%Y-%m-%d'))

        credit_trades = CreditTrade.objects.filter(
            status_id=credit_trade_status.id)

        # no exceptions should be raised
        CreditTradeService.validate_credits(credit_trades)

    # As a government user, I should be able to process all the approved
    # credit transfers
    # This test is similar to the one above, but a functional test to check
    # if the commit actually works
    def test_batch_process(self):
        credit_trade_status, created = CreditTradeStatus.objects.get_or_create(
            status='Approved')

        credit_trade_type, created = CreditTradeType.objects.get_or_create(
            the_type='Sell')

        credit_trade_zero_reason, created = CreditTradeZeroReason.objects \
            .get_or_create(reason='Other', display_order=2)

        from_organization = Organization.objects.create(
            name="Test 1",
            actions_type_id=1,
            status_id=1)
        to_organization = Organization.objects.create(
            name="Test 2",
            actions_type_id=1,
            status_id=1)

        CreditTrade.objects.create(status=credit_trade_status,
                                   initiator=self.gov_user.organization,
                                   respondent=from_organization,
                                   type=credit_trade_type,
                                   number_of_credits=1000,
                                   fair_market_value_per_credit=0,
                                   zero_reason=credit_trade_zero_reason,
                                   trade_effective_date=datetime.datetime
                                   .today().strftime('%Y-%m-%d'))

        CreditTrade.objects.create(status=credit_trade_status,
                                   initiator=from_organization,
                                   respondent=to_organization,
                                   type=credit_trade_type,
                                   number_of_credits=500,
                                   fair_market_value_per_credit=0,
                                   zero_reason=credit_trade_zero_reason,
                                   trade_effective_date=datetime.datetime
                                   .today().strftime('%Y-%m-%d'))

        CreditTrade.objects.create(status=credit_trade_status,
                                   initiator=from_organization,
                                   respondent=to_organization,
                                   type=credit_trade_type,
                                   number_of_credits=400,
                                   fair_market_value_per_credit=0,
                                   zero_reason=credit_trade_zero_reason,
                                   trade_effective_date=datetime.datetime
                                   .today().strftime('%Y-%m-%d'))

        credit_trades = CreditTrade.objects.filter(
            status_id=credit_trade_status.id)

        response = self.gov_client.put('/api/credit_trades/batch_process')
        assert response.status_code == status.HTTP_200_OK

        organization_balance = OrganizationBalance.objects.get(
            organization_id=from_organization.id,
            expiration_date=None)

        self.assertEqual(organization_balance.validated_credits, 100)

    # As a government user, I should be able to delete credit transfers
    # (Not a hard delete, just sets the status to Cancelled)
    def test_delete(self):
        completed_status, created = CreditTradeStatus.objects.get_or_create(
            status='Completed')

        cancelled_status, created = CreditTradeStatus.objects.get_or_create(
            status='Cancelled')

        credit_trade_type, created = CreditTradeType.objects.get_or_create(
            the_type='Sell')

        credit_trade_zero_reason, created = CreditTradeZeroReason.objects \
            .get_or_create(reason='Other', display_order=2)

        from_organization = Organization.objects.create(
            name="Test 1",
            actions_type_id=1,
            status_id=1)
        to_organization = Organization.objects.create(
            name="Test 2",
            actions_type_id=1,
            status_id=1)

        credit_trade = CreditTrade.objects.create(
            status=completed_status,
            initiator=self.gov_user.organization,
            respondent=from_organization,
            type=credit_trade_type,
            number_of_credits=1000,
            fair_market_value_per_credit=0,
            zero_reason=credit_trade_zero_reason,
            trade_effective_date=datetime.datetime.
            today().strftime('%Y-%m-%d'))

        response = self.gov_client.put('/api/credit_trades/{}/delete'.format(
            credit_trade.id))

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        credit_trade = CreditTrade.objects.get(id=credit_trade.id)

        self.assertEqual(credit_trade.status_id, cancelled_status.id)

    # As a government user
    # I shouldn't see drafts unless I'm the initiator
    # I shouldn't see cancelled transfers as they're considered (deleted)
    def test_get_organization_credit_trades_gov(self):
        completed_status, created = CreditTradeStatus.objects.get_or_create(
            status='Completed')

        cancelled_status, created = CreditTradeStatus.objects.get_or_create(
            status='Cancelled')

        draft_status, created = CreditTradeStatus.objects.get_or_create(
            status='Draft')

        credit_trade_type, created = CreditTradeType.objects.get_or_create(
            the_type='Sell')

        from_organization = Organization.objects.create(
            name="Test 1",
            actions_type_id=1,
            status_id=1)
        to_organization = Organization.objects.create(
            name="Test 2",
            actions_type_id=1,
            status_id=1)

        # the function shouldn't see this as it's only a draft and the
        # initiator is not government
        draft_credit_trade = CreditTrade.objects.create(
            status=draft_status,
            initiator=from_organization,
            respondent=to_organization,
            type=credit_trade_type,
            number_of_credits=1000,
            fair_market_value_per_credit=1,
            zero_reason=None,
            trade_effective_date=datetime.datetime.
            today().strftime('%Y-%m-%d'))

        # the function should see this as it's a draft from the government
        draft_credit_trade_from_gov = CreditTrade.objects.create(
            status=draft_status,
            initiator=self.gov_user.organization,
            respondent=to_organization,
            type=credit_trade_type,
            number_of_credits=1000,
            fair_market_value_per_credit=1,
            zero_reason=None,
            trade_effective_date=datetime.datetime.
            today().strftime('%Y-%m-%d'))

        # the function should see this as it's completed
        completed_credit_trade = CreditTrade.objects.create(
            status=completed_status,
            initiator=from_organization,
            respondent=to_organization,
            type=credit_trade_type,
            number_of_credits=1000,
            fair_market_value_per_credit=1,
            zero_reason=None,
            trade_effective_date=datetime.datetime.
            today().strftime('%Y-%m-%d'))

        credit_trades = CreditTradeService.get_organization_credit_trades(
            self.gov_user.organization
        )

        self.assertNotIn(draft_credit_trade, credit_trades)
        self.assertIn(draft_credit_trade_from_gov, credit_trades)
        self.assertIn(completed_credit_trade, credit_trades)

    # As a fuel supplier
    # I shouldn't see drafts unless I'm the initiator
    # I shouldn't see cancelled transfers as they're considered (deleted)
    # I shouldn't see submitted transfers unless I'm involved somehow
    def test_get_organization_credit_trades_fuel_supplier(self):
        completed_status, created = CreditTradeStatus.objects.get_or_create(
            status='Completed')

        cancelled_status, created = CreditTradeStatus.objects.get_or_create(
            status='Cancelled')

        draft_status, created = CreditTradeStatus.objects.get_or_create(
            status='Draft')

        submitted_status, created = CreditTradeStatus.objects.get_or_create(
            status='Submitted')

        credit_trade_type, created = CreditTradeType.objects.get_or_create(
            the_type='Sell')

        test_organization_1 = Organization.objects.create(
            name="Test 1",
            actions_type_id=1,
            status_id=1)
        test_organization_2 = Organization.objects.create(
            name="Test 2",
            actions_type_id=1,
            status_id=1)
        test_organization_3 = Organization.objects.create(
            name="Test 3",
            actions_type_id=1,
            status_id=1)

        # the function shouldn't see this as it's only a draft and the
        # initiator is not fuel_supplier
        # (even though the fuel supplier is the respondent)
        draft_credit_trade = CreditTrade.objects.create(
            status=draft_status,
            initiator=test_organization_2,
            respondent=test_organization_1,
            type=credit_trade_type,
            number_of_credits=1000,
            fair_market_value_per_credit=1,
            zero_reason=None,
            trade_effective_date=datetime.datetime.
            today().strftime('%Y-%m-%d'))

        # the function should see this as it's a draft from the fuel supplier
        draft_credit_trade_from_fuel_supplier = CreditTrade.objects.create(
            status=draft_status,
            initiator=test_organization_1,
            respondent=test_organization_2,
            type=credit_trade_type,
            number_of_credits=1000,
            fair_market_value_per_credit=1,
            zero_reason=None,
            trade_effective_date=datetime.datetime.
            today().strftime('%Y-%m-%d'))

        # the function shouldn't see this as it's a submitted transaction
        # not involving the fuel supplier
        submitted_credit_trade = CreditTrade.objects.create(
            status=submitted_status,
            initiator=test_organization_2,
            respondent=test_organization_3,
            type=credit_trade_type,
            number_of_credits=1000,
            fair_market_value_per_credit=1,
            zero_reason=None,
            trade_effective_date=datetime.datetime.
            today().strftime('%Y-%m-%d'))

        # the function should see this as it's a submitted transaction
        # involving the fuel supplier
        submitted_credit_trade_as_respondent = CreditTrade.objects.create(
            status=submitted_status,
            initiator=test_organization_2,
            respondent=test_organization_1,
            type=credit_trade_type,
            number_of_credits=1000,
            fair_market_value_per_credit=1,
            zero_reason=None,
            trade_effective_date=datetime.datetime.
            today().strftime('%Y-%m-%d'))

        # the function should see this as it's completed
        completed_credit_trade = CreditTrade.objects.create(
            status=completed_status,
            initiator=test_organization_1,
            respondent=test_organization_2,
            type=credit_trade_type,
            number_of_credits=1000,
            fair_market_value_per_credit=1,
            zero_reason=None,
            trade_effective_date=datetime.datetime.
            today().strftime('%Y-%m-%d'))

        credit_trades = CreditTradeService.get_organization_credit_trades(
            test_organization_1
        )

        self.assertNotIn(draft_credit_trade, credit_trades)
        self.assertIn(draft_credit_trade_from_fuel_supplier, credit_trades)
        self.assertNotIn(submitted_credit_trade, credit_trades)
        self.assertIn(submitted_credit_trade_as_respondent, credit_trades)
        self.assertIn(completed_credit_trade, credit_trades)
