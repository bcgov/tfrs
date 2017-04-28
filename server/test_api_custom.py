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


# Custom API test cases. 
# If an API operation does not contains generated code then it is tested in this 
# file.
#
class Test_Api_Custom(TestCase):

    def setUp(self):
        # Every test needs a client.
        self.client = Client()
        # needed to setup django
        django.setup()

    # following functions are used by the complex tests to create / delete dependent objects

    def createContact(self):
        testContactUrl = "/api/contacts"
        # Create:        
        payload = fakedata.ContactTestDataCreate()
        jsonString = json.dumps(payload)
        response = self.client.post(testContactUrl, content_type='application/json', data=jsonString)
        # Check that the response is OK.
        assert status.HTTP_201_CREATED == response.status_code
        # parse the response.
        jsonString = response.content.decode("utf-8")
        data = json.loads(jsonString)
        contactId = data['id']
        return contactId

    def createGroup(self):
        testGroupUrl = "/api/groups"
        payload = fakedata.GroupTestDataCreate()
        jsonString = json.dumps(payload)
        response = self.client.post(testGroupUrl, content_type='application/json', data=jsonString)
        # Check that the response is OK.
        assert status.HTTP_201_CREATED == response.status_code
        # parse the response.
        jsonString = response.content.decode("utf-8")
        data = json.loads(jsonString)
        contactId = data['id']
        return contactId

    def createCompliancePeriod(self):
        testUrl = "/api/complianceperiods"
        # Create:        
        payload = fakedata.CompliancePeriodTestDataCreate()
        jsonString = json.dumps(payload)
        response = self.client.post(testUrl, content_type='application/json', data=jsonString)
        # Check that the response is OK.
        assert status.HTTP_201_CREATED == response.status_code
        # parse the response.
        jsonString = response.content.decode("utf-8")
        data = json.loads(jsonString)
        createdId = data['id']
        return createdId

    def createFuelSupplier(self, contactId):
        testUrl = "/api/fuelsuppliers"
        # Create:        
        payload = {
          'name': "Initial",
          'status': "Initial",
          'dateCreated': '2000-01-01',   
          'primaryContact': contactId ,
          'contacts': [contactId],
          'notes': [],          
          'attachments': [],   
          'history': []
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

    def createUser(self, fuelsupplierId):
        testUserUrl = "/api/users"
        # Create:        
        fakeUser = fakedata.UserTestDataCreate()
        payload = {            
          'givenName': fakeUser['givenName'],
          'surname':fakeUser['surname'],
          'initials':fakeUser['initials'],
          'email':fakeUser['email'],
          'status':'Active',
          'smUserId':fakeUser['smUserId'],
          'guid':fakeUser['guid'],
          'smAuthorizationDirectory':fakeUser['smAuthorizationDirectory'],
          'fuelSupplier': fuelsupplierId
        }
        jsonString = json.dumps(payload)
        response = self.client.post(testUserUrl, content_type='application/json', data=jsonString)
        # Check that the response is OK.
        assert status.HTTP_201_CREATED == response.status_code
        # parse the response.
        jsonString = response.content.decode("utf-8")
        data = json.loads(jsonString)
        userId = data['id']
        return userId

    def createCreditTrade(self, fuelSupplierId, userId):
        testUrl = "/api/credittrades"
        fakeCreditTrade = fakedata.CreditTradeTestDataCreate()
        payload = {
          'status':fakeCreditTrade['status'],          
          'fuelSupplier':fuelSupplierId,
          'transactionPartnerFuelSupplier': fuelSupplierId,
          'fuelSupplierLastUpdatedBy': userId,
          'partnerLastUpdatedBy': None,
          'reviewedRejectedBy': None,
          'approvedRejectedBy': None,
          'cancelledBy': None,
          'tradeExecutionDate': '2017-01-01',
          'transactionType':fakeCreditTrade['transactionType'],
          'numberOfCredits':fakeCreditTrade['numberOfCredits'],
          'fairMarketValuePrice': '100.00', 
          'fuelSupplierBalanceAtTransactionTime':'2017-01-01',
          'notes':[],
          'attachments':[],
          'history':[]
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

    def createOffer(self, fuelSupplierId):
        testUrl = "/api/offers"
        fakeOffer = fakedata.OfferTestDataCreate()
        payload = {
          'fuelSupplier':fuelSupplierId,
          'status': fakeOffer['status'],
          'buyOrSell': fakeOffer['buyOrSell'],
          'numberOfCredits': fakeOffer['numberOfCredits'],
          'numberOfViews': fakeOffer['numberOfViews'], 
          'datePosted': '2017-01-01',
          'note': fakeOffer['note'], 
          'history':[]
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
    
    def createNotificationEvent(self, creditTradeId, offerId):
        testUrl = "/api/notificationevents"
        fakeNotificationEvent = fakedata.NotificationEventTestDataCreate()
        payload = {            
          'eventTime': '2017-01-01',
          'eventTypeCode': fakeNotificationEvent['eventTypeCode'],
          'notes': fakeNotificationEvent['notes'], 
          'creditTrade':creditTradeId,
          'offer': offerId          
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

    def deleteContact(self, contactId):
        # cleanup the contact.        
        deleteUrl = "/api/contacts/" + str(contactId) + "/delete"
        response = self.client.post(deleteUrl)
        # Check that the response is OK.
        assert status.HTTP_204_NO_CONTENT == response.status_code
    
    def deleteCreditTrade(self, creditTradeId):
        deleteUrl = "/api/credittrades/" + str(creditTradeId) + "/delete"
        response = self.client.post(deleteUrl)
        # Check that the response is OK.
        assert status.HTTP_204_NO_CONTENT == response.status_code

    def deleteFuelSupplier(self, fuelsupplierId):
        deleteUrl = "/api/fuelsuppliers/" + str(fuelsupplierId) + "/delete"
        response = self.client.post(deleteUrl)
        # Check that the response is OK.
        assert status.HTTP_204_NO_CONTENT == response.status_code

    def deleteGroup(self, groupId):
        deleteUrl = "/api/groups/" + str(groupId) + "/delete"
        response = self.client.post(deleteUrl)
        # Check that the response is OK.
        assert status.HTTP_204_NO_CONTENT == response.status_code

    def deleteRole(self, roleId):
        deleteUrl = "/api/roles/" + str(roleId) + "/delete"
        response = self.client.post(deleteUrl)
        # Check that the response is OK.
        assert status.HTTP_204_NO_CONTENT == response.status_code

    def deleteRolePermission(self, rolePermissionId):
        deleteUrl = "/api/rolepermissions/" + str(rolePermissionId) + "/delete"
        response = self.client.post(deleteUrl)
        # Check that the response is OK.
        assert status.HTTP_204_NO_CONTENT == response.status_code

    def deleteOffer(self, offerId):
        deleteUrl = "/api/offers/" + str(offerId) + "/delete"
        response = self.client.post(deleteUrl)
        # Check that the response is OK.
        assert status.HTTP_204_NO_CONTENT == response.status_code

    def deletePermission(self, permissionId):
        deleteUrl = "/api/permissions/" + str(permissionId) + "/delete"
        response = self.client.post(deleteUrl)
        # Check that the response is OK.
        assert status.HTTP_204_NO_CONTENT == response.status_code

    def deleteNotificationEvent(self, notificationEventId):
        deleteUrl = "/api/notificationevents/" + str(notificationEventId) + "/delete"
        response = self.client.post(deleteUrl)
        # Check that the response is OK.
        assert status.HTTP_204_NO_CONTENT == response.status_code

    def deleteUser(self, userId):
        deleteUrl = "/api/users/" + str(userId) + "/delete"
        response = self.client.post(deleteUrl)
        # Check that the response is OK.
        assert status.HTTP_204_NO_CONTENT == response.status_code    

    def test_credittradesBulkPost(self):
        # Test Bulk Load.
        payload = fakedata.CreditTradeTestDataCreate()
        jsonString = "[]"
        response = self.client.post('/api/credittrades/bulk',content_type='application/json', data=jsonString)
        # Check that the response is 200 OK.
        assert status.HTTP_201_CREATED == response.status_code
        

    def test_credittradesGet(self):
        # Credit Trade has the following dependencies:
        #      User
        #        Fuel Supplier 
        #      FuelSupplier
        #        Contact 
        
        # Order of operations for the create will be:
        # 1. Create a Contact
        # 2. Create a Fuel Supplier with that Contact
        # 3. Create a User with that Fuel Supplier
        # 4. Create the Credit Trade.
        fakeCreditTrade = fakedata.CreditTradeTestDataCreate()

        contactId = self.createContact()        
        fuelSupplierId = self.createFuelSupplier(contactId)
        userId = self.createUser(fuelSupplierId)
        creditTradeId = self.createCreditTrade(fuelSupplierId, userId)

        # Test List operation
        baseUrl = "/api/credittrades"
        response = self.client.get(baseUrl)
        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        testUrl = baseUrl + "/" + str(creditTradeId) 
        response = self.client.get(testUrl)
        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        # Test Put
        payload = {
          'id': creditTradeId,
          'status':'changed',          
          'fuelSupplier':fuelSupplierId,
          'transactionPartnerFuelSupplier': fuelSupplierId,
          'fuelSupplierLastUpdatedBy': userId,
          'fairMarketValuePrice': '101.00', 
          'partnerLastUpdatedBy': None,
          'reviewedRejectedBy': None,
          'approvedRejectedBy': None,
          'cancelledBy': None,
          'tradeExecutionDate': '2017-01-01',
          'transactionType':fakeCreditTrade['transactionType'],
          'numberOfCredits':fakeCreditTrade['numberOfCredits'],
          'fuelSupplierBalanceAtTransactionTime':'2017-01-01',
          'notes':[],
          'attachments':[],
          'history':[]
        }
        jsonString = json.dumps(payload)
        response = self.client.put(testUrl, content_type='application/json', data=jsonString)
        # Check that the response is OK.
        assert status.HTTP_200_OK == response.status_code

        # Cleanup
        self.deleteCreditTrade(creditTradeId)
        self.deleteUser(userId)
        self.deleteFuelSupplier(fuelSupplierId)
        self.deleteContact(contactId)                      

    def test_credittradetradelogentriesBulkPost(self):
        # Test Bulk Load.
        payload = fakedata.CreditTradeLogEntryTestDataCreate()
        jsonString = "[]"
        response = self.client.post('/api/credittradetradelogentries/bulk',content_type='application/json', data=jsonString)
        # Check that the response is 200 OK.
        assert status.HTTP_201_CREATED == response.status_code        

    def test_credittradetradelogentriesGet(self):
        contactId = self.createContact()        
        fuelSupplierId = self.createFuelSupplier(contactId)
        userId = self.createUser(fuelSupplierId)
        creditTradeId = self.createCreditTrade(fuelSupplierId, userId)

        # Test Create and List operations.
        testUrl = "/api/credittradetradelogentries"
        # Create:
        serializer_class = CreditTradeLogEntrySerializer
        fakeCreditTradeLogEntry = fakedata.CreditTradeLogEntryTestDataCreate()
        payload = {
            'creditTrade': creditTradeId,   
            'user': userId,  
            'logEntryTime': '2000-01-01',
            'newStatus': fakeCreditTradeLogEntry['newStatus'],
            'newTradeExecutionDate': '2000-01-01',   
            'newTransactionType': fakeCreditTradeLogEntry['newStatus'],   
            'newNumberOfCredits': fakeCreditTradeLogEntry['newNumberOfCredits'],  
            'newFairMarketValuePrice': '500.00',
            'newFuelSupplierBalanceAtTransactionTime': fakeCreditTradeLogEntry['newFuelSupplierBalanceAtTransactionTime']
        }
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
        # Put
        
        getputUrl = testUrl + "/" + str(createdId)
        payload = {
            'id': createdId,
            'creditTrade': creditTradeId,   
            'user': userId,  
            'logEntryTime': '2000-01-01',            
            'newStatus': 'changed',
            'newTradeExecutionDate': '2000-01-01',   
            'newTransactionType': fakeCreditTradeLogEntry['newStatus'],   
            'newNumberOfCredits': fakeCreditTradeLogEntry['newNumberOfCredits'],  
            'newFairMarketValuePrice': '500.00',
            'newFuelSupplierBalanceAtTransactionTime': fakeCreditTradeLogEntry['newFuelSupplierBalanceAtTransactionTime']
        }
        jsonString = json.dumps(payload)
        response = self.client.post(testUrl, content_type='application/json', data=jsonString)
        # Check that the response is OK.
        assert status.HTTP_201_CREATED == response.status_code        
        # Get
        response = self.client.get(testUrl)
        assert status.HTTP_200_OK == response.status_code        

        jsonString = response.content.decode("utf-8")
        data = json.loads(jsonString)
        assert data[1]['newStatus'] == payload['newStatus']

        # Cleanup:
        deleteUrl = testUrl + "/" + str(createdId) + "/delete"
        response = self.client.post(deleteUrl)
        # Check that the response is OK.
        assert status.HTTP_204_NO_CONTENT == response.status_code

        # Cleanup
        self.deleteCreditTrade(creditTradeId)
        self.deleteUser(userId)
        self.deleteFuelSupplier(fuelSupplierId)
        self.deleteContact(contactId)           


    def test_fuelsuppliersBulkPost(self):
        # Test Bulk Load.
        payload = fakedata.FuelSupplierTestDataCreate()
        jsonString = "[]"
        response = self.client.post('/api/fuelsuppliers/bulk',content_type='application/json', data=jsonString)
        # Check that the response is 200 OK.
        assert status.HTTP_201_CREATED == response.status_code        

    def test_fuelsuppliersCreateGetDelete(self):
        # Fuel supplier has contacts as a dependency.        
        contactId = self.createContact()        
        fuelSupplierId = self.createFuelSupplier(contactId)
        # Test List operation
        testUrl = "/api/fuelsuppliers"

        # List:
        response = self.client.get(testUrl)
        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code

        # Get
        getUrl = testUrl + "/" + str(fuelSupplierId) 
        response = self.client.get(testUrl)
        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code

        # Put
        changedpayload = {
          'id': fuelSupplierId,
          'name': "Changed",
          'status': "Changed",
          'dateCreated': '2000-01-01',   
          'primaryContact': contactId ,
          'contacts': [contactId],
          'notes': [],          
          'attachments': [],   
          'history': []
        }
        jsonString = json.dumps(changedpayload)
        response = self.client.put(getUrl, content_type='application/json', data=jsonString)
        jsonString = response.content.decode("utf-8")
        data = json.loads(jsonString)
        assert data['name'] == changedpayload['name'];

        response = self.client.get(getUrl)
        jsonString = response.content.decode("utf-8")
        data = json.loads(jsonString)
        assert data['name'] == changedpayload['name'];
        
        # Cleanup Fuel Supplier
        self.deleteFuelSupplier(fuelSupplierId)

        # Cleanup contact:
        self.deleteContact(contactId)        

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
        # NotificationEvent needs a CreditTrade.
        contactId = self.createContact()        
        fuelSupplierId = self.createFuelSupplier(contactId)
        userId = self.createUser(fuelSupplierId)
        creditTradeId = self.createCreditTrade(fuelSupplierId, userId)

        # Test Create and List operations.
        testUrl = "/api/notificationevents"
        # Create:
        serializer_class = NotificationEventSerializer
        fakeNotificationEvent = fakedata.NotificationEventTestDataCreate()
        payload = {
            'eventTime': '2000-01-01',   
            'eventTypeCode': fakeNotificationEvent['eventTypeCode'],
            'notes': fakeNotificationEvent['notes'],
            'creditTrade': creditTradeId 
        }
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

        getputUrl = testUrl + "/" + str (createdId)  
        # put
        payload = {
            'eventTime': '2000-01-01',   
            'eventTypeCode': 'test',
            'notes': fakeNotificationEvent['notes'],
            'creditTrade': creditTradeId 
        }
        jsonString = json.dumps(payload)
        response = self.client.put(getputUrl, content_type='application/json', data=jsonString)
        # Check that the response is OK.
        assert status.HTTP_200_OK == response.status_code
        response = self.client.get(getputUrl)
        # Check that the response is OK.
        assert status.HTTP_200_OK == response.status_code
        # parse the response.
        jsonString = response.content.decode("utf-8")
        data = json.loads(jsonString)        

        assert data['eventTypeCode'] == payload['eventTypeCode']

        # Cleanup
        deleteUrl = testUrl + "/" + str(createdId) + "/delete"
        response = self.client.post(deleteUrl)
        # Check that the response is OK.
        assert status.HTTP_204_NO_CONTENT == response.status_code

        self.deleteCreditTrade(creditTradeId)
        self.deleteUser(userId)
        self.deleteFuelSupplier(fuelSupplierId)
        self.deleteContact(contactId)

    def test_usersBulkPost(self):
        # Test Bulk Load.
        payload = fakedata.UserTestDataCreate()
        jsonString = "[]"
        response = self.client.post('/api/users/bulk',content_type='application/json', data=jsonString)
        # Check that the response is 200 OK.
        assert status.HTTP_201_CREATED == response.status_code        

    def test_users(self):
        # a User has Fuel supplier as a dependency
        # a Fuel Supplier has contacts as a dependency
        contactId = self.createContact()        
        fuelSupplierId = self.createFuelSupplier(contactId)
        userId = self.createUser(fuelSupplierId)
        creditTradeId = self.createCreditTrade(fuelSupplierId, userId)
        
        testUrl="/api/users"
        # List:
        response = self.client.get(testUrl)
        assert status.HTTP_200_OK == response.status_code

        fakeUser = fakedata.UserTestDataCreate()
        # test update and get
        testUrl="/api/users/" + str(userId)
        payload = {
          'id': userId,
          'givenName': 'changed',
          'surname':fakeUser['surname'],
          'initials':fakeUser['initials'],
          'email':fakeUser['email'],
          'status':fakeUser['status'],
          'smUserId':fakeUser['smUserId'],
          'guid':fakeUser['guid'],
          'smAuthorizationDirectory':fakeUser['smAuthorizationDirectory'],
          'fuelSupplier': fuelSupplierId
        }
        jsonString = json.dumps(payload)
        response = self.client.put(testUrl, content_type='application/json', data=jsonString)
        # Check that the response is OK.
        assert status.HTTP_200_OK == response.status_code

        response = self.client.get(testUrl)

        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        # Cleanup                       
        self.deleteCreditTrade(creditTradeId)
        self.deleteUser(userId)
        self.deleteFuelSupplier(fuelSupplierId)
        self.deleteContact(contactId)                      

    def test_attachmentsIdDownloadGet(self):
        # first upload a new attachment.
        testUrl = "/api/attachments"
        uploadUrl = testUrl + "/upload"
        serializer_class = AttachmentSerializer
        payload = fakedata.AttachmentTestDataCreate()
        rawData = "TEST"                
        jsonString = json.dumps(payload)        
        fileData = SimpleUploadedFile("file.txt", rawData.encode('utf-8') )
        form = {
            "file": fileData,
            "item": jsonString,
        }
        response = self.client.post(uploadUrl, data=form)
        # Check that the response is OK.
        assert status.HTTP_200_OK == response.status_code
        # parse the response.
        jsonString = response.content.decode("utf-8")
        data = json.loads(jsonString)
        createdId = data['id']
        # download the attachment.
        downloadUrl = testUrl + "/" + str(createdId) + "/download"
        response = self.client.get(downloadUrl)
        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        parsed = response.content.decode("utf-8")
        # response should match the contents sent.
        assert rawData==parsed
        # Cleanup:
        deleteUrl = testUrl + "/" + str(createdId) + "/delete"
        response = self.client.post(deleteUrl)
        # Check that the response is OK.
        assert status.HTTP_204_NO_CONTENT == response.status_code         
        

    def test_creditTradeIdNotesGet(self):
        # start by creating a credit trade.
        contactId = self.createContact()        
        fuelSupplierId = self.createFuelSupplier(contactId)
        userId = self.createUser(fuelSupplierId)
        creditTradeId = self.createCreditTrade(fuelSupplierId, userId)
        fakeNote = fakedata.NoteTestDataCreate()

        testUrl = "/api/credittrades/" + str(creditTradeId) + "/notes"
        payload = fakedata.NoteTestDataCreate()
        jsonString = json.dumps(payload)
        response = self.client.post(testUrl, content_type='application/json', data=jsonString)
        # Check that the response is OK.
        assert status.HTTP_200_OK == response.status_code
        # parse the response.
        jsonString = response.content.decode("utf-8")
        data = json.loads(jsonString)
        createdId = data['id']

        # Cleanup the Note
        deleteUrl = "/api/notes/" + str(createdId) + "/delete"
        response = self.client.post(deleteUrl)
        # Check that the response is OK.
        assert status.HTTP_204_NO_CONTENT == response.status_code

        # Cleanup                       
        self.deleteCreditTrade(creditTradeId)
        self.deleteUser(userId)
        self.deleteFuelSupplier(fuelSupplierId)
        self.deleteContact(contactId)                      

    def test_credittradesIdAttachmentsGet(self):
        contactId = self.createContact()        
        fuelSupplierId = self.createFuelSupplier(contactId)
        userId = self.createUser(fuelSupplierId)
        creditTradeId = self.createCreditTrade(fuelSupplierId, userId)

        uploadUrl = "/api/credittrades/" + str(creditTradeId) + "/attachments"
        payload = fakedata.AttachmentTestDataCreate()
        rawData = "TEST"                
        jsonString = json.dumps(payload)        
        fileData = SimpleUploadedFile("file.txt", rawData.encode('utf-8') )
        form = {
            "file": fileData,
            "item": jsonString,
        }
        response = self.client.post(uploadUrl, data=form)
        # Check that the response is OK.
        assert status.HTTP_200_OK == response.status_code
        # parse the response.
        jsonString = response.content.decode("utf-8")
        data = json.loads(jsonString)
        createdId = data['id']

        testUrl = "/api/attachments"
        # download the attachment.
        downloadUrl = testUrl + "/" + str(createdId) + "/download"
        response = self.client.get(downloadUrl)
        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        parsed = response.content.decode("utf-8")
        # response should match the contents sent.
        assert rawData==parsed
        # Cleanup:
        deleteUrl = testUrl + "/" + str(createdId) + "/delete"
        response = self.client.post(deleteUrl)
        # Check that the response is OK.
        assert status.HTTP_204_NO_CONTENT == response.status_code         

        # Cleanup                       
        self.deleteCreditTrade(creditTradeId)
        self.deleteUser(userId)
        self.deleteFuelSupplier(fuelSupplierId)
        self.deleteContact(contactId)                      

    def test_credittradesIdHistoryGet(self):
        contactId = self.createContact()        
        fuelSupplierId = self.createFuelSupplier(contactId)
        userId = self.createUser(fuelSupplierId)
        creditTradeId = self.createCreditTrade(fuelSupplierId, userId)

        fakeHistory = fakedata.HistoryTestDataCreate()
        testUrl = "/api/credittrades/" + str(creditTradeId) + "/history"
        payload = fakedata.HistoryTestDataCreate()
        jsonString = json.dumps(payload)
        response = self.client.post(testUrl, content_type='application/json', data=jsonString)
        # Check that the response is OK.
        assert status.HTTP_200_OK == response.status_code
        # parse the response.
        jsonString = response.content.decode("utf-8")
        data = json.loads(jsonString)
        createdId = data['id']

        # Cleanup the History
        deleteUrl = "/api/histories/" + str(createdId) + "/delete"
        response = self.client.post(deleteUrl)
        # Check that the response is OK.
        assert status.HTTP_204_NO_CONTENT == response.status_code
        testUrl = "/api/credittrades/" + str(creditTradeId) + "/history"
        payload = fakedata.HistoryTestDataCreate()
        jsonString = json.dumps(payload)
        response = self.client.post(testUrl, content_type='application/json', data=jsonString)
        # Check that the response is OK.
        assert status.HTTP_200_OK == response.status_code
        # parse the response.
        jsonString = response.content.decode("utf-8")
        data = json.loads(jsonString)

        # Cleanup                       
        self.deleteCreditTrade(creditTradeId)
        self.deleteUser(userId)
        self.deleteFuelSupplier(fuelSupplierId)
        self.deleteContact(contactId)                      


    def test_credittradeSearchGet(self):
        contactId = self.createContact()        
        fuelSupplierId = self.createFuelSupplier(contactId)
        userId = self.createUser(fuelSupplierId)
        creditTradeId = self.createCreditTrade(fuelSupplierId, userId)

        # do a search
        testUrl = "/api/credittrades/search"        
        response = self.client.get(testUrl)
        # Check that the response is OK.
        assert status.HTTP_200_OK == response.status_code
        # parse the response.
        jsonString = response.content.decode("utf-8")
        data = json.loads(jsonString)
        # Cleanup                       
        self.deleteCreditTrade(creditTradeId)
        self.deleteUser(userId)
        self.deleteFuelSupplier(fuelSupplierId)
        self.deleteContact(contactId)                      
        


    def test_usersCurrentFavourites(self):
        # create a user
        groupId = self.createGroup()
        contactId = self.createContact()        
        fuelSupplierId = self.createFuelSupplier(contactId)
        userId = self.createUser(fuelSupplierId)
        # add a favourite

        fakeFavourite = fakedata.UserFavouriteTestDataCreate()
        testUrl = "/api/users/current/favourites"
        jsonString = json.dumps(fakeFavourite)
        response = self.client.post(testUrl, content_type='application/json', data=jsonString)
        # Check that the response is OK.
        assert status.HTTP_200_OK == response.status_code
        # parse the response.
        jsonString = response.content.decode("utf-8")
        data = json.loads(jsonString)
        createdId = data['id']
        
        # update a favourite
        fakeFavourite = fakedata.UserFavouriteTestDataUpdate()
        payload = [{
            'type': fakeFavourite['type'],
            'name': fakeFavourite['name'],
            'value': fakeFavourite['value'],
            'isDefault': fakeFavourite['isDefault'],
            'user': userId
        }]
        jsonString = json.dumps(payload)        
        response = self.client.put(testUrl, content_type='application/json', data=jsonString)
        # Check that the response is OK.
        assert status.HTTP_200_OK == response.status_code
        
        # search for the favourite
        response = self.client.get(testUrl + "/search")
        assert status.HTTP_200_OK == response.status_code
        
        # delete favourite
        deleteUrl = testUrl + str(createdId) + "/delete"
        response = self.client.post(deleteUrl)

        # cleanup
        self.deleteUser (userId)
        self.deleteFuelSupplier(fuelSupplierId)
        self.deleteContact(contactId)        

    def test_usersCurrentGet(self):
        # the auth layer is out of scope - in future add a check here that the user matches the logged in user.
        groupId = self.createGroup()
        # create a user.
        contactId = self.createContact()        
        fuelSupplierId = self.createFuelSupplier(contactId)
        userId = self.createUser(fuelSupplierId)

        testUrl="/api/users/current"
        # List:
        response = self.client.get(testUrl)
        assert status.HTTP_200_OK == response.status_code
        self.deleteUser (userId)
        self.deleteFuelSupplier(fuelSupplierId)
        self.deleteContact(contactId)  


    def test_fuelsuppliersIdAttachmentsGet(self):
        contactId = self.createContact()        
        fuelSupplierId = self.createFuelSupplier(contactId)

        uploadUrl = "/api/fuelsuppliers/" + str(fuelSupplierId) + "/attachments"
        payload = fakedata.AttachmentTestDataCreate()
        rawData = "TEST"                
        jsonString = json.dumps(payload)        
        fileData = SimpleUploadedFile("file.txt", rawData.encode('utf-8') )
        form = {
            "file": fileData,
            "item": jsonString,
        }
        response = self.client.post(uploadUrl, data=form)
        # Check that the response is OK.
        assert status.HTTP_200_OK == response.status_code
        # parse the response.
        jsonString = response.content.decode("utf-8")
        data = json.loads(jsonString)
        createdId = data['id']

        testUrl = "/api/attachments"
        # download the attachment.
        downloadUrl = testUrl + "/" + str(createdId) + "/download"
        response = self.client.get(downloadUrl)
        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        parsed = response.content.decode("utf-8")
        # response should match the contents sent.
        assert rawData==parsed
        # Cleanup:
        deleteUrl = testUrl + "/" + str(createdId) + "/delete"
        response = self.client.post(deleteUrl)
        # Check that the response is OK.
        assert status.HTTP_204_NO_CONTENT == response.status_code         

        # Cleanup                       
        self.deleteFuelSupplier(fuelSupplierId)
        self.deleteContact(contactId)                      

    def test_fuelsuppliersIdHistoryGet(self):
        contactId = self.createContact()        
        fuelSupplierId = self.createFuelSupplier(contactId)

        fakeHistory = fakedata.HistoryTestDataCreate()
        testUrl = "/api/fuelsuppliers/" + str(fuelSupplierId) + "/history"
        payload = fakedata.HistoryTestDataCreate()
        jsonString = json.dumps(payload)
        response = self.client.post(testUrl, content_type='application/json', data=jsonString)
        # Check that the response is OK.
        assert status.HTTP_200_OK == response.status_code
        # parse the response.
        jsonString = response.content.decode("utf-8")
        data = json.loads(jsonString)
        createdId = data['id']

        # Cleanup the History
        deleteUrl = "/api/histories/" + str(createdId) + "/delete"
        response = self.client.post(deleteUrl)
        # Check that the response is OK.
        assert status.HTTP_204_NO_CONTENT == response.status_code

        # Cleanup                       
        self.deleteFuelSupplier(fuelSupplierId)
        self.deleteContact(contactId)                      

    def test_fuelsuppliersIdNotesGet(self):
        # start by creating a credit trade.
        contactId = self.createContact()        
        fuelSupplierId = self.createFuelSupplier(contactId)
        fakeNote = fakedata.NoteTestDataCreate()

        testUrl = "/api/fuelsuppliers/" + str(fuelSupplierId) + "/notes"
        payload = fakedata.NoteTestDataCreate()
        jsonString = json.dumps(payload)
        response = self.client.post(testUrl, content_type='application/json', data=jsonString)
        # Check that the response is OK.
        assert status.HTTP_200_OK == response.status_code
        # parse the response.
        jsonString = response.content.decode("utf-8")
        data = json.loads(jsonString)
        createdId = data['id']

        # Cleanup the Note
        deleteUrl = "/api/notes/" + str(createdId) + "/delete"
        response = self.client.post(deleteUrl)
        # Check that the response is OK.
        assert status.HTTP_204_NO_CONTENT == response.status_code

        # Cleanup                       
        self.deleteFuelSupplier(fuelSupplierId)
        self.deleteContact(contactId)                      

    def test_fuelsuppliersSearchGet(self):
        contactId = self.createContact()        
        fuelSupplierId = self.createFuelSupplier(contactId)        

        # do a search
        testUrl = "/api/fuelsuppliers/search"        
        response = self.client.get(testUrl)
        # Check that the response is OK.
        assert status.HTTP_200_OK == response.status_code
        # parse the response.
        jsonString = response.content.decode("utf-8")
        data = json.loads(jsonString)
        # Cleanup                       
        self.deleteFuelSupplier(fuelSupplierId)
        self.deleteContact(contactId)                    

    def test_groupsIdUsersGet(self):
        # create a group.
        groupId = self.createGroup()
        # create a user.
        contactId = self.createContact()        
        fuelSupplierId = self.createFuelSupplier(contactId)
        userId = self.createUser(fuelSupplierId)
        # add user to group.
        userGroupUrl = "/api/users/" + str(userId) + "/groups"
        # create a new group membership.
        payload = {'active': True, 'group':groupId, 'user':userId}
        jsonString = json.dumps(payload)
        response = self.client.post(userGroupUrl,content_type='application/json', data=jsonString)
        assert status.HTTP_200_OK == response.status_code

        # test the get
        response = self.client.get(userGroupUrl)
        assert status.HTTP_200_OK == response.status_code

        testUrl = "/api/groups/" + str(groupId)
        # get the users in the group.
        response = self.client.get(testUrl)
        # Check that the response is OK.
        assert status.HTTP_200_OK == response.status_code
        # parse the response.
        jsonString = response.content.decode("utf-8")
        data = json.loads(jsonString)
        
        # should match        

        # cleanup
        self.deleteGroup (groupId)
        self.deleteUser (userId)
        self.deleteFuelSupplier(fuelSupplierId)
        self.deleteContact(contactId)   

    def test_rolesIdPermissionsGet(self):
        # create a group.
        roleId = self.createRole()        
        # create a permission.
        permissionId = self.createPermission()

        rolePermissionUrl = "/api/roles/" + str(roleId) + "/permissions"
        # create a new group membership.
        payload = {'role':roleId, 'permission':permissionId}
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
          
        
        self.deleteRole (roleId)
        self.deletePermission(permissionId)        


    def test_rolesIdUsersGet(self):
        # create a role.
        roleId = self.createRole()
        # create a user.
        contactId = self.createContact()        
        fuelSupplierId = self.createFuelSupplier(contactId)
        userId = self.createUser(fuelSupplierId)
        # add role to user.
        userRoleUrl = "/api/users/" + str(userId) + "/roles"
        # create a new UserRole.
        payload = {
            'effectiveDate': '2000-01-01',   
            'expiryDate': None,   
            'user': userId,
            'role': roleId
        }
        jsonString = json.dumps(payload)
        response = self.client.post(userRoleUrl,content_type='application/json', data=jsonString)
        assert status.HTTP_200_OK == response.status_code
        
        # test the get
        response = self.client.get(userRoleUrl)
        assert status.HTTP_200_OK == response.status_code
        
        testUrl = "/api/roles/" + str(roleId)
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
        self.deleteRole (roleId)
        self.deleteUser (userId)
        self.deleteFuelSupplier(fuelSupplierId)
        self.deleteContact(contactId)          

    def test_usersIdFavourites(self):
        # create a user
        groupId = self.createGroup()
        contactId = self.createContact()        
        fuelSupplierId = self.createFuelSupplier(contactId)
        userId = self.createUser(fuelSupplierId)
        # add a favourite

        fakeFavourite = fakedata.UserFavouriteTestDataCreate()
        payload = {
            'type': fakeFavourite['type'],
            'name': fakeFavourite['name'],
            'value': fakeFavourite['value'], 
            'isDefault': fakeFavourite['isDefault'],
            'user': userId
        }

        testUrl = "/api/users/" + str(userId) +  "/favourites"
        jsonString = json.dumps(payload)
        response = self.client.post(testUrl, content_type='application/json', data=jsonString)
        # Check that the response is OK.
        assert status.HTTP_200_OK == response.status_code
        # parse the response.
        jsonString = response.content.decode("utf-8")
        data = json.loads(jsonString)
        createdId = data['id']
        
        # update a favourite
        fakeFavourite = fakedata.UserFavouriteTestDataUpdate()
        payload = [{
            'type': fakeFavourite['type'],
            'name': fakeFavourite['name'],
            'value': fakeFavourite['value'],
            'isDefault': fakeFavourite['isDefault'],
            'user': userId
        }]
        jsonString = json.dumps(payload)        
        response = self.client.put(testUrl, content_type='application/json', data=jsonString)
        # Check that the response is OK.
        assert status.HTTP_200_OK == response.status_code
                
        # delete favourite
        deleteUrl = testUrl + str(createdId) + "/delete"
        response = self.client.post(deleteUrl)

        # cleanup
        self.deleteUser (userId)
        self.deleteFuelSupplier(fuelSupplierId)
        self.deleteContact(contactId)                    

    
    def test_usersIdGroupsPut(self):
        # create a role.
        groupId = self.createGroup()
        # create a user.
        contactId = self.createContact()        
        fuelSupplierId = self.createFuelSupplier(contactId)
        userId = self.createUser(fuelSupplierId)
        # add group to user.
        userGroupUrl = "/api/users/" + str(userId) + "/groups"
        # create a new UserRole.
        payload = {
            'active': True,   
            'user': userId,   
            'group': groupId            
        }
        jsonString = json.dumps(payload)
        response = self.client.post(userGroupUrl,content_type='application/json', data=jsonString)
        assert status.HTTP_200_OK == response.status_code
        
        # test the PUT
        payload = []
        jsonString = json.dumps(payload)
        response = self.client.put(userGroupUrl,content_type='application/json', data=jsonString)
        assert status.HTTP_200_OK == response.status_code

        # cleanup
        self.deleteGroup (groupId)
        self.deleteUser (userId)
        self.deleteFuelSupplier(fuelSupplierId)
        self.deleteContact(contactId)                    

    def test_usersIdNotificationsGet(self):        
        # create a user.
        contactId = self.createContact()        
        fuelSupplierId = self.createFuelSupplier(contactId)
        userId = self.createUser(fuelSupplierId)

        # create a credit trade and offer.
        offerId = self.createOffer(fuelSupplierId)
        creditTradeId = self.createCreditTrade(fuelSupplierId,userId)
        notificationEventId = self.createNotificationEvent(creditTradeId, offerId)


        # add notification to user.
        userNotificationUrl = "/api/users/" + str(userId) + "/notifications"
        # create a new UserRole.
        payload = {
          'event': notificationEventId,
          'hasBeenViewed': False,
          'isWatchNotification': False,
          'user':userId
        }
        jsonString = json.dumps(payload)
        response = self.client.post(userNotificationUrl,content_type='application/json', data=jsonString)
        assert status.HTTP_200_OK == response.status_code
        
        # test the Get
        response = self.client.get(userNotificationUrl)
        assert status.HTTP_200_OK == response.status_code

        # cleanup
        self.deleteNotificationEvent(notificationEventId)
        self.deleteOffer(offerId)
        self.deleteCreditTrade(creditTradeId)       
        self.deleteUser (userId)
        self.deleteFuelSupplier(fuelSupplierId)
        self.deleteContact(contactId)                         

    def test_usersIdPermissionsGet(self):
        # create a user.
        contactId = self.createContact()        
        fuelSupplierId = self.createFuelSupplier(contactId)
        userId = self.createUser(fuelSupplierId)

        # create a credit trade and offer.

        notificationEventId = self.createUser(fuelSupplierId)

        # assign permissions to the user.
        #TODO add that.

        userPermissionUrl = "/api/users/" + str(userId) + "/permissions"        
        
        # test the Get
        response = self.client.get(userPermissionUrl)
        assert status.HTTP_200_OK == response.status_code

        # cleanup
        self.deleteUser (userId)
        self.deleteFuelSupplier(fuelSupplierId)
        self.deleteContact(contactId)                               

    def test_usersIdRolesPut(self):
        # create a role.
        roleId = self.createRole()
        # create a user.
        contactId = self.createContact()        
        fuelSupplierId = self.createFuelSupplier(contactId)
        userId = self.createUser(fuelSupplierId)
        # add role to user.
        userRoleUrl = "/api/users/" + str(userId) + "/roles"
        # create a new UserRole.
        payload = {
            'effectiveDate': '2000-01-01',   
            'expiryDate': None,   
            'user': userId,
            'role': roleId
        }
        jsonString = json.dumps(payload)
        response = self.client.post(userRoleUrl,content_type='application/json', data=jsonString)
        assert status.HTTP_200_OK == response.status_code
        
        # test the PUT
        payload = []
        jsonString = json.dumps(payload)
        response = self.client.put(userRoleUrl,content_type='application/json', data=jsonString)
        assert status.HTTP_200_OK == response.status_code

        # cleanup
        self.deleteRole (roleId)
        self.deleteUser (userId)
        self.deleteFuelSupplier(fuelSupplierId)
        self.deleteContact(contactId)             

    def test_usersSearchGet(self):
        contactId = self.createContact()        
        fuelSupplierId = self.createFuelSupplier(contactId)        
        userId = self.createUser(fuelSupplierId)

        # do a search
        testUrl = "/api/users/search"        
        response = self.client.get(testUrl)
        # Check that the response is OK.
        assert status.HTTP_200_OK == response.status_code
        # parse the response.
        jsonString = response.content.decode("utf-8")
        data = json.loads(jsonString)
        # Cleanup                       
        self.deleteUser(userId) 
        self.deleteFuelSupplier(fuelSupplierId)
        self.deleteContact(contactId) 
        

if __name__ == '__main__':
    unittest.main()




