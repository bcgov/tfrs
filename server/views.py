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

from auditable.views import AuditableMixin


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

class groupmembershipsBulkPost(BulkCreateModelMixin, generics.GenericAPIView):
  """  
  Bulk create / update a number of GroupMembership object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = GroupMembership.objects.all()  
  serializer_class = serializers.GroupMembershipSerializer
  def post(self, request, *args, **kwargs):
    """
    Creates a number of new GroupMembership objects
    """
    return self.create(request, *args, **kwargs)

class groupmembershipsGet(mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView):
  """  
  Lists available GroupMembership objects  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = GroupMembership.objects.all()  
  serializer_class = serializers.GroupMembershipSerializer
  def get(self, request, *args, **kwargs):
    """
    Lists available GroupMembership objects
    """
    return self.list(request, *args, **kwargs)
  def post(self, request, *args, **kwargs):
    """
    Creates a new GroupMembership object
    """
    return self.create(request, *args, **kwargs)

class groupmembershipsIdDeletePost(mixins.DestroyModelMixin, generics.GenericAPIView):
  """  
  Deletes a specific GroupMembership object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = GroupMembership.objects.all()  
  serializer_class = serializers.GroupMembershipSerializer
  def post(self, request, *args, **kwargs):
    """
    Destroys the specified GroupMembership object
    """
    return self.destroy(request, *args, **kwargs)


class groupmembershipsIdGet(mixins.RetrieveModelMixin, mixins.UpdateModelMixin, generics.GenericAPIView):
  """  
  Gets a specific GroupMembership object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = GroupMembership.objects.all()  
  serializer_class = serializers.GroupMembershipSerializer
  def get(self, request, *args, **kwargs):
    """
    Retrieves the specified GroupMembership object
    """
    return self.retrieve(request, *args, **kwargs)
  def put(self, request, *args, **kwargs):
    """
    Updates the specified GroupMembership object
    """
    return self.update(request, *args, **kwargs)

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

class notesBulkPost(AuditableMixin, BulkCreateModelMixin, generics.GenericAPIView):
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

class notesGet(AuditableMixin, mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView):
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

class notesIdDeletePost(AuditableMixin, mixins.DestroyModelMixin, generics.GenericAPIView):
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


class notesIdGet(AuditableMixin, mixins.RetrieveModelMixin, mixins.UpdateModelMixin, generics.GenericAPIView):
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

class offersBulkPost(BulkCreateModelMixin, generics.GenericAPIView):
  """  
  Bulk create / update a number of Offer object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = Offer.objects.all()  
  serializer_class = serializers.OfferSerializer
  def post(self, request, *args, **kwargs):
    """
    Creates a number of new Offer objects
    """
    return self.create(request, *args, **kwargs)

class offersGet(mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView):
  """  
  Lists available Offer objects  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = Offer.objects.all()  
  serializer_class = serializers.OfferSerializer
  def get(self, request, *args, **kwargs):
    """
    Lists available Offer objects
    """
    return self.list(request, *args, **kwargs)
  def post(self, request, *args, **kwargs):
    """
    Creates a new Offer object
    """
    return self.create(request, *args, **kwargs)

class offersIdDeletePost(mixins.DestroyModelMixin, generics.GenericAPIView):
  """  
  Deletes a specific Offer object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = Offer.objects.all()  
  serializer_class = serializers.OfferSerializer
  def post(self, request, *args, **kwargs):
    """
    Destroys the specified Offer object
    """
    return self.destroy(request, *args, **kwargs)


class offersIdGet(mixins.RetrieveModelMixin, mixins.UpdateModelMixin, generics.GenericAPIView):
  """  
  Gets a specific Offer object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = Offer.objects.all()  
  serializer_class = serializers.OfferSerializer
  def get(self, request, *args, **kwargs):
    """
    Retrieves the specified Offer object
    """
    return self.retrieve(request, *args, **kwargs)
  def put(self, request, *args, **kwargs):
    """
    Updates the specified Offer object
    """
    return self.update(request, *args, **kwargs)

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

class rolepermissionsBulkPost(BulkCreateModelMixin, generics.GenericAPIView):
  """  
  Bulk create / update a number of RolePermission object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = RolePermission.objects.all()  
  serializer_class = serializers.RolePermissionSerializer
  def post(self, request, *args, **kwargs):
    """
    Creates a number of new RolePermission objects
    """
    return self.create(request, *args, **kwargs)

class rolepermissionsGet(mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView):
  """  
  Lists available RolePermission objects  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = RolePermission.objects.all()  
  serializer_class = serializers.RolePermissionSerializer
  def get(self, request, *args, **kwargs):
    """
    Lists available RolePermission objects
    """
    return self.list(request, *args, **kwargs)
  def post(self, request, *args, **kwargs):
    """
    Creates a new RolePermission object
    """
    return self.create(request, *args, **kwargs)

class rolepermissionsIdDeletePost(mixins.DestroyModelMixin, generics.GenericAPIView):
  """  
  Deletes a specific RolePermission object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = RolePermission.objects.all()  
  serializer_class = serializers.RolePermissionSerializer
  def post(self, request, *args, **kwargs):
    """
    Destroys the specified RolePermission object
    """
    return self.destroy(request, *args, **kwargs)


class rolepermissionsIdGet(mixins.RetrieveModelMixin, mixins.UpdateModelMixin, generics.GenericAPIView):
  """  
  Gets a specific RolePermission object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = RolePermission.objects.all()  
  serializer_class = serializers.RolePermissionSerializer
  def get(self, request, *args, **kwargs):
    """
    Retrieves the specified RolePermission object
    """
    return self.retrieve(request, *args, **kwargs)
  def put(self, request, *args, **kwargs):
    """
    Updates the specified RolePermission object
    """
    return self.update(request, *args, **kwargs)

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

class userrolesBulkPost(BulkCreateModelMixin, generics.GenericAPIView):
  """  
  Bulk create / update a number of UserRole object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = UserRole.objects.all()  
  serializer_class = serializers.UserRoleSerializer
  def post(self, request, *args, **kwargs):
    """
    Creates a number of new UserRole objects
    """
    return self.create(request, *args, **kwargs)

class userrolesGet(mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView):
  """  
  Lists available UserRole objects  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = UserRole.objects.all()  
  serializer_class = serializers.UserRoleSerializer
  def get(self, request, *args, **kwargs):
    """
    Lists available UserRole objects
    """
    return self.list(request, *args, **kwargs)
  def post(self, request, *args, **kwargs):
    """
    Creates a new UserRole object
    """
    return self.create(request, *args, **kwargs)

class userrolesIdDeletePost(mixins.DestroyModelMixin, generics.GenericAPIView):
  """  
  Deletes a specific UserRole object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = UserRole.objects.all()  
  serializer_class = serializers.UserRoleSerializer
  def post(self, request, *args, **kwargs):
    """
    Destroys the specified UserRole object
    """
    return self.destroy(request, *args, **kwargs)


class userrolesIdGet(mixins.RetrieveModelMixin, mixins.UpdateModelMixin, generics.GenericAPIView):
  """  
  Gets a specific UserRole object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = UserRole.objects.all()  
  serializer_class = serializers.UserRoleSerializer
  def get(self, request, *args, **kwargs):
    """
    Retrieves the specified UserRole object
    """
    return self.retrieve(request, *args, **kwargs)
  def put(self, request, *args, **kwargs):
    """
    Updates the specified UserRole object
    """
    return self.update(request, *args, **kwargs)


