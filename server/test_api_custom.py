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
from .models.Audit import Audit
from .serializers import AuditSerializer
from .models.CreditTrade import CreditTrade
from .serializers import CreditTradeSerializer
from .models.CreditTradeHistory import CreditTradeHistory
from .serializers import CreditTradeHistorySerializer
from .models.CreditTradeStatus import CreditTradeStatus
from .serializers import CreditTradeStatusSerializer
from .models.CreditTradeType import CreditTradeType
from .serializers import CreditTradeTypeSerializer
from .models.CurrentUserViewModel import CurrentUserViewModel
from .serializers import CurrentUserViewModelSerializer
from .models.FuelSupplier import FuelSupplier
from .serializers import FuelSupplierSerializer
from .models.FuelSupplierActionsType import FuelSupplierActionsType
from .serializers import FuelSupplierActionsTypeSerializer
from .models.FuelSupplierAttachment import FuelSupplierAttachment
from .serializers import FuelSupplierAttachmentSerializer
from .models.FuelSupplierAttachmentTag import FuelSupplierAttachmentTag
from .serializers import FuelSupplierAttachmentTagSerializer
from .models.FuelSupplierBalance import FuelSupplierBalance
from .serializers import FuelSupplierBalanceSerializer
from .models.FuelSupplierCCData import FuelSupplierCCData
from .serializers import FuelSupplierCCDataSerializer
from .models.FuelSupplierContact import FuelSupplierContact
from .serializers import FuelSupplierContactSerializer
from .models.FuelSupplierContactRole import FuelSupplierContactRole
from .serializers import FuelSupplierContactRoleSerializer
from .models.FuelSupplierHistory import FuelSupplierHistory
from .serializers import FuelSupplierHistorySerializer
from .models.FuelSupplierStatus import FuelSupplierStatus
from .serializers import FuelSupplierStatusSerializer
from .models.FuelSupplierType import FuelSupplierType
from .serializers import FuelSupplierTypeSerializer
from .models.Notification import Notification
from .serializers import NotificationSerializer
from .models.NotificationEvent import NotificationEvent
from .serializers import NotificationEventSerializer
from .models.NotificationType import NotificationType
from .serializers import NotificationTypeSerializer
from .models.NotificationViewModel import NotificationViewModel
from .serializers import NotificationViewModelSerializer
from .models.Opportunity import Opportunity
from .serializers import OpportunitySerializer
from .models.OpportunityHistory import OpportunityHistory
from .serializers import OpportunityHistorySerializer
from .models.OpportunityStatus import OpportunityStatus
from .serializers import OpportunityStatusSerializer
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

    def createContact(self, fuelSupplierId):
        testContactUrl = "/api/fuelsuppliercontacts"
        # Create:        
        payload = fakedata.FuelSupplierContactTestDataCreate()
        payload['fuelSupplierId'] = fuelSupplierId
        jsonString = json.dumps(payload)
        response = self.client.post(testContactUrl, content_type='application/json', data=jsonString)
        # Check that the response is OK.
        assert status.HTTP_201_CREATED == response.status_code
        # parse the response.
        jsonString = response.content.decode("utf-8")
        data = json.loads(jsonString)
        contactId = data['id']
        return contactId

    def createFuelSupplierType(self):
        testUrl = "/api/fuelsuppliertypes"
        payload = fakedata.FuelSupplierTypeTestDataCreate()
        payload['expirationDate'] = '2017-01-02'
        payload['effectiveDate'] = '2017-01-01'
        jsonString = json.dumps(payload)
        response = self.client.post(testUrl, content_type='application/json', data=jsonString)
        # Check that the response is OK.
        assert status.HTTP_201_CREATED == response.status_code
        # parse the response.
        jsonString = response.content.decode("utf-8")
        data = json.loads(jsonString)
        createdId = data['id']
        return createdId

    def createFuelSupplierStatus(self):
        testUrl = "/api/fuelsupplierstatuses"
        payload = fakedata.FuelSupplierStatusTestDataCreate()
        payload['effectiveDate'] = '2017-01-01'
        jsonString = json.dumps(payload)
        response = self.client.post(testUrl, content_type='application/json', data=jsonString)
        # Check that the response is OK.
        assert status.HTTP_201_CREATED == response.status_code
        # parse the response.
        jsonString = response.content.decode("utf-8")
        data = json.loads(jsonString)
        createdId = data['id']
        return createdId

    def createFuelSupplierActionType(self):
        testUrl = "/api/fuelsupplieractionstypes"
        payload = fakedata.FuelSupplierActionsTypeTestDataCreate()
        jsonString = json.dumps(payload)
        response = self.client.post(testUrl, content_type='application/json', data=jsonString)
        # Check that the response is OK.
        assert status.HTTP_201_CREATED == response.status_code
        # parse the response.
        jsonString = response.content.decode("utf-8")
        data = json.loads(jsonString)
        createdId = data['id']
        return createdId

    def createFuelSupplier(self):
        typeId = self.createFuelSupplierType()
        statusId = self.createFuelSupplierStatus()
        actionsTypeId = self.createFuelSupplierActionType()

        testUrl = "/api/fuelsuppliers"
        # Create:        
        payload = {
          'name': "Initial",
          'status': "Initial",
          'dateCreated': '2000-01-01',   
        #   'primaryContact': contactId ,
        #   'contacts': [contactId],
          'notes': [],          
          'attachments': [],   
          'history': [],
          'fuelSupplierTypeId': typeId,
          'fuelSupplierStatusId': statusId,
          'fuelSupplierActionsTypeId': actionsTypeId,
        }
        jsonString = json.dumps(payload)
        response = self.client.post(testUrl, content_type='application/json', data=jsonString)
        # Check that the response is OK.
        assert status.HTTP_201_CREATED == response.status_code
        # parse the response.
        jsonString = response.content.decode("utf-8")
        data = json.loads(jsonString)
        createdId = data['id']
        return createdId, typeId, statusId, actionsTypeId

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
          'email':fakeUser['email'],
          'status':'Active',
          'userId':fakeUser['userId'],
          'guid':fakeUser['guid'],
          'authorizationDirectory':fakeUser['authorizationDirectory'],
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

    def createCreditTradeType(self):
        testUrl = "/api/credittradetypes"
        payload = fakedata.CreditTradeTypeTestDataCreate()
        payload['expirationDate'] = '2017-01-02'
        payload['effectiveDate'] = '2017-01-01'
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
        payload['effectiveDate'] = '2017-01-01'
        jsonString = json.dumps(payload)
        response = self.client.post(testUrl, content_type='application/json', data=jsonString)
        # Check that the response is OK.
        assert status.HTTP_201_CREATED == response.status_code
        # parse the response.
        jsonString = response.content.decode("utf-8")
        data = json.loads(jsonString)
        createdId = data['id']
        return createdId

    def createCreditTrade(self, fuelSupplierId, userId):
        typeId = self.createCreditTradeType()
        statusId = self.createCreditTradeStatus()

        testUrl = "/api/credittrades"
        payload = {
          'status':'Active',
          'initiator':fuelSupplierId,
          'respondent': fuelSupplierId,
          'initiatorLastUpdateBy': userId,
          'respondentLastUpdatedBy': None,
          'reviewedRejectedBy': None,
          'approvedRejectedBy': None,
          'cancelledBy': None,
          'tradeExecutionDate': '2017-01-01',
        #   TODO: replace transactionType
          'transactionType':'Type',
          'fairMarketValuePrice': '100.00', 
          'fuelSupplierBalanceBeforeTransaction':'2017-01-01',
          'notes':[],
          'attachments':[],
          'history':[],
          'creditTradeTypeId': typeId,
          'creditTradeStatusId': statusId,
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

    def createOpportunityStatus(self):
        testUrl = "/api/opportunitystatuses"
        payload = fakedata.CreditTradeStatusTestDataCreate()
        payload['effectiveDate'] = '2017-01-01'
        jsonString = json.dumps(payload)
        response = self.client.post(testUrl, content_type='application/json', data=jsonString)
        # Check that the response is OK.
        assert status.HTTP_201_CREATED == response.status_code
        # parse the response.
        jsonString = response.content.decode("utf-8")
        data = json.loads(jsonString)
        createdId = data['id']
        return createdId

    def createOpportunity(self, fuelSupplierId, fuelSupplierTypeId, creditTradeTypeId):
        opStatusId = self.createOpportunityStatus()

        testUrl = "/api/opportunities"
        payload = {
            'creditTradeTypeId': creditTradeTypeId,
            'fuelSupplierId': fuelSupplierId,
            'fuelSupplierTypeId': fuelSupplierTypeId,
            'opportunityStatusId': opStatusId,
            'datePosted': '2017-01-01',
            'history':[],
        }
        payload.update(fakedata.OpportunityTestDataCreate())

        jsonString = json.dumps(payload)
        response = self.client.post(testUrl, content_type='application/json', data=jsonString)
        # Check that the response is OK.
        assert status.HTTP_201_CREATED == response.status_code
        # parse the response.
        jsonString = response.content.decode("utf-8")
        data = json.loads(jsonString)
        createdId = data['id']
        return createdId  
    
    def createNotificationEvent(self):
        testUrl = "/api/notificationevents"
        payload = {            
          'eventTime': '2017-01-01',
        }
        event = fakedata.NotificationEventTestDataCreate()
        payload.update(event)
        jsonString = json.dumps(payload)
        response = self.client.post(testUrl, content_type='application/json', data=jsonString)
        # Check that the response is OK.
        assert status.HTTP_201_CREATED == response.status_code
        # parse the response.
        jsonString = response.content.decode("utf-8")
        data = json.loads(jsonString)
        createdId = data['id']
        return createdId

    def createAndVerifyNotification(self):
        testUrl = "/api/notifications"

        fuelSupplierId, typeId, statusId, actionId = self.createFuelSupplier()
        userId = self.createUser(fuelSupplierId)
        notificationEventId = self.createNotificationEvent()

        payload = fakedata.NotificationTestDataCreate()
        payload['userId'] = userId
        payload['notificationEventId'] = notificationEventId

        request = json.dumps(payload)
        response = self.client.post(testUrl, content_type='application/json', data=request)

        assert status.HTTP_201_CREATED == response.status_code

        return json.loads(response.content.decode("utf-8"))

    def createUserFavourite(self, userId):
        url = "/api/users/" + str(userId) + "/favourites"

        payload = fakedata.UserFavouriteTestDataCreate()
        request = json.dumps(payload)
        response = self.client.post(url, content_type='application/json', data=request)

        assert status.HTTP_200_OK == response.status_code

        jsonString = response.content.decode("utf-8")
        data = json.loads(jsonString)
        return data['id']

    def deleteContact(self, contactId):
        # cleanup the contact
        deleteUrl = "/api/fuelsuppliercontacts/" + str(contactId) + "/delete"
        response = self.client.post(deleteUrl)
        # Check that the response is OK.
        assert status.HTTP_204_NO_CONTENT == response.status_code

    def deleteRole(self, roleId):
        deleteUrl = "/api/roles/" + str(roleId) + "/delete"
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
        # Check that the response is OK
        assert status.HTTP_204_NO_CONTENT == response.status_code

    def deleteFuelSupplier(self, fuelsupplierId):
        deleteUrl = "/api/fuelsuppliers/" + str(fuelsupplierId) + "/delete"
        response = self.client.post(deleteUrl)
        # Check that the response is OK.
        assert status.HTTP_204_NO_CONTENT == response.status_code

    def deleteOpportunity(self, opportunityId):
        deleteUrl = "/api/opportunities/" + str(opportunityId) + "/delete"
        response = self.client.post(deleteUrl)
        # Check that the response is OK.
        assert status.HTTP_204_NO_CONTENT == response.status_code

    def deleteCreditTrade(self, creditTradeId):
        deleteUrl = "/api/credittrades/" + str(creditTradeId) + "/delete"
        response = self.client.post(deleteUrl)
        # Check that the response is OK.
        assert status.HTTP_204_NO_CONTENT == response.status_code

    def deletePermission(self, permissionId):
        deleteUrl = "/api/permissions/" + str(permissionId) + "/delete"
        response = self.client.post(deleteUrl)
        # Check that the response is OK.
        assert status.HTTP_204_NO_CONTENT == response.status_code

    def test_credittradesSearchGet(self):
        fsId, fsTypeId, _, _ = self.createFuelSupplier()
        contactId = self.createContact(fsId)
        userId = self.createUser(fsId)
        credId, credTypeId, _ = self.createCreditTrade(fsId, userId)

        testUrl = "/api/credittrades/search"
        response = self.client.get(testUrl)
        assert status.HTTP_200_OK == response.status_code

        jsonString = response.content.decode("utf-8")
        data = json.loads(jsonString)
        assert len(data) == 1

        self.deleteCreditTrade(credId)
        self.deleteUser(userId)
        self.deleteContact(contactId)
        self.deleteFuelSupplier(fsId)

    def test_usersCurrentFavouritesIdDeletePost(self):
        fsId, _, _, _= self.createFuelSupplier()
        contactId = self.createContact(fsId)
        userId = self.createUser(fsId)
        userFavId = self.createUserFavourite(userId)

        url = "/api/users/current/favourites/" + str(userFavId) + "/delete"
        response = self.client.post(url)
        assert status.HTTP_200_OK == response.status_code

        self.deleteUser(userId)
        self.deleteContact(contactId)
        self.deleteFuelSupplier(fsId)

    def test_usersCurrentFavouritesPut(self):
        fsId, _, _, _= self.createFuelSupplier()
        contactId = self.createContact(fsId)
        userId = self.createUser(fsId)

        url = "/api/users/current/favourites"
        payload = fakedata.UserFavouriteTestDataCreate()
        request = json.dumps(payload)
        response = self.client.post(url, content_type='application/json', data=request)

        assert status.HTTP_200_OK == response.status_code

        payload = [fakedata.UserFavouriteTestDataUpdate()]
        request = json.dumps(payload)
        response = self.client.put(url, content_type='application/json', data=request)

        assert status.HTTP_200_OK == response.status_code

        jsonString = response.content.decode("utf-8")
        data = json.loads(jsonString)

        assert data[0]["value"] == "Changed"

        self.deleteUser(userId)
        self.deleteContact(contactId)
        self.deleteFuelSupplier(fsId)

    def test_usersCurrentFavouritesSearchGet(self):
        fsId, _, _, _= self.createFuelSupplier()
        contactId = self.createContact(fsId)
        userId = self.createUser(fsId)
        userFavId = self.createUserFavourite(userId)

        url = "/api/users/current/favourites/search"
        response = self.client.get(url)
        assert status.HTTP_200_OK == response.status_code

        jsonString = response.content.decode("utf-8")
        data = json.loads(jsonString)
        assert len(data) == 1

        self.deleteUser(userId)
        self.deleteContact(contactId)
        self.deleteFuelSupplier(fsId)

    def test_usersCurrentGet(self):
        fuelSupplierId, typeId, statusId, actionId = self.createFuelSupplier()
        contactId = self.createContact(fuelSupplierId)        
        userId = self.createUser(fuelSupplierId)

        testUrl="/api/users/current"
        # List:
        response = self.client.get(testUrl)
        assert status.HTTP_200_OK == response.status_code
        self.deleteUser (userId)
        self.deleteContact(contactId)  
        self.deleteFuelSupplier(fuelSupplierId)

    def test_fuelsuppliersIdAttachmentsGet(self):
        fuelSupplierId, typeId, statusId, actionId = self.createFuelSupplier()
        contactId = self.createContact(fuelSupplierId)        

        uploadUrl = "/api/fuelsuppliers/"
        uploadUrl += str(fuelSupplierId) + "/attachments"
        payload = fakedata.FuelSupplierAttachmentTestDataCreate()
        payload['fuelSupplierId'] = fuelSupplierId
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

        testUrl = "/api/fuelsupplierattachments"
        # download the attachment.
        downloadUrl = testUrl + "/" + str(createdId)
        response = self.client.get(downloadUrl)
        # Check that the response is 200 OK.
        result = response.content.decode("utf-8")
        assert status.HTTP_200_OK == response.status_code
        parsed = response.content.decode("utf-8")

        # response should match the contents sent.
        # TODO: check that raw data matched returned parsed data
        # assert rawData==parsed

        # Cleanup:
        deleteUrl = "/api/fuelsupplierattachments/" + str(createdId) + "/delete"
        response = self.client.post(deleteUrl)
        # Check that the response is OK.
        assert status.HTTP_204_NO_CONTENT == response.status_code         

        # Cleanup                       
        self.deleteContact(contactId)                      
        self.deleteFuelSupplier(fuelSupplierId)

    def test_fuelsuppliersIdHistoryGet(self):
        fuelSupplierId, typeId, statusId, actionId = self.createFuelSupplier()
        contactId = self.createContact(fuelSupplierId)        

        testUrl = "/api/fuelsuppliers/" + str(fuelSupplierId) + "/history"
        payload = fakedata.FuelSupplierHistoryTestDataCreate()
        payload['fuelSupplierId'] = fuelSupplierId
        jsonString = json.dumps(payload)
        response = self.client.post(testUrl, content_type='application/json', data=jsonString)
        # Check that the response is OK.
        assert status.HTTP_200_OK == response.status_code
        # parse the response.
        jsonString = response.content.decode("utf-8")
        data = json.loads(jsonString)
        createdId = data['id']

        # Cleanup the History
        deleteUrl = "/api/fuelsupplierhistories/" + str(createdId) + "/delete"
        response = self.client.post(deleteUrl)
        # Check that the response is OK.
        assert status.HTTP_204_NO_CONTENT == response.status_code

        # Cleanup                       
        self.deleteContact(contactId)                      
        self.deleteFuelSupplier(fuelSupplierId)

    def test_fuelsuppliersSearchGet(self):
        fuelSupplierId, typeId, statusId, actionId = self.createFuelSupplier()        
        contactId = self.createContact(fuelSupplierId)        

        # do a search
        testUrl = "/api/fuelsuppliers/search"        
        response = self.client.get(testUrl)
        # Check that the response is OK.
        assert status.HTTP_200_OK == response.status_code
        # parse the response.
        jsonString = response.content.decode("utf-8")
        data = json.loads(jsonString)
        # Cleanup                       
        self.deleteContact(contactId)                    
        self.deleteFuelSupplier(fuelSupplierId)

    def test_rolesIdPermissionsGet(self):
        # create a group.
        roleId = self.createRole()        
        # create a permission.
        permissionId = self.createPermission()

        rolePermissionUrl = "/api/roles/" + str(roleId) + "/permissions"
        # create a new group membership.
        payload = {'roleId':roleId, 'permissionId':permissionId}
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
          
        self.deleteRole(roleId)
        self.deletePermission(permissionId)        

    def test_rolesIdUsersGet(self):
        roleId = self.createRole()
        fuelSupplierId, typeId, statusId, actionId = self.createFuelSupplier()
        contactId = self.createContact(fuelSupplierId)        
        userId = self.createUser(fuelSupplierId)

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
        self.deleteRole(roleId)
        self.deleteUser(userId)
        self.deleteContact(contactId)          
        self.deleteFuelSupplier(fuelSupplierId)

    def test_usersIdFavouritesGet(self):
        fsId, _, _, _= self.createFuelSupplier()
        contactId = self.createContact(fsId)
        userId = self.createUser(fsId)

        url = "/api/users/" + str(userId) + "/favourites"
        payload = fakedata.UserFavouriteTestDataCreate()
        jsonString = json.dumps(payload)
        response = self.client.post(url, content_type='application/json', data=jsonString)

        assert status.HTTP_200_OK == response.status_code

        payload = [fakedata.UserFavouriteTestDataUpdate()]
        jsonString = json.dumps(payload)
        response = self.client.put(url, content_type='application/json', data=jsonString)

        assert status.HTTP_200_OK == response.status_code

        jsonString = response.content.decode("utf-8")
        data = json.loads(jsonString)

        assert data[0]["value"] == "Changed"

        response = self.client.get(url)
        assert status.HTTP_200_OK == response.status_code

        jsonString = response.content.decode("utf-8")
        data = json.loads(jsonString)

        assert len(data) > 0

        self.deleteUser(userId)
        self.deleteContact(contactId)
        self.deleteFuelSupplier(fsId)

    def test_usersIdNotificationsGet(self):
        fsId, fsTypeId, _, _ = self.createFuelSupplier()
        contactId = self.createContact(fsId)        
        userId = self.createUser(fsId)
        credId, credTypeId, _ = self.createCreditTrade(fsId, userId)

        opportunityId = self.createOpportunity(fsId, fsTypeId, credTypeId)
        notificationEventId = self.createNotificationEvent()

        # add notification to user.
        userNotificationUrl = "/api/users/" + str(userId) + "/notifications"
        # create a new UserRole.
        payload = {
          'notificationEventId': notificationEventId,
          'hasBeenViewed': False,
          'isWatchNotification': False,
          'userId':userId
        }
        jsonString = json.dumps(payload)
        response = self.client.post(userNotificationUrl,content_type='application/json', data=jsonString)
        assert status.HTTP_200_OK == response.status_code
        
        # test the Get
        response = self.client.get(userNotificationUrl)
        assert status.HTTP_200_OK == response.status_code

        # cleanup
        self.deleteNotificationEvent(notificationEventId)
        self.deleteOpportunity(opportunityId)
        self.deleteCreditTrade(credId)       
        self.deleteUser(userId)
        self.deleteContact(contactId)                         
        self.deleteFuelSupplier(fsId)

    def test_usersIdPermissionsGet(self):
        # create a user.
        fuelSupplierId, typeId, statusId, actionId = self.createFuelSupplier()
        contactId = self.createContact(fuelSupplierId)        
        userId = self.createUser(fuelSupplierId)

        # create a credit trade and opportunity.

        notificationEventId = self.createUser(fuelSupplierId)

        # assign permissions to the user.
        #TODO add that.

        userPermissionUrl = "/api/users/" + str(userId) + "/permissions"        
        
        # test the Get
        response = self.client.get(userPermissionUrl)
        assert status.HTTP_200_OK == response.status_code

        # cleanup
        self.deleteUser (userId)
        self.deleteContact(contactId)                               
        self.deleteFuelSupplier(fuelSupplierId)

    def test_usersIdRolesGet(self):
        fsId, _, _, _= self.createFuelSupplier()
        contactId = self.createContact(fsId)
        userId = self.createUser(fsId)
        roleId = self.createRole()

        url = "/api/users/" + str(userId) + "/roles"
        payload = fakedata.UserRoleTestDataCreate()
        payload['user'] = userId
        payload['role'] = roleId
        jsonString = json.dumps(payload)
        response = self.client.post(url, content_type='application/json', data=jsonString)

        assert response.status_code == status.HTTP_200_OK

        response = self.client.get(url)

        assert response.status_code == status.HTTP_200_OK

        payload = [fakedata.UserRoleTestDataUpdate()]
        payload[0]['user'] = userId
        payload[0]['role'] = roleId
        jsonString = json.dumps(payload)
        response = self.client.put(url, content_type='application/json', data=jsonString)

        assert response.status_code == status.HTTP_200_OK

        jsonString = response.content.decode("utf-8")
        data = json.loads(jsonString)

        assert data[0]['effectiveDate'] == '2018-01-01'

        self.deleteRole(roleId)
        self.deleteUser(userId)
        self.deleteContact(contactId)
        self.deleteFuelSupplier(fsId)

    def test_usersSearchGet(self):
        fuelSupplierId, typeId, statusId, actionId = self.createFuelSupplier()        
        contactId = self.createContact(fuelSupplierId)        
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
        self.deleteContact(contactId) 
        self.deleteFuelSupplier(fuelSupplierId)

if __name__ == '__main__':
    unittest.main()




