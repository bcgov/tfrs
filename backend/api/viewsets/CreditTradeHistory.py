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
from rest_framework import filters, mixins, viewsets
from rest_framework.decorators import list_route
from rest_framework.response import Response

from api.models.CreditTradeHistory import CreditTradeHistory
from api.permissions.CreditTradeHistory import CreditTradeHistoryPermissions
from api.serializers import CreditTradeHistorySerializer, \
    CreditTradeHistoryReviewedSerializer
from auditable.views import AuditableMixin


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

    column_sort_mappings = {
        'updateTimestamp': 'credit_trade_update_time',
        'creditTradeId': 'id',
        'creditType': 'type__the_type',
        'action': 'status__status',
        'initiator': 'credit_trade__initiator__name',
        'respondent': 'respondent__name',
        'user': 'user__display_name'
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

    def list(self, request, **kwargs):
        """
        Function to get the user's activity.
        This should be restricted based on the user's roles.
        A government user won't see draft, submitted, refused.
        A regular user won't see recommended and not recommended.
        Regular users will only see histories related to their organization
        """

        limit = None
        offset = None
        sort_by = 'credit_trade_update_time'
        sort_direction = '-'

        if 'limit' in request.GET:
            limit = int(request.GET['limit'])

        if 'offset' in request.GET:
            offset = int(request.GET['offset'])

        if 'sort_by' in request.GET:
            sort_by = self.column_sort_mappings[request.GET['sort_by']]

        if 'sort_direction' in request.GET:
            sort_direction = request.GET['sort_direction']

        history = self.get_queryset()

        history = history.order_by('{sort_direction}{sort_by}'
                                   .format(sort_direction=sort_direction,
                                           sort_by=sort_by))
        total = history.count()

        headers = {
            'X-Total-Count': '{}'.format(total)
        }

        if limit is not None and offset is not None:
            history = history[offset:offset + limit]

        serializer = self.get_serializer(history,
                                         read_only=True,
                                         many=True)

        return Response(headers=headers,
                        data=serializer.data)
