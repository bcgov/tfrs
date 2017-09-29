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
from .models.CreditTradeZeroReason import CreditTradeZeroReason
from .serializers import CreditTradeZeroReasonSerializer
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
from .models.FuelSupplierHistory import FuelSupplierHistory
from .serializers import FuelSupplierHistorySerializer
from .models.FuelSupplierStatus import FuelSupplierStatus
from .serializers import FuelSupplierStatusSerializer
from .models.Notification import Notification
from .serializers import NotificationSerializer
from .models.NotificationEvent import NotificationEvent
from .serializers import NotificationEventSerializer
from .models.NotificationType import NotificationType
from .serializers import NotificationTypeSerializer
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


    def test_credittradesSearchGet(self):
        self.fail("Not implemented")        

    def test_usersCurrentFavouritesIdDeletePost(self):
        self.fail("Not implemented")        

    def test_usersCurrentFavouritesPut(self):
        self.fail("Not implemented")        

    def test_usersCurrentFavouritesSearchGet(self):
        self.fail("Not implemented")        

    def test_usersCurrentGet(self):
        self.fail("Not implemented")        

    def test_fuelsuppliersIdAttachmentsGet(self):
        self.fail("Not implemented")        

    def test_fuelsuppliersIdHistoryGet(self):
        self.fail("Not implemented")        

    def test_fuelsuppliersSearchGet(self):
        self.fail("Not implemented")        

    def test_rolesIdPermissionsGet(self):
        self.fail("Not implemented")        

    def test_rolesIdUsersGet(self):
        self.fail("Not implemented")        

    def test_usersIdFavouritesGet(self):
        self.fail("Not implemented")        

    def test_usersIdNotificationsGet(self):
        self.fail("Not implemented")        

    def test_usersIdPermissionsGet(self):
        self.fail("Not implemented")        

    def test_usersIdRolesGet(self):
        self.fail("Not implemented")        

    def test_usersSearchGet(self):
        self.fail("Not implemented")        

if __name__ == '__main__':
    unittest.main()




