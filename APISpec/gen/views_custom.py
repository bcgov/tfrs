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

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions 
from rest_framework import mixins
from rest_framework import generics
from rest_framework_bulk import BulkCreateModelMixin
from . import serializers
from .models.Audit import Audit
from .models.CreditTrade import CreditTrade
from .models.CreditTradeHistory import CreditTradeHistory
from .models.CreditTradeStatus import CreditTradeStatus
from .models.CreditTradeType import CreditTradeType
from .models.CurrentUserViewModel import CurrentUserViewModel
from .models.FuelSupplier import FuelSupplier
from .models.FuelSupplierActionsType import FuelSupplierActionsType
from .models.FuelSupplierAttachment import FuelSupplierAttachment
from .models.FuelSupplierAttachmentTag import FuelSupplierAttachmentTag
from .models.FuelSupplierBalance import FuelSupplierBalance
from .models.FuelSupplierCCData import FuelSupplierCCData
from .models.FuelSupplierContact import FuelSupplierContact
from .models.FuelSupplierContactRole import FuelSupplierContactRole
from .models.FuelSupplierHistory import FuelSupplierHistory
from .models.FuelSupplierStatus import FuelSupplierStatus
from .models.FuelSupplierType import FuelSupplierType
from .models.Notification import Notification
from .models.NotificationEvent import NotificationEvent
from .models.NotificationType import NotificationType
from .models.NotificationViewModel import NotificationViewModel
from .models.Opportunity import Opportunity
from .models.OpportunityHistory import OpportunityHistory
from .models.OpportunityStatus import OpportunityStatus
from .models.Permission import Permission
from .models.PermissionViewModel import PermissionViewModel
from .models.Role import Role
from .models.RolePermission import RolePermission
from .models.RolePermissionViewModel import RolePermissionViewModel
from .models.RoleViewModel import RoleViewModel
from .models.User import User
from .models.UserDetailsViewModel import UserDetailsViewModel
from .models.UserFavourite import UserFavourite
from .models.UserFavouriteViewModel import UserFavouriteViewModel
from .models.UserRole import UserRole
from .models.UserRoleViewModel import UserRoleViewModel
from .models.UserViewModel import UserViewModel


# Custom views.  This file is hand edited.

class credittradesSearchGet(APIView):
  """  
  Searches credit trades  
  """
  # enter code for this routine here.        
  
  def get(self, request, fuelSuppliers = None, tradeType = None, status = None, dateType = None, startDate = None, endDate = None):
    return Response()

class usersCurrentFavouritesIdDeletePost(APIView):
  """  
  Removes a specific user favourite  
  """
  # enter code for this routine here.        
  
  def post(self, request, id):
    return Response()

class usersCurrentFavouritesPut(APIView):
  """  
  Updates a favourite  
  """
  # enter code for this routine here.        
  
  def put(self, request, item):
    return Response()

class usersCurrentFavouritesSearchGet(APIView):
  """  
  Returns a user's favourites of a given type.  If type is empty, returns all.  
  """
  # enter code for this routine here.        
  
  def get(self, request, type):
    return Response()

class usersCurrentGet(APIView):
  """  
  Get the currently logged in user  
  """
  # enter code for this routine here.        
  
  def get(self, request, ):
    return Response()

class fuelsuppliersIdAttachmentsGet(APIView):
  """  
  Returns attachments for a particular FuelSupplier  
  """
  # enter code for this routine here.        
  
  def get(self, request, id):
    return Response()

class fuelsuppliersIdHistoryGet(APIView):
  """  
  Returns History for a particular FuelSupplier  
  """
  # enter code for this routine here.        
  
  def get(self, request, id, offset = None, limit = None):
    return Response()

class fuelsuppliersSearchGet(APIView):
  """  
  Searches fuel suppliers  
  """
  # enter code for this routine here.        
  
  def get(self, request, fuelSupplierName = None, includeInactive = None):
    return Response()

class rolesIdPermissionsGet(APIView):
  """  
  Get all the permissions for a role  
  """
  # enter code for this routine here.        
  
  def get(self, request, id):
    return Response()

class rolesIdUsersGet(APIView):
  """  
  Gets all the users for a role  
  """
  # enter code for this routine here.        
  
  def get(self, request, id):
    return Response()

class usersIdFavouritesGet(APIView):
  """  
  Returns the favourites for a user  
  """
  # enter code for this routine here.        
  
  def get(self, request, id):
    return Response()

class usersIdNotificationsGet(APIView):
  """  
  Returns a user's notifications  
  """
  # enter code for this routine here.        
  
  def get(self, request, id):
    return Response()

class usersIdPermissionsGet(APIView):
  """  
  Returns the set of permissions for a user  
  """
  # enter code for this routine here.        
  
  def get(self, request, id):
    return Response()

class usersIdRolesGet(APIView):
  """  
  Returns the roles for a user  
  """
  # enter code for this routine here.        
  
  def get(self, request, id):
    return Response()

class usersSearchGet(APIView):
  """  
  Searches Users  
  """
  # enter code for this routine here.        
  
  def get(self, request, fuelSuppliers = None, surname = None, includeInactive = None):
    return Response()


