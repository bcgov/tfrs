import json
from django.test import TestCase, Client

from rest_framework import status

from pprint import pprint

from server import fake_api_calls

# Credit Trade Statuses
STATUS_DRAFT = 1
STATUS_PROPOSED = 2
STATUS_ACCEPTED = 3
STATUS_CANCELLED = 8

class TestCreditTradeAPI(TestCase):

    fixtures = ['credit_trade_statuses.json']

    def setUp(self):

        # Initialize Foreign keys
        # self.ct_status_id = fake_api_calls?.create_credit_trade_status()
        self.ct_type_id = fake_api_calls.create_credit_trade_type()
        self.fs1_id, self.fs1_status_id, self.fs1_action_type_id = (
            fake_api_calls.create_fuel_supplier())
        self.user_id = fake_api_calls.create_user(self.fs1_id)
        self.credit_trade_id = fake_api_calls.create_credit_trade(
            self.fs1_id,
            self.user_id
        )[0]

        self.client = Client(HTTP_SM_USER_ID=self.user_id)
        self.test_url = "/api/credit_trades"

        self.test_data_fail = [{
            'data': {'numberOfCredits': 1},
            'response': {
                "creditTradeStatusFK": ["This field is required."],
                "respondentFK": ["This field is required."],
                "creditTradeTypeFK": ["This field is required."]
            }
        }, {
            'data': {'numberOfCredits': 1,
                     'creditTradeStatusFK': STATUS_DRAFT},
            'response': {
                "respondentFK": ["This field is required."],
                "creditTradeTypeFK": ["This field is required."],
            }
        }, {
            'data': {'numberOfCredits': 1,
                     'creditTradeStatusFK': STATUS_DRAFT,
                     'respondentFK': self.fs1_id},
            'response': {
                "creditTradeTypeFK": ["This field is required."]
            }
        }]

        self.test_data_success = [{
            'data': {'numberOfCredits': 1,
                     'creditTradeStatusFK': STATUS_DRAFT,
                     'respondentFK': self.fs1_id,
                     'creditTradeTypeFK': self.ct_type_id},
        }]

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
        credit_trade_id = kwargs.get("credit_trade_id", self.credit_trade_id)
        num_of_credits = kwargs.get("num_of_credits", 4)
        credit_trade_status = kwargs.get("credit_trade_status", STATUS_DRAFT)

        if not credit_trade_id:
            credit_trade_id = self.credit_trade_id

        data = {
            'numberOfCredits': num_of_credits,
            'creditTradeStatusFK': credit_trade_status,
            'respondentFK': self.fs1_id,
            'creditTradeTypeFK': self.ct_type_id
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
            "{}/{}/history".format(self.test_url, self.credit_trade_id),
            content_type='application/json')

        response_data = json.loads(response.content.decode("utf-8"))

        self.assertEqual(3, len(response_data))

        assert status.HTTP_200_OK == response.status_code

    def test_is_internal_history_false(self):
        data = [STATUS_PROPOSED, STATUS_ACCEPTED]
        for ct_status in data:
            self.test_update(credit_trade_status=ct_status)
            response = self.client.get(
                "{}/{}/history".format(self.test_url, self.credit_trade_id),
                content_type='application/json')
            response_data = json.loads(response.content.decode("utf-8"))
            self.assertFalse(response_data[0]['isInternalHistoryRecord'])

    def test_is_internal_history_draft(self):
        # Initially created credit trade is "Draft"
        response = self.client.get(
            "{}/{}/history".format(self.test_url, self.credit_trade_id),
            content_type='application/json')

        response_data = json.loads(response.content.decode("utf-8"))
        self.assertTrue(response_data[0]['isInternalHistoryRecord'])

    def test_is_internal_history_draft_then_cancelled(self):
        # Initially created credit trade is "Draft"

        # Update the status to "Cancelled"
        self.test_update(credit_trade_status=STATUS_CANCELLED)
        response = self.client.get(
            "{}/{}/history".format(self.test_url, self.credit_trade_id),
            content_type='application/json')

        response_data = json.loads(response.content.decode("utf-8"))
        self.assertTrue(response_data[0]['isInternalHistoryRecord'])

    def test_director_approved(self):
        """Execute and complete a trade when an "On Director's Approval" Trade
        is approved"""
        pass
