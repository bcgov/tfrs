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
from .models.CompliancePeriod import CompliancePeriod
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


class attachmentsBulkPost(BulkCreateModelMixin, generics.GenericAPIView):
  """  
  Bulk create / update a number of Attachment object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = Attachment.objects.all()  
  serializer_class = serializers.AttachmentSerializer
  def post(self, request, *args, **kwargs):
    """
    Creates a number of new Attachment objects
    """
    return self.create(request, *args, **kwargs)

class attachmentsGet(mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView):
  """  
  Lists available Attachment objects  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = Attachment.objects.all()  
  serializer_class = serializers.AttachmentSerializer
  def get(self, request, *args, **kwargs):
    """
    Lists available Attachment objects
    """
    return self.list(request, *args, **kwargs)
  def post(self, request, *args, **kwargs):
    """
    Creates a new Attachment object
    """
    return self.create(request, *args, **kwargs)

class attachmentsIdDeletePost(mixins.DestroyModelMixin, generics.GenericAPIView):
  """  
  Deletes a specific Attachment object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = Attachment.objects.all()  
  serializer_class = serializers.AttachmentSerializer
  def post(self, request, *args, **kwargs):
    """
    Destroys the specified Attachment object
    """
    return self.destroy(request, *args, **kwargs)


class attachmentsIdDownloadGet(APIView):
  """  
  Returns the binary file component of an attachment  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  def get(self, request, id):
    return Response()

class attachmentsIdGet(mixins.RetrieveModelMixin, mixins.UpdateModelMixin, generics.GenericAPIView):
  """  
  Gets a specific Attachment object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = Attachment.objects.all()  
  serializer_class = serializers.AttachmentSerializer
  def get(self, request, *args, **kwargs):
    """
    Retrieves the specified Attachment object
    """
    return self.retrieve(request, *args, **kwargs)
  def put(self, request, *args, **kwargs):
    """
    Updates the specified Attachment object
    """
    return self.update(request, *args, **kwargs)

class attachmentsIdPut(APIView):
  """  
  Updates a specific Attachment object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = Attachment.objects.all()  
  serializer_class = serializers.AttachmentSerializer  
  def put(self, request, id, item):
    return Response()

class attachmentsPost(APIView):
  """  
  Creates a new Attachment object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = Attachment.objects.all()  
  serializer_class = serializers.AttachmentSerializer  
  def post(self, request, item):
    return Response()

class complianceperiodsBulkPost(BulkCreateModelMixin, generics.GenericAPIView):
  """  
  Bulk create / update a number of CompliancePeriod object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = CompliancePeriod.objects.all()  
  serializer_class = serializers.CompliancePeriodSerializer
  def post(self, request, *args, **kwargs):
    """
    Creates a number of new CompliancePeriod objects
    """
    return self.create(request, *args, **kwargs)

class complianceperiodsGet(mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView):
  """  
  Lists available CompliancePeriod objects  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = CompliancePeriod.objects.all()  
  serializer_class = serializers.CompliancePeriodSerializer
  def get(self, request, *args, **kwargs):
    """
    Lists available CompliancePeriod objects
    """
    return self.list(request, *args, **kwargs)
  def post(self, request, *args, **kwargs):
    """
    Creates a new CompliancePeriod object
    """
    return self.create(request, *args, **kwargs)

class complianceperiodsIdDeletePost(mixins.DestroyModelMixin, generics.GenericAPIView):
  """  
  Deletes a specific CompliancePeriod object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = CompliancePeriod.objects.all()  
  serializer_class = serializers.CompliancePeriodSerializer
  def post(self, request, *args, **kwargs):
    """
    Destroys the specified CompliancePeriod object
    """
    return self.destroy(request, *args, **kwargs)


class complianceperiodsIdGet(mixins.RetrieveModelMixin, mixins.UpdateModelMixin, generics.GenericAPIView):
  """  
  Gets a specific CompliancePeriod object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = CompliancePeriod.objects.all()  
  serializer_class = serializers.CompliancePeriodSerializer
  def get(self, request, *args, **kwargs):
    """
    Retrieves the specified CompliancePeriod object
    """
    return self.retrieve(request, *args, **kwargs)
  def put(self, request, *args, **kwargs):
    """
    Updates the specified CompliancePeriod object
    """
    return self.update(request, *args, **kwargs)

class complianceperiodsIdPut(APIView):
  """  
  Updates a specific CompliancePeriod object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = CompliancePeriod.objects.all()  
  serializer_class = serializers.CompliancePeriodSerializer  
  def put(self, request, id, item):
    return Response()

class complianceperiodsPost(APIView):
  """  
  Creates a new CompliancePeriod object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = CompliancePeriod.objects.all()  
  serializer_class = serializers.CompliancePeriodSerializer  
  def post(self, request, item):
    return Response()

class contactsBulkPost(BulkCreateModelMixin, generics.GenericAPIView):
  """  
  Bulk create / update a number of Contact object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = Contact.objects.all()  
  serializer_class = serializers.ContactSerializer
  def post(self, request, *args, **kwargs):
    """
    Creates a number of new Contact objects
    """
    return self.create(request, *args, **kwargs)

class contactsGet(mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView):
  """  
  Lists available Contact objects  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = Contact.objects.all()  
  serializer_class = serializers.ContactSerializer
  def get(self, request, *args, **kwargs):
    """
    Lists available Contact objects
    """
    return self.list(request, *args, **kwargs)
  def post(self, request, *args, **kwargs):
    """
    Creates a new Contact object
    """
    return self.create(request, *args, **kwargs)

class contactsIdDeletePost(mixins.DestroyModelMixin, generics.GenericAPIView):
  """  
  Deletes a specific Contact object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = Contact.objects.all()  
  serializer_class = serializers.ContactSerializer
  def post(self, request, *args, **kwargs):
    """
    Destroys the specified Contact object
    """
    return self.destroy(request, *args, **kwargs)


class contactsIdGet(mixins.RetrieveModelMixin, mixins.UpdateModelMixin, generics.GenericAPIView):
  """  
  Gets a specific Contact object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = Contact.objects.all()  
  serializer_class = serializers.ContactSerializer
  def get(self, request, *args, **kwargs):
    """
    Retrieves the specified Contact object
    """
    return self.retrieve(request, *args, **kwargs)
  def put(self, request, *args, **kwargs):
    """
    Updates the specified Contact object
    """
    return self.update(request, *args, **kwargs)

class contactsIdPut(APIView):
  """  
  Updates a specific Contact object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = Contact.objects.all()  
  serializer_class = serializers.ContactSerializer  
  def put(self, request, id, item):
    return Response()

class contactsPost(APIView):
  """  
  Creates a new Contact object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = Contact.objects.all()  
  serializer_class = serializers.ContactSerializer  
  def post(self, request, item):
    return Response()

class creditTradeIdNotesGet(APIView):
  """  
  Returns notes for a particular CreditTrade  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  def get(self, request, id):
    return Response()

class credittradesBulkPost(BulkCreateModelMixin, generics.GenericAPIView):
  """  
  Bulk create / update a number of CreditTrade object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = CreditTrade.objects.all()  
  serializer_class = serializers.CreditTradeSerializer
  def post(self, request, *args, **kwargs):
    """
    Creates a number of new CreditTrade objects
    """
    return self.create(request, *args, **kwargs)

class credittradesGet(mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView):
  """  
  Lists available CreditTrade objects  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = CreditTrade.objects.all()  
  serializer_class = serializers.CreditTradeSerializer
  def get(self, request, *args, **kwargs):
    """
    Lists available CreditTrade objects
    """
    return self.list(request, *args, **kwargs)
  def post(self, request, *args, **kwargs):
    """
    Creates a new CreditTrade object
    """
    return self.create(request, *args, **kwargs)

class credittradesIdAttachmentsGet(APIView):
  """  
  Returns attachments for a particular CreditTrade  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  def get(self, request, id):
    return Response()

class credittradesIdDeletePost(mixins.DestroyModelMixin, generics.GenericAPIView):
  """  
  Deletes a specific CreditTrade object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = CreditTrade.objects.all()  
  serializer_class = serializers.CreditTradeSerializer
  def post(self, request, *args, **kwargs):
    """
    Destroys the specified CreditTrade object
    """
    return self.destroy(request, *args, **kwargs)


class credittradesIdGet(mixins.RetrieveModelMixin, mixins.UpdateModelMixin, generics.GenericAPIView):
  """  
  Gets a specific CreditTrade object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = CreditTrade.objects.all()  
  serializer_class = serializers.CreditTradeSerializer
  def get(self, request, *args, **kwargs):
    """
    Retrieves the specified CreditTrade object
    """
    return self.retrieve(request, *args, **kwargs)
  def put(self, request, *args, **kwargs):
    """
    Updates the specified CreditTrade object
    """
    return self.update(request, *args, **kwargs)

class credittradesIdHistoryGet(APIView):
  """  
  Returns History for a particular CreditTrade  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  def get(self, request, id, offset = None, limit = None):
    return Response()

class credittradesIdHistoryPost(APIView):
  """  
  Add a History record to the CreditTrade  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  def post(self, request, id, item):
    return Response()

class credittradesIdPut(APIView):
  """  
  Updates a specific CreditTrade object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = CreditTrade.objects.all()  
  serializer_class = serializers.CreditTradeSerializer  
  def put(self, request, id, item):
    return Response()

class credittradesPost(APIView):
  """  
  Creates a new CreditTrade object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = CreditTrade.objects.all()  
  serializer_class = serializers.CreditTradeSerializer  
  def post(self, request, item):
    return Response()

class credittradingSearchGet(APIView):
  """  
  Searches credit trades  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  def get(self, request, organization = None, tradeType = None, status = None, dateType = None, startDate = None, endDate = None):
    return Response()

class credittradetradelogentriesBulkPost(BulkCreateModelMixin, generics.GenericAPIView):
  """  
  Bulk create / update a number of CreditTradeLogEntry object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = CreditTradeLogEntry.objects.all()  
  serializer_class = serializers.CreditTradeLogEntrySerializer
  def post(self, request, *args, **kwargs):
    """
    Creates a number of new CreditTradeLogEntry objects
    """
    return self.create(request, *args, **kwargs)

class credittradetradelogentriesGet(mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView):
  """  
  Lists available CreditTradeLogEntry objects  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = CreditTradeLogEntry.objects.all()  
  serializer_class = serializers.CreditTradeLogEntrySerializer
  def get(self, request, *args, **kwargs):
    """
    Lists available CreditTradeLogEntry objects
    """
    return self.list(request, *args, **kwargs)
  def post(self, request, *args, **kwargs):
    """
    Creates a new CreditTradeLogEntry object
    """
    return self.create(request, *args, **kwargs)

class credittradetradelogentriesIdDeletePost(mixins.DestroyModelMixin, generics.GenericAPIView):
  """  
  Deletes a specific CreditTradeLogEntry object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = CreditTradeLogEntry.objects.all()  
  serializer_class = serializers.CreditTradeLogEntrySerializer
  def post(self, request, *args, **kwargs):
    """
    Destroys the specified CreditTradeLogEntry object
    """
    return self.destroy(request, *args, **kwargs)


class credittradetradelogentriesIdGet(mixins.RetrieveModelMixin, mixins.UpdateModelMixin, generics.GenericAPIView):
  """  
  Gets a specific CreditTradeLogEntry object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = CreditTradeLogEntry.objects.all()  
  serializer_class = serializers.CreditTradeLogEntrySerializer
  def get(self, request, *args, **kwargs):
    """
    Retrieves the specified CreditTradeLogEntry object
    """
    return self.retrieve(request, *args, **kwargs)
  def put(self, request, *args, **kwargs):
    """
    Updates the specified CreditTradeLogEntry object
    """
    return self.update(request, *args, **kwargs)

class credittradetradelogentriesIdPut(APIView):
  """  
  Updates a specific CreditTradeLogEntry object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = CreditTradeLogEntry.objects.all()  
  serializer_class = serializers.CreditTradeLogEntrySerializer  
  def put(self, request, id, item):
    return Response()

class credittradetradelogentriesPost(APIView):
  """  
  Creates a new CreditTradeLogEntry object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = CreditTradeLogEntry.objects.all()  
  serializer_class = serializers.CreditTradeLogEntrySerializer  
  def post(self, request, item):
    return Response()

class usersCurrentFavouritesIdDeletePost(APIView):
  """  
  Removes a specific user favourite  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  def post(self, request, id):
    return Response()

class usersCurrentFavouritesPost(APIView):
  """  
  Create new favourite for the current user  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  def post(self, request, item):
    return Response()

class usersCurrentFavouritesPut(APIView):
  """  
  Updates a favourite  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  def put(self, request, item):
    return Response()

class usersCurrentFavouritesTypeGet(APIView):
  """  
  Returns a user's favourites of a given type.  If type is empty, returns all.  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  def get(self, request, type):
    return Response()

class usersCurrentGet(APIView):
  """  
  Get the currently logged in user  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  def get(self, request, ):
    return Response()

class fuelsuppliersBulkPost(BulkCreateModelMixin, generics.GenericAPIView):
  """  
  Bulk create / update a number of FuelSupplier object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = FuelSupplier.objects.all()  
  serializer_class = serializers.FuelSupplierSerializer
  def post(self, request, *args, **kwargs):
    """
    Creates a number of new FuelSupplier objects
    """
    return self.create(request, *args, **kwargs)

class fuelsuppliersGet(mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView):
  """  
  Lists available FuelSupplier objects  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = FuelSupplier.objects.all()  
  serializer_class = serializers.FuelSupplierSerializer
  def get(self, request, *args, **kwargs):
    """
    Lists available FuelSupplier objects
    """
    return self.list(request, *args, **kwargs)
  def post(self, request, *args, **kwargs):
    """
    Creates a new FuelSupplier object
    """
    return self.create(request, *args, **kwargs)

class fuelsuppliersIdAttachmentsGet(APIView):
  """  
  Returns attachments for a particular FuelSupplier  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  def get(self, request, id):
    return Response()

class fuelsuppliersIdDeletePost(mixins.DestroyModelMixin, generics.GenericAPIView):
  """  
  Deletes a specific FuelSupplier object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = FuelSupplier.objects.all()  
  serializer_class = serializers.FuelSupplierSerializer
  def post(self, request, *args, **kwargs):
    """
    Destroys the specified FuelSupplier object
    """
    return self.destroy(request, *args, **kwargs)


class fuelsuppliersIdGet(mixins.RetrieveModelMixin, mixins.UpdateModelMixin, generics.GenericAPIView):
  """  
  Gets a specific FuelSupplier object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = FuelSupplier.objects.all()  
  serializer_class = serializers.FuelSupplierSerializer
  def get(self, request, *args, **kwargs):
    """
    Retrieves the specified FuelSupplier object
    """
    return self.retrieve(request, *args, **kwargs)
  def put(self, request, *args, **kwargs):
    """
    Updates the specified FuelSupplier object
    """
    return self.update(request, *args, **kwargs)

class fuelsuppliersIdHistoryGet(APIView):
  """  
  Returns History for a particular FuelSupplier  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  def get(self, request, id, offset = None, limit = None):
    return Response()

class fuelsuppliersIdHistoryPost(APIView):
  """  
  Add a History record to the FuelSupplier  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  def post(self, request, id, item):
    return Response()

class fuelsuppliersIdNotesGet(APIView):
  """  
  Returns notes for a particular FuelSupplier  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  def get(self, request, id):
    return Response()

class fuelsuppliersIdPut(APIView):
  """  
  Updates a specific FuelSupplier object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = FuelSupplier.objects.all()  
  serializer_class = serializers.FuelSupplierSerializer  
  def put(self, request, id, item):
    return Response()

class fuelsuppliersPost(APIView):
  """  
  Creates a new FuelSupplier object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = FuelSupplier.objects.all()  
  serializer_class = serializers.FuelSupplierSerializer  
  def post(self, request, item):
    return Response()

class fuelsuppliersSearchGet(APIView):
  """  
  Searches fuel suppliers  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  def get(self, request, fuelSupplierName = None, includeInactive = None):
    return Response()

class groupsBulkPost(BulkCreateModelMixin, generics.GenericAPIView):
  """  
  Bulk create / update a number of Group object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = Group.objects.all()  
  serializer_class = serializers.GroupSerializer
  def post(self, request, *args, **kwargs):
    """
    Creates a number of new Group objects
    """
    return self.create(request, *args, **kwargs)

class groupsGet(mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView):
  """  
  Lists available Group objects  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = Group.objects.all()  
  serializer_class = serializers.GroupSerializer
  def get(self, request, *args, **kwargs):
    """
    Lists available Group objects
    """
    return self.list(request, *args, **kwargs)
  def post(self, request, *args, **kwargs):
    """
    Creates a new Group object
    """
    return self.create(request, *args, **kwargs)

class groupsIdDeletePost(mixins.DestroyModelMixin, generics.GenericAPIView):
  """  
  Deletes a specific Group object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = Group.objects.all()  
  serializer_class = serializers.GroupSerializer
  def post(self, request, *args, **kwargs):
    """
    Destroys the specified Group object
    """
    return self.destroy(request, *args, **kwargs)


class groupsIdGet(mixins.RetrieveModelMixin, mixins.UpdateModelMixin, generics.GenericAPIView):
  """  
  Gets a specific Group object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = Group.objects.all()  
  serializer_class = serializers.GroupSerializer
  def get(self, request, *args, **kwargs):
    """
    Retrieves the specified Group object
    """
    return self.retrieve(request, *args, **kwargs)
  def put(self, request, *args, **kwargs):
    """
    Updates the specified Group object
    """
    return self.update(request, *args, **kwargs)

class groupsIdPut(APIView):
  """  
  Updates a specific Group object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = Group.objects.all()  
  serializer_class = serializers.GroupSerializer  
  def put(self, request, id, item):
    return Response()

class groupsIdUsersGet(APIView):
  """  
  returns users in a given Group  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  def get(self, request, id):
    return Response()

class groupsPost(APIView):
  """  
  Creates a new Group object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = Group.objects.all()  
  serializer_class = serializers.GroupSerializer  
  def post(self, request, item):
    return Response()

class historiesBulkPost(BulkCreateModelMixin, generics.GenericAPIView):
  """  
  Bulk create / update a number of History object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = History.objects.all()  
  serializer_class = serializers.HistorySerializer
  def post(self, request, *args, **kwargs):
    """
    Creates a number of new History objects
    """
    return self.create(request, *args, **kwargs)

class historiesGet(mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView):
  """  
  Lists available History objects  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = History.objects.all()  
  serializer_class = serializers.HistorySerializer
  def get(self, request, *args, **kwargs):
    """
    Lists available History objects
    """
    return self.list(request, *args, **kwargs)
  def post(self, request, *args, **kwargs):
    """
    Creates a new History object
    """
    return self.create(request, *args, **kwargs)

class historiesIdDeletePost(mixins.DestroyModelMixin, generics.GenericAPIView):
  """  
  Deletes a specific History object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = History.objects.all()  
  serializer_class = serializers.HistorySerializer
  def post(self, request, *args, **kwargs):
    """
    Destroys the specified History object
    """
    return self.destroy(request, *args, **kwargs)


class historiesIdGet(mixins.RetrieveModelMixin, mixins.UpdateModelMixin, generics.GenericAPIView):
  """  
  Gets a specific History object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = History.objects.all()  
  serializer_class = serializers.HistorySerializer
  def get(self, request, *args, **kwargs):
    """
    Retrieves the specified History object
    """
    return self.retrieve(request, *args, **kwargs)
  def put(self, request, *args, **kwargs):
    """
    Updates the specified History object
    """
    return self.update(request, *args, **kwargs)

class historiesIdPut(APIView):
  """  
  Updates a specific History object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = History.objects.all()  
  serializer_class = serializers.HistorySerializer  
  def put(self, request, id, item):
    return Response()

class historiesPost(APIView):
  """  
  Creates a new History object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = History.objects.all()  
  serializer_class = serializers.HistorySerializer  
  def post(self, request, item):
    return Response()

class lookuplistsBulkPost(BulkCreateModelMixin, generics.GenericAPIView):
  """  
  Bulk create / update a number of LookupList object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = LookupList.objects.all()  
  serializer_class = serializers.LookupListSerializer
  def post(self, request, *args, **kwargs):
    """
    Creates a number of new LookupList objects
    """
    return self.create(request, *args, **kwargs)

class lookuplistsGet(mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView):
  """  
  Lists available LookupList objects  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = LookupList.objects.all()  
  serializer_class = serializers.LookupListSerializer
  def get(self, request, *args, **kwargs):
    """
    Lists available LookupList objects
    """
    return self.list(request, *args, **kwargs)
  def post(self, request, *args, **kwargs):
    """
    Creates a new LookupList object
    """
    return self.create(request, *args, **kwargs)

class lookuplistsIdDeletePost(mixins.DestroyModelMixin, generics.GenericAPIView):
  """  
  Deletes a specific LookupList object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = LookupList.objects.all()  
  serializer_class = serializers.LookupListSerializer
  def post(self, request, *args, **kwargs):
    """
    Destroys the specified LookupList object
    """
    return self.destroy(request, *args, **kwargs)


class lookuplistsIdGet(mixins.RetrieveModelMixin, mixins.UpdateModelMixin, generics.GenericAPIView):
  """  
  Gets a specific LookupList object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = LookupList.objects.all()  
  serializer_class = serializers.LookupListSerializer
  def get(self, request, *args, **kwargs):
    """
    Retrieves the specified LookupList object
    """
    return self.retrieve(request, *args, **kwargs)
  def put(self, request, *args, **kwargs):
    """
    Updates the specified LookupList object
    """
    return self.update(request, *args, **kwargs)

class lookuplistsIdPut(APIView):
  """  
  Updates a specific LookupList object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = LookupList.objects.all()  
  serializer_class = serializers.LookupListSerializer  
  def put(self, request, id, item):
    return Response()

class lookuplistsPost(APIView):
  """  
  Creates a new LookupList object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = LookupList.objects.all()  
  serializer_class = serializers.LookupListSerializer  
  def post(self, request, item):
    return Response()

class notesBulkPost(BulkCreateModelMixin, generics.GenericAPIView):
  """  
  Bulk create / update a number of Note object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = Note.objects.all()  
  serializer_class = serializers.NoteSerializer
  def post(self, request, *args, **kwargs):
    """
    Creates a number of new Note objects
    """
    return self.create(request, *args, **kwargs)

class notesGet(mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView):
  """  
  Lists available Note objects  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = Note.objects.all()  
  serializer_class = serializers.NoteSerializer
  def get(self, request, *args, **kwargs):
    """
    Lists available Note objects
    """
    return self.list(request, *args, **kwargs)
  def post(self, request, *args, **kwargs):
    """
    Creates a new Note object
    """
    return self.create(request, *args, **kwargs)

class notesIdDeletePost(mixins.DestroyModelMixin, generics.GenericAPIView):
  """  
  Deletes a specific Note object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = Note.objects.all()  
  serializer_class = serializers.NoteSerializer
  def post(self, request, *args, **kwargs):
    """
    Destroys the specified Note object
    """
    return self.destroy(request, *args, **kwargs)


class notesIdGet(mixins.RetrieveModelMixin, mixins.UpdateModelMixin, generics.GenericAPIView):
  """  
  Gets a specific Note object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = Note.objects.all()  
  serializer_class = serializers.NoteSerializer
  def get(self, request, *args, **kwargs):
    """
    Retrieves the specified Note object
    """
    return self.retrieve(request, *args, **kwargs)
  def put(self, request, *args, **kwargs):
    """
    Updates the specified Note object
    """
    return self.update(request, *args, **kwargs)

class notesIdPut(APIView):
  """  
  Updates a specific Note object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = Note.objects.all()  
  serializer_class = serializers.NoteSerializer  
  def put(self, request, id, item):
    return Response()

class notesPost(APIView):
  """  
  Creates a new Note object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = Note.objects.all()  
  serializer_class = serializers.NoteSerializer  
  def post(self, request, item):
    return Response()

class notificationsBulkPost(BulkCreateModelMixin, generics.GenericAPIView):
  """  
  Bulk create / update a number of Notification object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = Notification.objects.all()  
  serializer_class = serializers.NotificationSerializer
  def post(self, request, *args, **kwargs):
    """
    Creates a number of new Notification objects
    """
    return self.create(request, *args, **kwargs)

class notificationsGet(mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView):
  """  
  Lists available Notification objects  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = Notification.objects.all()  
  serializer_class = serializers.NotificationSerializer
  def get(self, request, *args, **kwargs):
    """
    Lists available Notification objects
    """
    return self.list(request, *args, **kwargs)
  def post(self, request, *args, **kwargs):
    """
    Creates a new Notification object
    """
    return self.create(request, *args, **kwargs)

class notificationsIdDeletePost(mixins.DestroyModelMixin, generics.GenericAPIView):
  """  
  Deletes a specific Notification object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = Notification.objects.all()  
  serializer_class = serializers.NotificationSerializer
  def post(self, request, *args, **kwargs):
    """
    Destroys the specified Notification object
    """
    return self.destroy(request, *args, **kwargs)


class notificationsIdGet(mixins.RetrieveModelMixin, mixins.UpdateModelMixin, generics.GenericAPIView):
  """  
  Gets a specific Notification object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = Notification.objects.all()  
  serializer_class = serializers.NotificationSerializer
  def get(self, request, *args, **kwargs):
    """
    Retrieves the specified Notification object
    """
    return self.retrieve(request, *args, **kwargs)
  def put(self, request, *args, **kwargs):
    """
    Updates the specified Notification object
    """
    return self.update(request, *args, **kwargs)

class notificationsIdPut(APIView):
  """  
  Updates a specific Notification object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = Notification.objects.all()  
  serializer_class = serializers.NotificationSerializer  
  def put(self, request, id, item):
    return Response()

class notificationsPost(APIView):
  """  
  Creates a new Notification object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = Notification.objects.all()  
  serializer_class = serializers.NotificationSerializer  
  def post(self, request, item):
    return Response()

class notificationeventsBulkPost(BulkCreateModelMixin, generics.GenericAPIView):
  """  
  Bulk create / update a number of NotificationEvent object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = NotificationEvent.objects.all()  
  serializer_class = serializers.NotificationEventSerializer
  def post(self, request, *args, **kwargs):
    """
    Creates a number of new NotificationEvent objects
    """
    return self.create(request, *args, **kwargs)

class notificationeventsGet(mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView):
  """  
  Lists available NotificationEvent objects  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = NotificationEvent.objects.all()  
  serializer_class = serializers.NotificationEventSerializer
  def get(self, request, *args, **kwargs):
    """
    Lists available NotificationEvent objects
    """
    return self.list(request, *args, **kwargs)
  def post(self, request, *args, **kwargs):
    """
    Creates a new NotificationEvent object
    """
    return self.create(request, *args, **kwargs)

class notificationeventsIdDeletePost(mixins.DestroyModelMixin, generics.GenericAPIView):
  """  
  Deletes a specific NotificationEvent object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = NotificationEvent.objects.all()  
  serializer_class = serializers.NotificationEventSerializer
  def post(self, request, *args, **kwargs):
    """
    Destroys the specified NotificationEvent object
    """
    return self.destroy(request, *args, **kwargs)


class notificationeventsIdGet(mixins.RetrieveModelMixin, mixins.UpdateModelMixin, generics.GenericAPIView):
  """  
  Gets a specific NotificationEvent object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = NotificationEvent.objects.all()  
  serializer_class = serializers.NotificationEventSerializer
  def get(self, request, *args, **kwargs):
    """
    Retrieves the specified NotificationEvent object
    """
    return self.retrieve(request, *args, **kwargs)
  def put(self, request, *args, **kwargs):
    """
    Updates the specified NotificationEvent object
    """
    return self.update(request, *args, **kwargs)

class notificationeventsIdPut(APIView):
  """  
  Updates a specific NotificationEvent object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = NotificationEvent.objects.all()  
  serializer_class = serializers.NotificationEventSerializer  
  def put(self, request, id, item):
    return Response()

class notificationeventsPost(APIView):
  """  
  Creates a new NotificationEvent object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = NotificationEvent.objects.all()  
  serializer_class = serializers.NotificationEventSerializer  
  def post(self, request, item):
    return Response()

class permissionsBulkPost(BulkCreateModelMixin, generics.GenericAPIView):
  """  
  Bulk create / update a number of PermissionViewModel object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = Permission.objects.all()  
  serializer_class = serializers.PermissionSerializer
  def post(self, request, *args, **kwargs):
    """
    Creates a number of new Permission objects
    """
    return self.create(request, *args, **kwargs)

class permissionsGet(mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView):
  """  
  Lists available PermissionViewModel objects  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = Permission.objects.all()  
  serializer_class = serializers.PermissionSerializer
  def get(self, request, *args, **kwargs):
    """
    Lists available Permission objects
    """
    return self.list(request, *args, **kwargs)
  def post(self, request, *args, **kwargs):
    """
    Creates a new Permission object
    """
    return self.create(request, *args, **kwargs)

class permissionsIdDeletePost(mixins.DestroyModelMixin, generics.GenericAPIView):
  """  
  Deletes a specific PermissionViewModel object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = Permission.objects.all()  
  serializer_class = serializers.PermissionSerializer
  def post(self, request, *args, **kwargs):
    """
    Destroys the specified Permission object
    """
    return self.destroy(request, *args, **kwargs)


class permissionsIdGet(mixins.RetrieveModelMixin, mixins.UpdateModelMixin, generics.GenericAPIView):
  """  
  Gets a specific PermissionViewModel object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = Permission.objects.all()  
  serializer_class = serializers.PermissionSerializer
  def get(self, request, *args, **kwargs):
    """
    Retrieves the specified Permission object
    """
    return self.retrieve(request, *args, **kwargs)
  def put(self, request, *args, **kwargs):
    """
    Updates the specified Permission object
    """
    return self.update(request, *args, **kwargs)

class permissionsIdPut(APIView):
  """  
  Updates a specific PermissionViewModel object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = Permission.objects.all()  
  serializer_class = serializers.PermissionSerializer  
  def put(self, request, id, item):
    return Response()

class permissionsPost(APIView):
  """  
  Creates a new PermissionViewModel object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = Permission.objects.all()  
  serializer_class = serializers.PermissionSerializer  
  def post(self, request, item):
    return Response()

class rolesBulkPost(BulkCreateModelMixin, generics.GenericAPIView):
  """  
  Bulk create / update a number of RoleViewModel object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = Role.objects.all()  
  serializer_class = serializers.RoleSerializer
  def post(self, request, *args, **kwargs):
    """
    Creates a number of new Role objects
    """
    return self.create(request, *args, **kwargs)

class rolesGet(mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView):
  """  
  Lists available RoleViewModel objects  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = Role.objects.all()  
  serializer_class = serializers.RoleSerializer
  def get(self, request, *args, **kwargs):
    """
    Lists available Role objects
    """
    return self.list(request, *args, **kwargs)
  def post(self, request, *args, **kwargs):
    """
    Creates a new Role object
    """
    return self.create(request, *args, **kwargs)

class rolesIdDeletePost(mixins.DestroyModelMixin, generics.GenericAPIView):
  """  
  Deletes a specific RoleViewModel object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = Role.objects.all()  
  serializer_class = serializers.RoleSerializer
  def post(self, request, *args, **kwargs):
    """
    Destroys the specified Role object
    """
    return self.destroy(request, *args, **kwargs)


class rolesIdGet(mixins.RetrieveModelMixin, mixins.UpdateModelMixin, generics.GenericAPIView):
  """  
  Gets a specific RoleViewModel object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = Role.objects.all()  
  serializer_class = serializers.RoleSerializer
  def get(self, request, *args, **kwargs):
    """
    Retrieves the specified Role object
    """
    return self.retrieve(request, *args, **kwargs)
  def put(self, request, *args, **kwargs):
    """
    Updates the specified Role object
    """
    return self.update(request, *args, **kwargs)

class rolesIdPermissionsGet(APIView):
  """  
  Get all the permissions for a role  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  def get(self, request, id):
    return Response()

class rolesIdPermissionsPost(APIView):
  """  
  Adds a permissions to a role  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  def post(self, request, id, item):
    return Response()

class rolesIdPermissionsPut(APIView):
  """  
  Updates the permissions for a role  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  def put(self, request, id, items):
    return Response()

class rolesIdPut(APIView):
  """  
  Updates a specific RoleViewModel object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = Role.objects.all()  
  serializer_class = serializers.RoleSerializer  
  def put(self, request, id, item):
    return Response()

class rolesIdUsersGet(APIView):
  """  
  Gets all the users for a role  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  def get(self, request, id):
    return Response()

class rolesIdUsersPut(APIView):
  """  
  Updates the users for a role  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  def put(self, request, id, items):
    return Response()

class rolesPost(APIView):
  """  
  Creates a new RoleViewModel object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = Role.objects.all()  
  serializer_class = serializers.RoleSerializer  
  def post(self, request, item):
    return Response()

class usersBulkPost(BulkCreateModelMixin, generics.GenericAPIView):
  """  
  Adds a number of users  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = User.objects.all()  
  serializer_class = serializers.UserSerializer
  def post(self, request, *args, **kwargs):
    """
    Creates a number of new User objects
    """
    return self.create(request, *args, **kwargs)

class usersGet(mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView):
  """  
  Returns all users  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = User.objects.all()  
  serializer_class = serializers.UserSerializer
  def get(self, request, *args, **kwargs):
    """
    Lists available User objects
    """
    return self.list(request, *args, **kwargs)
  def post(self, request, *args, **kwargs):
    """
    Creates a new User object
    """
    return self.create(request, *args, **kwargs)

class usersIdDeletePost(mixins.DestroyModelMixin, generics.GenericAPIView):
  """  
  Deletes a user  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = User.objects.all()  
  serializer_class = serializers.UserSerializer
  def post(self, request, *args, **kwargs):
    """
    Destroys the specified User object
    """
    return self.destroy(request, *args, **kwargs)


class usersIdFavouritesGet(APIView):
  """  
  Returns the favourites for a user  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  def get(self, request, id):
    return Response()

class usersIdFavouritesPost(APIView):
  """  
  Adds favourites to a user  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  def post(self, request, id, item):
    return Response()

class usersIdFavouritesPut(APIView):
  """  
  Updates the favourites for a user  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  def put(self, request, id, items):
    return Response()

class usersIdGet(mixins.RetrieveModelMixin, mixins.UpdateModelMixin, generics.GenericAPIView):
  """  
  Returns data for a particular user  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = User.objects.all()  
  serializer_class = serializers.UserSerializer
  def get(self, request, *args, **kwargs):
    """
    Retrieves the specified User object
    """
    return self.retrieve(request, *args, **kwargs)
  def put(self, request, *args, **kwargs):
    """
    Updates the specified User object
    """
    return self.update(request, *args, **kwargs)

class usersIdGroupsGet(APIView):
  """  
  Returns all groups that a user is a member of  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  def get(self, request, id):
    return Response()

class usersIdGroupsPost(APIView):
  """  
  Add to the active set of groups for a user  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  def post(self, request, id, item):
    return Response()

class usersIdGroupsPut(APIView):
  """  
  Updates the active set of groups for a user  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  def put(self, request, id, items):
    return Response()

class usersIdNotificationsGet(APIView):
  """  
  Returns a user's notifications  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  def get(self, request, id):
    return Response()

class usersIdPermissionsGet(APIView):
  """  
  Returns the set of permissions for a user  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  def get(self, request, id):
    return Response()

class usersIdPut(APIView):
  """  
    
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = User.objects.all()  
  serializer_class = serializers.UserSerializer  
  def put(self, request, id, item):
    return Response()

class usersIdRolesGet(APIView):
  """  
  Returns the roles for a user  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  def get(self, request, id):
    return Response()

class usersIdRolesPost(APIView):
  """  
  Adds a role to a user  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  def post(self, request, id, item):
    return Response()

class usersIdRolesPut(APIView):
  """  
  Updates the roles for a user  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  def put(self, request, id, items):
    return Response()

class usersPost(APIView):
  """  
  Create new user  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = User.objects.all()  
  serializer_class = serializers.UserSerializer  
  def post(self, request, item):
    return Response()

class usersSearchGet(APIView):
  """  
  Searches Users  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  def get(self, request, fuelSuppliers = None, surname = None, includeInactive = None):
    return Response()


