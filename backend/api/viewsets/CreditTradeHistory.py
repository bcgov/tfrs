"""
    REST API Documentation for the NRS TFRS Credit Trading Application

    The Transportation Fuels Reporting System is being designed to streamline
    compliance reporting for transportation fuel suppliers in accordance with
    the Renewable & Low Carbon Fuel Requirements Regulation.

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
from rest_framework import filters, mixins, permissions, viewsets

from auditable.views import AuditableMixin

from api.models.CreditTradeHistory import CreditTradeHistory
from api.permissions.CreditTradeHistory import CreditTradeHistoryPermissions
from api.serializers import CreditTradeHistorySerializer, \
    CreditTradeHistoryReviewedSerializer


class CreditTradeHistoryViewSet(AuditableMixin, mixins.ListModelMixin,
                                viewsets.GenericViewSet):
    """
    This viewset automatically provides `list`
    """
    permission_classes = (CreditTradeHistoryPermissions,)
    http_method_names = ['get']
    queryset = CreditTradeHistory.objects.all()
    filter_backends = (filters.OrderingFilter,)
    ordering_fields = '__all__'
    ordering = ('-update_timestamp', '-create_timestamp', '-id',)
    serializer_class = CreditTradeHistorySerializer
    serializer_classes = {
        'list': CreditTradeHistoryReviewedSerializer
    }

    def get_serializer_class(self):
        if self.action in list(self.serializer_classes.keys()):
            return self.serializer_classes[self.action]

        return self.serializer_classes['default']

    def get_queryset(self):
        """
        This view should return the credit trade history for all users
        of the same organization as the logged-in user
        """
        user = self.request.user
        return CreditTradeHistory.objects.filter(
            user__organization_id=user.organization_id
        )
