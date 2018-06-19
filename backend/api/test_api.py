import json
from django.test import TestCase, Client

from rest_framework import status
import datetime

from api import fake_api_calls
from api.models.CreditTrade import CreditTrade
from api.models.OrganizationBalance import OrganizationBalance
from api.models.Role import Role
from api.models.User import User
from api.models.UserRole import UserRole

# Credit Trade Statuses
STATUS_DRAFT = 1
STATUS_SUBMITTED = 2
STATUS_ACCEPTED = 3
STATUS_RECOMMENDED = 4
STATUS_APPROVED = 6
STATUS_COMPLETED = 7
STATUS_CANCELLED = 8
STATUS_DECLINED = 9


class TestAPI(TestCase):
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
        # self.ct_status_id = fake_api_calls?.create_credit_trade_status()
        self.ct_type_id = fake_api_calls.create_credit_trade_type()
        self.fs1_id, self.fs1_status_id, self.fs1_action_type_id = (
            fake_api_calls.create_organization())
        self.user_id = fake_api_calls.create_user(self.fs1_id)
        resp_user = User.objects.get(id=self.user_id)
        resp_user.authorization_guid = 'e46435c1-7d69-489f-9dde-83005cd77744'
        resp_user.save()

        # Apply a fuel supplier role to the default user
        fs_user = User.objects.get(username='business_bsmith')
        fs_role = Role.objects.get(name='FSManager')
        UserRole.objects.create(user_id=fs_user.id, role_id=fs_role.id)

        # Apply a fuel supplier role to the respondent user
        fs_role = Role.objects.get(name='FSManager')
        UserRole.objects.create(user_id=resp_user.id, role_id=fs_role.id)

        self.credit_trade = fake_api_calls.create_credit_trade(
            initiator=2,
            respondent=self.fs1_id,
            type=self.ct_type_id,
            status=STATUS_DRAFT,
            user_id=self.user_id,
        )

        self.client = Client(
            HTTP_SMGOV_USERGUID='c9804c52-05f1-4a6a-9d24-332d9d8be2a9',
            HTTP_SMGOV_USERDISPLAYNAME='Brad Smith',
            HTTP_SMGOV_USEREMAIL='BradJSmith@cuvox.de',
            HTTP_SM_UNIVERSALID='BSmith')

        self.gov_client = Client(
            HTTP_SMGOV_USERGUID='c2971372-3a96-4704-9b9c-18e4e9298ee3',
            HTTP_SMGOV_USERDISPLAYNAME='Test Person',
            HTTP_SMGOV_USEREMAIL='Test.Person@gov.bc.ca',
            HTTP_SM_UNIVERSALID='Teperson',
            HTTP_SMGOV_USERTYPE='Internal',
            HTTP_SM_AUTHDIRNAME='IDIR')

        self.respondent_client = Client(
            HTTP_SMGOV_USERGUID='e46435c1-7d69-489f-9dde-83005cd77744',
            HTTP_SMGOV_USERDISPLAYNAME=resp_user.display_name,
            HTTP_SMGOV_USEREMAIL=resp_user.email)

        # Apply a government role to Teperson
        gov_user = User.objects.get(username='internal_teperson')
        gov_role = Role.objects.get(name='GovDirector')
        UserRole.objects.create(user_id=gov_user.id, role_id=gov_role.id)

        self.test_url = "/api/credit_trades"

        self.test_data_fail = [{
            'data': {'number_of_credits': 1},
            'response': {
                "status": ["This field is required."],
                "respondent": ["This field is required."],
                "type": ["This field is required."]
            }
        }, {
            'data': {'number_of_credits': 1,
                     'status': STATUS_DRAFT},
            'response': {
                "respondent": ["This field is required."],
                "type": ["This field is required."],
            }
        }, {
            'data': {'number_of_credits': 1,
                     'status': STATUS_DRAFT,
                     'respondent': self.fs1_id},
            'response': {
                "type": ["This field is required."]
            }
        }]

        self.test_data_success = [{
            'data': {'number_of_credits': 1,
                     'status': STATUS_DRAFT,
                     'initiator': 2,
                     'respondent': self.fs1_id,
                     'type': self.ct_type_id},
        }]

    def test_current_user(self):
        response = self.client.get('/api/users/current')

        response_data = json.loads(response.content.decode("utf-8"))

        HTTP_SMGOV_USERGUID = 'c9804c52-05f1-4a6a-9d24-332d9d8be2a9'
        HTTP_SMGOV_USERDISPLAYNAME = 'Brad Smith'
        HTTP_SMGOV_USEREMAIL = 'BradJSmith@cuvox.de'
        HTTP_SM_UNIVERSALID = 'BSmith'

        assert response_data['authorizationGuid'] == HTTP_SMGOV_USERGUID
        assert response_data['authorizationId'] == HTTP_SM_UNIVERSALID.lower()
        assert response_data['email'] == HTTP_SMGOV_USEREMAIL
        assert response_data['displayName'] == HTTP_SMGOV_USERDISPLAYNAME

    def test_create_fail(self):
        credit_trades = self.test_data_fail

        for tests in credit_trades:
            response = self.client.post(
                self.test_url,
                content_type='application/json',
                data=json.dumps(tests['data']))

            self.assertJSONEqual(
                response.content.decode("utf-8"),
                tests['response'])
            assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_create_success(self):
        credit_trades = self.test_data_success

        for tests in credit_trades:
            response = self.client.post(
                self.test_url,
                content_type='application/json',
                data=json.dumps(tests['data']))

            assert status.HTTP_201_CREATED == response.status_code

    def test_create_and_create_trade_history(self):
        credit_trades = self.test_data_success

        for tests in credit_trades:
            response = self.client.post(
                self.test_url,
                content_type='application/json',
                data=json.dumps(tests['data']))

            ct_id = response.data['id']
            response = self.client.get(
                "{}/{}/history".format(self.test_url, ct_id),
                content_type='application/json')

            assert status.HTTP_200_OK == response.status_code

    def test_update(self, **kwargs):
        credit_trade_id = kwargs.get("credit_trade_id", self.credit_trade['id'])
        num_of_credits = kwargs.get("num_of_credits", 4)
        credit_trade_status = kwargs.get("credit_trade_status", STATUS_DRAFT)
        fair_market_value = kwargs.get("fair_market_value", 1)
        #
        # if not credit_trade_id:
        #     credit_trade_id = self.credit_trade_id

        data = {
            'number_of_credits': num_of_credits,
            'status': credit_trade_status,
            'initiator': 2,
            'respondent': self.fs1_id,
            'type': self.ct_type_id,
            'fair_market_value_per_credit': fair_market_value
        }

        response = self.client.put(
            "{}/{}".format(self.test_url, credit_trade_id),
            content_type='application/json',
            data=json.dumps(data))

        assert status.HTTP_200_OK == response.status_code

    def test_update_create_trade_history(self):
        self.test_update(num_of_credits=1)
        self.test_update(num_of_credits=2)

        response = self.client.get(
            "{}/{}/history".format(self.test_url, self.credit_trade['id']),
            content_type='application/json')

        response_data = json.loads(response.content.decode("utf-8"))

        self.assertEqual(3, len(response_data))

        assert status.HTTP_200_OK == response.status_code

    # TODO: possibly move the next set of tests to another file;
    # They test the business logic & not the API itself.
    def test_is_internal_history_false(self):
        self.test_update(credit_trade_status=STATUS_SUBMITTED)

        data = {
            'number_of_credits': 4,
            'status': STATUS_ACCEPTED,
            'initiator': 2,
            'respondent': self.fs1_id,
            'type': self.ct_type_id,
            'fair_market_value_per_credit': 1
        }

        response = self.respondent_client.put(
            "{}/{}".format(self.test_url, self.credit_trade['id']),
            content_type='application/json',
            data=json.dumps(data))

        # self.test_update(credit_trade_status=STATUS_ACCEPTED)
        # TODO: Change this to /id/propose and /id/accept
        response = self.client.get(
            "{}/{}/history".format(self.test_url, self.credit_trade['id']),
            content_type='application/json')
        response_data = json.loads(response.content.decode("utf-8"))
        self.assertFalse(response_data[0]['isInternalHistoryRecord'])

    def test_is_internal_history_draft(self):
        # Initially created credit trade is "Draft"
        response = self.client.get(
            "{}/{}/history".format(self.test_url, self.credit_trade['id']),
            content_type='application/json')

        response_data = json.loads(response.content.decode("utf-8"))
        self.assertTrue(response_data[0]['isInternalHistoryRecord'])

    def test_is_internal_history_draft_then_cancelled(self):
        # Initially created credit trade is "Draft"

        # Update the status to "Cancelled"
        self.test_update(credit_trade_status=STATUS_CANCELLED)

        credit_trade = CreditTrade.objects.get(id=self.credit_trade['id'])
        self.assertEqual(credit_trade.status_id, STATUS_CANCELLED)

    def test_nested_credit_trade(self):
        response = self.client.get(
            "{}/{}".format(self.test_url, self.credit_trade['id']),
            content_type='application/json')
        response_data = json.loads(response.content.decode("utf-8"))

        credit_trade_status = {
            "id": STATUS_DRAFT,
            "status": "Draft"
        }
        self.assertTrue(
            set(credit_trade_status).issubset(
                response_data['status']))

    def test_nested_credit_trade_history(self):
        response = self.client.get(
            "{}/{}/history".format(self.test_url, self.credit_trade['id']),
            content_type='application/json')
        response_data = json.loads(response.content.decode("utf-8"))[0]

        credit_trade_status = {
            "id": STATUS_DRAFT,
            "status": "Draft"
        }
        self.assertTrue(
            set(credit_trade_status).issubset(
                response_data['status']))

    def test_get_fuel_suppliers_only(self):
        response = self.gov_client.get("/api/organizations/fuel_suppliers")
        response_data = json.loads(response.content.decode("utf-8"))
        for r in response_data:
            assert r['type'] == 2

    def test_approved_buy(self):
        # get fuel supplier balance for fs 1
        initiator_bal = OrganizationBalance.objects.get(
            organization_id=2,
            expiration_date=None)
        respondent_bal, created = OrganizationBalance.objects.get_or_create(
            organization_id=self.fs1_id,
            expiration_date=None,
            defaults={'validated_credits': 10000})

        num_of_credits = 50

        credit_trade = fake_api_calls.create_credit_trade(
            user_id=self.user_id,
            status=STATUS_SUBMITTED,
            fair_market_value_per_credit=1000,
            initiator=2,
            respondent=self.fs1_id,
            number_of_credits=num_of_credits,
            type=2
        )

        data = {
            'number_of_credits': num_of_credits,
            'status': STATUS_ACCEPTED,
            'initiator': 2,
            'respondent': self.fs1_id,
            'type': 2,
            'fair_market_value_per_credit': 1000
        }

        resp_user = User.objects.get(id=self.user_id)
        resp_user.organization_id = self.fs1_id
        resp_user.save()

        response = self.respondent_client.put(
            "{}/{}".format(self.test_url, credit_trade['id']),
            content_type='application/json',
            data=json.dumps(data))

        response = self.gov_client.put(
            "{}/{}/approve".format(self.test_url, credit_trade['id']),
            content_type='application/json')

        assert status.HTTP_200_OK == response.status_code

        # TODO: Make sure two credit histories are created

        initiator_bal_after = OrganizationBalance.objects.get(
            organization_id=2,
            expiration_date=None)

        respondent_bal_after = OrganizationBalance.objects.get(
            organization_id=self.fs1_id,
            expiration_date=None)

        init_final_bal = initiator_bal.validated_credits + num_of_credits
        resp_final_bal = respondent_bal.validated_credits - num_of_credits

        ct_completed = self.client.get(
            "{}/{}".format(self.test_url, credit_trade['id']),
            content_type='application/json')

        completed_response = json.loads(
            ct_completed.content.decode("utf-8"))

        # response_data should have status == completed
        today = datetime.datetime.today().strftime('%Y-%m-%d')

        # Status of Credit Trade should be 'completed'
        self.assertEqual(completed_response['status']['id'],
                         STATUS_COMPLETED)

        # Effective date should be today
        self.assertEqual(
            initiator_bal_after.effective_date.strftime('%Y-%m-%d'),
            today)
        self.assertEqual(
            respondent_bal_after.effective_date.strftime('%Y-%m-%d'),
            today)

        # Credits should be subtracted/added
        self.assertEqual(init_final_bal,
                         initiator_bal_after.validated_credits)
        self.assertEqual(resp_final_bal,
                         respondent_bal_after.validated_credits)

    def test_approved_sell(self, **kwargs):
        pass

    def test_approved_credit_validation(self, **kwargs):
        pass

    def test_approved_retirement(self, **kwargs):
        pass

    def test_approved_part_3_award(self, **kwargs):
        pass

        #
        # def test_director_approved(self):
        #     """Execute and complete a trade when an "On Director's Approval" Trade
        #     is approved"""
        #     tests = [{
        #         'data': {
        #             'credit_trade_status': STATUS_APPROVED,
        #             'number_of_credits': 2
        #         },
        #         'response': {
        #             ''
        #         }
        #     }, {
        #         'data': {
        #             'credit_trade_status': STATUS_DRAFT,
        #             'number_of_credits': 10,
        #             'fair_market_value': "Value"
        #         },
        #         'response': {
        #             ''
        #         }
        #     }]
        #     for test in tests:
        #         self.test_update(**test['data'])

        # self.test_update(credit_trade_status=STATUS_APPROVED)
        # Test that no other fields are changed, except for notes,
        # effective date & status

        # don't care where it comes from (ignore previous status)
        # status is "Approved"
        # no other fields can change, unless from getting a new note

        # effective date is None or past
        # Set effective date on director's approval

        # fuel supplier receives credits
        # fuel supplier loses credits
        # OrganizationBalance record created, effective data = transaction create time
        #   end data is None


        # pass

    # Test transitions of statuses
    def test_create_draft_or_proposed(self):
        credit_trades = [{
            'numberOfCredits': 1,
            'status': STATUS_DRAFT,
            'initiator': 2,
            'respondent': self.fs1_id,
            'type': self.ct_type_id
        }, {
            'numberOfCredits': 1,
            'status': STATUS_SUBMITTED,
            'initiator': 2,
            'respondent': self.fs1_id,
            'type': self.ct_type_id
        }]

        for ct in credit_trades:
            response = fake_api_calls.create_credit_trade_dict(ct)
            assert status.HTTP_201_CREATED == response.status_code

            # Make sure action statuses are "Draft" and "Submitted"
            # And Button actions are "Save as Draft" and "Propose"
            new_ct = fake_api_calls.get_credit_trade(response.json()['id'])
            if ct['status'] == STATUS_DRAFT:
                statuses = [a['status'] for a in new_ct.json()['actions']]
                actions = [a['action'] for a in new_ct.json()['actions']]

                assert sorted(["Draft", "Submitted"]) == sorted(statuses)
                assert sorted(["Save Draft", "Propose"]) == sorted(actions)

    def test_create_other_statuses_fail(self):
        credit_trades = [{
            'data': {
                'numberOfCredits': 1,
                'status': STATUS_ACCEPTED,
                'respondent': self.fs1_id,
                'type': self.ct_type_id
            },
            'error': {"invalidStatus": ["You do not have permission to set"
                                        " statuses to `Accepted`."]}
        }, {
            'data': {
                'numberOfCredits': 1,
                'status': STATUS_RECOMMENDED,
                'respondent': self.fs1_id,
                'type': self.ct_type_id},
            'error': {"invalidStatus": ["You do not have permission to set"
                                        " statuses to `Recommended`."]}

        }, {
            'data': {
                'numberOfCredits': 1,
                'status': STATUS_APPROVED,
                'respondent': self.fs1_id,
                'type': self.ct_type_id},
            'error': {"invalidStatus": ["You do not have permission to set"
                                        " statuses to `Approved`."]}
        }, {
            'data': {
                'numberOfCredits': 1,
                'status': STATUS_COMPLETED,
                'respondent': self.fs1_id,
                'type': self.ct_type_id},
            'error': {"invalidStatus": ["You do not have permission to set"
                                        " statuses to `Completed`."]}
        }, {
            'data': {
                'numberOfCredits': 1,
                'status': STATUS_CANCELLED,
                'respondent': self.fs1_id,
                'type': self.ct_type_id},
            'error': {"invalidStatus": ["You do not have permission to set"
                                        " statuses to `Cancelled`."]}
        }, {
            'data': {
                'numberOfCredits': 1,
                'status': STATUS_DECLINED,
                'respondent': self.fs1_id,
                'type': self.ct_type_id},
            'error': {"invalidStatus": ["You do not have permission to set"
                                        " statuses to `Declined`."]}
        }]

        for tests in credit_trades:
            response = fake_api_calls.create_credit_trade_dict(tests['data'])
            self.assertJSONEqual(
                response.content.decode("utf-8"),
                tests['error'])
            assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_update_draft_to_proposed_success(self, **kwargs):
        credit_trades = [{
            'numberOfCredits': 1,
            'status': STATUS_DRAFT,
            'initiator': 2,
            'respondent': self.fs1_id,
            'type': self.ct_type_id
        }, {
            'numberOfCredits': 5,
            'status': STATUS_DRAFT,
            'initiator': 2,
            'respondent': self.fs1_id,
            'type': self.ct_type_id
        }]

        self.test_create_success()
        for ct in credit_trades:
            # Create
            response = fake_api_calls.create_credit_trade_dict(ct)
            assert status.HTTP_201_CREATED == response.status_code

            # Update
            ct['status'] = STATUS_SUBMITTED
            updated_response = fake_api_calls.update_credit_trade_dict(
                ct,
                response.json()['id'])

            assert status.HTTP_200_OK == updated_response.status_code

    def test_update_proposed_to_accepted(self, **kwargs):
        pass

    def test_update_proposed_to_rescinded(self, **kwargs):
        pass

    def test_update_proposed_to_refused(self, **kwargs):
        pass

    def test_update_accepted_to_rescinded(self, **kwargs):
        pass

    def test_update_accepted_to_recommended(self, **kwargs):
        pass

    def test_update_accepted_to_approved(self, **kwargs):
        pass

    def test_update_accepted_to_declined(self, **kwargs):
        pass
