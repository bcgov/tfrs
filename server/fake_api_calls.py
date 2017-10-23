import json
from rest_framework import status
from . import fakedata
from django.test import Client


client = Client()


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