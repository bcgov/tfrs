import json
from django.test import TestCase, Client
# import django

from .models.CreditTrade import CreditTrade
from .models.CreditTradeStatus import CreditTradeStatus
from .models.FuelSupplier import FuelSupplier
from .models.CreditTradeType import CreditTradeType
from .models.CreditTradeHistory import CreditTradeHistory
from .models.User import User

from rest_framework import status

from server import fakedata
from pprint import pprint

from server import fake_api_calls


class TestCreditTradeAPI(TestCase):

    def setUp(self):

        self.client = Client()

        # HTTP_SM_USER_ID='1'
        # django.setup()

        # Initialize Foreign keys
        # self.credit_trade_status = CreditTradeStatus.objects.create(status='', description='', effectiveDate='2011-01-01', displayOrder=1)
        # self.initiator = FuelSupplier.objects.create(name='Initiator')
        # self.respondent = FuelSupplier.objects.create(name='Respondent')
        # self.credit_trade_type = CreditTradeType.objects.create(theType='', description='')
        # self.user = User.objects.create(givenName='', surname='')
        #
        # self.client = Client(HTTP_SM_USER_ID=self.user.id)
        #


        ct_type_id = fake_api_calls.create_credit_trade_type()
        ct_status_id = fake_api_calls.create_credit_trade_status()
        fs1_id, fs1_status_id, fs1_action_type_id = (
            fake_api_calls.create_fuel_supplier())
        fs2_id, fs2_status_id, fs2_action_type_id = (
            fake_api_calls.create_fuel_supplier())

        user_id = fake_api_calls.create_user(fs1_id)

        self.test_data_fail = [{
            'data': {'numberOfCredits': 1},
            'response': {
                "creditTradeStatusFK": ["This field is required."],
                "respondentFK": ["This field is required."],
                "creditTradeTypeFK": ["This field is required.dd"]
            }
        }, {
            'data': {'numberOfCredits': 1,
                     'creditTradeStatusFK': ct_status_id},
            'response': {
                "respondentFK": ["This field is required."],
                "creditTradeTypeFK": ["This field is required."],
            }
        }, {
            'data': {'numberOfCredits': 1,
                     'creditTradeStatusFK': ct_status_id,
                     'respondentFK': fs1_id},
            'response': {
                "creditTradeTypeFK": ["This field is required."]
            }
        }

        ]

    def create_credit_trade_type(self):
        test_url = "/api/credittradetypes"
        payload = fakedata.CreditTradeTypeTestDataCreate()
        payload['expirationDate'] = '2017-01-02'
        payload['effectiveDate'] = '2017-01-01'

        response = self.client.post(
            test_url,
            content_type='application/json',
            data=json.dumps(payload))

        # Check that the response is OK.
        assert status.HTTP_201_CREATED == response.status_code
        # parse the response.
        data = json.loads(response.content.decode("utf-8"))
        created_id = data['id']
        return created_id

    def create_credit_trade_status(self):
        test_url = "/api/credittradestatuses"
        payload = fakedata.CreditTradeStatusTestDataCreate()
        payload['effectiveDate'] = '2017-01-01'
        response = self.client.post(
            test_url,
            content_type='application/json',
            data=json.dumps(payload))
        # Check that the response is OK.
        assert status.HTTP_201_CREATED == response.status_code
        # parse the response.
        data = json.loads(response.content.decode("utf-8"))
        created_id = data['id']
        return created_id

    def create_fuel_supplier_status(self):
        test_url = "/api/fuelsupplierstatuses"
        payload = fakedata.FuelSupplierStatusTestDataCreate()
        payload['effectiveDate'] = '2017-01-01'
        response = self.client.post(
            test_url,
            content_type='application/json',
            data=json.dumps(payload))
        # Check that the response is OK.
        assert status.HTTP_201_CREATED == response.status_code
        # parse the response.
        data = json.loads(response.content.decode("utf-8"))
        created_id = data['id']
        return created_id

    def create_fuel_supplier_action_type(self):
        test_url = "/api/fuelsupplieractionstypes"
        payload = fakedata.FuelSupplierActionsTypeTestDataCreate()
        response = self.client.post(
            test_url,
            content_type='application/json',
            data=json.dumps(payload))
        # Check that the response is OK.
        assert status.HTTP_201_CREATED == response.status_code
        # parse the response.
        data = json.loads(response.content.decode("utf-8"))
        created_id = data['id']
        return created_id

    def create_fuel_supplier(self):
        status_id = self.create_fuel_supplier_status()
        action_type_id = self.create_fuel_supplier_action_type()

        test_url = "/api/fuelsuppliers"
        # Create:
        payload = {
            'name': "Initial",
            'status': "Initial",
            'createdDate': '2000-01-01',
            #   'primaryContact': contactId ,
            #   'contacts': [contactId],
            'notes': [],
            'attachments': [],
            'history': [],
            'fuelSupplierStatusFK': status_id,
            'fuelSupplierActionsTypeFK': action_type_id,
        }
        response = self.client.post(
            test_url,
            content_type='application/json',
            data=json.dumps(payload))
        # Check that the response is OK.
        assert status.HTTP_201_CREATED == response.status_code
        # parse the response.
        data = json.loads(response.content.decode("utf-8"))
        created_id = data['id']
        return created_id, status_id, action_type_id

    def create_user(self, fuel_supplier_id):
        test_url = "/api/users"
        # Create:
        fake_user = fakedata.UserTestDataCreate()
        payload = {
          'givenName': fake_user['givenName'],
          'surname': fake_user['surname'],
          'email': fake_user['email'],
          'status': 'Active',
          'userFK': fake_user['userId'],
          'guid': fake_user['guid'],
          'authorizationDirectory': fake_user['authorizationDirectory'],
          'fuelSupplier': fuel_supplier_id
        }
        response = self.client.post(
            test_url,
            content_type='application/json',
            data=json.dumps(payload))
        # Check that the response is OK.
        assert status.HTTP_201_CREATED == response.status_code
        # parse the response.
        data = json.loads(response.content.decode("utf-8"))
        user_id = data['id']
        return user_id

    def test_create_fail(self):
        # credit_trades = self.test_data
        credit_trades = self.test_data_fail
        test_url = "/api/credit_trades/"
        for tests in credit_trades:

            response = self.client.post(
                test_url,
                content_type='application/json',
                data=json.dumps(tests['data']))

            # pprint(tests['data'])
            # print("Response is")
            # pprint(response.content.decode("utf-8"))
            #
            # self.assertJSONEqual(
            #     response.content.decode("utf-8"),
            #     tests['response'])
            assert response.status_code == status.HTTP_400_BAD_REQUEST
            # assert status.HTTP_201_CREATED == response.status_code

    # def test_create_success(self):
    #
    #     # Create user
    #     user = {
    #       "authorizationID": "1",
    #       "givenName": "Test",
    #       "surname": "Test",
    #       "email": "Test",
    #       "userId": "Test"
    #     }
    #
    #     test_user_url = "/api/users"
    #     response = self.client.post(
    #         test_user_url,
    #         content_type='application/json',
    #         data=user)
    #
    #     # client_with_user = Client(HTTP_SM_USER_ID=response.id)
    #     client_with_user = Client(HTTP_SM_USER_ID='1')
    #
    #     credit_trades = create_trade_test_data_create_success()
    #     test_url = "/api/credit_trades/"
    #     for tests in credit_trades:
    #         response = client_with_user.post(
    #             test_url,
    #             content_type='application/json',
    #             data=json.dumps(tests['data']))
    #
    #         # print("Response is", response)
    #
    #
    #         assert status.HTTP_400_BAD_REQUEST == response.status_code

    def test_create_and_create_trade_history(self):
        pass



    def test_credit_trade_update(self):
        """Create a credit trade"""
        pass

    # def test_credit_trade_create(self):
    #     """Create a credit trade"""
    #     pass
