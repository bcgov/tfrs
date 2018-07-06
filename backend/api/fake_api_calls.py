import json

from rest_framework import status
from . import fakedata
from django.test import Client

# client = Client()
client = Client(
    HTTP_SMGOV_USERGUID='c9804c52-05f1-4a6a-9d24-332d9d8be2a9',
    HTTP_SMAUTH_USERDISPLAYNAME='Brad Smith',
    HTTP_SMGOV_USEREMAIL='BradJSmith@cuvox.de',
    HTTP_SM_UNIVERSALID='BSmith'
)

STATUS_DRAFT = 1


def create_organization():
    status_id = 1  # Active
    action_type_id = 1  # buy and sell

    test_url = "/api/organizations"
    # Create:
    payload = {
        'name': "Initial",
        'created_date': '2000-01-01',
        #   'primaryContact': contactId ,
        #   'contacts': [contactId],
        'notes': [],
        'attachments': [],
        'history': [],
        'status': status_id,
        'actions_type': action_type_id,
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


def create_user(organization_id):
    test_url = "/api/users"
    # Create:
    fake_user = fakedata.UserTestDataCreate()
    payload = {
        'first_name': fake_user['first_name'],
        'last_name': fake_user['last_name'],
        'email': fake_user['email'],
        'status': 'Active',
        'username': fake_user['username'],
        'authorization_guid': fake_user['authorization_guid'],
        'authorization_directory': fake_user['authorization_directory'],
        'organization': organization_id
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


def create_credit_trade(**kwargs):
    body = {
        "number_of_credits": kwargs.get("number_of_credits", 2),
        "fair_market_value_per_credit": kwargs.get("fair_market_value_per_credit", 1),

        "trade_effective_date": "2017-04-01",
        "status": kwargs.get("status", 1),
        "respondent": kwargs.get("respondent", create_organization()),
        "type": kwargs.get("type", 1),
        "initiator": kwargs.get("initiator"),
        "zero_reason": kwargs.get("zero_reason")
    }

    # user_id = kwargs.get("user_id")

    # client_with_user = Client(HTTP_SM_USER_ID=user_id)

    response = client.post("/api/credit_trades",
                           content_type='application/json',
                           data=json.dumps(body))
    print('response code: {}'.format(response.status_code))
    print('had sent:\n{}'.format(json.dumps(body)))
    print('got back: {}'.format(response.content.decode('utf-8')))
    # print(response.content.decode("utf-8"))

    assert status.HTTP_201_CREATED == response.status_code
    response_data = json.loads(response.content.decode("utf-8"))
    return response_data
