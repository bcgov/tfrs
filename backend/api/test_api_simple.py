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
import django


from rest_framework import status

from . import fakedata
from .serializers import CreditTradeStatusSerializer
from .serializers import CreditTradeTypeSerializer
from .serializers import CreditTradeZeroReasonSerializer
from .serializers import OrganizationActionsTypeSerializer
from .serializers import OrganizationStatusSerializer
from .serializers import PermissionSerializer
from .serializers import RoleSerializer
from .serializers import UserSerializer

# Simple API test cases. 
# If an API operation contains generated code and requires a simple model object
# (one that is not complex, containing child items) then it is tested in this 
# file.
#
# See the file test_api_complex.py for other test cases, which must be hand 
# written.
class Test_Api_Simple(TestCase):
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

    def test_credittradestatusesBulkPost(self):
        # Test Bulk Load.
        payload = fakedata.CreditTradeStatusTestDataCreate()
        jsonString = "[]"
        response = self.client.post('/api/credittradestatuses/bulk',
                                    content_type='application/json',
                                    data=jsonString)
        # Check that the response is 200 OK.
        assert status.HTTP_201_CREATED == response.status_code

    def test_credittradestatusesGet(self):
        # Test Create and List operations.
        testUrl = "/api/credittradestatuses"
        # Create:
        serializer_class = CreditTradeStatusSerializer
        payload = fakedata.CreditTradeStatusTestDataCreate()
        jsonString = json.dumps(payload)
        response = self.client.post(testUrl, content_type='application/json',
                                    data=jsonString)
        # Check that the response is OK.
        assert status.HTTP_201_CREATED == response.status_code
        # parse the response.
        jsonString = response.content.decode("utf-8")
        data = json.loads(jsonString)
        createdId = data['id']
        # List:
        response = self.client.get(testUrl)
        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        # Cleanup:
        deleteUrl = testUrl + "/" + str(createdId) + "/delete"
        response = self.client.post(deleteUrl)
        # Check that the response is OK.
        assert status.HTTP_204_NO_CONTENT == response.status_code

    def test_credittradestatusesIdDeletePost(self):
        # Test Retrieve and Update operations.
        testUrl = "/api/credittradestatuses/(?P<id>[0-9]+)/delete"
        createUrl = testUrl.replace("/(?P<id>[0-9]+)/delete", "")
        # Create an object:
        payload = fakedata.CreditTradeStatusTestDataCreate()
        jsonString = json.dumps(payload)
        response = self.client.post(createUrl, content_type='application/json',
                                    data=jsonString)
        # Check that the response is OK.
        assert status.HTTP_201_CREATED == response.status_code
        # parse the response.
        jsonString = response.content.decode("utf-8")
        data = json.loads(jsonString)
        createdId = data['id']
        deleteUrl = testUrl.replace("(?P<id>[0-9]+)", str(createdId))
        response = self.client.post(deleteUrl)
        # Check that the response is OK.
        assert status.HTTP_204_NO_CONTENT == response.status_code

    def test_credittradestatusesIdGet(self):
        # Test Retrieve and Update operations.
        testUrl = "/api/credittradestatuses/(?P<id>[0-9]+)"
        createUrl = testUrl.replace("/(?P<id>[0-9]+)", "")
        # Create an object:
        payload = fakedata.CreditTradeStatusTestDataCreate()
        jsonString = json.dumps(payload)
        response = self.client.post(createUrl, content_type='application/json',
                                    data=jsonString)
        # Check that the response is OK.
        assert status.HTTP_201_CREATED == response.status_code
        # parse the response.
        jsonString = response.content.decode("utf-8")
        data = json.loads(jsonString)
        createdId = data['id']
        # Update the object:
        updateUrl = testUrl.replace("(?P<id>[0-9]+)", str(createdId))
        payload = fakedata.CreditTradeStatusTestDataUpdate()
        jsonString = json.dumps(payload)
        response = self.client.put(updateUrl, content_type='application/json',
                                   data=jsonString)
        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        # Cleanup:
        deleteUrl = createUrl + "/" + str(createdId) + "/delete"
        response = self.client.post(deleteUrl)
        # Check that the response is OK.
        assert status.HTTP_204_NO_CONTENT == response.status_code

    def test_credittradetypesBulkPost(self):
        # Test Bulk Load.
        payload = fakedata.CreditTradeTypeTestDataCreate()
        jsonString = "[]"
        response = self.client.post('/api/credittradetypes/bulk',
                                    content_type='application/json',
                                    data=jsonString)
        # Check that the response is 200 OK.
        assert status.HTTP_201_CREATED == response.status_code

    def test_credittradetypesGet(self):
        # Test Create and List operations.
        testUrl = "/api/credittradetypes"
        # Create:
        serializer_class = CreditTradeTypeSerializer
        payload = fakedata.CreditTradeTypeTestDataCreate()
        jsonString = json.dumps(payload)
        response = self.client.post(testUrl, content_type='application/json',
                                    data=jsonString)
        # Check that the response is OK.
        assert status.HTTP_201_CREATED == response.status_code
        # parse the response.
        jsonString = response.content.decode("utf-8")
        data = json.loads(jsonString)
        createdId = data['id']
        # List:
        response = self.client.get(testUrl)
        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        # Cleanup:
        deleteUrl = testUrl + "/" + str(createdId) + "/delete"
        response = self.client.post(deleteUrl)
        # Check that the response is OK.
        assert status.HTTP_204_NO_CONTENT == response.status_code

    def test_credittradetypesIdDeletePost(self):
        # Test Retrieve and Update operations.
        testUrl = "/api/credittradetypes/(?P<id>[0-9]+)/delete"
        createUrl = testUrl.replace("/(?P<id>[0-9]+)/delete", "")
        # Create an object:
        payload = fakedata.CreditTradeTypeTestDataCreate()
        jsonString = json.dumps(payload)
        response = self.client.post(createUrl, content_type='application/json',
                                    data=jsonString)
        # Check that the response is OK.
        assert status.HTTP_201_CREATED == response.status_code
        # parse the response.
        jsonString = response.content.decode("utf-8")
        data = json.loads(jsonString)
        createdId = data['id']
        deleteUrl = testUrl.replace("(?P<id>[0-9]+)", str(createdId))
        response = self.client.post(deleteUrl)
        # Check that the response is OK.
        assert status.HTTP_204_NO_CONTENT == response.status_code

    def test_credittradetypesIdGet(self):
        # Test Retrieve and Update operations.
        testUrl = "/api/credittradetypes/(?P<id>[0-9]+)"
        createUrl = testUrl.replace("/(?P<id>[0-9]+)", "")
        # Create an object:
        payload = fakedata.CreditTradeTypeTestDataCreate()
        jsonString = json.dumps(payload)
        response = self.client.post(createUrl, content_type='application/json',
                                    data=jsonString)
        # Check that the response is OK.
        assert status.HTTP_201_CREATED == response.status_code
        # parse the response.
        jsonString = response.content.decode("utf-8")
        data = json.loads(jsonString)
        createdId = data['id']
        # Update the object:
        updateUrl = testUrl.replace("(?P<id>[0-9]+)", str(createdId))
        payload = fakedata.CreditTradeTypeTestDataUpdate()
        jsonString = json.dumps(payload)
        response = self.client.put(updateUrl, content_type='application/json',
                                   data=jsonString)
        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        # Cleanup:
        deleteUrl = createUrl + "/" + str(createdId) + "/delete"
        response = self.client.post(deleteUrl)
        # Check that the response is OK.
        assert status.HTTP_204_NO_CONTENT == response.status_code

    def test_credittradezeroreasonBulkPost(self):
        # Test Bulk Load.
        payload = fakedata.CreditTradeZeroReasonTestDataCreate()
        jsonString = "[]"
        response = self.client.post('/api/credittradezeroreason/bulk',
                                    content_type='application/json',
                                    data=jsonString)
        # Check that the response is 200 OK.
        assert status.HTTP_201_CREATED == response.status_code

    def test_credittradezeroreasonGet(self):
        # Test Create and List operations.
        testUrl = "/api/credittradezeroreason"
        # Create:
        serializer_class = CreditTradeZeroReasonSerializer
        payload = fakedata.CreditTradeZeroReasonTestDataCreate()
        jsonString = json.dumps(payload)
        response = self.client.post(testUrl, content_type='application/json',
                                    data=jsonString)
        # Check that the response is OK.
        assert status.HTTP_201_CREATED == response.status_code
        # parse the response.
        jsonString = response.content.decode("utf-8")
        data = json.loads(jsonString)
        createdId = data['id']
        # List:
        response = self.client.get(testUrl)
        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        # Cleanup:
        deleteUrl = testUrl + "/" + str(createdId) + "/delete"
        response = self.client.post(deleteUrl)
        # Check that the response is OK.
        assert status.HTTP_204_NO_CONTENT == response.status_code

    def test_credittradezeroreasonIdDeletePost(self):
        # Test Retrieve and Update operations.
        testUrl = "/api/credittradezeroreason/(?P<id>[0-9]+)/delete"
        createUrl = testUrl.replace("/(?P<id>[0-9]+)/delete", "")
        # Create an object:
        payload = fakedata.CreditTradeZeroReasonTestDataCreate()
        jsonString = json.dumps(payload)
        response = self.client.post(createUrl, content_type='application/json',
                                    data=jsonString)
        # Check that the response is OK.
        assert status.HTTP_201_CREATED == response.status_code
        # parse the response.
        jsonString = response.content.decode("utf-8")
        data = json.loads(jsonString)
        createdId = data['id']
        deleteUrl = testUrl.replace("(?P<id>[0-9]+)", str(createdId))
        response = self.client.post(deleteUrl)
        # Check that the response is OK.
        assert status.HTTP_204_NO_CONTENT == response.status_code

    def test_credittradezeroreasonIdGet(self):
        # Test Retrieve and Update operations.
        testUrl = "/api/credittradezeroreason/(?P<id>[0-9]+)"
        createUrl = testUrl.replace("/(?P<id>[0-9]+)", "")
        # Create an object:
        payload = fakedata.CreditTradeZeroReasonTestDataCreate()
        jsonString = json.dumps(payload)
        response = self.client.post(createUrl, content_type='application/json',
                                    data=jsonString)
        # Check that the response is OK.
        assert status.HTTP_201_CREATED == response.status_code
        # parse the response.
        jsonString = response.content.decode("utf-8")
        data = json.loads(jsonString)
        createdId = data['id']
        # Update the object:
        updateUrl = testUrl.replace("(?P<id>[0-9]+)", str(createdId))
        payload = fakedata.CreditTradeZeroReasonTestDataUpdate()
        jsonString = json.dumps(payload)
        response = self.client.put(updateUrl, content_type='application/json',
                                   data=jsonString)
        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        # Cleanup:
        deleteUrl = createUrl + "/" + str(createdId) + "/delete"
        response = self.client.post(deleteUrl)
        # Check that the response is OK.
        assert status.HTTP_204_NO_CONTENT == response.status_code

    def test_organizationactionstypesBulkPost(self):
        # Test Bulk Load.
        payload = fakedata.OrganizationActionsTypeTestDataCreate()
        jsonString = "[]"
        response = self.client.post('/api/organization_actions_types/bulk',
                                    content_type='application/json',
                                    data=jsonString)
        # Check that the response is 200 OK.
        assert status.HTTP_201_CREATED == response.status_code

    def test_organizationactionstypesGet(self):
        # Test Create and List operations.
        testUrl = "/api/organization_actions_types"
        # Create:
        serializer_class = OrganizationActionsTypeSerializer
        payload = fakedata.OrganizationActionsTypeTestDataCreate()
        jsonString = json.dumps(payload)
        response = self.client.post(testUrl, content_type='application/json',
                                    data=jsonString)
        # Check that the response is OK.
        assert status.HTTP_201_CREATED == response.status_code
        # parse the response.
        jsonString = response.content.decode("utf-8")
        data = json.loads(jsonString)
        createdId = data['id']
        # List:
        response = self.client.get(testUrl)
        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        # Cleanup:
        deleteUrl = testUrl + "/" + str(createdId) + "/delete"
        response = self.client.post(deleteUrl)
        # Check that the response is OK.
        assert status.HTTP_204_NO_CONTENT == response.status_code

    def test_organizationactionstypesIdDeletePost(self):
        # Test Retrieve and Update operations.
        testUrl = "/api/organization_actions_types/(?P<id>[0-9]+)/delete"
        createUrl = testUrl.replace("/(?P<id>[0-9]+)/delete", "")
        # Create an object:
        payload = fakedata.OrganizationActionsTypeTestDataCreate()
        jsonString = json.dumps(payload)
        response = self.client.post(createUrl, content_type='application/json',
                                    data=jsonString)
        # Check that the response is OK.
        assert status.HTTP_201_CREATED == response.status_code
        # parse the response.
        jsonString = response.content.decode("utf-8")
        data = json.loads(jsonString)
        createdId = data['id']
        deleteUrl = testUrl.replace("(?P<id>[0-9]+)", str(createdId))
        response = self.client.post(deleteUrl)
        # Check that the response is OK.
        assert status.HTTP_204_NO_CONTENT == response.status_code

    def test_organizationactionstypesIdGet(self):
        # Test Retrieve and Update operations.
        testUrl = "/api/organization_actions_types/(?P<id>[0-9]+)"
        createUrl = testUrl.replace("/(?P<id>[0-9]+)", "")
        # Create an object:
        payload = fakedata.OrganizationActionsTypeTestDataCreate()
        jsonString = json.dumps(payload)
        response = self.client.post(createUrl, content_type='application/json',
                                    data=jsonString)
        # Check that the response is OK.
        assert status.HTTP_201_CREATED == response.status_code
        # parse the response.
        jsonString = response.content.decode("utf-8")
        data = json.loads(jsonString)
        createdId = data['id']
        # Update the object:
        updateUrl = testUrl.replace("(?P<id>[0-9]+)", str(createdId))
        payload = fakedata.OrganizationActionsTypeTestDataUpdate()
        jsonString = json.dumps(payload)
        response = self.client.put(updateUrl, content_type='application/json',
                                   data=jsonString)
        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        # Cleanup:
        deleteUrl = createUrl + "/" + str(createdId) + "/delete"
        response = self.client.post(deleteUrl)
        # Check that the response is OK.
        assert status.HTTP_204_NO_CONTENT == response.status_code

    def test_organizationstatusesBulkPost(self):
        # Test Bulk Load.
        payload = fakedata.OrganizationStatusTestDataCreate()
        jsonString = "[]"
        response = self.client.post('/api/organization_statuses/bulk',
                                    content_type='application/json',
                                    data=jsonString)
        # Check that the response is 200 OK.
        assert status.HTTP_201_CREATED == response.status_code

    def test_organizationstatusesGet(self):
        # Test Create and List operations.
        testUrl = "/api/organization_statuses"
        # Create:
        serializer_class = OrganizationStatusSerializer
        payload = fakedata.OrganizationStatusTestDataCreate()
        jsonString = json.dumps(payload)
        response = self.client.post(testUrl, content_type='application/json',
                                    data=jsonString)
        # Check that the response is OK.
        assert status.HTTP_201_CREATED == response.status_code
        # parse the response.
        jsonString = response.content.decode("utf-8")
        data = json.loads(jsonString)
        createdId = data['id']
        # List:
        response = self.client.get(testUrl)
        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        # Cleanup:
        deleteUrl = testUrl + "/" + str(createdId) + "/delete"
        response = self.client.post(deleteUrl)
        # Check that the response is OK.
        assert status.HTTP_204_NO_CONTENT == response.status_code

    def test_organizationstatusesIdDeletePost(self):
        # Test Retrieve and Update operations.
        testUrl = "/api/organization_statuses/(?P<id>[0-9]+)/delete"
        createUrl = testUrl.replace("/(?P<id>[0-9]+)/delete", "")
        # Create an object:
        payload = fakedata.OrganizationStatusTestDataCreate()
        jsonString = json.dumps(payload)
        response = self.client.post(createUrl, content_type='application/json',
                                    data=jsonString)
        # Check that the response is OK.
        assert status.HTTP_201_CREATED == response.status_code
        # parse the response.
        jsonString = response.content.decode("utf-8")
        data = json.loads(jsonString)
        createdId = data['id']
        deleteUrl = testUrl.replace("(?P<id>[0-9]+)", str(createdId))
        response = self.client.post(deleteUrl)
        # Check that the response is OK.
        assert status.HTTP_204_NO_CONTENT == response.status_code

    def test_organizationstatusesIdGet(self):
        # Test Retrieve and Update operations.
        testUrl = "/api/organization_statuses/(?P<id>[0-9]+)"
        createUrl = testUrl.replace("/(?P<id>[0-9]+)", "")
        # Create an object:
        payload = fakedata.OrganizationStatusTestDataCreate()
        jsonString = json.dumps(payload)
        response = self.client.post(createUrl, content_type='application/json',
                                    data=jsonString)
        # Check that the response is OK.
        assert status.HTTP_201_CREATED == response.status_code
        # parse the response.
        jsonString = response.content.decode("utf-8")
        data = json.loads(jsonString)
        createdId = data['id']
        # Update the object:
        updateUrl = testUrl.replace("(?P<id>[0-9]+)", str(createdId))
        payload = fakedata.OrganizationStatusTestDataUpdate()
        jsonString = json.dumps(payload)
        response = self.client.put(updateUrl, content_type='application/json',
                                   data=jsonString)
        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        # Cleanup:
        deleteUrl = createUrl + "/" + str(createdId) + "/delete"
        response = self.client.post(deleteUrl)
        # Check that the response is OK.
        assert status.HTTP_204_NO_CONTENT == response.status_code

    def test_permissionsBulkPost(self):
        # Test Bulk Load.
        payload = fakedata.PermissionTestDataCreate()
        jsonString = "[]"
        response = self.client.post('/api/permissions/bulk',
                                    content_type='application/json',
                                    data=jsonString)
        # Check that the response is 200 OK.
        assert status.HTTP_201_CREATED == response.status_code

    def test_permissionsGet(self):
        # Test Create and List operations.
        testUrl = "/api/permissions"
        # Create:
        serializer_class = PermissionSerializer
        payload = fakedata.PermissionTestDataCreate()
        jsonString = json.dumps(payload)
        response = self.client.post(testUrl, content_type='application/json',
                                    data=jsonString)
        # Check that the response is OK.
        assert status.HTTP_201_CREATED == response.status_code
        # parse the response.
        jsonString = response.content.decode("utf-8")
        data = json.loads(jsonString)
        createdId = data['id']
        # List:
        response = self.client.get(testUrl)
        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        # Cleanup:
        deleteUrl = testUrl + "/" + str(createdId) + "/delete"
        response = self.client.post(deleteUrl)
        # Check that the response is OK.
        assert status.HTTP_204_NO_CONTENT == response.status_code

    def test_permissionsIdDeletePost(self):
        # Test Retrieve and Update operations.
        testUrl = "/api/permissions/(?P<id>[0-9]+)/delete"
        createUrl = testUrl.replace("/(?P<id>[0-9]+)/delete", "")
        # Create an object:
        payload = fakedata.PermissionTestDataCreate()
        jsonString = json.dumps(payload)
        response = self.client.post(createUrl, content_type='application/json',
                                    data=jsonString)
        # Check that the response is OK.
        assert status.HTTP_201_CREATED == response.status_code
        # parse the response.
        jsonString = response.content.decode("utf-8")
        data = json.loads(jsonString)
        createdId = data['id']
        deleteUrl = testUrl.replace("(?P<id>[0-9]+)", str(createdId))
        response = self.client.post(deleteUrl)
        # Check that the response is OK.
        assert status.HTTP_204_NO_CONTENT == response.status_code

    def test_permissionsIdGet(self):
        # Test Retrieve and Update operations.
        testUrl = "/api/permissions/(?P<id>[0-9]+)"
        createUrl = testUrl.replace("/(?P<id>[0-9]+)", "")
        # Create an object:
        payload = fakedata.PermissionTestDataCreate()
        jsonString = json.dumps(payload)
        response = self.client.post(createUrl, content_type='application/json',
                                    data=jsonString)
        # Check that the response is OK.
        assert status.HTTP_201_CREATED == response.status_code
        # parse the response.
        jsonString = response.content.decode("utf-8")
        data = json.loads(jsonString)
        createdId = data['id']
        # Update the object:
        updateUrl = testUrl.replace("(?P<id>[0-9]+)", str(createdId))
        payload = fakedata.PermissionTestDataUpdate()
        jsonString = json.dumps(payload)
        response = self.client.put(updateUrl, content_type='application/json',
                                   data=jsonString)
        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        # Cleanup:
        deleteUrl = createUrl + "/" + str(createdId) + "/delete"
        response = self.client.post(deleteUrl)
        # Check that the response is OK.
        assert status.HTTP_204_NO_CONTENT == response.status_code

    def test_rolesBulkPost(self):
        # Test Bulk Load.
        payload = fakedata.RoleTestDataCreate()
        jsonString = "[]"
        response = self.client.post('/api/roles/bulk',
                                    content_type='application/json',
                                    data=jsonString)
        # Check that the response is 200 OK.
        assert status.HTTP_201_CREATED == response.status_code

    def test_rolesGet(self):
        # Test Create and List operations.
        testUrl = "/api/roles"
        # Create:
        serializer_class = RoleSerializer
        payload = fakedata.RoleTestDataCreate()
        jsonString = json.dumps(payload)
        response = self.client.post(testUrl, content_type='application/json',
                                    data=jsonString)
        # Check that the response is OK.
        assert status.HTTP_201_CREATED == response.status_code
        # parse the response.
        jsonString = response.content.decode("utf-8")
        data = json.loads(jsonString)
        createdId = data['id']
        # List:
        response = self.client.get(testUrl)
        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        # Cleanup:
        deleteUrl = testUrl + "/" + str(createdId) + "/delete"
        response = self.client.post(deleteUrl)
        # Check that the response is OK.
        assert status.HTTP_204_NO_CONTENT == response.status_code

    def test_rolesIdDeletePost(self):
        # Test Retrieve and Update operations.
        testUrl = "/api/roles/(?P<id>[0-9]+)/delete"
        createUrl = testUrl.replace("/(?P<id>[0-9]+)/delete", "")
        # Create an object:
        payload = fakedata.RoleTestDataCreate()
        jsonString = json.dumps(payload)
        response = self.client.post(createUrl, content_type='application/json',
                                    data=jsonString)
        # Check that the response is OK.
        assert status.HTTP_201_CREATED == response.status_code
        # parse the response.
        jsonString = response.content.decode("utf-8")
        data = json.loads(jsonString)
        createdId = data['id']
        deleteUrl = testUrl.replace("(?P<id>[0-9]+)", str(createdId))
        response = self.client.post(deleteUrl)
        # Check that the response is OK.
        assert status.HTTP_204_NO_CONTENT == response.status_code

    def test_rolesIdGet(self):
        # Test Retrieve and Update operations.
        testUrl = "/api/roles/(?P<id>[0-9]+)"
        createUrl = testUrl.replace("/(?P<id>[0-9]+)", "")
        # Create an object:
        payload = fakedata.RoleTestDataCreate()
        jsonString = json.dumps(payload)
        response = self.client.post(createUrl, content_type='application/json',
                                    data=jsonString)
        # Check that the response is OK.
        assert status.HTTP_201_CREATED == response.status_code
        # parse the response.
        jsonString = response.content.decode("utf-8")
        data = json.loads(jsonString)
        createdId = data['id']
        # Update the object:
        updateUrl = testUrl.replace("(?P<id>[0-9]+)", str(createdId))
        payload = fakedata.RoleTestDataUpdate()
        jsonString = json.dumps(payload)
        response = self.client.put(updateUrl, content_type='application/json',
                                   data=jsonString)
        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        # Cleanup:
        deleteUrl = createUrl + "/" + str(createdId) + "/delete"
        response = self.client.post(deleteUrl)
        # Check that the response is OK.
        assert status.HTTP_204_NO_CONTENT == response.status_code

    # def test_usersBulkPost(self):
    #     # Test Bulk Load.
    #     payload = fakedata.UserTestDataCreate()
    #     jsonString = "[]"
    #     response = self.client.post('/api/users/bulk',
    #                                 content_type='application/json',
    #                                 data=jsonString)
    #     # Check that the response is 200 OK.
    #     print(response.status_code)
    #     print(response.content.decode("utf-8"))
    #     assert status.HTTP_201_CREATED == response.status_code

    def test_usersGet(self):
        # Test Create and List operations.
        testUrl = "/api/users"
        # Create:
        serializer_class = UserSerializer
        payload = fakedata.UserTestDataCreate()
        jsonString = json.dumps(payload)
        response = self.client.post(testUrl, content_type='application/json',
                                    data=jsonString)
        # Check that the response is OK.
        assert status.HTTP_201_CREATED == response.status_code
        # parse the response.
        jsonString = response.content.decode("utf-8")
        data = json.loads(jsonString)
        createdId = data['id']
        # List:
        response = self.client.get(testUrl)
        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        # Cleanup:
        deleteUrl = testUrl + "/" + str(createdId) + "/delete"
        response = self.client.post(deleteUrl)
        # Check that the response is OK.
        assert status.HTTP_204_NO_CONTENT == response.status_code

    def test_usersIdDeletePost(self):
        # Test Retrieve and Update operations.
        testUrl = "/api/users/(?P<id>[0-9]+)/delete"
        createUrl = testUrl.replace("/(?P<id>[0-9]+)/delete", "")
        # Create an object:
        payload = fakedata.UserTestDataCreate()
        jsonString = json.dumps(payload)
        response = self.client.post(createUrl, content_type='application/json',
                                    data=jsonString)
        # Check that the response is OK.
        assert status.HTTP_201_CREATED == response.status_code
        # parse the response.
        jsonString = response.content.decode("utf-8")
        data = json.loads(jsonString)
        createdId = data['id']
        deleteUrl = testUrl.replace("(?P<id>[0-9]+)", str(createdId))
        response = self.client.post(deleteUrl)
        # Check that the response is OK.
        assert status.HTTP_204_NO_CONTENT == response.status_code

    def test_usersIdGet(self):
        # Test Retrieve and Update operations.
        testUrl = "/api/users/(?P<id>[0-9]+)"
        createUrl = testUrl.replace("/(?P<id>[0-9]+)", "")
        # Create an object:
        payload = fakedata.UserTestDataCreate()
        jsonString = json.dumps(payload)
        response = self.client.post(createUrl, content_type='application/json',
                                    data=jsonString)
        # Check that the response is OK.
        assert status.HTTP_201_CREATED == response.status_code
        # parse the response.
        jsonString = response.content.decode("utf-8")
        data = json.loads(jsonString)
        createdId = data['id']
        # Update the object:
        updateUrl = testUrl.replace("(?P<id>[0-9]+)", str(createdId))
        payload = fakedata.UserTestDataUpdate()
        jsonString = json.dumps(payload)
        response = self.client.put(updateUrl, content_type='application/json',
                                   data=jsonString)
        # print(response.status_code)
        # print(response.content.decode("utf-8"))
        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        # Cleanup:
        deleteUrl = createUrl + "/" + str(createdId) + "/delete"
        response = self.client.post(deleteUrl)
        # Check that the response is OK.
        assert status.HTTP_204_NO_CONTENT == response.status_code


if __name__ == '__main__':
    unittest.main()
