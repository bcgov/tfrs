"""
    REST API Documentation for the NRS TFRS Credit Trading Application

    The Transportation Fuels Reporting System is being designed to streamline compliance reporting for transportation fuel suppliers in accordance with the Renewable & Low Carbon Fuel Requirements Regulation.

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
from django.core.files.uploadedfile import SimpleUploadedFile
import django

from rest_framework import status

from . import fakedata


# Custom API test cases. 
# If an API operation does not contains generated code then it is tested in this 
# file.
#
class Test_Api_Custom(TestCase):
    fixtures = ['organization_types.json',
                'organization_government.json',
                'organization_balance_gov.json',
                'credit_trade_statuses.json',
                'organization_actions_types.json',
                'organization_statuses.json',
                'credit_trade_types.json',
                'test_users.json',
                ]

    def setUp(self):
        # Every test needs a client.
        self.client = Client(
            HTTP_SMGOV_USERGUID='c9804c52-05f1-4a6a-9d24-332d9d8be2a9',
            HTTP_SMAUTH_USERDISPLAYNAME='Brad Smith',
            HTTP_SMGOV_USEREMAIL='BradJSmith@cuvox.de',
            HTTP_SM_UNIVERSALID='BSmith')
        # needed to setup django
        django.setup()

    def createOrganizationStatus(self):
        testUrl = "/api/organization_statuses"
        payload = fakedata.OrganizationStatusTestDataCreate()
        payload['effective_date'] = '2017-01-01'
        jsonString = json.dumps(payload)
        response = self.client.post(testUrl, content_type='application/json', data=jsonString)
        # Check that the response is OK.
        assert status.HTTP_201_CREATED == response.status_code
        # parse the response.
        jsonString = response.content.decode("utf-8")
        data = json.loads(jsonString)
        createdId = data['id']
        return createdId

    def createOrganizationActionType(self):
        testUrl = "/api/organization_actions_types"
        payload = fakedata.OrganizationActionsTypeTestDataCreate()
        jsonString = json.dumps(payload)
        response = self.client.post(testUrl, content_type='application/json', data=jsonString)
        # Check that the response is OK.
        assert status.HTTP_201_CREATED == response.status_code
        # parse the response.
        jsonString = response.content.decode("utf-8")
        data = json.loads(jsonString)
        createdId = data['id']
        return createdId

    def createOrganization(self):
        statusId = self.createOrganizationStatus()
        actionsTypeId = self.createOrganizationActionType()

        testUrl = "/api/organizations"
        # Create:
        payload = {
          'name': "Initial",
          'created_date': '2000-01-01',
        #   'primaryContact': contactId ,
        #   'contacts': [contactId],
          'notes': [],
          'attachments': [],
          'history': [],
          'status': statusId,
          'actions_type': actionsTypeId,
        }
        jsonString = json.dumps(payload)
        response = self.client.post(testUrl, content_type='application/json', data=jsonString)
        # Check that the response is OK.
        assert status.HTTP_201_CREATED == response.status_code
        # parse the response.
        jsonString = response.content.decode("utf-8")
        data = json.loads(jsonString)
        createdId = data['id']
        return createdId, statusId, actionsTypeId

    def createRole(self):
        testUrl = "/api/roles"
        # Create:
        fakeRole = fakedata.RoleTestDataCreate()
        payload = {
          'name': fakeRole['name'],
          'description': fakeRole['description']
        }
        jsonString = json.dumps(payload)
        response = self.client.post(testUrl, content_type='application/json', data=jsonString)
        # Check that the response is OK.
        assert status.HTTP_201_CREATED == response.status_code
        # parse the response.
        jsonString = response.content.decode("utf-8")
        data = json.loads(jsonString)
        createdId = data['id']
        return createdId

    def createPermission(self):
        testUrl = "/api/permissions"
        # Create:
        fakePermission = fakedata.PermissionTestDataCreate()
        payload = {
          'code': fakePermission['code'],
          'name': fakePermission['name'],
          'description': fakePermission['description']
        }
        jsonString = json.dumps(payload)
        response = self.client.post(testUrl, content_type='application/json', data=jsonString)
        # Check that the response is OK.
        assert status.HTTP_201_CREATED == response.status_code
        # parse the response.
        jsonString = response.content.decode("utf-8")
        data = json.loads(jsonString)
        createdId = data['id']
        return createdId

    def createUser(self, organization_id):
        testUserUrl = "/api/users"
        # Create:
        fakeUser = fakedata.UserTestDataCreate()
        payload = {
          'firstName': fakeUser['first_name'],
          'lastName':fakeUser['last_name'],
          'email':fakeUser['email'],
          'status':'Active',
          'username': fakeUser['username'],
          'authorizationGuid':fakeUser['authorization_guid'],
          'authorizationDirectory':fakeUser['authorization_directory'],
          'organization': organization_id
        }
        jsonString = json.dumps(payload)
        response = self.client.post(testUserUrl, content_type='application/json', data=jsonString)
        # Check that the response is OK.
        assert status.HTTP_201_CREATED == response.status_code
        # parse the response.
        jsonString = response.content.decode("utf-8")
        data = json.loads(jsonString)

        user_headers = {
            'authorizationGuid': data['authorizationGuid'],
            'displayName': data['displayName'],
            'email': data['email'],
            'username': data['email'],
            'id': data['id']
        }
        return user_headers

    def createCreditTradeType(self):
        testUrl = "/api/credittradetypes"
        payload = fakedata.CreditTradeTypeTestDataCreate()
        payload['expiration_date'] = '2017-01-02'
        payload['effective_date'] = '2017-01-01'
        jsonString = json.dumps(payload)
        response = self.client.post(testUrl, content_type='application/json', data=jsonString)
        # Check that the response is OK.
        assert status.HTTP_201_CREATED == response.status_code
        # parse the response.
        jsonString = response.content.decode("utf-8")
        data = json.loads(jsonString)
        createdId = data['id']
        return createdId

    def createCreditTradeStatus(self):
        testUrl = "/api/credittradestatuses"
        payload = fakedata.CreditTradeStatusTestDataCreate()
        payload['effective_date'] = '2017-01-01'
        jsonString = json.dumps(payload)
        response = self.client.post(testUrl, content_type='application/json', data=jsonString)
        # Check that the response is OK.
        assert status.HTTP_201_CREATED == response.status_code
        # parse the response.
        jsonString = response.content.decode("utf-8")
        data = json.loads(jsonString)
        createdId = data['id']
        return createdId

    def createCreditTrade(self, organization_id, authorization_id):
        typeId = self.createCreditTradeType()
        statusId = self.createCreditTradeStatus()

        testUrl = "/api/credittrades"
        payload = {
          'status':'Active',
          'initiator':organization_id,
          'respondent': organization_id,
          'initiatorLastUpdateBy': authorization_id,
          'respondentLastUpdatedBy': None,
          'reviewedRejectedBy': None,
          'approvedRejectedBy': None,
          'cancelledBy': None,
          'tradeExecutionDate': '2017-01-01',
        #   TODO: replace transactionType
          'transactionType':'Type',
          'fairMarketValuePrice': '100.00',
          'notes':[],
          'attachments':[],
          'history':[],
          'type': typeId,
          'status': statusId,
          'respondent': organization_id,
        }
        fakeCreditTrade = fakedata.CreditTradeTestDataCreate()
        payload.update(fakeCreditTrade)
        jsonString = json.dumps(payload)
        response = self.client.post(testUrl, content_type='application/json', data=jsonString)
        # Check that the response is OK.
        assert status.HTTP_201_CREATED == response.status_code
        # parse the response.
        jsonString = response.content.decode("utf-8")
        data = json.loads(jsonString)
        createdId = data['id']
        return createdId, typeId, statusId

        return createdId

    def deleteRole(self, role_id):
        deleteUrl = "/api/roles/" + str(role_id) + "/delete"
        response = self.client.post(deleteUrl)
        # Check that the response is OK.
        assert status.HTTP_204_NO_CONTENT == response.status_code

    def deleteUser(self, authorization_id):
        deleteUrl = "/api/users/" + str(authorization_id) + "/delete"
        response = self.client.post(deleteUrl)
        # Check that the response is OK
        assert status.HTTP_204_NO_CONTENT == response.status_code

    def deleteOrganization(self, organization_id):
        deleteUrl = "/api/organizations/" + str(organization_id) + "/delete"
        response = self.client.put(deleteUrl)
        # Check that the response is OK.
        assert status.HTTP_204_NO_CONTENT == response.status_code

    def deleteCreditTrade(self, creditTradeId):
        deleteUrl = "/api/credittrades/" + str(creditTradeId) + "/delete"
        response = self.client.post(deleteUrl)
        # Check that the response is OK.
        assert status.HTTP_204_NO_CONTENT == response.status_code

    def deletePermission(self, permission_id):
        deleteUrl = "/api/permissions/" + str(permission_id) + "/delete"
        response = self.client.post(deleteUrl)
        # Check that the response is OK.
        assert status.HTTP_204_NO_CONTENT == response.status_code

    def test_credittradesSearchGet(self):
        fsId, _, _ = self.createOrganization()
        user = self.createUser(fsId)
        credId, credTypeId, _ = self.createCreditTrade(fsId, user.get('id'))

        testUrl = "/api/credittrades/search"
        response = self.client.get(testUrl)
        assert status.HTTP_200_OK == response.status_code

        jsonString = response.content.decode("utf-8")
        data = json.loads(jsonString)
        assert len(data) == 1

        self.deleteCreditTrade(credId)
        self.deleteUser(user.get('id'))
        self.deleteOrganization(fsId)

    def test_usersCurrentGet(self):
        organization_id, statusId, actionId = self.createOrganization()
        user = self.createUser(organization_id)

        testUrl="/api/users/current"
        # List:
        response = self.client.get(testUrl)
        assert status.HTTP_200_OK == response.status_code
        self.deleteUser (user.get('id'))
        self.deleteOrganization(organization_id)


    def test_organizationsSearchGet(self):
        organization_id, statusId, actionId = self.createOrganization()

        # do a search
        testUrl = "/api/organizations/search"
        response = self.client.get(testUrl)
        # Check that the response is OK.
        assert status.HTTP_200_OK == response.status_code
        # parse the response.
        jsonString = response.content.decode("utf-8")
        data = json.loads(jsonString)
        # Cleanup

    def test_rolesIdPermissionsGet(self):
        # create a group.
        role_id = self.createRole()
        # create a permission.
        permission_id = self.createPermission()

        rolePermissionUrl = "/api/roles/" + str(role_id) + "/permissions"
        # create a new group membership.
        payload = {'role':role_id, 'permission':permission_id}
        jsonString = json.dumps(payload)
        response = self.client.post(rolePermissionUrl,content_type='application/json', data=jsonString)
        assert status.HTTP_200_OK == response.status_code
        jsonString = response.content.decode("utf-8")
        data = json.loads(jsonString)
        rolePermissionId = data['id']

        # test the get
        response = self.client.get(rolePermissionUrl)
        assert status.HTTP_200_OK == response.status_code

        # test the put.  This will also delete the RolePermission.
        payload = []
        jsonString = json.dumps(payload)
        response = self.client.put(rolePermissionUrl,content_type='application/json', data=jsonString)
        assert status.HTTP_200_OK == response.status_code

        # cleanup

        self.deleteRole(role_id)
        self.deletePermission(permission_id)

    def test_rolesIdUsersGet(self):
        role_id = self.createRole()
        organization_id, statusId, actionId = self.createOrganization()
        user = self.createUser(organization_id)

        userRoleUrl = "/api/users/" + str(user.get('id')) + "/roles"
        # create a new UserRole.
        payload = {
            'effective_date': '2000-01-01',
            'expiration_date': None,
            'user': user.get('id'),
            'role': role_id
        }
        jsonString = json.dumps(payload)
        response = self.client.post(userRoleUrl,content_type='application/json', data=jsonString)
        assert status.HTTP_200_OK == response.status_code

        # test the get
        response = self.client.get(userRoleUrl)
        assert status.HTTP_200_OK == response.status_code

        testUrl = "/api/roles/" + str(role_id)
        # get the users in the group.
        response = self.client.get(testUrl)
        # Check that the response is OK.
        assert status.HTTP_200_OK == response.status_code
        # parse the response.
        jsonString = response.content.decode("utf-8")
        data = json.loads(jsonString)

        # test the PUT - this will clear the user role map.
        payload = []
        jsonString = json.dumps(payload)
        response = self.client.put(userRoleUrl,content_type='application/json', data=jsonString)
        assert status.HTTP_200_OK == response.status_code

        # cleanup
        self.deleteRole(role_id)
        self.deleteUser(user.get('id'))
        self.deleteOrganization(organization_id)

    def test_usersIdPermissionsGet(self):
        # create a user.
        organization_id, statusId, actionId = self.createOrganization()
        user = self.createUser(organization_id)

        # create a credit trade

        # notificationEventId = self.createUser(organization_id)

        # assign permissions to the user.
        #TODO add that.

        userPermissionUrl = "/api/users/" + str(user.get('id')) + "/permissions"

        # test the Get
        response = self.client.get(userPermissionUrl)
        assert status.HTTP_200_OK == response.status_code

        # cleanup
        self.deleteUser(user.get('id'))
        self.deleteOrganization(organization_id)

    def test_usersIdRolesGet(self):
        fsId, _, _= self.createOrganization()
        user = self.createUser(fsId)
        role_id = self.createRole()

        url = "/api/users/" + str(user.get('id')) + "/roles"
        payload = fakedata.UserRoleTestDataCreate()
        payload['user'] = user.get('id')
        payload['role'] = role_id
        jsonString = json.dumps(payload)
        response = self.client.post(url, content_type='application/json', data=jsonString)

        assert response.status_code == status.HTTP_200_OK

        response = self.client.get(url)

        assert response.status_code == status.HTTP_200_OK

        payload = [fakedata.UserRoleTestDataUpdate()]
        payload[0]['user'] = user.get('id')
        payload[0]['role'] = role_id
        jsonString = json.dumps(payload)
        response = self.client.put(url, content_type='application/json', data=jsonString)

        assert response.status_code == status.HTTP_200_OK

        jsonString = response.content.decode("utf-8")
        data = json.loads(jsonString)

        assert data[0]['user'] == user.get('id')
        assert data[0]['role'] == role_id

        self.deleteRole(role_id)
        self.deleteUser(user.get('id'))
        self.deleteOrganization(fsId)

    def test_usersSearchGet(self):
        organization_id, statusId, actionId = self.createOrganization()
        user = self.createUser(organization_id)

        # do a search
        testUrl = "/api/users/search"
        response = self.client.get(testUrl)
        # Check that the response is OK.
        assert status.HTTP_200_OK == response.status_code
        # parse the response.
        jsonString = response.content.decode("utf-8")
        data = json.loads(jsonString)
        # Cleanup
        self.deleteUser(user.get('id'))
        self.deleteOrganization(organization_id)

    def test_createCreditTradeNegativeNumberOfCredits(self):
        fsId, _, _ = self.createOrganization()
        user = self.createUser(fsId)
        typeId = self.createCreditTradeType()
        statusId = self.createCreditTradeStatus()

        testUrl = "/api/credittrades"
        payload = {
          'status': statusId,
          'type': typeId,
          'fairMarketValuePrice': '100.00',
          'historySet':[],
          'initiator': fsId,
          'respondent': fsId,
          'trade_effective_date': '2017-01-01',
        }
        fakeCreditTrade = fakedata.CreditTradeTestDataCreate()
        payload.update(fakeCreditTrade)
        payload['number_of_credits'] = -1
        jsonString = json.dumps(payload)
        response = self.client.post(testUrl, content_type='application/json', data=jsonString)
        # Check that the response is OK.
        assert status.HTTP_422_UNPROCESSABLE_ENTITY == response.status_code

        self.deleteUser(user.get('id'))
        self.deleteOrganization(fsId)

if __name__ == '__main__':
    unittest.main()




