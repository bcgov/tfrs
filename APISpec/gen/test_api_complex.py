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

from rest_framework.test import APIRequestFactory
from rest_framework.parsers import JSONParser
from rest_framework import status

from . import fakedata
from .models.Attachment import Attachment
from .serializers import AttachmentSerializer
from .models.AttachmentViewModel import AttachmentViewModel
from .serializers import AttachmentViewModelSerializer
from .models.Audit import Audit
from .serializers import AuditSerializer
from .models.Contact import Contact
from .serializers import ContactSerializer
from .models.CreditTrade import CreditTrade
from .serializers import CreditTradeSerializer
from .models.CreditTradeLogEntry import CreditTradeLogEntry
from .serializers import CreditTradeLogEntrySerializer
from .models.CurrentUserViewModel import CurrentUserViewModel
from .serializers import CurrentUserViewModelSerializer
from .models.FuelSupplier import FuelSupplier
from .serializers import FuelSupplierSerializer
from .models.Group import Group
from .serializers import GroupSerializer
from .models.GroupMembership import GroupMembership
from .serializers import GroupMembershipSerializer
from .models.GroupMembershipViewModel import GroupMembershipViewModel
from .serializers import GroupMembershipViewModelSerializer
from .models.GroupViewModel import GroupViewModel
from .serializers import GroupViewModelSerializer
from .models.History import History
from .serializers import HistorySerializer
from .models.HistoryViewModel import HistoryViewModel
from .serializers import HistoryViewModelSerializer
from .models.LookupList import LookupList
from .serializers import LookupListSerializer
from .models.Note import Note
from .serializers import NoteSerializer
from .models.Notification import Notification
from .serializers import NotificationSerializer
from .models.NotificationEvent import NotificationEvent
from .serializers import NotificationEventSerializer
from .models.NotificationViewModel import NotificationViewModel
from .serializers import NotificationViewModelSerializer
from .models.Offer import Offer
from .serializers import OfferSerializer
from .models.Permission import Permission
from .serializers import PermissionSerializer
from .models.PermissionViewModel import PermissionViewModel
from .serializers import PermissionViewModelSerializer
from .models.Role import Role
from .serializers import RoleSerializer
from .models.RolePermission import RolePermission
from .serializers import RolePermissionSerializer
from .models.RolePermissionViewModel import RolePermissionViewModel
from .serializers import RolePermissionViewModelSerializer
from .models.RoleViewModel import RoleViewModel
from .serializers import RoleViewModelSerializer
from .models.User import User
from .serializers import UserSerializer
from .models.UserDetailsViewModel import UserDetailsViewModel
from .serializers import UserDetailsViewModelSerializer
from .models.UserFavourite import UserFavourite
from .serializers import UserFavouriteSerializer
from .models.UserFavouriteViewModel import UserFavouriteViewModel
from .serializers import UserFavouriteViewModelSerializer
from .models.UserRole import UserRole
from .serializers import UserRoleSerializer
from .models.UserRoleViewModel import UserRoleViewModel
from .serializers import UserRoleViewModelSerializer
from .models.UserViewModel import UserViewModel
from .serializers import UserViewModelSerializer


# Complex API test cases. 
# If an API operation contains generated code and requires a complex model object
# (containing child items) then it is tested in this file.
#
# This file will have to be edited by hand.
class Test_Api_Complex(TestCase):

    def setUp(self):
        # Every test needs a client.
        self.client = Client()
        # needed to setup django
        django.setup()


    def test_credittradesBulkPost(self):
        # Test Bulk Load.
        payload = fakedata.CreditTradeTestDataCreate()
        jsonString = "[]"
        response = self.client.post('/api/credittrades/bulk',content_type='application/json', data=jsonString)
        # Check that the response is 200 OK.
        assert status.HTTP_201_CREATED == response.status_code
        

    def test_credittradesGet(self):
        # Test Create and List operations.
        testUrl = "/api/credittrades"
        # Create:
        serializer_class = CreditTradeSerializer
        payload = fakedata.CreditTradeTestDataCreate()
        jsonString = json.dumps(payload)
        response = self.client.post(testUrl, content_type='application/json', data=jsonString)
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
        

    def test_credittradesIdDeletePost(self):
        # Test Retrieve and Update operations.
        testUrl = "/api/credittrades/(?P<id>[0-9]+)/delete"
        createUrl = testUrl.replace ("/(?P<id>[0-9]+)/delete","")
        # Create an object:
        payload = fakedata.CreditTradeTestDataCreate()
        jsonString = json.dumps(payload)
        response = self.client.post(createUrl, content_type='application/json', data=jsonString)
        # Check that the response is OK.
        assert status.HTTP_201_CREATED == response.status_code
        # parse the response.
        jsonString = response.content.decode("utf-8")
        data = json.loads(jsonString)
        createdId = data['id']
        deleteUrl = testUrl.replace ("(?P<id>[0-9]+)",str(createdId))
        response = self.client.post(deleteUrl)
        # Check that the response is OK.
        assert status.HTTP_204_NO_CONTENT == response.status_code
        

    def test_credittradesIdGet(self):
        # Test Retrieve and Update operations.
        testUrl = "/api/credittrades/(?P<id>[0-9]+)"
        createUrl = testUrl.replace ("/(?P<id>[0-9]+)","")
        # Create an object:
        payload = fakedata.CreditTradeTestDataCreate()
        jsonString = json.dumps(payload)
        response = self.client.post(createUrl, content_type='application/json', data=jsonString)
        # Check that the response is OK.
        assert status.HTTP_201_CREATED == response.status_code
        # parse the response.
        jsonString = response.content.decode("utf-8")
        data = json.loads(jsonString)
        createdId = data['id']
        # Update the object:
        updateUrl = testUrl.replace ("(?P<id>[0-9]+)",str(createdId))
        payload = fakedata.CreditTradeTestDataUpdate()
        jsonString = json.dumps(payload)
        response = self.client.put(updateUrl, content_type='application/json', data=jsonString)
        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        # Cleanup:
        deleteUrl = createUrl + "/" + str(createdId) + "/delete"
        response = self.client.post(deleteUrl)
        # Check that the response is OK.
        assert status.HTTP_204_NO_CONTENT == response.status_code
        

    def test_credittradetradelogentriesBulkPost(self):
        # Test Bulk Load.
        payload = fakedata.CreditTradeLogEntryTestDataCreate()
        jsonString = "[]"
        response = self.client.post('/api/credittradetradelogentries/bulk',content_type='application/json', data=jsonString)
        # Check that the response is 200 OK.
        assert status.HTTP_201_CREATED == response.status_code
        

    def test_credittradetradelogentriesGet(self):
        # Test Create and List operations.
        testUrl = "/api/credittradetradelogentries"
        # Create:
        serializer_class = CreditTradeLogEntrySerializer
        payload = fakedata.CreditTradeLogEntryTestDataCreate()
        jsonString = json.dumps(payload)
        response = self.client.post(testUrl, content_type='application/json', data=jsonString)
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
        

    def test_credittradetradelogentriesIdDeletePost(self):
        # Test Retrieve and Update operations.
        testUrl = "/api/credittradetradelogentries/(?P<id>[0-9]+)/delete"
        createUrl = testUrl.replace ("/(?P<id>[0-9]+)/delete","")
        # Create an object:
        payload = fakedata.CreditTradeLogEntryTestDataCreate()
        jsonString = json.dumps(payload)
        response = self.client.post(createUrl, content_type='application/json', data=jsonString)
        # Check that the response is OK.
        assert status.HTTP_201_CREATED == response.status_code
        # parse the response.
        jsonString = response.content.decode("utf-8")
        data = json.loads(jsonString)
        createdId = data['id']
        deleteUrl = testUrl.replace ("(?P<id>[0-9]+)",str(createdId))
        response = self.client.post(deleteUrl)
        # Check that the response is OK.
        assert status.HTTP_204_NO_CONTENT == response.status_code
        

    def test_credittradetradelogentriesIdGet(self):
        # Test Retrieve and Update operations.
        testUrl = "/api/credittradetradelogentries/(?P<id>[0-9]+)"
        createUrl = testUrl.replace ("/(?P<id>[0-9]+)","")
        # Create an object:
        payload = fakedata.CreditTradeLogEntryTestDataCreate()
        jsonString = json.dumps(payload)
        response = self.client.post(createUrl, content_type='application/json', data=jsonString)
        # Check that the response is OK.
        assert status.HTTP_201_CREATED == response.status_code
        # parse the response.
        jsonString = response.content.decode("utf-8")
        data = json.loads(jsonString)
        createdId = data['id']
        # Update the object:
        updateUrl = testUrl.replace ("(?P<id>[0-9]+)",str(createdId))
        payload = fakedata.CreditTradeLogEntryTestDataUpdate()
        jsonString = json.dumps(payload)
        response = self.client.put(updateUrl, content_type='application/json', data=jsonString)
        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        # Cleanup:
        deleteUrl = createUrl + "/" + str(createdId) + "/delete"
        response = self.client.post(deleteUrl)
        # Check that the response is OK.
        assert status.HTTP_204_NO_CONTENT == response.status_code
        

    def test_fuelsuppliersBulkPost(self):
        # Test Bulk Load.
        payload = fakedata.FuelSupplierTestDataCreate()
        jsonString = "[]"
        response = self.client.post('/api/fuelsuppliers/bulk',content_type='application/json', data=jsonString)
        # Check that the response is 200 OK.
        assert status.HTTP_201_CREATED == response.status_code
        

    def test_fuelsuppliersGet(self):
        # Test Create and List operations.
        testUrl = "/api/fuelsuppliers"
        # Create:
        serializer_class = FuelSupplierSerializer
        payload = fakedata.FuelSupplierTestDataCreate()
        jsonString = json.dumps(payload)
        response = self.client.post(testUrl, content_type='application/json', data=jsonString)
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
        

    def test_fuelsuppliersIdDeletePost(self):
        # Test Retrieve and Update operations.
        testUrl = "/api/fuelsuppliers/(?P<id>[0-9]+)/delete"
        createUrl = testUrl.replace ("/(?P<id>[0-9]+)/delete","")
        # Create an object:
        payload = fakedata.FuelSupplierTestDataCreate()
        jsonString = json.dumps(payload)
        response = self.client.post(createUrl, content_type='application/json', data=jsonString)
        # Check that the response is OK.
        assert status.HTTP_201_CREATED == response.status_code
        # parse the response.
        jsonString = response.content.decode("utf-8")
        data = json.loads(jsonString)
        createdId = data['id']
        deleteUrl = testUrl.replace ("(?P<id>[0-9]+)",str(createdId))
        response = self.client.post(deleteUrl)
        # Check that the response is OK.
        assert status.HTTP_204_NO_CONTENT == response.status_code
        

    def test_fuelsuppliersIdGet(self):
        # Test Retrieve and Update operations.
        testUrl = "/api/fuelsuppliers/(?P<id>[0-9]+)"
        createUrl = testUrl.replace ("/(?P<id>[0-9]+)","")
        # Create an object:
        payload = fakedata.FuelSupplierTestDataCreate()
        jsonString = json.dumps(payload)
        response = self.client.post(createUrl, content_type='application/json', data=jsonString)
        # Check that the response is OK.
        assert status.HTTP_201_CREATED == response.status_code
        # parse the response.
        jsonString = response.content.decode("utf-8")
        data = json.loads(jsonString)
        createdId = data['id']
        # Update the object:
        updateUrl = testUrl.replace ("(?P<id>[0-9]+)",str(createdId))
        payload = fakedata.FuelSupplierTestDataUpdate()
        jsonString = json.dumps(payload)
        response = self.client.put(updateUrl, content_type='application/json', data=jsonString)
        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        # Cleanup:
        deleteUrl = createUrl + "/" + str(createdId) + "/delete"
        response = self.client.post(deleteUrl)
        # Check that the response is OK.
        assert status.HTTP_204_NO_CONTENT == response.status_code
        

    def test_groupmembershipsBulkPost(self):
        # Test Bulk Load.
        payload = fakedata.GroupMembershipTestDataCreate()
        jsonString = "[]"
        response = self.client.post('/api/groupmemberships/bulk',content_type='application/json', data=jsonString)
        # Check that the response is 200 OK.
        assert status.HTTP_201_CREATED == response.status_code
        

    def test_groupmembershipsGet(self):
        # Test Create and List operations.
        testUrl = "/api/groupmemberships"
        # Create:
        serializer_class = GroupMembershipSerializer
        payload = fakedata.GroupMembershipTestDataCreate()
        jsonString = json.dumps(payload)
        response = self.client.post(testUrl, content_type='application/json', data=jsonString)
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
        

    def test_groupmembershipsIdDeletePost(self):
        # Test Retrieve and Update operations.
        testUrl = "/api/groupmemberships/(?P<id>[0-9]+)/delete"
        createUrl = testUrl.replace ("/(?P<id>[0-9]+)/delete","")
        # Create an object:
        payload = fakedata.GroupMembershipTestDataCreate()
        jsonString = json.dumps(payload)
        response = self.client.post(createUrl, content_type='application/json', data=jsonString)
        # Check that the response is OK.
        assert status.HTTP_201_CREATED == response.status_code
        # parse the response.
        jsonString = response.content.decode("utf-8")
        data = json.loads(jsonString)
        createdId = data['id']
        deleteUrl = testUrl.replace ("(?P<id>[0-9]+)",str(createdId))
        response = self.client.post(deleteUrl)
        # Check that the response is OK.
        assert status.HTTP_204_NO_CONTENT == response.status_code
        

    def test_groupmembershipsIdGet(self):
        # Test Retrieve and Update operations.
        testUrl = "/api/groupmemberships/(?P<id>[0-9]+)"
        createUrl = testUrl.replace ("/(?P<id>[0-9]+)","")
        # Create an object:
        payload = fakedata.GroupMembershipTestDataCreate()
        jsonString = json.dumps(payload)
        response = self.client.post(createUrl, content_type='application/json', data=jsonString)
        # Check that the response is OK.
        assert status.HTTP_201_CREATED == response.status_code
        # parse the response.
        jsonString = response.content.decode("utf-8")
        data = json.loads(jsonString)
        createdId = data['id']
        # Update the object:
        updateUrl = testUrl.replace ("(?P<id>[0-9]+)",str(createdId))
        payload = fakedata.GroupMembershipTestDataUpdate()
        jsonString = json.dumps(payload)
        response = self.client.put(updateUrl, content_type='application/json', data=jsonString)
        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        # Cleanup:
        deleteUrl = createUrl + "/" + str(createdId) + "/delete"
        response = self.client.post(deleteUrl)
        # Check that the response is OK.
        assert status.HTTP_204_NO_CONTENT == response.status_code
        

    def test_notificationsBulkPost(self):
        # Test Bulk Load.
        payload = fakedata.NotificationTestDataCreate()
        jsonString = "[]"
        response = self.client.post('/api/notifications/bulk',content_type='application/json', data=jsonString)
        # Check that the response is 200 OK.
        assert status.HTTP_201_CREATED == response.status_code
        

    def test_notificationsGet(self):
        # Test Create and List operations.
        testUrl = "/api/notifications"
        # Create:
        serializer_class = NotificationSerializer
        payload = fakedata.NotificationTestDataCreate()
        jsonString = json.dumps(payload)
        response = self.client.post(testUrl, content_type='application/json', data=jsonString)
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
        

    def test_notificationsIdDeletePost(self):
        # Test Retrieve and Update operations.
        testUrl = "/api/notifications/(?P<id>[0-9]+)/delete"
        createUrl = testUrl.replace ("/(?P<id>[0-9]+)/delete","")
        # Create an object:
        payload = fakedata.NotificationTestDataCreate()
        jsonString = json.dumps(payload)
        response = self.client.post(createUrl, content_type='application/json', data=jsonString)
        # Check that the response is OK.
        assert status.HTTP_201_CREATED == response.status_code
        # parse the response.
        jsonString = response.content.decode("utf-8")
        data = json.loads(jsonString)
        createdId = data['id']
        deleteUrl = testUrl.replace ("(?P<id>[0-9]+)",str(createdId))
        response = self.client.post(deleteUrl)
        # Check that the response is OK.
        assert status.HTTP_204_NO_CONTENT == response.status_code
        

    def test_notificationsIdGet(self):
        # Test Retrieve and Update operations.
        testUrl = "/api/notifications/(?P<id>[0-9]+)"
        createUrl = testUrl.replace ("/(?P<id>[0-9]+)","")
        # Create an object:
        payload = fakedata.NotificationTestDataCreate()
        jsonString = json.dumps(payload)
        response = self.client.post(createUrl, content_type='application/json', data=jsonString)
        # Check that the response is OK.
        assert status.HTTP_201_CREATED == response.status_code
        # parse the response.
        jsonString = response.content.decode("utf-8")
        data = json.loads(jsonString)
        createdId = data['id']
        # Update the object:
        updateUrl = testUrl.replace ("(?P<id>[0-9]+)",str(createdId))
        payload = fakedata.NotificationTestDataUpdate()
        jsonString = json.dumps(payload)
        response = self.client.put(updateUrl, content_type='application/json', data=jsonString)
        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        # Cleanup:
        deleteUrl = createUrl + "/" + str(createdId) + "/delete"
        response = self.client.post(deleteUrl)
        # Check that the response is OK.
        assert status.HTTP_204_NO_CONTENT == response.status_code
        

    def test_notificationeventsBulkPost(self):
        # Test Bulk Load.
        payload = fakedata.NotificationEventTestDataCreate()
        jsonString = "[]"
        response = self.client.post('/api/notificationevents/bulk',content_type='application/json', data=jsonString)
        # Check that the response is 200 OK.
        assert status.HTTP_201_CREATED == response.status_code
        

    def test_notificationeventsGet(self):
        # Test Create and List operations.
        testUrl = "/api/notificationevents"
        # Create:
        serializer_class = NotificationEventSerializer
        payload = fakedata.NotificationEventTestDataCreate()
        jsonString = json.dumps(payload)
        response = self.client.post(testUrl, content_type='application/json', data=jsonString)
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
        

    def test_notificationeventsIdDeletePost(self):
        # Test Retrieve and Update operations.
        testUrl = "/api/notificationevents/(?P<id>[0-9]+)/delete"
        createUrl = testUrl.replace ("/(?P<id>[0-9]+)/delete","")
        # Create an object:
        payload = fakedata.NotificationEventTestDataCreate()
        jsonString = json.dumps(payload)
        response = self.client.post(createUrl, content_type='application/json', data=jsonString)
        # Check that the response is OK.
        assert status.HTTP_201_CREATED == response.status_code
        # parse the response.
        jsonString = response.content.decode("utf-8")
        data = json.loads(jsonString)
        createdId = data['id']
        deleteUrl = testUrl.replace ("(?P<id>[0-9]+)",str(createdId))
        response = self.client.post(deleteUrl)
        # Check that the response is OK.
        assert status.HTTP_204_NO_CONTENT == response.status_code
        

    def test_notificationeventsIdGet(self):
        # Test Retrieve and Update operations.
        testUrl = "/api/notificationevents/(?P<id>[0-9]+)"
        createUrl = testUrl.replace ("/(?P<id>[0-9]+)","")
        # Create an object:
        payload = fakedata.NotificationEventTestDataCreate()
        jsonString = json.dumps(payload)
        response = self.client.post(createUrl, content_type='application/json', data=jsonString)
        # Check that the response is OK.
        assert status.HTTP_201_CREATED == response.status_code
        # parse the response.
        jsonString = response.content.decode("utf-8")
        data = json.loads(jsonString)
        createdId = data['id']
        # Update the object:
        updateUrl = testUrl.replace ("(?P<id>[0-9]+)",str(createdId))
        payload = fakedata.NotificationEventTestDataUpdate()
        jsonString = json.dumps(payload)
        response = self.client.put(updateUrl, content_type='application/json', data=jsonString)
        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        # Cleanup:
        deleteUrl = createUrl + "/" + str(createdId) + "/delete"
        response = self.client.post(deleteUrl)
        # Check that the response is OK.
        assert status.HTTP_204_NO_CONTENT == response.status_code
        

    def test_offersBulkPost(self):
        # Test Bulk Load.
        payload = fakedata.OfferTestDataCreate()
        jsonString = "[]"
        response = self.client.post('/api/offers/bulk',content_type='application/json', data=jsonString)
        # Check that the response is 200 OK.
        assert status.HTTP_201_CREATED == response.status_code
        

    def test_offersGet(self):
        # Test Create and List operations.
        testUrl = "/api/offers"
        # Create:
        serializer_class = OfferSerializer
        payload = fakedata.OfferTestDataCreate()
        jsonString = json.dumps(payload)
        response = self.client.post(testUrl, content_type='application/json', data=jsonString)
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
        

    def test_offersIdDeletePost(self):
        # Test Retrieve and Update operations.
        testUrl = "/api/offers/(?P<id>[0-9]+)/delete"
        createUrl = testUrl.replace ("/(?P<id>[0-9]+)/delete","")
        # Create an object:
        payload = fakedata.OfferTestDataCreate()
        jsonString = json.dumps(payload)
        response = self.client.post(createUrl, content_type='application/json', data=jsonString)
        # Check that the response is OK.
        assert status.HTTP_201_CREATED == response.status_code
        # parse the response.
        jsonString = response.content.decode("utf-8")
        data = json.loads(jsonString)
        createdId = data['id']
        deleteUrl = testUrl.replace ("(?P<id>[0-9]+)",str(createdId))
        response = self.client.post(deleteUrl)
        # Check that the response is OK.
        assert status.HTTP_204_NO_CONTENT == response.status_code
        

    def test_offersIdGet(self):
        # Test Retrieve and Update operations.
        testUrl = "/api/offers/(?P<id>[0-9]+)"
        createUrl = testUrl.replace ("/(?P<id>[0-9]+)","")
        # Create an object:
        payload = fakedata.OfferTestDataCreate()
        jsonString = json.dumps(payload)
        response = self.client.post(createUrl, content_type='application/json', data=jsonString)
        # Check that the response is OK.
        assert status.HTTP_201_CREATED == response.status_code
        # parse the response.
        jsonString = response.content.decode("utf-8")
        data = json.loads(jsonString)
        createdId = data['id']
        # Update the object:
        updateUrl = testUrl.replace ("(?P<id>[0-9]+)",str(createdId))
        payload = fakedata.OfferTestDataUpdate()
        jsonString = json.dumps(payload)
        response = self.client.put(updateUrl, content_type='application/json', data=jsonString)
        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        # Cleanup:
        deleteUrl = createUrl + "/" + str(createdId) + "/delete"
        response = self.client.post(deleteUrl)
        # Check that the response is OK.
        assert status.HTTP_204_NO_CONTENT == response.status_code
        

    def test_rolepermissionsBulkPost(self):
        # Test Bulk Load.
        payload = fakedata.RolePermissionTestDataCreate()
        jsonString = "[]"
        response = self.client.post('/api/rolepermissions/bulk',content_type='application/json', data=jsonString)
        # Check that the response is 200 OK.
        assert status.HTTP_201_CREATED == response.status_code
        

    def test_rolepermissionsGet(self):
        # Test Create and List operations.
        testUrl = "/api/rolepermissions"
        # Create:
        serializer_class = RolePermissionSerializer
        payload = fakedata.RolePermissionTestDataCreate()
        jsonString = json.dumps(payload)
        response = self.client.post(testUrl, content_type='application/json', data=jsonString)
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
        

    def test_rolepermissionsIdDeletePost(self):
        # Test Retrieve and Update operations.
        testUrl = "/api/rolepermissions/(?P<id>[0-9]+)/delete"
        createUrl = testUrl.replace ("/(?P<id>[0-9]+)/delete","")
        # Create an object:
        payload = fakedata.RolePermissionTestDataCreate()
        jsonString = json.dumps(payload)
        response = self.client.post(createUrl, content_type='application/json', data=jsonString)
        # Check that the response is OK.
        assert status.HTTP_201_CREATED == response.status_code
        # parse the response.
        jsonString = response.content.decode("utf-8")
        data = json.loads(jsonString)
        createdId = data['id']
        deleteUrl = testUrl.replace ("(?P<id>[0-9]+)",str(createdId))
        response = self.client.post(deleteUrl)
        # Check that the response is OK.
        assert status.HTTP_204_NO_CONTENT == response.status_code
        

    def test_rolepermissionsIdGet(self):
        # Test Retrieve and Update operations.
        testUrl = "/api/rolepermissions/(?P<id>[0-9]+)"
        createUrl = testUrl.replace ("/(?P<id>[0-9]+)","")
        # Create an object:
        payload = fakedata.RolePermissionTestDataCreate()
        jsonString = json.dumps(payload)
        response = self.client.post(createUrl, content_type='application/json', data=jsonString)
        # Check that the response is OK.
        assert status.HTTP_201_CREATED == response.status_code
        # parse the response.
        jsonString = response.content.decode("utf-8")
        data = json.loads(jsonString)
        createdId = data['id']
        # Update the object:
        updateUrl = testUrl.replace ("(?P<id>[0-9]+)",str(createdId))
        payload = fakedata.RolePermissionTestDataUpdate()
        jsonString = json.dumps(payload)
        response = self.client.put(updateUrl, content_type='application/json', data=jsonString)
        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        # Cleanup:
        deleteUrl = createUrl + "/" + str(createdId) + "/delete"
        response = self.client.post(deleteUrl)
        # Check that the response is OK.
        assert status.HTTP_204_NO_CONTENT == response.status_code
        

    def test_usersBulkPost(self):
        # Test Bulk Load.
        payload = fakedata.UserTestDataCreate()
        jsonString = "[]"
        response = self.client.post('/api/users/bulk',content_type='application/json', data=jsonString)
        # Check that the response is 200 OK.
        assert status.HTTP_201_CREATED == response.status_code
        

    def test_usersGet(self):
        # Test Create and List operations.
        testUrl = "/api/users"
        # Create:
        serializer_class = UserSerializer
        payload = fakedata.UserTestDataCreate()
        jsonString = json.dumps(payload)
        response = self.client.post(testUrl, content_type='application/json', data=jsonString)
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
        createUrl = testUrl.replace ("/(?P<id>[0-9]+)/delete","")
        # Create an object:
        payload = fakedata.UserTestDataCreate()
        jsonString = json.dumps(payload)
        response = self.client.post(createUrl, content_type='application/json', data=jsonString)
        # Check that the response is OK.
        assert status.HTTP_201_CREATED == response.status_code
        # parse the response.
        jsonString = response.content.decode("utf-8")
        data = json.loads(jsonString)
        createdId = data['id']
        deleteUrl = testUrl.replace ("(?P<id>[0-9]+)",str(createdId))
        response = self.client.post(deleteUrl)
        # Check that the response is OK.
        assert status.HTTP_204_NO_CONTENT == response.status_code
        

    def test_usersIdGet(self):
        # Test Retrieve and Update operations.
        testUrl = "/api/users/(?P<id>[0-9]+)"
        createUrl = testUrl.replace ("/(?P<id>[0-9]+)","")
        # Create an object:
        payload = fakedata.UserTestDataCreate()
        jsonString = json.dumps(payload)
        response = self.client.post(createUrl, content_type='application/json', data=jsonString)
        # Check that the response is OK.
        assert status.HTTP_201_CREATED == response.status_code
        # parse the response.
        jsonString = response.content.decode("utf-8")
        data = json.loads(jsonString)
        createdId = data['id']
        # Update the object:
        updateUrl = testUrl.replace ("(?P<id>[0-9]+)",str(createdId))
        payload = fakedata.UserTestDataUpdate()
        jsonString = json.dumps(payload)
        response = self.client.put(updateUrl, content_type='application/json', data=jsonString)
        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        # Cleanup:
        deleteUrl = createUrl + "/" + str(createdId) + "/delete"
        response = self.client.post(deleteUrl)
        # Check that the response is OK.
        assert status.HTTP_204_NO_CONTENT == response.status_code
        

    def test_userrolesBulkPost(self):
        # Test Bulk Load.
        payload = fakedata.UserRoleTestDataCreate()
        jsonString = "[]"
        response = self.client.post('/api/userroles/bulk',content_type='application/json', data=jsonString)
        # Check that the response is 200 OK.
        assert status.HTTP_201_CREATED == response.status_code
        

    def test_userrolesGet(self):
        # Test Create and List operations.
        testUrl = "/api/userroles"
        # Create:
        serializer_class = UserRoleSerializer
        payload = fakedata.UserRoleTestDataCreate()
        jsonString = json.dumps(payload)
        response = self.client.post(testUrl, content_type='application/json', data=jsonString)
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
        

    def test_userrolesIdDeletePost(self):
        # Test Retrieve and Update operations.
        testUrl = "/api/userroles/(?P<id>[0-9]+)/delete"
        createUrl = testUrl.replace ("/(?P<id>[0-9]+)/delete","")
        # Create an object:
        payload = fakedata.UserRoleTestDataCreate()
        jsonString = json.dumps(payload)
        response = self.client.post(createUrl, content_type='application/json', data=jsonString)
        # Check that the response is OK.
        assert status.HTTP_201_CREATED == response.status_code
        # parse the response.
        jsonString = response.content.decode("utf-8")
        data = json.loads(jsonString)
        createdId = data['id']
        deleteUrl = testUrl.replace ("(?P<id>[0-9]+)",str(createdId))
        response = self.client.post(deleteUrl)
        # Check that the response is OK.
        assert status.HTTP_204_NO_CONTENT == response.status_code
        

    def test_userrolesIdGet(self):
        # Test Retrieve and Update operations.
        testUrl = "/api/userroles/(?P<id>[0-9]+)"
        createUrl = testUrl.replace ("/(?P<id>[0-9]+)","")
        # Create an object:
        payload = fakedata.UserRoleTestDataCreate()
        jsonString = json.dumps(payload)
        response = self.client.post(createUrl, content_type='application/json', data=jsonString)
        # Check that the response is OK.
        assert status.HTTP_201_CREATED == response.status_code
        # parse the response.
        jsonString = response.content.decode("utf-8")
        data = json.loads(jsonString)
        createdId = data['id']
        # Update the object:
        updateUrl = testUrl.replace ("(?P<id>[0-9]+)",str(createdId))
        payload = fakedata.UserRoleTestDataUpdate()
        jsonString = json.dumps(payload)
        response = self.client.put(updateUrl, content_type='application/json', data=jsonString)
        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        # Cleanup:
        deleteUrl = createUrl + "/" + str(createdId) + "/delete"
        response = self.client.post(deleteUrl)
        # Check that the response is OK.
        assert status.HTTP_204_NO_CONTENT == response.status_code
        

if __name__ == '__main__':
    unittest.main()




