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
from .models.Organization import Organization
from .models.OrganizationActionsType import OrganizationActionsType
from .models.OrganizationAttachment import OrganizationAttachment
from .models.OrganizationBalance import OrganizationBalance
from .models.OrganizationHistory import OrganizationHistory
from .models.OrganizationStatus import OrganizationStatus
from .models.Permission import Permission
from .models.PermissionViewModel import PermissionViewModel
from .models.Role import Role
from .models.RolePermission import RolePermission
from .models.RolePermissionViewModel import RolePermissionViewModel
from .models.RoleViewModel import RoleViewModel
from .models.User import User
from .models.UserDetailsViewModel import UserDetailsViewModel
from .models.UserRole import UserRole
from .models.UserRoleViewModel import UserRoleViewModel
from .models.UserViewModel import UserViewModel


class credittradesBulkPost(AuditableMixin, BulkCreateModelMixin,
                           generics.GenericAPIView):
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


class credittradesGet(AuditableMixin, mixins.ListModelMixin,
                      mixins.CreateModelMixin, generics.GenericAPIView):
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


class credittradesIdDeletePost(AuditableMixin, mixins.DestroyModelMixin,
                               generics.GenericAPIView):
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


class credittradesIdGet(AuditableMixin, mixins.RetrieveModelMixin,
                        mixins.UpdateModelMixin, generics.GenericAPIView):
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


class credittradehistoriesBulkPost(AuditableMixin, BulkCreateModelMixin,
                                   generics.GenericAPIView):
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


class credittradehistoriesGet(AuditableMixin, mixins.ListModelMixin,
                              mixins.CreateModelMixin, generics.GenericAPIView):
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


class credittradehistoriesIdDeletePost(AuditableMixin, mixins.DestroyModelMixin,
                                       generics.GenericAPIView):
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


class credittradehistoriesIdGet(AuditableMixin, mixins.RetrieveModelMixin,
                                mixins.UpdateModelMixin,
                                generics.GenericAPIView):
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


class credittradestatusesBulkPost(AuditableMixin, BulkCreateModelMixin,
                                  generics.GenericAPIView):
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


class credittradestatusesGet(AuditableMixin, mixins.ListModelMixin,
                             mixins.CreateModelMixin, generics.GenericAPIView):
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


class credittradestatusesIdDeletePost(AuditableMixin, mixins.DestroyModelMixin,
                                      generics.GenericAPIView):
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


class credittradestatusesIdGet(AuditableMixin, mixins.RetrieveModelMixin,
                               mixins.UpdateModelMixin,
                               generics.GenericAPIView):
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


class credittradetypesBulkPost(AuditableMixin, BulkCreateModelMixin,
                               generics.GenericAPIView):
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


class credittradetypesGet(AuditableMixin, mixins.ListModelMixin,
                          mixins.CreateModelMixin, generics.GenericAPIView):
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


class credittradetypesIdDeletePost(AuditableMixin, mixins.DestroyModelMixin,
                                   generics.GenericAPIView):
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


class credittradetypesIdGet(AuditableMixin, mixins.RetrieveModelMixin,
                            mixins.UpdateModelMixin, generics.GenericAPIView):
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


class credittradezeroreasonBulkPost(AuditableMixin, BulkCreateModelMixin,
                                    generics.GenericAPIView):
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


class credittradezeroreasonGet(AuditableMixin, mixins.ListModelMixin,
                               mixins.CreateModelMixin,
                               generics.GenericAPIView):
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


class credittradezeroreasonIdDeletePost(AuditableMixin,
                                        mixins.DestroyModelMixin,
                                        generics.GenericAPIView):
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


class credittradezeroreasonIdGet(AuditableMixin, mixins.RetrieveModelMixin,
                                 mixins.UpdateModelMixin,
                                 generics.GenericAPIView):
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


class organizationsBulkPost(AuditableMixin, BulkCreateModelMixin,
                            generics.GenericAPIView):
    """
    Bulk create / update a number of Organization object
    """
    lookup_field = 'id'
    permission_classes = (permissions.AllowAny,)
    queryset = Organization.objects.all()
    serializer_class = serializers.OrganizationSerializer

    def post(self, request, *args, **kwargs):
        """
        Creates a number of new Organization objects
        """
        return self.create(request, *args, **kwargs)


class organizationsGet(AuditableMixin, mixins.ListModelMixin,
                       mixins.CreateModelMixin, generics.GenericAPIView):
    """
    Lists available Organization objects
    """
    lookup_field = 'id'
    permission_classes = (permissions.AllowAny,)
    queryset = Organization.objects.all()
    serializer_class = serializers.OrganizationSerializer

    def get(self, request, *args, **kwargs):
        """
        Lists available Organization objects
        """
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        """
        Creates a new Organization object
        """
        return self.create(request, *args, **kwargs)


class organizationsIdDeletePost(AuditableMixin, mixins.DestroyModelMixin,
                                generics.GenericAPIView):
    """
    Deletes a specific Organization object
    """
    lookup_field = 'id'
    permission_classes = (permissions.AllowAny,)
    queryset = Organization.objects.all()
    serializer_class = serializers.OrganizationSerializer

    def post(self, request, *args, **kwargs):
        """
        Destroys the specified Organization object
        """
        return self.destroy(request, *args, **kwargs)


class organizationsIdGet(AuditableMixin, mixins.RetrieveModelMixin,
                         mixins.UpdateModelMixin, generics.GenericAPIView):
    """
    Gets a specific Organization object
    """
    lookup_field = 'id'
    permission_classes = (permissions.AllowAny,)
    queryset = Organization.objects.all()
    serializer_class = serializers.OrganizationSerializer

    def get(self, request, *args, **kwargs):
        """
        Retrieves the specified Organization object
        """
        return self.retrieve(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        """
        Updates the specified Organization object
        """
        return self.update(request, *args, **kwargs)


class organizationactionstypesBulkPost(AuditableMixin, BulkCreateModelMixin,
                                       generics.GenericAPIView):
    """
    Bulk create / update a number of OrganizationActionsType object
    """
    lookup_field = 'id'
    permission_classes = (permissions.AllowAny,)
    queryset = OrganizationActionsType.objects.all()
    serializer_class = serializers.OrganizationActionsTypeSerializer

    def post(self, request, *args, **kwargs):
        """
        Creates a number of new OrganizationActionsType objects
        """
        return self.create(request, *args, **kwargs)


class organizationactionstypesGet(AuditableMixin, mixins.ListModelMixin,
                                  mixins.CreateModelMixin,
                                  generics.GenericAPIView):
    """
    Lists available OrganizationActionsType objects
    """
    lookup_field = 'id'
    permission_classes = (permissions.AllowAny,)
    queryset = OrganizationActionsType.objects.all()
    serializer_class = serializers.OrganizationActionsTypeSerializer

    def get(self, request, *args, **kwargs):
        """
        Lists available OrganizationActionsType objects
        """
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        """
        Creates a new OrganizationActionsType object
        """
        return self.create(request, *args, **kwargs)


class organizationactionstypesIdDeletePost(AuditableMixin,
                                           mixins.DestroyModelMixin,
                                           generics.GenericAPIView):
    """
    Deletes a specific OrganizationActionsType object
    """
    lookup_field = 'id'
    permission_classes = (permissions.AllowAny,)
    queryset = OrganizationActionsType.objects.all()
    serializer_class = serializers.OrganizationActionsTypeSerializer

    def post(self, request, *args, **kwargs):
        """
        Destroys the specified OrganizationActionsType object
        """
        return self.destroy(request, *args, **kwargs)


class organizationactionstypesIdGet(AuditableMixin, mixins.RetrieveModelMixin,
                                    mixins.UpdateModelMixin,
                                    generics.GenericAPIView):
    """
    Gets a specific OrganizationActionsType object
    """
    lookup_field = 'id'
    permission_classes = (permissions.AllowAny,)
    queryset = OrganizationActionsType.objects.all()
    serializer_class = serializers.OrganizationActionsTypeSerializer

    def get(self, request, *args, **kwargs):
        """
        Retrieves the specified OrganizationActionsType object
        """
        return self.retrieve(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        """
        Updates the specified OrganizationActionsType object
        """
        return self.update(request, *args, **kwargs)


class organizationattachmentsBulkPost(AuditableMixin, BulkCreateModelMixin,
                                      generics.GenericAPIView):
    """
    Bulk create / update a number of OrganizationAttachment object
    """
    lookup_field = 'id'
    permission_classes = (permissions.AllowAny,)
    queryset = OrganizationAttachment.objects.all()
    serializer_class = serializers.OrganizationAttachmentSerializer

    def post(self, request, *args, **kwargs):
        """
        Creates a number of new OrganizationAttachment objects
        """
        return self.create(request, *args, **kwargs)


class organizationattachmentsGet(AuditableMixin, mixins.ListModelMixin,
                                 mixins.CreateModelMixin,
                                 generics.GenericAPIView):
    """
    Lists available OrganizationAttachment objects
    """
    lookup_field = 'id'
    permission_classes = (permissions.AllowAny,)
    queryset = OrganizationAttachment.objects.all()
    serializer_class = serializers.OrganizationAttachmentSerializer

    def get(self, request, *args, **kwargs):
        """
        Lists available OrganizationAttachment objects
        """
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        """
        Creates a new OrganizationAttachment object
        """
        return self.create(request, *args, **kwargs)


class organizationattachmentsIdDeletePost(AuditableMixin,
                                          mixins.DestroyModelMixin,
                                          generics.GenericAPIView):
    """
    Deletes a specific OrganizationAttachment object
    """
    lookup_field = 'id'
    permission_classes = (permissions.AllowAny,)
    queryset = OrganizationAttachment.objects.all()
    serializer_class = serializers.OrganizationAttachmentSerializer

    def post(self, request, *args, **kwargs):
        """
        Destroys the specified OrganizationAttachment object
        """
        return self.destroy(request, *args, **kwargs)


class organizationattachmentsIdGet(AuditableMixin, mixins.RetrieveModelMixin,
                                   mixins.UpdateModelMixin,
                                   generics.GenericAPIView):
    """
    Gets a specific OrganizationAttachment object
    """
    lookup_field = 'id'
    permission_classes = (permissions.AllowAny,)
    queryset = OrganizationAttachment.objects.all()
    serializer_class = serializers.OrganizationAttachmentSerializer

    def get(self, request, *args, **kwargs):
        """
        Retrieves the specified OrganizationAttachment object
        """
        return self.retrieve(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        """
        Updates the specified OrganizationAttachment object
        """
        return self.update(request, *args, **kwargs)


class organizationbalancesBulkPost(AuditableMixin, BulkCreateModelMixin,
                                   generics.GenericAPIView):
    """
    Bulk create / update a number of OrganizationBalance object
    """
    lookup_field = 'id'
    permission_classes = (permissions.AllowAny,)
    queryset = OrganizationBalance.objects.all()
    serializer_class = serializers.OrganizationBalanceSerializer

    def post(self, request, *args, **kwargs):
        """
        Creates a number of new OrganizationBalance objects
        """
        return self.create(request, *args, **kwargs)


class organizationbalancesGet(AuditableMixin, mixins.ListModelMixin,
                              mixins.CreateModelMixin, generics.GenericAPIView):
    """
    Lists available OrganizationBalance objects
    """
    lookup_field = 'id'
    permission_classes = (permissions.AllowAny,)
    queryset = OrganizationBalance.objects.all()
    serializer_class = serializers.OrganizationBalanceSerializer

    def get(self, request, *args, **kwargs):
        """
        Lists available OrganizationBalance objects
        """
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        """
        Creates a new OrganizationBalance object
        """
        return self.create(request, *args, **kwargs)


class organizationbalancesIdDeletePost(AuditableMixin, mixins.DestroyModelMixin,
                                       generics.GenericAPIView):
    """
    Deletes a specific OrganizationBalance object
    """
    lookup_field = 'id'
    permission_classes = (permissions.AllowAny,)
    queryset = OrganizationBalance.objects.all()
    serializer_class = serializers.OrganizationBalanceSerializer

    def post(self, request, *args, **kwargs):
        """
        Destroys the specified OrganizationBalance object
        """
        return self.destroy(request, *args, **kwargs)


class organizationbalancesIdGet(AuditableMixin, mixins.RetrieveModelMixin,
                                mixins.UpdateModelMixin,
                                generics.GenericAPIView):
    """
    Gets a specific OrganizationBalance object
    """
    lookup_field = 'id'
    permission_classes = (permissions.AllowAny,)
    queryset = OrganizationBalance.objects.all()
    serializer_class = serializers.OrganizationBalanceSerializer

    def get(self, request, *args, **kwargs):
        """
        Retrieves the specified OrganizationBalance object
        """
        return self.retrieve(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        """
        Updates the specified OrganizationBalance object
        """
        return self.update(request, *args, **kwargs)


class organizationhistoriesBulkPost(AuditableMixin, BulkCreateModelMixin,
                                    generics.GenericAPIView):
    """
    Bulk create / update a number of OrganizationHistory object
    """
    lookup_field = 'id'
    permission_classes = (permissions.AllowAny,)
    queryset = OrganizationHistory.objects.all()
    serializer_class = serializers.OrganizationHistorySerializer

    def post(self, request, *args, **kwargs):
        """
        Creates a number of new OrganizationHistory objects
        """
        return self.create(request, *args, **kwargs)


class organizationhistoriesGet(AuditableMixin, mixins.ListModelMixin,
                               mixins.CreateModelMixin,
                               generics.GenericAPIView):
    """
    Lists available OrganizationHistory objects
    """
    lookup_field = 'id'
    permission_classes = (permissions.AllowAny,)
    queryset = OrganizationHistory.objects.all()
    serializer_class = serializers.OrganizationHistorySerializer

    def get(self, request, *args, **kwargs):
        """
        Lists available OrganizationHistory objects
        """
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        """
        Creates a new OrganizationHistory object
        """
        return self.create(request, *args, **kwargs)


class organizationhistoriesIdDeletePost(AuditableMixin,
                                        mixins.DestroyModelMixin,
                                        generics.GenericAPIView):
    """
    Deletes a specific OrganizationHistory object
    """
    lookup_field = 'id'
    permission_classes = (permissions.AllowAny,)
    queryset = OrganizationHistory.objects.all()
    serializer_class = serializers.OrganizationHistorySerializer

    def post(self, request, *args, **kwargs):
        """
        Destroys the specified OrganizationHistory object
        """
        return self.destroy(request, *args, **kwargs)


class organizationhistoriesIdGet(AuditableMixin, mixins.RetrieveModelMixin,
                                 mixins.UpdateModelMixin,
                                 generics.GenericAPIView):
    """
    Gets a specific OrganizationHistory object
    """
    lookup_field = 'id'
    permission_classes = (permissions.AllowAny,)
    queryset = OrganizationHistory.objects.all()
    serializer_class = serializers.OrganizationHistorySerializer

    def get(self, request, *args, **kwargs):
        """
        Retrieves the specified OrganizationHistory object
        """
        return self.retrieve(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        """
        Updates the specified OrganizationHistory object
        """
        return self.update(request, *args, **kwargs)


class organizationstatusesBulkPost(AuditableMixin, BulkCreateModelMixin,
                                   generics.GenericAPIView):
    """
    Bulk create / update a number of OrganizationStatus object
    """
    lookup_field = 'id'
    permission_classes = (permissions.AllowAny,)
    queryset = OrganizationStatus.objects.all()
    serializer_class = serializers.OrganizationStatusSerializer

    def post(self, request, *args, **kwargs):
        """
        Creates a number of new OrganizationStatus objects
        """
        return self.create(request, *args, **kwargs)


class organizationstatusesGet(AuditableMixin, mixins.ListModelMixin,
                              mixins.CreateModelMixin, generics.GenericAPIView):
    """
    Lists available OrganizationStatus objects
    """
    lookup_field = 'id'
    permission_classes = (permissions.AllowAny,)
    queryset = OrganizationStatus.objects.all()
    serializer_class = serializers.OrganizationStatusSerializer

    def get(self, request, *args, **kwargs):
        """
        Lists available OrganizationStatus objects
        """
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        """
        Creates a new OrganizationStatus object
        """
        return self.create(request, *args, **kwargs)


class organizationstatusesIdDeletePost(AuditableMixin, mixins.DestroyModelMixin,
                                       generics.GenericAPIView):
    """
    Deletes a specific OrganizationStatus object
    """
    lookup_field = 'id'
    permission_classes = (permissions.AllowAny,)
    queryset = OrganizationStatus.objects.all()
    serializer_class = serializers.OrganizationStatusSerializer

    def post(self, request, *args, **kwargs):
        """
        Destroys the specified OrganizationStatus object
        """
        return self.destroy(request, *args, **kwargs)


class organizationstatusesIdGet(AuditableMixin, mixins.RetrieveModelMixin,
                                mixins.UpdateModelMixin,
                                generics.GenericAPIView):
    """
    Gets a specific OrganizationStatus object
    """
    lookup_field = 'id'
    permission_classes = (permissions.AllowAny,)
    queryset = OrganizationStatus.objects.all()
    serializer_class = serializers.OrganizationStatusSerializer

    def get(self, request, *args, **kwargs):
        """
        Retrieves the specified OrganizationStatus object
        """
        return self.retrieve(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        """
        Updates the specified OrganizationStatus object
        """
        return self.update(request, *args, **kwargs)


class permissionsBulkPost(AuditableMixin, BulkCreateModelMixin,
                          generics.GenericAPIView):
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


class permissionsGet(AuditableMixin, mixins.ListModelMixin,
                     mixins.CreateModelMixin, generics.GenericAPIView):
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


class permissionsIdDeletePost(AuditableMixin, mixins.DestroyModelMixin,
                              generics.GenericAPIView):
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


class permissionsIdGet(AuditableMixin, mixins.RetrieveModelMixin,
                       mixins.UpdateModelMixin, generics.GenericAPIView):
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


class rolesBulkPost(AuditableMixin, BulkCreateModelMixin,
                    generics.GenericAPIView):
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


class rolesGet(AuditableMixin, mixins.ListModelMixin, mixins.CreateModelMixin,
               generics.GenericAPIView):
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


class rolesIdDeletePost(AuditableMixin, mixins.DestroyModelMixin,
                        generics.GenericAPIView):
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


class rolesIdGet(AuditableMixin, mixins.RetrieveModelMixin,
                 mixins.UpdateModelMixin, generics.GenericAPIView):
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


class rolepermissionsBulkPost(AuditableMixin, BulkCreateModelMixin,
                              generics.GenericAPIView):
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


class rolepermissionsGet(AuditableMixin, mixins.ListModelMixin,
                         mixins.CreateModelMixin, generics.GenericAPIView):
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


class rolepermissionsIdDeletePost(AuditableMixin, mixins.DestroyModelMixin,
                                  generics.GenericAPIView):
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


class rolepermissionsIdGet(AuditableMixin, mixins.RetrieveModelMixin,
                           mixins.UpdateModelMixin, generics.GenericAPIView):
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


class usersBulkPost(AuditableMixin, BulkCreateModelMixin,
                    generics.GenericAPIView):
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


class usersGet(AuditableMixin, mixins.ListModelMixin, mixins.CreateModelMixin,
               generics.GenericAPIView):
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


class usersIdDeletePost(AuditableMixin, mixins.DestroyModelMixin,
                        generics.GenericAPIView):
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


class usersIdGet(AuditableMixin, mixins.RetrieveModelMixin,
                 mixins.UpdateModelMixin, generics.GenericAPIView):
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


class userrolesBulkPost(AuditableMixin, BulkCreateModelMixin,
                        generics.GenericAPIView):
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


class userrolesGet(AuditableMixin, mixins.ListModelMixin,
                   mixins.CreateModelMixin, generics.GenericAPIView):
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


class userrolesIdDeletePost(AuditableMixin, mixins.DestroyModelMixin,
                            generics.GenericAPIView):
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


class userrolesIdGet(AuditableMixin, mixins.RetrieveModelMixin,
                     mixins.UpdateModelMixin, generics.GenericAPIView):
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
