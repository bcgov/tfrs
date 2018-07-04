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
from django.test import TestCase
from django.test import Client
import django

from rest_framework import status

from api.models.Role import Role
from api.models.User import User
from api.models.UserRole import UserRole

from . import fakedata


class TestApiCustom(TestCase):
    """
    Custom API test cases.
    If an API operation does not contains generated code then it is tested in
    this file.
    """
    fixtures = ['organization_types.json',
                'organization_government.json',
                'organization_balance_gov.json',
                'credit_trade_statuses.json',
                'credit_trade_statuses_refused.json',
                'organization_actions_types.json',
                'organization_statuses.json',
                'credit_trade_types.json',
                'test_organization_fuel_suppliers.json',
                'test_users.json',
                'roles.json',
                'permissions.json',
                'roles_permissions.json',
                'roles_permissions_v0.3.0.json',
                'roles_permissions_v0.3.1.json',
                'test_fakedata_permissions_assignment.json',
                'test_prodlike_government_users_and_roles.json']

    def setUp(self):
        # Every test needs a client.
        self.client = Client(
            HTTP_SMGOV_USERGUID='c9804c52-05f1-4a6a-9d24-332d9d8be2a9',
            HTTP_SMAUTH_USERDISPLAYNAME='Brad Smith',
            HTTP_SMGOV_USEREMAIL='BradJSmith@cuvox.de',
            HTTP_SM_UNIVERSALID='BSmith')
        # needed to setup django

        # Government client for elevated privileges
        self.gov_client = Client(
            HTTP_SMGOV_USERGUID='c2971372-3a96-4704-9b9c-18e4e9298ee3',
            HTTP_SMGOV_USERDISPLAYNAME='Test Person',
            HTTP_SMGOV_USEREMAIL='Test.Person@gov.bc.ca',
            HTTP_SM_UNIVERSALID='Teperson',
            HTTP_SMGOV_USERTYPE='Internal',
            HTTP_SM_AUTHDIRNAME='IDIR')

        # Apply a government role to Teperson
        gov_user = User.objects.get(username='internal_teperson')
        gov_role = Role.objects.get(name='GovDirector')
        UserRole.objects.create(user_id=gov_user.id, role_id=gov_role.id)

        django.setup()

    def createOrganizationStatus(self):
        """
        Test Create Organization Status
        """
        test_url = "/api/organization_statuses"
        payload = fakedata.OrganizationStatusTestDataCreate()
        payload['effective_date'] = '2017-01-01'
        json_string = json.dumps(payload)
        response = self.client.post(test_url, content_type='application/json',
                                    data=json_string)
        # Check that the response is OK.
        assert status.HTTP_201_CREATED == response.status_code
        # parse the response.
        json_string = response.content.decode("utf-8")
        data = json.loads(json_string)
        created_idd = data['id']
        return created_idd

    def createOrganizationActionType(self):
        """
        Test Create Organization Action Type
        """
        test_url = "/api/organization_actions_types"
        payload = fakedata.OrganizationActionsTypeTestDataCreate()
        json_string = json.dumps(payload)
        response = self.client.post(test_url, content_type='application/json',
                                    data=json_string)
        # Check that the response is OK.
        assert status.HTTP_201_CREATED == response.status_code
        # parse the response.
        json_string = response.content.decode("utf-8")
        data = json.loads(json_string)
        created_id = data['id']
        return created_id

    def createOrganization(self):
        """
        Test Create Organization
        """
        status_id = self.createOrganizationStatus()
        actions_type_id = self.createOrganizationActionType()

        test_url = "/api/organizations"
        # Create:
        payload = {
            'name': "Initial",
            'created_date': '2000-01-01',
            'notes': [],
            'attachments': [],
            'history': [],
            'status': status_id,
            'actions_type': actions_type_id,
        }
        json_string = json.dumps(payload)
        response = self.client.post(test_url, content_type='application/json',
                                    data=json_string)
        # Check that the response is OK.
        self.assertEqual(status.HTTP_201_CREATED, response.status_code)
        # parse the response.
        json_string = response.content.decode("utf-8")
        data = json.loads(json_string)
        created_id = data['id']
        return created_id, status_id, actions_type_id

    def createRole(self):
        """
        Test Create Role
        """
        test_url = "/api/roles"
        # Create:
        fake_role = fakedata.RoleTestDataCreate()
        payload = {
            'name': fake_role['name'],
            'description': fake_role['description']
        }
        json_string = json.dumps(payload)
        response = self.client.post(test_url, content_type='application/json',
                                    data=json_string)
        # Check that the response is OK.
        self.assertEqual(status.HTTP_201_CREATED, response.status_code)
        # parse the response.
        json_string = response.content.decode("utf-8")
        data = json.loads(json_string)
        created_id = data['id']
        return created_id

    def createPermission(self):
        """
        Test Create Permission
        """
        test_url = "/api/permissions"
        # Create:
        fake_permission = fakedata.PermissionTestDataCreate()
        payload = {
            'code': fake_permission['code'],
            'name': fake_permission['name'],
            'description': fake_permission['description']
        }
        json_string = json.dumps(payload)
        response = self.client.post(test_url, content_type='application/json',
                                    data=json_string)
        # Check that the response is OK.
        self.assertEqual(status.HTTP_201_CREATED, response.status_code)
        # parse the response.
        json_string = response.content.decode("utf-8")
        data = json.loads(json_string)
        created_id = data['id']
        return created_id

    def createUser(self, organization_id):
        """
        Test Create User
        """
        test_user_url = "/api/users"
        # Create:
        fake_user = fakedata.UserTestDataCreate()
        payload = {
            'firstName': fake_user['first_name'],
            'lastName': fake_user['last_name'],
            'email': fake_user['email'],
            'status': 'Active',
            'username': fake_user['username'],
            'authorizationGuid': fake_user['authorization_guid'],
            'authorizationDirectory': fake_user['authorization_directory'],
            'organization': organization_id
        }
        json_string = json.dumps(payload)
        response = self.client.post(test_user_url,
                                    content_type='application/json',
                                    data=json_string)
        # Check that the response is OK.
        self.assertEqual(status.HTTP_201_CREATED, response.status_code)
        # parse the response.
        json_string = response.content.decode("utf-8")
        data = json.loads(json_string)

        id = data['id']
        user = User.objects.get(id=id)

        user_headers = {
            'authorizationGuid': user.authorization_guid,
            'displayName': user.display_name,
            'email': user.email,
            'username': user.username,
            'id': id
        }

        print("user headers:\n{}".format(json.dumps(user_headers)))
        return user_headers

    def createCreditTradeType(self):
        """
        Test Create Credit Trade Type
        """
        test_url = "/api/credittradetypes"
        payload = fakedata.CreditTradeTypeTestDataCreate()
        payload['expiration_date'] = '2017-01-02'
        payload['effective_date'] = '2017-01-01'
        json_string = json.dumps(payload)
        response = self.client.post(test_url, content_type='application/json',
                                    data=json_string)
        # Check that the response is OK.
        self.assertEqual(status.HTTP_201_CREATED, response.status_code)
        # parse the response.
        json_string = response.content.decode("utf-8")
        data = json.loads(json_string)
        created_id = data['id']
        print("create ctype:\n{}".format(json.dumps(data)))
        return created_id

    def createCreditTradeStatus(self):
        """
        Test Create Credit Trade Status
        """
        test_url = "/api/credittradestatuses"
        payload = fakedata.CreditTradeStatusTestDataCreate()
        payload['effective_date'] = '2017-01-01'
        json_string = json.dumps(payload)
        response = self.client.post(test_url, content_type='application/json',
                                    data=json_string)
        # Check that the response is OK.
        self.assertEqual(status.HTTP_201_CREATED, response.status_code)
        # parse the response.
        json_string = response.content.decode("utf-8")
        data = json.loads(json_string)
        created_id = data['id']
        print("create ctstatus:\n{}".format(json.dumps(data)))
        return created_id

    def createCreditTrade(self, organization_id, authorization_id):
        """
        Test Create Credit Trade
        """
        type_id = self.createCreditTradeType()
        status_id = self.createCreditTradeStatus()

        test_url = "/api/credittrades"
        payload = {
            'status': 'Active',
            'initiator': organization_id,
            'respondent': organization_id,
            'initiatorLastUpdateBy': authorization_id,
            'respondentLastUpdatedBy': None,
            'reviewedRejectedBy': None,
            'approvedRejectedBy': None,
            'cancelledBy': None,
            'tradeExecutionDate': '2017-01-01',
            # TODO: replace transactionType
            'transactionType': 'Type',
            'fairMarketValuePrice': '100.00',
            'notes': [],
            'attachments': [],
            'history': [],
            'type': type_id,
            'status': status_id,
            'respondent': organization_id,
        }
        fake_credit_trade = fakedata.CreditTradeTestDataCreate()
        payload.update(fake_credit_trade)
        json_string = json.dumps(payload)
        response = self.client.post(test_url, content_type='application/json',
                                    data=json_string)
        # Check that the response is OK.
        self.assertEqual(status.HTTP_201_CREATED, response.status_code)
        # parse the response.
        json_string = response.content.decode("utf-8")
        data = json.loads(json_string)
        created_id = data['id']
        print("create ct:\n{}".format(json.dumps(data)))

        return created_id, type_id, status_id

    def deleteRole(self, role_id):
        """
        Test Delete Role
        """
        delete_url = "/api/roles/" + str(role_id) + "/delete"
        response = self.client.post(delete_url)
        # Check that the response is OK.
        assert status.HTTP_204_NO_CONTENT == response.status_code

    def deleteUser(self, authorization_id):
        """
        Test Delete User
        """
        delete_url = "/api/users/" + str(authorization_id) + "/delete"
        response = self.gov_client.post(delete_url)
        # Check that the response is OK
        assert status.HTTP_204_NO_CONTENT == response.status_code

    def deleteOrganization(self, organization_id):
        """
        Test Delete Organization
        """
        delete_url = "/api/organizations/" + str(organization_id) + "/delete"
        response = self.gov_client.put(delete_url)
        # Check that the response is OK.
        assert status.HTTP_204_NO_CONTENT == response.status_code

    def deleteCreditTrade(self, creditTradeId):
        """
        Test Credit Trade
        """
        delete_url = "/api/credittrades/" + str(creditTradeId) + "/delete"
        response = self.client.post(delete_url)
        # Check that the response is OK.
        assert status.HTTP_204_NO_CONTENT == response.status_code

    def deletePermission(self, permission_id):
        """
        Test Delete Permission
        """
        delete_url = "/api/permissions/" + str(permission_id) + "/delete"
        response = self.client.post(delete_url)
        # Check that the response is OK.
        assert status.HTTP_204_NO_CONTENT == response.status_code

    def test_credittradesSearchGet(self):
        """
        Test Search Credit Trade
        """
        fs_id, _, _ = self.createOrganization()
        user = self.createUser(fs_id)
        cred_id, *_ = self.createCreditTrade(fs_id,
                                             user.get('id'))

        test_url = "/api/credittrades/search"
        response = self.client.get(test_url)
        assert status.HTTP_200_OK == response.status_code

        json_string = response.content.decode("utf-8")
        data = json.loads(json_string)
        assert len(data) == 1

        self.deleteCreditTrade(cred_id)
        self.deleteUser(user.get('id'))
        self.deleteOrganization(fs_id)

    def test_usersCurrentGet(self):
        """
        Test Get Logged-in User
        """
        organization_id, *_ = self.createOrganization()
        user = self.createUser(organization_id)

        test_url = "/api/users/current"
        # List:
        response = self.client.get(test_url)
        assert status.HTTP_200_OK == response.status_code
        self.deleteUser(user.get('id'))
        self.deleteOrganization(organization_id)

    def test_rolesIdPermissionsGet(self):
        """
        Test Get Role Permissions
        """
        # create a group.
        role_id = self.createRole()
        # create a permission.
        permission_id = self.createPermission()

        role_permission_url = "/api/roles/" + str(role_id) + "/permissions"
        # create a new group membership.
        payload = {'role': role_id, 'permission': permission_id}
        json_string = json.dumps(payload)
        response = self.client.post(role_permission_url,
                                    content_type='application/json',
                                    data=json_string)
        assert status.HTTP_200_OK == response.status_code
        json_string = response.content.decode("utf-8")

        # test the get
        response = self.client.get(role_permission_url)
        assert status.HTTP_200_OK == response.status_code

        # test the put.  This will also delete the RolePermission.
        payload = []
        json_string = json.dumps(payload)
        response = self.client.put(role_permission_url,
                                   content_type='application/json',
                                   data=json_string)
        assert status.HTTP_200_OK == response.status_code

        # cleanup

        self.deleteRole(role_id)
        self.deletePermission(permission_id)

    def test_rolesIdUsersGet(self):
        """
        Test Get User Roles
        """
        role_id = self.createRole()
        organization_id, *_ = self.createOrganization()
        user = self.createUser(organization_id)

        user_role_url = "/api/users/" + str(user.get('id')) + "/roles"
        # create a new UserRole.
        payload = {
            'effective_date': '2000-01-01',
            'expiration_date': None,
            'user': user.get('id'),
            'role': role_id
        }
        json_string = json.dumps(payload)
        response = self.client.post(user_role_url,
                                    content_type='application/json',
                                    data=json_string)
        assert status.HTTP_200_OK == response.status_code

        # test the get
        response = self.client.get(user_role_url)
        assert status.HTTP_200_OK == response.status_code

        test_url = "/api/roles/" + str(role_id)
        # get the users in the group.
        response = self.client.get(test_url)
        # Check that the response is OK.
        assert status.HTTP_200_OK == response.status_code
        # parse the response.
        json_string = response.content.decode("utf-8")

        # test the PUT - this will clear the user role map.
        payload = []
        json_string = json.dumps(payload)
        response = self.client.put(user_role_url,
                                   content_type='application/json',
                                   data=json_string)
        assert status.HTTP_200_OK == response.status_code

        # cleanup
        self.deleteRole(role_id)
        self.deleteUser(user.get('id'))
        self.deleteOrganization(organization_id)

    def test_usersIdPermissionsGet(self):
        """
        Test Get User Permissions
        """
        # create a user.
        organization_id, _, _ = self.createOrganization()
        user = self.createUser(organization_id)

        # create a credit trade

        # notificationEventId = self.createUser(organization_id)

        # assign permissions to the user.
        # TODO add that.

        permission_url = "/api/users/" + str(user.get('id')) + "/permissions"

        # test the Get
        response = self.client.get(permission_url)
        assert status.HTTP_200_OK == response.status_code

        # cleanup
        self.deleteUser(user.get('id'))
        self.deleteOrganization(organization_id)

    def test_usersSearchGet(self):
        """
        Test Search Users
        """
        organization_id, *_ = self.createOrganization()
        user = self.createUser(organization_id)

        # do a search
        test_url = "/api/users/search"
        response = self.client.get(test_url)
        # Check that the response is OK.
        assert status.HTTP_200_OK == response.status_code

        # Cleanup
        self.deleteUser(user.get('id'))
        self.deleteOrganization(organization_id)

    def test_createCreditTradeNegativeNumberOfCredits(self):
        """
        Test Create Credit Trade with Negative Number of Credits
        """
        fs_id, _, _ = self.createOrganization()
        user = self.createUser(fs_id)
        type_id = self.createCreditTradeType()
        status_id = self.createCreditTradeStatus()

        test_url = "/api/credittrades"
        payload = {
            'status': status_id,
            'type': type_id,
            'fairMarketValuePrice': '100.00',
            'historySet': [],
            'initiator': fs_id,
            'respondent': fs_id,
            'trade_effective_date': '2017-01-01',
        }
        fake_credit_trade = fakedata.CreditTradeTestDataCreate()
        payload.update(fake_credit_trade)
        payload['number_of_credits'] = -1
        json_string = json.dumps(payload)
        response = self.client.post(test_url, content_type='application/json',
                                    data=json_string)
        # Check that the response is OK.
        assert status.HTTP_422_UNPROCESSABLE_ENTITY == response.status_code

        self.deleteUser(user.get('id'))
        self.deleteOrganization(fs_id)

if __name__ == '__main__':
    unittest.main()
