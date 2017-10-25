import json
from rest_framework import status
from . import fakedata
from django.test import Client


client = Client()

STATUS_DRAFT = 1

def create_credit_trade_type():

    test_url = "/api/credittradetypes"
    payload = fakedata.CreditTradeTypeTestDataCreate()
    payload['expirationDate'] = '2017-01-02'
    payload['effectiveDate'] = '2017-01-01'

    response = client.post(
        test_url,
        content_type='application/json',
        data=json.dumps(payload))

    # Check that the response is OK.
    assert status.HTTP_201_CREATED == response.status_code
    # parse the response.
    data = json.loads(response.content.decode("utf-8"))
    created_id = data['id']
    return created_id


def create_credit_trade_status():

    test_url = "/api/credittradestatuses"
    payload = fakedata.CreditTradeStatusTestDataCreate()
    payload['effectiveDate'] = '2017-01-01'
    response = client.post(
        test_url,
        content_type='application/json',
        data=json.dumps(payload))
    # Check that the response is OK.
    assert status.HTTP_201_CREATED == response.status_code
    # parse the response.
    data = json.loads(response.content.decode("utf-8"))
    created_id = data['id']
    return created_id


def create_fuel_supplier_status():

    test_url = "/api/fuelsupplierstatuses"
    payload = fakedata.FuelSupplierStatusTestDataCreate()
    payload['effectiveDate'] = '2017-01-01'
    response = client.post(
        test_url,
        content_type='application/json',
        data=json.dumps(payload))
    # Check that the response is OK.
    assert status.HTTP_201_CREATED == response.status_code
    # parse the response.
    data = json.loads(response.content.decode("utf-8"))
    created_id = data['id']
    return created_id


def create_fuel_supplier_action_type():

    test_url = "/api/fuelsupplieractionstypes"
    payload = fakedata.FuelSupplierActionsTypeTestDataCreate()
    response = client.post(
        test_url,
        content_type='application/json',
        data=json.dumps(payload))
    # Check that the response is OK.
    assert status.HTTP_201_CREATED == response.status_code
    # parse the response.
    data = json.loads(response.content.decode("utf-8"))
    created_id = data['id']
    return created_id


def create_fuel_supplier():

    status_id = create_fuel_supplier_status()
    action_type_id = create_fuel_supplier_action_type()

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
    response = client.post(
        test_url,
        content_type='application/json',
        data=json.dumps(payload))
    # Check that the response is OK.
    assert status.HTTP_201_CREATED == response.status_code
    # parse the response.
    data = json.loads(response.content.decode("utf-8"))
    created_id = data['id']
    return created_id, status_id, action_type_id


def create_user(fuel_supplier_id):

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
    response = client.post(
        test_url,
        content_type='application/json',
        data=json.dumps(payload))
    # Check that the response is OK.
    assert status.HTTP_201_CREATED == response.status_code
    # parse the response.
    data = json.loads(response.content.decode("utf-8"))
    user_id = data['id']

    return user_id


def create_credit_trade(fuel_supplier_id, user_id):

    type_id = create_credit_trade_type()

    test_url = "/api/credit_trades"
    payload = {
      'status': 'Active',
      'initiator': fuel_supplier_id,
      'respondent': fuel_supplier_id,
      'initiatorLastUpdateBy': user_id,
      'respondentLastUpdatedBy': None,
      'reviewedRejectedBy': None,
      'approvedRejectedBy': None,
      'cancelledBy': None,
      'tradeExecutionDate': '2017-01-01',
      #   TODO: replace transactionType
      'transactionType': 'Type',
      'fairMarketValuePrice': '100.00',
      'fuelSupplierBalanceBeforeTransaction': '2017-01-01',
      'note': None,
      'attachments': [],
      'creditTradeTypeFK': type_id,
      'creditTradeStatusFK': STATUS_DRAFT,
      'respondentFK': fuel_supplier_id,
    }
    fake_credit_trade = fakedata.CreditTradeTestDataCreate()
    payload.update(fake_credit_trade)
    client_with_user = Client(HTTP_SM_USER_ID=user_id)

    response = client_with_user.post(test_url,
                                     content_type='application/json',
                                     data=json.dumps(payload))

    # Check that the response is OK.
    assert status.HTTP_201_CREATED == response.status_code
    # parse the response.
    data = json.loads(response.content.decode("utf-8"))
    credit_trade_id = data['id']
    return credit_trade_id, type_id
