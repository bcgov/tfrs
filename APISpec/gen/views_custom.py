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
from .models.Attachment import Attachment
from .models.AttachmentViewModel import AttachmentViewModel
from .models.Audit import Audit
from .models.Contact import Contact
from .models.CreditTrade import CreditTrade
from .models.CreditTradeLogEntry import CreditTradeLogEntry
from .models.CurrentUserViewModel import CurrentUserViewModel
from .models.FuelSupplier import FuelSupplier
from .models.Group import Group
from .models.GroupMembership import GroupMembership
from .models.GroupMembershipViewModel import GroupMembershipViewModel
from .models.GroupViewModel import GroupViewModel
from .models.History import History
from .models.HistoryViewModel import HistoryViewModel
from .models.LookupList import LookupList
from .models.Note import Note
from .models.Notification import Notification
from .models.NotificationEvent import NotificationEvent
from .models.NotificationViewModel import NotificationViewModel
from .models.Offer import Offer
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

class attachmentsIdDownloadGet(APIView):
  """  
  Returns the binary file component of an attachment  
  """
  # enter code for this routine here.        
  
  def get(self, request, id):
    return Response()

class attachmentsUploadPost(APIView):
  """  
  Used to upload an attachment  
  """
  # enter code for this routine here.        
  
  def post(self, request, item):
    return Response()

class credittradesIdAttachmentsGet(APIView):
  """  
  Returns attachments for a particular CreditTrade  
  """
  # enter code for this routine here.        
  
  def get(self, request, id):
    return Response()

class credittradesIdHistoryGet(APIView):
  """  
  Returns History for a particular CreditTrade  
  """
  # enter code for this routine here.        
  
  def get(self, request, id, offset = None, limit = None):
    return Response()

class credittradesIdNotesGet(APIView):
  """  
  Returns notes for a particular CreditTrade  
  """
  # enter code for this routine here.        
  
  def get(self, request, id):
    return Response()

class credittradesSearchGet(APIView):
  """  
  Searches credit trades  
  """
  # enter code for this routine here.        
  
  def get(self, request, organization = None, tradeType = None, status = None, dateType = None, startDate = None, endDate = None):
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

class fuelsuppliersIdNotesGet(APIView):
  """  
  Returns notes for a particular FuelSupplier  
  """
  # enter code for this routine here.        
  
  def get(self, request, id):
    return Response()

class fuelsuppliersSearchGet(APIView):
  """  
  Searches fuel suppliers  
  """
  # enter code for this routine here.        
  
  def get(self, request, fuelSupplierName = None, includeInactive = None):
    return Response()

class groupsIdUsersGet(APIView):
  """  
  returns users in a given Group  
  """
  # enter code for this routine here.        
  
  def get(self, request, id):
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

class usersIdGroupsGet(APIView):
  """  
  Returns all groups that a user is a member of  
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


