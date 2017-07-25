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

class credittradehistoriesBulkPost(BulkCreateModelMixin, generics.GenericAPIView):
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

class credittradehistoriesGet(mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView):
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

class credittradehistoriesIdDeletePost(mixins.DestroyModelMixin, generics.GenericAPIView):
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


class credittradehistoriesIdGet(mixins.RetrieveModelMixin, mixins.UpdateModelMixin, generics.GenericAPIView):
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

class credittradestatusesBulkPost(BulkCreateModelMixin, generics.GenericAPIView):
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

class credittradestatusesGet(mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView):
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

class credittradestatusesIdDeletePost(mixins.DestroyModelMixin, generics.GenericAPIView):
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


class credittradestatusesIdGet(mixins.RetrieveModelMixin, mixins.UpdateModelMixin, generics.GenericAPIView):
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

class credittradetypesBulkPost(BulkCreateModelMixin, generics.GenericAPIView):
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

class credittradetypesGet(mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView):
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

class credittradetypesIdDeletePost(mixins.DestroyModelMixin, generics.GenericAPIView):
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


class credittradetypesIdGet(mixins.RetrieveModelMixin, mixins.UpdateModelMixin, generics.GenericAPIView):
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

class fuelsupplieractionstypesBulkPost(BulkCreateModelMixin, generics.GenericAPIView):
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

class fuelsupplieractionstypesGet(mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView):
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

class fuelsupplieractionstypesIdDeletePost(mixins.DestroyModelMixin, generics.GenericAPIView):
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


class fuelsupplieractionstypesIdGet(mixins.RetrieveModelMixin, mixins.UpdateModelMixin, generics.GenericAPIView):
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

class fuelsupplierattachmentsBulkPost(BulkCreateModelMixin, generics.GenericAPIView):
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

class fuelsupplierattachmentsGet(mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView):
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

class fuelsupplierattachmentsIdDeletePost(mixins.DestroyModelMixin, generics.GenericAPIView):
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


class fuelsupplierattachmentsIdGet(mixins.RetrieveModelMixin, mixins.UpdateModelMixin, generics.GenericAPIView):
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

class fuelsupplierattachmenttagsBulkPost(BulkCreateModelMixin, generics.GenericAPIView):
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

class fuelsupplierattachmenttagsGet(mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView):
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

class fuelsupplierattachmenttagsIdDeletePost(mixins.DestroyModelMixin, generics.GenericAPIView):
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


class fuelsupplierattachmenttagsIdGet(mixins.RetrieveModelMixin, mixins.UpdateModelMixin, generics.GenericAPIView):
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

class fuelsupplierbalancesBulkPost(BulkCreateModelMixin, generics.GenericAPIView):
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

class fuelsupplierbalancesGet(mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView):
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

class fuelsupplierbalancesIdDeletePost(mixins.DestroyModelMixin, generics.GenericAPIView):
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


class fuelsupplierbalancesIdGet(mixins.RetrieveModelMixin, mixins.UpdateModelMixin, generics.GenericAPIView):
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

class fuelsuppliersCCDatumBulkPost(BulkCreateModelMixin, generics.GenericAPIView):
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

class fuelsuppliersCCDatumGet(mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView):
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

class fuelsuppliersCCDatumIdDeletePost(mixins.DestroyModelMixin, generics.GenericAPIView):
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


class fuelsuppliersCCDatumIdGet(mixins.RetrieveModelMixin, mixins.UpdateModelMixin, generics.GenericAPIView):
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

class fuelsuppliercontactsBulkPost(BulkCreateModelMixin, generics.GenericAPIView):
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

class fuelsuppliercontactsGet(mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView):
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

class fuelsuppliercontactsIdDeletePost(mixins.DestroyModelMixin, generics.GenericAPIView):
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


class fuelsuppliercontactsIdGet(mixins.RetrieveModelMixin, mixins.UpdateModelMixin, generics.GenericAPIView):
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

class fuelsuppliercontactrolesBulkPost(BulkCreateModelMixin, generics.GenericAPIView):
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

class fuelsuppliercontactrolesGet(mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView):
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

class fuelsuppliercontactrolesIdDeletePost(mixins.DestroyModelMixin, generics.GenericAPIView):
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


class fuelsuppliercontactrolesIdGet(mixins.RetrieveModelMixin, mixins.UpdateModelMixin, generics.GenericAPIView):
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

class fuelsupplierhistoriesBulkPost(BulkCreateModelMixin, generics.GenericAPIView):
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

class fuelsupplierhistoriesGet(mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView):
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

class fuelsupplierhistoriesIdDeletePost(mixins.DestroyModelMixin, generics.GenericAPIView):
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


class fuelsupplierhistoriesIdGet(mixins.RetrieveModelMixin, mixins.UpdateModelMixin, generics.GenericAPIView):
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

class fuelsupplierstatusesBulkPost(BulkCreateModelMixin, generics.GenericAPIView):
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

class fuelsupplierstatusesGet(mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView):
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

class fuelsupplierstatusesIdDeletePost(mixins.DestroyModelMixin, generics.GenericAPIView):
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


class fuelsupplierstatusesIdGet(mixins.RetrieveModelMixin, mixins.UpdateModelMixin, generics.GenericAPIView):
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

class fuelsuppliertypesBulkPost(BulkCreateModelMixin, generics.GenericAPIView):
  """  
  Bulk create / update a number of FuelSupplierType object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = FuelSupplierType.objects.all()  
  serializer_class = serializers.FuelSupplierTypeSerializer
  def post(self, request, *args, **kwargs):
    """
    Creates a number of new FuelSupplierType objects
    """
    return self.create(request, *args, **kwargs)

class fuelsuppliertypesGet(mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView):
  """  
  Lists available FuelSupplierType objects  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = FuelSupplierType.objects.all()  
  serializer_class = serializers.FuelSupplierTypeSerializer
  def get(self, request, *args, **kwargs):
    """
    Lists available FuelSupplierType objects
    """
    return self.list(request, *args, **kwargs)
  def post(self, request, *args, **kwargs):
    """
    Creates a new FuelSupplierType object
    """
    return self.create(request, *args, **kwargs)

class fuelsuppliertypesIdDeletePost(mixins.DestroyModelMixin, generics.GenericAPIView):
  """  
  Deletes a specific FuelSupplierType object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = FuelSupplierType.objects.all()  
  serializer_class = serializers.FuelSupplierTypeSerializer
  def post(self, request, *args, **kwargs):
    """
    Destroys the specified FuelSupplierType object
    """
    return self.destroy(request, *args, **kwargs)


class fuelsuppliertypesIdGet(mixins.RetrieveModelMixin, mixins.UpdateModelMixin, generics.GenericAPIView):
  """  
  Gets a specific FuelSupplierType object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = FuelSupplierType.objects.all()  
  serializer_class = serializers.FuelSupplierTypeSerializer
  def get(self, request, *args, **kwargs):
    """
    Retrieves the specified FuelSupplierType object
    """
    return self.retrieve(request, *args, **kwargs)
  def put(self, request, *args, **kwargs):
    """
    Updates the specified FuelSupplierType object
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

class notificationtypesBulkPost(BulkCreateModelMixin, generics.GenericAPIView):
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

class notificationtypesGet(mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView):
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

class notificationtypesIdDeletePost(mixins.DestroyModelMixin, generics.GenericAPIView):
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


class notificationtypesIdGet(mixins.RetrieveModelMixin, mixins.UpdateModelMixin, generics.GenericAPIView):
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

class opportunitiesBulkPost(BulkCreateModelMixin, generics.GenericAPIView):
  """  
  Bulk create / update a number of Opportunity object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = Opportunity.objects.all()  
  serializer_class = serializers.OpportunitySerializer
  def post(self, request, *args, **kwargs):
    """
    Creates a number of new Opportunity objects
    """
    return self.create(request, *args, **kwargs)

class opportunitiesGet(mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView):
  """  
  Lists available Opportunity objects  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = Opportunity.objects.all()  
  serializer_class = serializers.OpportunitySerializer
  def get(self, request, *args, **kwargs):
    """
    Lists available Opportunity objects
    """
    return self.list(request, *args, **kwargs)
  def post(self, request, *args, **kwargs):
    """
    Creates a new Opportunity object
    """
    return self.create(request, *args, **kwargs)

class opportunitiesIdDeletePost(mixins.DestroyModelMixin, generics.GenericAPIView):
  """  
  Deletes a specific Opportunity object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = Opportunity.objects.all()  
  serializer_class = serializers.OpportunitySerializer
  def post(self, request, *args, **kwargs):
    """
    Destroys the specified Opportunity object
    """
    return self.destroy(request, *args, **kwargs)


class opportunitiesIdGet(mixins.RetrieveModelMixin, mixins.UpdateModelMixin, generics.GenericAPIView):
  """  
  Gets a specific Opportunity object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = Opportunity.objects.all()  
  serializer_class = serializers.OpportunitySerializer
  def get(self, request, *args, **kwargs):
    """
    Retrieves the specified Opportunity object
    """
    return self.retrieve(request, *args, **kwargs)
  def put(self, request, *args, **kwargs):
    """
    Updates the specified Opportunity object
    """
    return self.update(request, *args, **kwargs)

class opportunityhistoriesBulkPost(BulkCreateModelMixin, generics.GenericAPIView):
  """  
  Bulk create / update a number of OpportunityHistory object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = OpportunityHistory.objects.all()  
  serializer_class = serializers.OpportunityHistorySerializer
  def post(self, request, *args, **kwargs):
    """
    Creates a number of new OpportunityHistory objects
    """
    return self.create(request, *args, **kwargs)

class opportunityhistoriesGet(mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView):
  """  
  Lists available OpportunityHistory objects  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = OpportunityHistory.objects.all()  
  serializer_class = serializers.OpportunityHistorySerializer
  def get(self, request, *args, **kwargs):
    """
    Lists available OpportunityHistory objects
    """
    return self.list(request, *args, **kwargs)
  def post(self, request, *args, **kwargs):
    """
    Creates a new OpportunityHistory object
    """
    return self.create(request, *args, **kwargs)

class opportunityhistoriesIdDeletePost(mixins.DestroyModelMixin, generics.GenericAPIView):
  """  
  Deletes a specific OpportunityHistory object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = OpportunityHistory.objects.all()  
  serializer_class = serializers.OpportunityHistorySerializer
  def post(self, request, *args, **kwargs):
    """
    Destroys the specified OpportunityHistory object
    """
    return self.destroy(request, *args, **kwargs)


class opportunityhistoriesIdGet(mixins.RetrieveModelMixin, mixins.UpdateModelMixin, generics.GenericAPIView):
  """  
  Gets a specific OpportunityHistory object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = OpportunityHistory.objects.all()  
  serializer_class = serializers.OpportunityHistorySerializer
  def get(self, request, *args, **kwargs):
    """
    Retrieves the specified OpportunityHistory object
    """
    return self.retrieve(request, *args, **kwargs)
  def put(self, request, *args, **kwargs):
    """
    Updates the specified OpportunityHistory object
    """
    return self.update(request, *args, **kwargs)

class opportunitystatusesBulkPost(BulkCreateModelMixin, generics.GenericAPIView):
  """  
  Bulk create / update a number of OpportunityStatus object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = OpportunityStatus.objects.all()  
  serializer_class = serializers.OpportunityStatusSerializer
  def post(self, request, *args, **kwargs):
    """
    Creates a number of new OpportunityStatus objects
    """
    return self.create(request, *args, **kwargs)

class opportunitystatusesGet(mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView):
  """  
  Lists available OpportunityStatus objects  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = OpportunityStatus.objects.all()  
  serializer_class = serializers.OpportunityStatusSerializer
  def get(self, request, *args, **kwargs):
    """
    Lists available OpportunityStatus objects
    """
    return self.list(request, *args, **kwargs)
  def post(self, request, *args, **kwargs):
    """
    Creates a new OpportunityStatus object
    """
    return self.create(request, *args, **kwargs)

class opportunitystatusesIdDeletePost(mixins.DestroyModelMixin, generics.GenericAPIView):
  """  
  Deletes a specific OpportunityStatus object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = OpportunityStatus.objects.all()  
  serializer_class = serializers.OpportunityStatusSerializer
  def post(self, request, *args, **kwargs):
    """
    Destroys the specified OpportunityStatus object
    """
    return self.destroy(request, *args, **kwargs)


class opportunitystatusesIdGet(mixins.RetrieveModelMixin, mixins.UpdateModelMixin, generics.GenericAPIView):
  """  
  Gets a specific OpportunityStatus object  
  """
  lookup_field = 'id'
  permission_classes = (permissions.AllowAny,)  
  queryset = OpportunityStatus.objects.all()  
  serializer_class = serializers.OpportunityStatusSerializer
  def get(self, request, *args, **kwargs):
    """
    Retrieves the specified OpportunityStatus object
    """
    return self.retrieve(request, *args, **kwargs)
  def put(self, request, *args, **kwargs):
    """
    Updates the specified OpportunityStatus object
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

class usersGet(mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView):
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

class usersIdDeletePost(mixins.DestroyModelMixin, generics.GenericAPIView):
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


class usersIdGet(mixins.RetrieveModelMixin, mixins.UpdateModelMixin, generics.GenericAPIView):
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


