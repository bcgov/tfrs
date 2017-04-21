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
  permission_classes = (permissions.AllowAny,)  
  queryset = Attachment.objects.all()  
  serializer_class = serializers.AttachmentSerializer
  def post(self, request, items):
    return self.create(request, items)



class attachmentsGet(mixins.ListModelMixin, generics.GenericAPIView):
  """  
  Lists available Attachment objects  
  """
  permission_classes = (permissions.AllowAny,)  
  queryset = Attachment.objects.all()  
  serializer_class = serializers.AttachmentSerializer
  def get(self, request, ):
    return self.list(request, )



class attachmentsIdDeletePost(mixins.DestroyModelMixin, generics.GenericAPIView):
  """  
  Deletes a specific Attachment object  
  """
  permission_classes = (permissions.AllowAny,)  
  queryset = Attachment.objects.all()  
  serializer_class = serializers.AttachmentSerializer
  def post(self, request, id):
    return self.destroy(request, id)



class attachmentsIdDownloadGet(APIView):
  """  
  Returns the binary file component of an attachment  
  """
  permission_classes = (permissions.AllowAny,)
  def get(self, request, id):
    return Response()



class attachmentsIdGet(mixins.RetrieveModelMixin, generics.GenericAPIView):
  """  
  Gets a specific Attachment object  
  """
  permission_classes = (permissions.AllowAny,)  
  queryset = Attachment.objects.all()  
  serializer_class = serializers.AttachmentSerializer
  def get(self, request, id):
    return self.retrieve(request, id)



class attachmentsIdPut(mixins.UpdateModelMixin, generics.GenericAPIView):
  """  
  Updates a specific Attachment object  
  """
  permission_classes = (permissions.AllowAny,)  
  queryset = Attachment.objects.all()  
  serializer_class = serializers.AttachmentSerializer
  def put(self, request, id, item):
    return self.update(request, id, item)



class attachmentsPost(mixins.CreateModelMixin, generics.GenericAPIView):
  """  
  Creates a new Attachment object  
  """
  permission_classes = (permissions.AllowAny,)  
  queryset = Attachment.objects.all()  
  serializer_class = serializers.AttachmentSerializer
  def post(self, request, item):
    return self.create(request, item)



class complianceperiodsBulkPost(BulkCreateModelMixin, generics.GenericAPIView):
  """  
  Bulk create / update a number of CompliancePeriod object  
  """
  permission_classes = (permissions.AllowAny,)  
  queryset = CompliancePeriod.objects.all()  
  serializer_class = serializers.CompliancePeriodSerializer
  def post(self, request, items):
    return self.create(request, items)



class complianceperiodsGet(mixins.ListModelMixin, generics.GenericAPIView):
  """  
  Lists available CompliancePeriod objects  
  """
  permission_classes = (permissions.AllowAny,)  
  queryset = CompliancePeriod.objects.all()  
  serializer_class = serializers.CompliancePeriodSerializer
  def get(self, request, ):
    return self.list(request, )



class complianceperiodsIdDeletePost(mixins.DestroyModelMixin, generics.GenericAPIView):
  """  
  Deletes a specific CompliancePeriod object  
  """
  permission_classes = (permissions.AllowAny,)  
  queryset = CompliancePeriod.objects.all()  
  serializer_class = serializers.CompliancePeriodSerializer
  def post(self, request, id):
    return self.destroy(request, id)



class complianceperiodsIdGet(mixins.RetrieveModelMixin, generics.GenericAPIView):
  """  
  Gets a specific CompliancePeriod object  
  """
  permission_classes = (permissions.AllowAny,)  
  queryset = CompliancePeriod.objects.all()  
  serializer_class = serializers.CompliancePeriodSerializer
  def get(self, request, id):
    return self.retrieve(request, id)



class complianceperiodsIdPut(mixins.UpdateModelMixin, generics.GenericAPIView):
  """  
  Updates a specific CompliancePeriod object  
  """
  permission_classes = (permissions.AllowAny,)  
  queryset = CompliancePeriod.objects.all()  
  serializer_class = serializers.CompliancePeriodSerializer
  def put(self, request, id, item):
    return self.update(request, id, item)



class complianceperiodsPost(mixins.CreateModelMixin, generics.GenericAPIView):
  """  
  Creates a new CompliancePeriod object  
  """
  permission_classes = (permissions.AllowAny,)  
  queryset = CompliancePeriod.objects.all()  
  serializer_class = serializers.CompliancePeriodSerializer
  def post(self, request, item):
    return self.create(request, item)



class contactsBulkPost(BulkCreateModelMixin, generics.GenericAPIView):
  """  
  Bulk create / update a number of Contact object  
  """
  permission_classes = (permissions.AllowAny,)  
  queryset = Contact.objects.all()  
  serializer_class = serializers.ContactSerializer
  def post(self, request, items):
    return self.create(request, items)



class contactsGet(mixins.ListModelMixin, generics.GenericAPIView):
  """  
  Lists available Contact objects  
  """
  permission_classes = (permissions.AllowAny,)  
  queryset = Contact.objects.all()  
  serializer_class = serializers.ContactSerializer
  def get(self, request, ):
    return self.list(request, )



class contactsIdDeletePost(mixins.DestroyModelMixin, generics.GenericAPIView):
  """  
  Deletes a specific Contact object  
  """
  permission_classes = (permissions.AllowAny,)  
  queryset = Contact.objects.all()  
  serializer_class = serializers.ContactSerializer
  def post(self, request, id):
    return self.destroy(request, id)



class contactsIdGet(mixins.RetrieveModelMixin, generics.GenericAPIView):
  """  
  Gets a specific Contact object  
  """
  permission_classes = (permissions.AllowAny,)  
  queryset = Contact.objects.all()  
  serializer_class = serializers.ContactSerializer
  def get(self, request, id):
    return self.retrieve(request, id)



class contactsIdPut(mixins.UpdateModelMixin, generics.GenericAPIView):
  """  
  Updates a specific Contact object  
  """
  permission_classes = (permissions.AllowAny,)  
  queryset = Contact.objects.all()  
  serializer_class = serializers.ContactSerializer
  def put(self, request, id, item):
    return self.update(request, id, item)



class contactsPost(mixins.CreateModelMixin, generics.GenericAPIView):
  """  
  Creates a new Contact object  
  """
  permission_classes = (permissions.AllowAny,)  
  queryset = Contact.objects.all()  
  serializer_class = serializers.ContactSerializer
  def post(self, request, item):
    return self.create(request, item)



class creditTradeIdNotesGet(APIView):
  """  
  Returns notes for a particular CreditTrade  
  """
  permission_classes = (permissions.AllowAny,)
  def get(self, request, id):
    return Response()



class credittradesBulkPost(BulkCreateModelMixin, generics.GenericAPIView):
  """  
  Bulk create / update a number of CreditTrade object  
  """
  permission_classes = (permissions.AllowAny,)  
  queryset = CreditTrade.objects.all()  
  serializer_class = serializers.CreditTradeSerializer
  def post(self, request, items):
    return self.create(request, items)



class credittradesGet(mixins.ListModelMixin, generics.GenericAPIView):
  """  
  Lists available CreditTrade objects  
  """
  permission_classes = (permissions.AllowAny,)  
  queryset = CreditTrade.objects.all()  
  serializer_class = serializers.CreditTradeSerializer
  def get(self, request, ):
    return self.list(request, )



class credittradesIdAttachmentsGet(APIView):
  """  
  Returns attachments for a particular CreditTrade  
  """
  permission_classes = (permissions.AllowAny,)
  def get(self, request, id):
    return Response()



class credittradesIdDeletePost(mixins.DestroyModelMixin, generics.GenericAPIView):
  """  
  Deletes a specific CreditTrade object  
  """
  permission_classes = (permissions.AllowAny,)  
  queryset = CreditTrade.objects.all()  
  serializer_class = serializers.CreditTradeSerializer
  def post(self, request, id):
    return self.destroy(request, id)



class credittradesIdGet(mixins.RetrieveModelMixin, generics.GenericAPIView):
  """  
  Gets a specific CreditTrade object  
  """
  permission_classes = (permissions.AllowAny,)  
  queryset = CreditTrade.objects.all()  
  serializer_class = serializers.CreditTradeSerializer
  def get(self, request, id):
    return self.retrieve(request, id)



class credittradesIdHistoryGet(APIView):
  """  
  Returns History for a particular CreditTrade  
  """
  permission_classes = (permissions.AllowAny,)
  def get(self, request, id, offset = None, limit = None):
    return Response()



class credittradesIdHistoryPost(APIView):
  """  
  Add a History record to the CreditTrade  
  """
  permission_classes = (permissions.AllowAny,)
  def post(self, request, id, item):
    return Response()



class credittradesIdPut(mixins.UpdateModelMixin, generics.GenericAPIView):
  """  
  Updates a specific CreditTrade object  
  """
  permission_classes = (permissions.AllowAny,)  
  queryset = CreditTrade.objects.all()  
  serializer_class = serializers.CreditTradeSerializer
  def put(self, request, id, item):
    return self.update(request, id, item)



class credittradesPost(mixins.CreateModelMixin, generics.GenericAPIView):
  """  
  Creates a new CreditTrade object  
  """
  permission_classes = (permissions.AllowAny,)  
  queryset = CreditTrade.objects.all()  
  serializer_class = serializers.CreditTradeSerializer
  def post(self, request, item):
    return self.create(request, item)



class credittradingSearchGet(APIView):
  """  
  Searches credit trades  
  """
  permission_classes = (permissions.AllowAny,)
  def get(self, request, organization = None, tradeType = None, status = None, dateType = None, startDate = None, endDate = None):
    return Response()



class credittradetradelogentriesBulkPost(BulkCreateModelMixin, generics.GenericAPIView):
  """  
  Bulk create / update a number of CreditTradeLogEntry object  
  """
  permission_classes = (permissions.AllowAny,)  
  queryset = CreditTradeLogEntry.objects.all()  
  serializer_class = serializers.CreditTradeLogEntrySerializer
  def post(self, request, items):
    return self.create(request, items)



class credittradetradelogentriesGet(mixins.ListModelMixin, generics.GenericAPIView):
  """  
  Lists available CreditTradeLogEntry objects  
  """
  permission_classes = (permissions.AllowAny,)  
  queryset = CreditTradeLogEntry.objects.all()  
  serializer_class = serializers.CreditTradeLogEntrySerializer
  def get(self, request, ):
    return self.list(request, )



class credittradetradelogentriesIdDeletePost(mixins.DestroyModelMixin, generics.GenericAPIView):
  """  
  Deletes a specific CreditTradeLogEntry object  
  """
  permission_classes = (permissions.AllowAny,)  
  queryset = CreditTradeLogEntry.objects.all()  
  serializer_class = serializers.CreditTradeLogEntrySerializer
  def post(self, request, id):
    return self.destroy(request, id)



class credittradetradelogentriesIdGet(mixins.RetrieveModelMixin, generics.GenericAPIView):
  """  
  Gets a specific CreditTradeLogEntry object  
  """
  permission_classes = (permissions.AllowAny,)  
  queryset = CreditTradeLogEntry.objects.all()  
  serializer_class = serializers.CreditTradeLogEntrySerializer
  def get(self, request, id):
    return self.retrieve(request, id)



class credittradetradelogentriesIdPut(mixins.UpdateModelMixin, generics.GenericAPIView):
  """  
  Updates a specific CreditTradeLogEntry object  
  """
  permission_classes = (permissions.AllowAny,)  
  queryset = CreditTradeLogEntry.objects.all()  
  serializer_class = serializers.CreditTradeLogEntrySerializer
  def put(self, request, id, item):
    return self.update(request, id, item)



class credittradetradelogentriesPost(mixins.CreateModelMixin, generics.GenericAPIView):
  """  
  Creates a new CreditTradeLogEntry object  
  """
  permission_classes = (permissions.AllowAny,)  
  queryset = CreditTradeLogEntry.objects.all()  
  serializer_class = serializers.CreditTradeLogEntrySerializer
  def post(self, request, item):
    return self.create(request, item)



class usersCurrentFavouritesIdDeletePost(APIView):
  """  
  Removes a specific user favourite  
  """
  permission_classes = (permissions.AllowAny,)
  def post(self, request, id):
    return Response()



class usersCurrentFavouritesPost(APIView):
  """  
  Create new favourite for the current user  
  """
  permission_classes = (permissions.AllowAny,)
  def post(self, request, item):
    return Response()



class usersCurrentFavouritesPut(APIView):
  """  
  Updates a favourite  
  """
  permission_classes = (permissions.AllowAny,)
  def put(self, request, item):
    return Response()



class usersCurrentFavouritesTypeGet(APIView):
  """  
  Returns a user's favourites of a given type.  If type is empty, returns all.  
  """
  permission_classes = (permissions.AllowAny,)
  def get(self, request, type):
    return Response()



class usersCurrentGet(APIView):
  """  
  Get the currently logged in user  
  """
  permission_classes = (permissions.AllowAny,)
  def get(self, request, ):
    return Response()



class fuelsuppliersBulkPost(BulkCreateModelMixin, generics.GenericAPIView):
  """  
  Bulk create / update a number of FuelSupplier object  
  """
  permission_classes = (permissions.AllowAny,)  
  queryset = FuelSupplier.objects.all()  
  serializer_class = serializers.FuelSupplierSerializer
  def post(self, request, items):
    return self.create(request, items)



class fuelsuppliersGet(mixins.ListModelMixin, generics.GenericAPIView):
  """  
  Lists available FuelSupplier objects  
  """
  permission_classes = (permissions.AllowAny,)  
  queryset = FuelSupplier.objects.all()  
  serializer_class = serializers.FuelSupplierSerializer
  def get(self, request, ):
    return self.list(request, )



class fuelsuppliersIdAttachmentsGet(APIView):
  """  
  Returns attachments for a particular FuelSupplier  
  """
  permission_classes = (permissions.AllowAny,)
  def get(self, request, id):
    return Response()



class fuelsuppliersIdDeletePost(mixins.DestroyModelMixin, generics.GenericAPIView):
  """  
  Deletes a specific FuelSupplier object  
  """
  permission_classes = (permissions.AllowAny,)  
  queryset = FuelSupplier.objects.all()  
  serializer_class = serializers.FuelSupplierSerializer
  def post(self, request, id):
    return self.destroy(request, id)



class fuelsuppliersIdGet(mixins.RetrieveModelMixin, generics.GenericAPIView):
  """  
  Gets a specific FuelSupplier object  
  """
  permission_classes = (permissions.AllowAny,)  
  queryset = FuelSupplier.objects.all()  
  serializer_class = serializers.FuelSupplierSerializer
  def get(self, request, id):
    return self.retrieve(request, id)



class fuelsuppliersIdHistoryGet(APIView):
  """  
  Returns History for a particular FuelSupplier  
  """
  permission_classes = (permissions.AllowAny,)
  def get(self, request, id, offset = None, limit = None):
    return Response()



class fuelsuppliersIdHistoryPost(APIView):
  """  
  Add a History record to the FuelSupplier  
  """
  permission_classes = (permissions.AllowAny,)
  def post(self, request, id, item):
    return Response()



class fuelsuppliersIdNotesGet(APIView):
  """  
  Returns notes for a particular FuelSupplier  
  """
  permission_classes = (permissions.AllowAny,)
  def get(self, request, id):
    return Response()



class fuelsuppliersIdPut(mixins.UpdateModelMixin, generics.GenericAPIView):
  """  
  Updates a specific FuelSupplier object  
  """
  permission_classes = (permissions.AllowAny,)  
  queryset = FuelSupplier.objects.all()  
  serializer_class = serializers.FuelSupplierSerializer
  def put(self, request, id, item):
    return self.update(request, id, item)



class fuelsuppliersPost(mixins.CreateModelMixin, generics.GenericAPIView):
  """  
  Creates a new FuelSupplier object  
  """
  permission_classes = (permissions.AllowAny,)  
  queryset = FuelSupplier.objects.all()  
  serializer_class = serializers.FuelSupplierSerializer
  def post(self, request, item):
    return self.create(request, item)



class fuelsuppliersSearchGet(APIView):
  """  
  Searches fuel suppliers  
  """
  permission_classes = (permissions.AllowAny,)
  def get(self, request, fuelSupplierName = None, includeInactive = None):
    return Response()



class groupsBulkPost(BulkCreateModelMixin, generics.GenericAPIView):
  """  
  Bulk create / update a number of Group object  
  """
  permission_classes = (permissions.AllowAny,)  
  queryset = Group.objects.all()  
  serializer_class = serializers.GroupSerializer
  def post(self, request, items):
    return self.create(request, items)



class groupsGet(mixins.ListModelMixin, generics.GenericAPIView):
  """  
  Lists available Group objects  
  """
  permission_classes = (permissions.AllowAny,)  
  queryset = Group.objects.all()  
  serializer_class = serializers.GroupSerializer
  def get(self, request, ):
    return self.list(request, )



class groupsIdDeletePost(mixins.DestroyModelMixin, generics.GenericAPIView):
  """  
  Deletes a specific Group object  
  """
  permission_classes = (permissions.AllowAny,)  
  queryset = Group.objects.all()  
  serializer_class = serializers.GroupSerializer
  def post(self, request, id):
    return self.destroy(request, id)



class groupsIdGet(mixins.RetrieveModelMixin, generics.GenericAPIView):
  """  
  Gets a specific Group object  
  """
  permission_classes = (permissions.AllowAny,)  
  queryset = Group.objects.all()  
  serializer_class = serializers.GroupSerializer
  def get(self, request, id):
    return self.retrieve(request, id)



class groupsIdPut(mixins.UpdateModelMixin, generics.GenericAPIView):
  """  
  Updates a specific Group object  
  """
  permission_classes = (permissions.AllowAny,)  
  queryset = Group.objects.all()  
  serializer_class = serializers.GroupSerializer
  def put(self, request, id, item):
    return self.update(request, id, item)



class groupsIdUsersGet(APIView):
  """  
  returns users in a given Group  
  """
  permission_classes = (permissions.AllowAny,)
  def get(self, request, id):
    return Response()



class groupsPost(mixins.CreateModelMixin, generics.GenericAPIView):
  """  
  Creates a new Group object  
  """
  permission_classes = (permissions.AllowAny,)  
  queryset = Group.objects.all()  
  serializer_class = serializers.GroupSerializer
  def post(self, request, item):
    return self.create(request, item)



class historiesBulkPost(BulkCreateModelMixin, generics.GenericAPIView):
  """  
  Bulk create / update a number of History object  
  """
  permission_classes = (permissions.AllowAny,)  
  queryset = History.objects.all()  
  serializer_class = serializers.HistorySerializer
  def post(self, request, items):
    return self.create(request, items)



class historiesGet(mixins.ListModelMixin, generics.GenericAPIView):
  """  
  Lists available History objects  
  """
  permission_classes = (permissions.AllowAny,)  
  queryset = History.objects.all()  
  serializer_class = serializers.HistorySerializer
  def get(self, request, ):
    return self.list(request, )



class historiesIdDeletePost(mixins.DestroyModelMixin, generics.GenericAPIView):
  """  
  Deletes a specific History object  
  """
  permission_classes = (permissions.AllowAny,)  
  queryset = History.objects.all()  
  serializer_class = serializers.HistorySerializer
  def post(self, request, id):
    return self.destroy(request, id)



class historiesIdGet(mixins.RetrieveModelMixin, generics.GenericAPIView):
  """  
  Gets a specific History object  
  """
  permission_classes = (permissions.AllowAny,)  
  queryset = History.objects.all()  
  serializer_class = serializers.HistorySerializer
  def get(self, request, id):
    return self.retrieve(request, id)



class historiesIdPut(mixins.UpdateModelMixin, generics.GenericAPIView):
  """  
  Updates a specific History object  
  """
  permission_classes = (permissions.AllowAny,)  
  queryset = History.objects.all()  
  serializer_class = serializers.HistorySerializer
  def put(self, request, id, item):
    return self.update(request, id, item)



class historiesPost(mixins.CreateModelMixin, generics.GenericAPIView):
  """  
  Creates a new History object  
  """
  permission_classes = (permissions.AllowAny,)  
  queryset = History.objects.all()  
  serializer_class = serializers.HistorySerializer
  def post(self, request, item):
    return self.create(request, item)



class lookuplistsBulkPost(BulkCreateModelMixin, generics.GenericAPIView):
  """  
  Bulk create / update a number of LookupList object  
  """
  permission_classes = (permissions.AllowAny,)  
  queryset = LookupList.objects.all()  
  serializer_class = serializers.LookupListSerializer
  def post(self, request, items):
    return self.create(request, items)



class lookuplistsGet(mixins.ListModelMixin, generics.GenericAPIView):
  """  
  Lists available LookupList objects  
  """
  permission_classes = (permissions.AllowAny,)  
  queryset = LookupList.objects.all()  
  serializer_class = serializers.LookupListSerializer
  def get(self, request, ):
    return self.list(request, )



class lookuplistsIdDeletePost(mixins.DestroyModelMixin, generics.GenericAPIView):
  """  
  Deletes a specific LookupList object  
  """
  permission_classes = (permissions.AllowAny,)  
  queryset = LookupList.objects.all()  
  serializer_class = serializers.LookupListSerializer
  def post(self, request, id):
    return self.destroy(request, id)



class lookuplistsIdGet(mixins.RetrieveModelMixin, generics.GenericAPIView):
  """  
  Gets a specific LookupList object  
  """
  permission_classes = (permissions.AllowAny,)  
  queryset = LookupList.objects.all()  
  serializer_class = serializers.LookupListSerializer
  def get(self, request, id):
    return self.retrieve(request, id)



class lookuplistsIdPut(mixins.UpdateModelMixin, generics.GenericAPIView):
  """  
  Updates a specific LookupList object  
  """
  permission_classes = (permissions.AllowAny,)  
  queryset = LookupList.objects.all()  
  serializer_class = serializers.LookupListSerializer
  def put(self, request, id, item):
    return self.update(request, id, item)



class lookuplistsPost(mixins.CreateModelMixin, generics.GenericAPIView):
  """  
  Creates a new LookupList object  
  """
  permission_classes = (permissions.AllowAny,)  
  queryset = LookupList.objects.all()  
  serializer_class = serializers.LookupListSerializer
  def post(self, request, item):
    return self.create(request, item)



class notesBulkPost(BulkCreateModelMixin, generics.GenericAPIView):
  """  
  Bulk create / update a number of Note object  
  """
  permission_classes = (permissions.AllowAny,)  
  queryset = Note.objects.all()  
  serializer_class = serializers.NoteSerializer
  def post(self, request, items):
    return self.create(request, items)



class notesGet(mixins.ListModelMixin, generics.GenericAPIView):
  """  
  Lists available Note objects  
  """
  permission_classes = (permissions.AllowAny,)  
  queryset = Note.objects.all()  
  serializer_class = serializers.NoteSerializer
  def get(self, request, ):
    return self.list(request, )



class notesIdDeletePost(mixins.DestroyModelMixin, generics.GenericAPIView):
  """  
  Deletes a specific Note object  
  """
  permission_classes = (permissions.AllowAny,)  
  queryset = Note.objects.all()  
  serializer_class = serializers.NoteSerializer
  def post(self, request, id):
    return self.destroy(request, id)



class notesIdGet(mixins.RetrieveModelMixin, generics.GenericAPIView):
  """  
  Gets a specific Note object  
  """
  permission_classes = (permissions.AllowAny,)  
  queryset = Note.objects.all()  
  serializer_class = serializers.NoteSerializer
  def get(self, request, id):
    return self.retrieve(request, id)



class notesIdPut(mixins.UpdateModelMixin, generics.GenericAPIView):
  """  
  Updates a specific Note object  
  """
  permission_classes = (permissions.AllowAny,)  
  queryset = Note.objects.all()  
  serializer_class = serializers.NoteSerializer
  def put(self, request, id, item):
    return self.update(request, id, item)



class notesPost(mixins.CreateModelMixin, generics.GenericAPIView):
  """  
  Creates a new Note object  
  """
  permission_classes = (permissions.AllowAny,)  
  queryset = Note.objects.all()  
  serializer_class = serializers.NoteSerializer
  def post(self, request, item):
    return self.create(request, item)



class notificationsBulkPost(BulkCreateModelMixin, generics.GenericAPIView):
  """  
  Bulk create / update a number of Notification object  
  """
  permission_classes = (permissions.AllowAny,)  
  queryset = Notification.objects.all()  
  serializer_class = serializers.NotificationSerializer
  def post(self, request, items):
    return self.create(request, items)



class notificationsGet(mixins.ListModelMixin, generics.GenericAPIView):
  """  
  Lists available Notification objects  
  """
  permission_classes = (permissions.AllowAny,)  
  queryset = Notification.objects.all()  
  serializer_class = serializers.NotificationSerializer
  def get(self, request, ):
    return self.list(request, )



class notificationsIdDeletePost(mixins.DestroyModelMixin, generics.GenericAPIView):
  """  
  Deletes a specific Notification object  
  """
  permission_classes = (permissions.AllowAny,)  
  queryset = Notification.objects.all()  
  serializer_class = serializers.NotificationSerializer
  def post(self, request, id):
    return self.destroy(request, id)



class notificationsIdGet(mixins.RetrieveModelMixin, generics.GenericAPIView):
  """  
  Gets a specific Notification object  
  """
  permission_classes = (permissions.AllowAny,)  
  queryset = Notification.objects.all()  
  serializer_class = serializers.NotificationSerializer
  def get(self, request, id):
    return self.retrieve(request, id)



class notificationsIdPut(mixins.UpdateModelMixin, generics.GenericAPIView):
  """  
  Updates a specific Notification object  
  """
  permission_classes = (permissions.AllowAny,)  
  queryset = Notification.objects.all()  
  serializer_class = serializers.NotificationSerializer
  def put(self, request, id, item):
    return self.update(request, id, item)



class notificationsPost(mixins.CreateModelMixin, generics.GenericAPIView):
  """  
  Creates a new Notification object  
  """
  permission_classes = (permissions.AllowAny,)  
  queryset = Notification.objects.all()  
  serializer_class = serializers.NotificationSerializer
  def post(self, request, item):
    return self.create(request, item)



class notificationeventsBulkPost(BulkCreateModelMixin, generics.GenericAPIView):
  """  
  Bulk create / update a number of NotificationEvent object  
  """
  permission_classes = (permissions.AllowAny,)  
  queryset = NotificationEvent.objects.all()  
  serializer_class = serializers.NotificationEventSerializer
  def post(self, request, items):
    return self.create(request, items)



class notificationeventsGet(mixins.ListModelMixin, generics.GenericAPIView):
  """  
  Lists available NotificationEvent objects  
  """
  permission_classes = (permissions.AllowAny,)  
  queryset = NotificationEvent.objects.all()  
  serializer_class = serializers.NotificationEventSerializer
  def get(self, request, ):
    return self.list(request, )



class notificationeventsIdDeletePost(mixins.DestroyModelMixin, generics.GenericAPIView):
  """  
  Deletes a specific NotificationEvent object  
  """
  permission_classes = (permissions.AllowAny,)  
  queryset = NotificationEvent.objects.all()  
  serializer_class = serializers.NotificationEventSerializer
  def post(self, request, id):
    return self.destroy(request, id)



class notificationeventsIdGet(mixins.RetrieveModelMixin, generics.GenericAPIView):
  """  
  Gets a specific NotificationEvent object  
  """
  permission_classes = (permissions.AllowAny,)  
  queryset = NotificationEvent.objects.all()  
  serializer_class = serializers.NotificationEventSerializer
  def get(self, request, id):
    return self.retrieve(request, id)



class notificationeventsIdPut(mixins.UpdateModelMixin, generics.GenericAPIView):
  """  
  Updates a specific NotificationEvent object  
  """
  permission_classes = (permissions.AllowAny,)  
  queryset = NotificationEvent.objects.all()  
  serializer_class = serializers.NotificationEventSerializer
  def put(self, request, id, item):
    return self.update(request, id, item)



class notificationeventsPost(mixins.CreateModelMixin, generics.GenericAPIView):
  """  
  Creates a new NotificationEvent object  
  """
  permission_classes = (permissions.AllowAny,)  
  queryset = NotificationEvent.objects.all()  
  serializer_class = serializers.NotificationEventSerializer
  def post(self, request, item):
    return self.create(request, item)



class permissionsBulkPost(BulkCreateModelMixin, generics.GenericAPIView):
  """  
  Bulk create / update a number of PermissionViewModel object  
  """
  permission_classes = (permissions.AllowAny,)  
  queryset = Permission.objects.all()  
  serializer_class = serializers.PermissionSerializer
  def post(self, request, items):
    return self.create(request, items)



class permissionsGet(mixins.ListModelMixin, generics.GenericAPIView):
  """  
  Lists available PermissionViewModel objects  
  """
  permission_classes = (permissions.AllowAny,)  
  queryset = Permission.objects.all()  
  serializer_class = serializers.PermissionSerializer
  def get(self, request, ):
    return self.list(request, )



class permissionsIdDeletePost(mixins.DestroyModelMixin, generics.GenericAPIView):
  """  
  Deletes a specific PermissionViewModel object  
  """
  permission_classes = (permissions.AllowAny,)  
  queryset = Permission.objects.all()  
  serializer_class = serializers.PermissionSerializer
  def post(self, request, id):
    return self.destroy(request, id)



class permissionsIdGet(mixins.RetrieveModelMixin, generics.GenericAPIView):
  """  
  Gets a specific PermissionViewModel object  
  """
  permission_classes = (permissions.AllowAny,)  
  queryset = Permission.objects.all()  
  serializer_class = serializers.PermissionSerializer
  def get(self, request, id):
    return self.retrieve(request, id)



class permissionsIdPut(mixins.UpdateModelMixin, generics.GenericAPIView):
  """  
  Updates a specific PermissionViewModel object  
  """
  permission_classes = (permissions.AllowAny,)  
  queryset = Permission.objects.all()  
  serializer_class = serializers.PermissionSerializer
  def put(self, request, id, item):
    return self.update(request, id, item)



class permissionsPost(mixins.CreateModelMixin, generics.GenericAPIView):
  """  
  Creates a new PermissionViewModel object  
  """
  permission_classes = (permissions.AllowAny,)  
  queryset = Permission.objects.all()  
  serializer_class = serializers.PermissionSerializer
  def post(self, request, item):
    return self.create(request, item)



class rolesBulkPost(BulkCreateModelMixin, generics.GenericAPIView):
  """  
  Bulk create / update a number of RoleViewModel object  
  """
  permission_classes = (permissions.AllowAny,)  
  queryset = Role.objects.all()  
  serializer_class = serializers.RoleSerializer
  def post(self, request, items):
    return self.create(request, items)



class rolesGet(mixins.ListModelMixin, generics.GenericAPIView):
  """  
  Lists available RoleViewModel objects  
  """
  permission_classes = (permissions.AllowAny,)  
  queryset = Role.objects.all()  
  serializer_class = serializers.RoleSerializer
  def get(self, request, ):
    return self.list(request, )



class rolesIdDeletePost(mixins.DestroyModelMixin, generics.GenericAPIView):
  """  
  Deletes a specific RoleViewModel object  
  """
  permission_classes = (permissions.AllowAny,)  
  queryset = Role.objects.all()  
  serializer_class = serializers.RoleSerializer
  def post(self, request, id):
    return self.destroy(request, id)



class rolesIdGet(mixins.RetrieveModelMixin, generics.GenericAPIView):
  """  
  Gets a specific RoleViewModel object  
  """
  permission_classes = (permissions.AllowAny,)  
  queryset = Role.objects.all()  
  serializer_class = serializers.RoleSerializer
  def get(self, request, id):
    return self.retrieve(request, id)



class rolesIdPermissionsGet(APIView):
  """  
  Get all the permissions for a role  
  """
  permission_classes = (permissions.AllowAny,)
  def get(self, request, id):
    return Response()



class rolesIdPermissionsPost(APIView):
  """  
  Adds a permissions to a role  
  """
  permission_classes = (permissions.AllowAny,)
  def post(self, request, id, item):
    return Response()



class rolesIdPermissionsPut(APIView):
  """  
  Updates the permissions for a role  
  """
  permission_classes = (permissions.AllowAny,)
  def put(self, request, id, items):
    return Response()



class rolesIdPut(mixins.UpdateModelMixin, generics.GenericAPIView):
  """  
  Updates a specific RoleViewModel object  
  """
  permission_classes = (permissions.AllowAny,)  
  queryset = Role.objects.all()  
  serializer_class = serializers.RoleSerializer
  def put(self, request, id, item):
    return self.update(request, id, item)



class rolesIdUsersGet(APIView):
  """  
  Gets all the users for a role  
  """
  permission_classes = (permissions.AllowAny,)
  def get(self, request, id):
    return Response()



class rolesIdUsersPut(APIView):
  """  
  Updates the users for a role  
  """
  permission_classes = (permissions.AllowAny,)
  def put(self, request, id, items):
    return Response()



class rolesPost(mixins.CreateModelMixin, generics.GenericAPIView):
  """  
  Creates a new RoleViewModel object  
  """
  permission_classes = (permissions.AllowAny,)  
  queryset = Role.objects.all()  
  serializer_class = serializers.RoleSerializer
  def post(self, request, item):
    return self.create(request, item)



class usersBulkPost(APIView):
  """  
  Adds a number of users  
  """
  permission_classes = (permissions.AllowAny,)
  def post(self, request, items):
    return Response()



class usersGet(APIView):
  """  
  Returns all users  
  """
  permission_classes = (permissions.AllowAny,)
  def get(self, request, ):
    return Response()



class usersIdDeletePost(APIView):
  """  
  Deletes a user  
  """
  permission_classes = (permissions.AllowAny,)
  def post(self, request, id):
    return Response()



class usersIdFavouritesGet(APIView):
  """  
  Returns the favourites for a user  
  """
  permission_classes = (permissions.AllowAny,)
  def get(self, request, id):
    return Response()



class usersIdFavouritesPost(APIView):
  """  
  Adds favourites to a user  
  """
  permission_classes = (permissions.AllowAny,)
  def post(self, request, id, item):
    return Response()



class usersIdFavouritesPut(APIView):
  """  
  Updates the favourites for a user  
  """
  permission_classes = (permissions.AllowAny,)
  def put(self, request, id, items):
    return Response()



class usersIdGet(APIView):
  """  
  Returns data for a particular user  
  """
  permission_classes = (permissions.AllowAny,)
  def get(self, request, id):
    return Response()



class usersIdGroupsGet(APIView):
  """  
  Returns all groups that a user is a member of  
  """
  permission_classes = (permissions.AllowAny,)
  def get(self, request, id):
    return Response()



class usersIdGroupsPost(APIView):
  """  
  Add to the active set of groups for a user  
  """
  permission_classes = (permissions.AllowAny,)
  def post(self, request, id, item):
    return Response()



class usersIdGroupsPut(APIView):
  """  
  Updates the active set of groups for a user  
  """
  permission_classes = (permissions.AllowAny,)
  def put(self, request, id, items):
    return Response()



class usersIdNotificationsGet(APIView):
  """  
  Returns a user's notifications  
  """
  permission_classes = (permissions.AllowAny,)
  def get(self, request, id):
    return Response()



class usersIdPermissionsGet(APIView):
  """  
  Returns the set of permissions for a user  
  """
  permission_classes = (permissions.AllowAny,)
  def get(self, request, id):
    return Response()



class usersIdPut(APIView):
  """  
    
  """
  permission_classes = (permissions.AllowAny,)
  def put(self, request, id, item):
    return Response()



class usersIdRolesGet(APIView):
  """  
  Returns the roles for a user  
  """
  permission_classes = (permissions.AllowAny,)
  def get(self, request, id):
    return Response()



class usersIdRolesPost(APIView):
  """  
  Adds a role to a user  
  """
  permission_classes = (permissions.AllowAny,)
  def post(self, request, id, item):
    return Response()



class usersIdRolesPut(APIView):
  """  
  Updates the roles for a user  
  """
  permission_classes = (permissions.AllowAny,)
  def put(self, request, id, items):
    return Response()



class usersPost(APIView):
  """  
  Create new user  
  """
  permission_classes = (permissions.AllowAny,)
  def post(self, request, item):
    return Response()



class usersSearchGet(APIView):
  """  
  Searches Users  
  """
  permission_classes = (permissions.AllowAny,)
  def get(self, request, fuelSuppliers = None, surname = None, includeInactive = None):
    return Response()



