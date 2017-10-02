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
from auditable.views import AuditableMixin
from .models.Audit import Audit
from .models.CreditTrade import CreditTrade
from .models.CreditTradeHistory import CreditTradeHistory
from .models.CreditTradeStatus import CreditTradeStatus
from .models.CreditTradeType import CreditTradeType
from .models.CreditTradeZeroReason import CreditTradeZeroReason
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
from .models.Notification import Notification
from .models.NotificationEvent import NotificationEvent
from .models.NotificationType import NotificationType
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


class credittradesBulkPost(AuditableMixin,BulkCreateModelMixin, generics.GenericAPIView):
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

class credittradesGet(AuditableMixin,mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView):
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

class credittradesIdDeletePost(AuditableMixin,mixins.DestroyModelMixin, generics.GenericAPIView):
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


class credittradesIdGet(AuditableMixin,mixins.RetrieveModelMixin, mixins.UpdateModelMixin, generics.GenericAPIView):
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

class credittradehistoriesBulkPost(AuditableMixin,BulkCreateModelMixin, generics.GenericAPIView):
  """  
  Bulk create / update a number of CreditTradeHistory object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = CreditTradeHistory.objects.all()  
  serializer_class = serializers.CreditTradeHistorySerializer
  def post(self, request, *args, **kwargs):
    """
    Creates a number of new CreditTradeHistory objects
    """
    return self.create(request, *args, **kwargs)

class credittradehistoriesGet(AuditableMixin,mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView):
  """  
  Lists available CreditTradeHistory objects  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = CreditTradeHistory.objects.all()  
  serializer_class = serializers.CreditTradeHistorySerializer
  def get(self, request, *args, **kwargs):
    """
    Lists available CreditTradeHistory objects
    """
    return self.list(request, *args, **kwargs)
  def post(self, request, *args, **kwargs):
    """
    Creates a new CreditTradeHistory object
    """
    return self.create(request, *args, **kwargs)

class credittradehistoriesIdDeletePost(AuditableMixin,mixins.DestroyModelMixin, generics.GenericAPIView):
  """  
  Deletes a specific CreditTradeHistory object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = CreditTradeHistory.objects.all()  
  serializer_class = serializers.CreditTradeHistorySerializer
  def post(self, request, *args, **kwargs):
    """
    Destroys the specified CreditTradeHistory object
    """
    return self.destroy(request, *args, **kwargs)


class credittradehistoriesIdGet(AuditableMixin,mixins.RetrieveModelMixin, mixins.UpdateModelMixin, generics.GenericAPIView):
  """  
  Gets a specific CreditTradeHistory object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = CreditTradeHistory.objects.all()  
  serializer_class = serializers.CreditTradeHistorySerializer
  def get(self, request, *args, **kwargs):
    """
    Retrieves the specified CreditTradeHistory object
    """
    return self.retrieve(request, *args, **kwargs)
  def put(self, request, *args, **kwargs):
    """
    Updates the specified CreditTradeHistory object
    """
    return self.update(request, *args, **kwargs)

class credittradestatusesBulkPost(AuditableMixin,BulkCreateModelMixin, generics.GenericAPIView):
  """  
  Bulk create / update a number of CreditTradeStatus object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = CreditTradeStatus.objects.all()  
  serializer_class = serializers.CreditTradeStatusSerializer
  def post(self, request, *args, **kwargs):
    """
    Creates a number of new CreditTradeStatus objects
    """
    return self.create(request, *args, **kwargs)

class credittradestatusesGet(AuditableMixin,mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView):
  """  
  Lists available CreditTradeStatus objects  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = CreditTradeStatus.objects.all()  
  serializer_class = serializers.CreditTradeStatusSerializer
  def get(self, request, *args, **kwargs):
    """
    Lists available CreditTradeStatus objects
    """
    return self.list(request, *args, **kwargs)
  def post(self, request, *args, **kwargs):
    """
    Creates a new CreditTradeStatus object
    """
    return self.create(request, *args, **kwargs)

class credittradestatusesIdDeletePost(AuditableMixin,mixins.DestroyModelMixin, generics.GenericAPIView):
  """  
  Deletes a specific CreditTradeStatus object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = CreditTradeStatus.objects.all()  
  serializer_class = serializers.CreditTradeStatusSerializer
  def post(self, request, *args, **kwargs):
    """
    Destroys the specified CreditTradeStatus object
    """
    return self.destroy(request, *args, **kwargs)


class credittradestatusesIdGet(AuditableMixin,mixins.RetrieveModelMixin, mixins.UpdateModelMixin, generics.GenericAPIView):
  """  
  Gets a specific CreditTradeStatus object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = CreditTradeStatus.objects.all()  
  serializer_class = serializers.CreditTradeStatusSerializer
  def get(self, request, *args, **kwargs):
    """
    Retrieves the specified CreditTradeStatus object
    """
    return self.retrieve(request, *args, **kwargs)
  def put(self, request, *args, **kwargs):
    """
    Updates the specified CreditTradeStatus object
    """
    return self.update(request, *args, **kwargs)

class credittradetypesBulkPost(AuditableMixin,BulkCreateModelMixin, generics.GenericAPIView):
  """  
  Bulk create / update a number of CreditTradeType object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = CreditTradeType.objects.all()  
  serializer_class = serializers.CreditTradeTypeSerializer
  def post(self, request, *args, **kwargs):
    """
    Creates a number of new CreditTradeType objects
    """
    return self.create(request, *args, **kwargs)

class credittradetypesGet(AuditableMixin,mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView):
  """  
  Lists available CreditTradeType objects  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = CreditTradeType.objects.all()  
  serializer_class = serializers.CreditTradeTypeSerializer
  def get(self, request, *args, **kwargs):
    """
    Lists available CreditTradeType objects
    """
    return self.list(request, *args, **kwargs)
  def post(self, request, *args, **kwargs):
    """
    Creates a new CreditTradeType object
    """
    return self.create(request, *args, **kwargs)

class credittradetypesIdDeletePost(AuditableMixin,mixins.DestroyModelMixin, generics.GenericAPIView):
  """  
  Deletes a specific CreditTradeType object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = CreditTradeType.objects.all()  
  serializer_class = serializers.CreditTradeTypeSerializer
  def post(self, request, *args, **kwargs):
    """
    Destroys the specified CreditTradeType object
    """
    return self.destroy(request, *args, **kwargs)


class credittradetypesIdGet(AuditableMixin,mixins.RetrieveModelMixin, mixins.UpdateModelMixin, generics.GenericAPIView):
  """  
  Gets a specific CreditTradeType object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = CreditTradeType.objects.all()  
  serializer_class = serializers.CreditTradeTypeSerializer
  def get(self, request, *args, **kwargs):
    """
    Retrieves the specified CreditTradeType object
    """
    return self.retrieve(request, *args, **kwargs)
  def put(self, request, *args, **kwargs):
    """
    Updates the specified CreditTradeType object
    """
    return self.update(request, *args, **kwargs)

class credittradezeroreasonBulkPost(AuditableMixin,BulkCreateModelMixin, generics.GenericAPIView):
  """  
  Bulk create / update a number of CreditTradeZeroReason object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = CreditTradeZeroReason.objects.all()  
  serializer_class = serializers.CreditTradeZeroReasonSerializer
  def post(self, request, *args, **kwargs):
    """
    Creates a number of new CreditTradeZeroReason objects
    """
    return self.create(request, *args, **kwargs)

class credittradezeroreasonGet(AuditableMixin,mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView):
  """  
  Lists available CreditTradeZeroReason objects  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = CreditTradeZeroReason.objects.all()  
  serializer_class = serializers.CreditTradeZeroReasonSerializer
  def get(self, request, *args, **kwargs):
    """
    Lists available CreditTradeZeroReason objects
    """
    return self.list(request, *args, **kwargs)
  def post(self, request, *args, **kwargs):
    """
    Creates a new CreditTradeZeroReason object
    """
    return self.create(request, *args, **kwargs)

class credittradezeroreasonIdDeletePost(AuditableMixin,mixins.DestroyModelMixin, generics.GenericAPIView):
  """  
  Deletes a specific CreditTradeZeroReason object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = CreditTradeZeroReason.objects.all()  
  serializer_class = serializers.CreditTradeZeroReasonSerializer
  def post(self, request, *args, **kwargs):
    """
    Destroys the specified CreditTradeZeroReason object
    """
    return self.destroy(request, *args, **kwargs)


class credittradezeroreasonIdGet(AuditableMixin,mixins.RetrieveModelMixin, mixins.UpdateModelMixin, generics.GenericAPIView):
  """  
  Gets a specific CreditTradeZeroReason object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = CreditTradeZeroReason.objects.all()  
  serializer_class = serializers.CreditTradeZeroReasonSerializer
  def get(self, request, *args, **kwargs):
    """
    Retrieves the specified CreditTradeZeroReason object
    """
    return self.retrieve(request, *args, **kwargs)
  def put(self, request, *args, **kwargs):
    """
    Updates the specified CreditTradeZeroReason object
    """
    return self.update(request, *args, **kwargs)

class fuelsuppliersBulkPost(AuditableMixin,BulkCreateModelMixin, generics.GenericAPIView):
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

class fuelsuppliersGet(AuditableMixin,mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView):
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

class fuelsuppliersIdDeletePost(AuditableMixin,mixins.DestroyModelMixin, generics.GenericAPIView):
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


class fuelsuppliersIdGet(AuditableMixin,mixins.RetrieveModelMixin, mixins.UpdateModelMixin, generics.GenericAPIView):
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

class fuelsupplieractionstypesBulkPost(AuditableMixin,BulkCreateModelMixin, generics.GenericAPIView):
  """  
  Bulk create / update a number of FuelSupplierActionsType object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = FuelSupplierActionsType.objects.all()  
  serializer_class = serializers.FuelSupplierActionsTypeSerializer
  def post(self, request, *args, **kwargs):
    """
    Creates a number of new FuelSupplierActionsType objects
    """
    return self.create(request, *args, **kwargs)

class fuelsupplieractionstypesGet(AuditableMixin,mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView):
  """  
  Lists available FuelSupplierActionsType objects  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = FuelSupplierActionsType.objects.all()  
  serializer_class = serializers.FuelSupplierActionsTypeSerializer
  def get(self, request, *args, **kwargs):
    """
    Lists available FuelSupplierActionsType objects
    """
    return self.list(request, *args, **kwargs)
  def post(self, request, *args, **kwargs):
    """
    Creates a new FuelSupplierActionsType object
    """
    return self.create(request, *args, **kwargs)

class fuelsupplieractionstypesIdDeletePost(AuditableMixin,mixins.DestroyModelMixin, generics.GenericAPIView):
  """  
  Deletes a specific FuelSupplierActionsType object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = FuelSupplierActionsType.objects.all()  
  serializer_class = serializers.FuelSupplierActionsTypeSerializer
  def post(self, request, *args, **kwargs):
    """
    Destroys the specified FuelSupplierActionsType object
    """
    return self.destroy(request, *args, **kwargs)


class fuelsupplieractionstypesIdGet(AuditableMixin,mixins.RetrieveModelMixin, mixins.UpdateModelMixin, generics.GenericAPIView):
  """  
  Gets a specific FuelSupplierActionsType object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = FuelSupplierActionsType.objects.all()  
  serializer_class = serializers.FuelSupplierActionsTypeSerializer
  def get(self, request, *args, **kwargs):
    """
    Retrieves the specified FuelSupplierActionsType object
    """
    return self.retrieve(request, *args, **kwargs)
  def put(self, request, *args, **kwargs):
    """
    Updates the specified FuelSupplierActionsType object
    """
    return self.update(request, *args, **kwargs)

class fuelsupplierattachmentsBulkPost(AuditableMixin,BulkCreateModelMixin, generics.GenericAPIView):
  """  
  Bulk create / update a number of FuelSupplierAttachment object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = FuelSupplierAttachment.objects.all()  
  serializer_class = serializers.FuelSupplierAttachmentSerializer
  def post(self, request, *args, **kwargs):
    """
    Creates a number of new FuelSupplierAttachment objects
    """
    return self.create(request, *args, **kwargs)

class fuelsupplierattachmentsGet(AuditableMixin,mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView):
  """  
  Lists available FuelSupplierAttachment objects  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = FuelSupplierAttachment.objects.all()  
  serializer_class = serializers.FuelSupplierAttachmentSerializer
  def get(self, request, *args, **kwargs):
    """
    Lists available FuelSupplierAttachment objects
    """
    return self.list(request, *args, **kwargs)
  def post(self, request, *args, **kwargs):
    """
    Creates a new FuelSupplierAttachment object
    """
    return self.create(request, *args, **kwargs)

class fuelsupplierattachmentsIdDeletePost(AuditableMixin,mixins.DestroyModelMixin, generics.GenericAPIView):
  """  
  Deletes a specific FuelSupplierAttachment object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = FuelSupplierAttachment.objects.all()  
  serializer_class = serializers.FuelSupplierAttachmentSerializer
  def post(self, request, *args, **kwargs):
    """
    Destroys the specified FuelSupplierAttachment object
    """
    return self.destroy(request, *args, **kwargs)


class fuelsupplierattachmentsIdGet(AuditableMixin,mixins.RetrieveModelMixin, mixins.UpdateModelMixin, generics.GenericAPIView):
  """  
  Gets a specific FuelSupplierAttachment object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = FuelSupplierAttachment.objects.all()  
  serializer_class = serializers.FuelSupplierAttachmentSerializer
  def get(self, request, *args, **kwargs):
    """
    Retrieves the specified FuelSupplierAttachment object
    """
    return self.retrieve(request, *args, **kwargs)
  def put(self, request, *args, **kwargs):
    """
    Updates the specified FuelSupplierAttachment object
    """
    return self.update(request, *args, **kwargs)

class fuelsupplierattachmenttagsBulkPost(AuditableMixin,BulkCreateModelMixin, generics.GenericAPIView):
  """  
  Bulk create / update a number of FuelSupplierAttachmentTag object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = FuelSupplierAttachmentTag.objects.all()  
  serializer_class = serializers.FuelSupplierAttachmentTagSerializer
  def post(self, request, *args, **kwargs):
    """
    Creates a number of new FuelSupplierAttachmentTag objects
    """
    return self.create(request, *args, **kwargs)

class fuelsupplierattachmenttagsGet(AuditableMixin,mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView):
  """  
  Lists available FuelSupplierAttachmentTag objects  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = FuelSupplierAttachmentTag.objects.all()  
  serializer_class = serializers.FuelSupplierAttachmentTagSerializer
  def get(self, request, *args, **kwargs):
    """
    Lists available FuelSupplierAttachmentTag objects
    """
    return self.list(request, *args, **kwargs)
  def post(self, request, *args, **kwargs):
    """
    Creates a new FuelSupplierAttachmentTag object
    """
    return self.create(request, *args, **kwargs)

class fuelsupplierattachmenttagsIdDeletePost(AuditableMixin,mixins.DestroyModelMixin, generics.GenericAPIView):
  """  
  Deletes a specific FuelSupplierAttachmentTag object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = FuelSupplierAttachmentTag.objects.all()  
  serializer_class = serializers.FuelSupplierAttachmentTagSerializer
  def post(self, request, *args, **kwargs):
    """
    Destroys the specified FuelSupplierAttachmentTag object
    """
    return self.destroy(request, *args, **kwargs)


class fuelsupplierattachmenttagsIdGet(AuditableMixin,mixins.RetrieveModelMixin, mixins.UpdateModelMixin, generics.GenericAPIView):
  """  
  Gets a specific FuelSupplierAttachmentTag object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = FuelSupplierAttachmentTag.objects.all()  
  serializer_class = serializers.FuelSupplierAttachmentTagSerializer
  def get(self, request, *args, **kwargs):
    """
    Retrieves the specified FuelSupplierAttachmentTag object
    """
    return self.retrieve(request, *args, **kwargs)
  def put(self, request, *args, **kwargs):
    """
    Updates the specified FuelSupplierAttachmentTag object
    """
    return self.update(request, *args, **kwargs)

class fuelsupplierbalancesBulkPost(AuditableMixin,BulkCreateModelMixin, generics.GenericAPIView):
  """  
  Bulk create / update a number of FuelSupplierBalance object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = FuelSupplierBalance.objects.all()  
  serializer_class = serializers.FuelSupplierBalanceSerializer
  def post(self, request, *args, **kwargs):
    """
    Creates a number of new FuelSupplierBalance objects
    """
    return self.create(request, *args, **kwargs)

class fuelsupplierbalancesGet(AuditableMixin,mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView):
  """  
  Lists available FuelSupplierBalance objects  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = FuelSupplierBalance.objects.all()  
  serializer_class = serializers.FuelSupplierBalanceSerializer
  def get(self, request, *args, **kwargs):
    """
    Lists available FuelSupplierBalance objects
    """
    return self.list(request, *args, **kwargs)
  def post(self, request, *args, **kwargs):
    """
    Creates a new FuelSupplierBalance object
    """
    return self.create(request, *args, **kwargs)

class fuelsupplierbalancesIdDeletePost(AuditableMixin,mixins.DestroyModelMixin, generics.GenericAPIView):
  """  
  Deletes a specific FuelSupplierBalance object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = FuelSupplierBalance.objects.all()  
  serializer_class = serializers.FuelSupplierBalanceSerializer
  def post(self, request, *args, **kwargs):
    """
    Destroys the specified FuelSupplierBalance object
    """
    return self.destroy(request, *args, **kwargs)


class fuelsupplierbalancesIdGet(AuditableMixin,mixins.RetrieveModelMixin, mixins.UpdateModelMixin, generics.GenericAPIView):
  """  
  Gets a specific FuelSupplierBalance object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = FuelSupplierBalance.objects.all()  
  serializer_class = serializers.FuelSupplierBalanceSerializer
  def get(self, request, *args, **kwargs):
    """
    Retrieves the specified FuelSupplierBalance object
    """
    return self.retrieve(request, *args, **kwargs)
  def put(self, request, *args, **kwargs):
    """
    Updates the specified FuelSupplierBalance object
    """
    return self.update(request, *args, **kwargs)

class fuelsuppliersCCDatumBulkPost(AuditableMixin,BulkCreateModelMixin, generics.GenericAPIView):
  """  
  Bulk create / update a number of FuelSupplierCCData object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = FuelSupplierCCData.objects.all()  
  serializer_class = serializers.FuelSupplierCCDataSerializer
  def post(self, request, *args, **kwargs):
    """
    Creates a number of new FuelSupplierCCData objects
    """
    return self.create(request, *args, **kwargs)

class fuelsuppliersCCDatumGet(AuditableMixin,mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView):
  """  
  Lists available FuelSupplierCCData objects  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = FuelSupplierCCData.objects.all()  
  serializer_class = serializers.FuelSupplierCCDataSerializer
  def get(self, request, *args, **kwargs):
    """
    Lists available FuelSupplierCCData objects
    """
    return self.list(request, *args, **kwargs)
  def post(self, request, *args, **kwargs):
    """
    Creates a new FuelSupplierCCData object
    """
    return self.create(request, *args, **kwargs)

class fuelsuppliersCCDatumIdDeletePost(AuditableMixin,mixins.DestroyModelMixin, generics.GenericAPIView):
  """  
  Deletes a specific FuelSupplierCCData object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = FuelSupplierCCData.objects.all()  
  serializer_class = serializers.FuelSupplierCCDataSerializer
  def post(self, request, *args, **kwargs):
    """
    Destroys the specified FuelSupplierCCData object
    """
    return self.destroy(request, *args, **kwargs)


class fuelsuppliersCCDatumIdGet(AuditableMixin,mixins.RetrieveModelMixin, mixins.UpdateModelMixin, generics.GenericAPIView):
  """  
  Gets a specific FuelSupplierCCData object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = FuelSupplierCCData.objects.all()  
  serializer_class = serializers.FuelSupplierCCDataSerializer
  def get(self, request, *args, **kwargs):
    """
    Retrieves the specified FuelSupplierCCData object
    """
    return self.retrieve(request, *args, **kwargs)
  def put(self, request, *args, **kwargs):
    """
    Updates the specified FuelSupplierCCData object
    """
    return self.update(request, *args, **kwargs)

class fuelsuppliercontactsBulkPost(AuditableMixin,BulkCreateModelMixin, generics.GenericAPIView):
  """  
  Bulk create / update a number of FuelSupplierContact object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = FuelSupplierContact.objects.all()  
  serializer_class = serializers.FuelSupplierContactSerializer
  def post(self, request, *args, **kwargs):
    """
    Creates a number of new FuelSupplierContact objects
    """
    return self.create(request, *args, **kwargs)

class fuelsuppliercontactsGet(AuditableMixin,mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView):
  """  
  Lists available FuelSupplierContact objects  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = FuelSupplierContact.objects.all()  
  serializer_class = serializers.FuelSupplierContactSerializer
  def get(self, request, *args, **kwargs):
    """
    Lists available FuelSupplierContact objects
    """
    return self.list(request, *args, **kwargs)
  def post(self, request, *args, **kwargs):
    """
    Creates a new FuelSupplierContact object
    """
    return self.create(request, *args, **kwargs)

class fuelsuppliercontactsIdDeletePost(AuditableMixin,mixins.DestroyModelMixin, generics.GenericAPIView):
  """  
  Deletes a specific FuelSupplierContact object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = FuelSupplierContact.objects.all()  
  serializer_class = serializers.FuelSupplierContactSerializer
  def post(self, request, *args, **kwargs):
    """
    Destroys the specified FuelSupplierContact object
    """
    return self.destroy(request, *args, **kwargs)


class fuelsuppliercontactsIdGet(AuditableMixin,mixins.RetrieveModelMixin, mixins.UpdateModelMixin, generics.GenericAPIView):
  """  
  Gets a specific FuelSupplierContact object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = FuelSupplierContact.objects.all()  
  serializer_class = serializers.FuelSupplierContactSerializer
  def get(self, request, *args, **kwargs):
    """
    Retrieves the specified FuelSupplierContact object
    """
    return self.retrieve(request, *args, **kwargs)
  def put(self, request, *args, **kwargs):
    """
    Updates the specified FuelSupplierContact object
    """
    return self.update(request, *args, **kwargs)

class fuelsuppliercontactrolesBulkPost(AuditableMixin,BulkCreateModelMixin, generics.GenericAPIView):
  """  
  Bulk create / update a number of FuelSupplierContactRole object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = FuelSupplierContactRole.objects.all()  
  serializer_class = serializers.FuelSupplierContactRoleSerializer
  def post(self, request, *args, **kwargs):
    """
    Creates a number of new FuelSupplierContactRole objects
    """
    return self.create(request, *args, **kwargs)

class fuelsuppliercontactrolesGet(AuditableMixin,mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView):
  """  
  Lists available FuelSupplierContactRole objects  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = FuelSupplierContactRole.objects.all()  
  serializer_class = serializers.FuelSupplierContactRoleSerializer
  def get(self, request, *args, **kwargs):
    """
    Lists available FuelSupplierContactRole objects
    """
    return self.list(request, *args, **kwargs)
  def post(self, request, *args, **kwargs):
    """
    Creates a new FuelSupplierContactRole object
    """
    return self.create(request, *args, **kwargs)

class fuelsuppliercontactrolesIdDeletePost(AuditableMixin,mixins.DestroyModelMixin, generics.GenericAPIView):
  """  
  Deletes a specific FuelSupplierContactRole object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = FuelSupplierContactRole.objects.all()  
  serializer_class = serializers.FuelSupplierContactRoleSerializer
  def post(self, request, *args, **kwargs):
    """
    Destroys the specified FuelSupplierContactRole object
    """
    return self.destroy(request, *args, **kwargs)


class fuelsuppliercontactrolesIdGet(AuditableMixin,mixins.RetrieveModelMixin, mixins.UpdateModelMixin, generics.GenericAPIView):
  """  
  Gets a specific FuelSupplierContactRole object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = FuelSupplierContactRole.objects.all()  
  serializer_class = serializers.FuelSupplierContactRoleSerializer
  def get(self, request, *args, **kwargs):
    """
    Retrieves the specified FuelSupplierContactRole object
    """
    return self.retrieve(request, *args, **kwargs)
  def put(self, request, *args, **kwargs):
    """
    Updates the specified FuelSupplierContactRole object
    """
    return self.update(request, *args, **kwargs)

class fuelsupplierhistoriesBulkPost(AuditableMixin,BulkCreateModelMixin, generics.GenericAPIView):
  """  
  Bulk create / update a number of FuelSupplierHistory object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = FuelSupplierHistory.objects.all()  
  serializer_class = serializers.FuelSupplierHistorySerializer
  def post(self, request, *args, **kwargs):
    """
    Creates a number of new FuelSupplierHistory objects
    """
    return self.create(request, *args, **kwargs)

class fuelsupplierhistoriesGet(AuditableMixin,mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView):
  """  
  Lists available FuelSupplierHistory objects  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = FuelSupplierHistory.objects.all()  
  serializer_class = serializers.FuelSupplierHistorySerializer
  def get(self, request, *args, **kwargs):
    """
    Lists available FuelSupplierHistory objects
    """
    return self.list(request, *args, **kwargs)
  def post(self, request, *args, **kwargs):
    """
    Creates a new FuelSupplierHistory object
    """
    return self.create(request, *args, **kwargs)

class fuelsupplierhistoriesIdDeletePost(AuditableMixin,mixins.DestroyModelMixin, generics.GenericAPIView):
  """  
  Deletes a specific FuelSupplierHistory object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = FuelSupplierHistory.objects.all()  
  serializer_class = serializers.FuelSupplierHistorySerializer
  def post(self, request, *args, **kwargs):
    """
    Destroys the specified FuelSupplierHistory object
    """
    return self.destroy(request, *args, **kwargs)


class fuelsupplierhistoriesIdGet(AuditableMixin,mixins.RetrieveModelMixin, mixins.UpdateModelMixin, generics.GenericAPIView):
  """  
  Gets a specific FuelSupplierHistory object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = FuelSupplierHistory.objects.all()  
  serializer_class = serializers.FuelSupplierHistorySerializer
  def get(self, request, *args, **kwargs):
    """
    Retrieves the specified FuelSupplierHistory object
    """
    return self.retrieve(request, *args, **kwargs)
  def put(self, request, *args, **kwargs):
    """
    Updates the specified FuelSupplierHistory object
    """
    return self.update(request, *args, **kwargs)

class fuelsupplierstatusesBulkPost(AuditableMixin,BulkCreateModelMixin, generics.GenericAPIView):
  """  
  Bulk create / update a number of FuelSupplierStatus object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = FuelSupplierStatus.objects.all()  
  serializer_class = serializers.FuelSupplierStatusSerializer
  def post(self, request, *args, **kwargs):
    """
    Creates a number of new FuelSupplierStatus objects
    """
    return self.create(request, *args, **kwargs)

class fuelsupplierstatusesGet(AuditableMixin,mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView):
  """  
  Lists available FuelSupplierStatus objects  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = FuelSupplierStatus.objects.all()  
  serializer_class = serializers.FuelSupplierStatusSerializer
  def get(self, request, *args, **kwargs):
    """
    Lists available FuelSupplierStatus objects
    """
    return self.list(request, *args, **kwargs)
  def post(self, request, *args, **kwargs):
    """
    Creates a new FuelSupplierStatus object
    """
    return self.create(request, *args, **kwargs)

class fuelsupplierstatusesIdDeletePost(AuditableMixin,mixins.DestroyModelMixin, generics.GenericAPIView):
  """  
  Deletes a specific FuelSupplierStatus object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = FuelSupplierStatus.objects.all()  
  serializer_class = serializers.FuelSupplierStatusSerializer
  def post(self, request, *args, **kwargs):
    """
    Destroys the specified FuelSupplierStatus object
    """
    return self.destroy(request, *args, **kwargs)


class fuelsupplierstatusesIdGet(AuditableMixin,mixins.RetrieveModelMixin, mixins.UpdateModelMixin, generics.GenericAPIView):
  """  
  Gets a specific FuelSupplierStatus object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = FuelSupplierStatus.objects.all()  
  serializer_class = serializers.FuelSupplierStatusSerializer
  def get(self, request, *args, **kwargs):
    """
    Retrieves the specified FuelSupplierStatus object
    """
    return self.retrieve(request, *args, **kwargs)
  def put(self, request, *args, **kwargs):
    """
    Updates the specified FuelSupplierStatus object
    """
    return self.update(request, *args, **kwargs)

class notificationsBulkPost(AuditableMixin,BulkCreateModelMixin, generics.GenericAPIView):
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

class notificationsGet(AuditableMixin,mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView):
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

class notificationsIdDeletePost(AuditableMixin,mixins.DestroyModelMixin, generics.GenericAPIView):
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


class notificationsIdGet(AuditableMixin,mixins.RetrieveModelMixin, mixins.UpdateModelMixin, generics.GenericAPIView):
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

class notificationeventsBulkPost(AuditableMixin,BulkCreateModelMixin, generics.GenericAPIView):
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

class notificationeventsGet(AuditableMixin,mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView):
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

class notificationeventsIdDeletePost(AuditableMixin,mixins.DestroyModelMixin, generics.GenericAPIView):
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


class notificationeventsIdGet(AuditableMixin,mixins.RetrieveModelMixin, mixins.UpdateModelMixin, generics.GenericAPIView):
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

class notificationtypesBulkPost(AuditableMixin,BulkCreateModelMixin, generics.GenericAPIView):
  """  
  Bulk create / update a number of NotificationType object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = NotificationType.objects.all()  
  serializer_class = serializers.NotificationTypeSerializer
  def post(self, request, *args, **kwargs):
    """
    Creates a number of new NotificationType objects
    """
    return self.create(request, *args, **kwargs)

class notificationtypesGet(AuditableMixin,mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView):
  """  
  Lists available NotificationType objects  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = NotificationType.objects.all()  
  serializer_class = serializers.NotificationTypeSerializer
  def get(self, request, *args, **kwargs):
    """
    Lists available NotificationType objects
    """
    return self.list(request, *args, **kwargs)
  def post(self, request, *args, **kwargs):
    """
    Creates a new NotificationType object
    """
    return self.create(request, *args, **kwargs)

class notificationtypesIdDeletePost(AuditableMixin,mixins.DestroyModelMixin, generics.GenericAPIView):
  """  
  Deletes a specific NotificationType object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = NotificationType.objects.all()  
  serializer_class = serializers.NotificationTypeSerializer
  def post(self, request, *args, **kwargs):
    """
    Destroys the specified NotificationType object
    """
    return self.destroy(request, *args, **kwargs)


class notificationtypesIdGet(AuditableMixin,mixins.RetrieveModelMixin, mixins.UpdateModelMixin, generics.GenericAPIView):
  """  
  Gets a specific NotificationType object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = NotificationType.objects.all()  
  serializer_class = serializers.NotificationTypeSerializer
  def get(self, request, *args, **kwargs):
    """
    Retrieves the specified NotificationType object
    """
    return self.retrieve(request, *args, **kwargs)
  def put(self, request, *args, **kwargs):
    """
    Updates the specified NotificationType object
    """
    return self.update(request, *args, **kwargs)

class permissionsBulkPost(AuditableMixin,BulkCreateModelMixin, generics.GenericAPIView):
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

class permissionsGet(AuditableMixin,mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView):
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

class permissionsIdDeletePost(AuditableMixin,mixins.DestroyModelMixin, generics.GenericAPIView):
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


class permissionsIdGet(AuditableMixin,mixins.RetrieveModelMixin, mixins.UpdateModelMixin, generics.GenericAPIView):
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

class rolesBulkPost(AuditableMixin,BulkCreateModelMixin, generics.GenericAPIView):
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

class rolesGet(AuditableMixin,mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView):
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

class rolesIdDeletePost(AuditableMixin,mixins.DestroyModelMixin, generics.GenericAPIView):
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


class rolesIdGet(AuditableMixin,mixins.RetrieveModelMixin, mixins.UpdateModelMixin, generics.GenericAPIView):
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

class rolepermissionsBulkPost(AuditableMixin,BulkCreateModelMixin, generics.GenericAPIView):
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

class rolepermissionsGet(AuditableMixin,mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView):
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

class rolepermissionsIdDeletePost(AuditableMixin,mixins.DestroyModelMixin, generics.GenericAPIView):
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


class rolepermissionsIdGet(AuditableMixin,mixins.RetrieveModelMixin, mixins.UpdateModelMixin, generics.GenericAPIView):
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

class usersBulkPost(AuditableMixin,BulkCreateModelMixin, generics.GenericAPIView):
  """  
  Bulk create / update a number of User object  
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

class usersGet(AuditableMixin,mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView):
  """  
  Lists available User objects  
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

class usersIdDeletePost(AuditableMixin,mixins.DestroyModelMixin, generics.GenericAPIView):
  """  
  Deletes a specific User object  
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


class usersIdGet(AuditableMixin,mixins.RetrieveModelMixin, mixins.UpdateModelMixin, generics.GenericAPIView):
  """  
  Gets a specific User object  
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

class userrolesBulkPost(AuditableMixin,BulkCreateModelMixin, generics.GenericAPIView):
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

class userrolesGet(AuditableMixin,mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView):
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

class userrolesIdDeletePost(AuditableMixin,mixins.DestroyModelMixin, generics.GenericAPIView):
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


class userrolesIdGet(AuditableMixin,mixins.RetrieveModelMixin, mixins.UpdateModelMixin, generics.GenericAPIView):
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

