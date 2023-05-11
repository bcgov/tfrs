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
from django.db.models import Q
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from api.models.CreditTradeHistory import CreditTradeHistory
from api.permissions.CreditTradeHistory import CreditTradeHistoryPermissions
from api.serializers import CreditTradeHistoryReviewedSerializer
from api.paginations import BasicPagination


class CreditTradeHistoryViewSet(viewsets.GenericViewSet):
    queryset = CreditTradeHistory.objects.all()
    permission_classes = (CreditTradeHistoryPermissions,)
    serializer_classes = {
        "default": CreditTradeHistoryReviewedSerializer,
    }
    pagination_class = BasicPagination

    column_sort_mappings = {
        "createTimestamp": "create_timestamp",
        "creditTradeId": "credit_trade__id",
        "initiator": "credit_trade__initiator__name",
        "respondent": "credit_trade__respondent__name",
    }

    def get_serializer_class(self):
        if self.action in list(self.serializer_classes.keys()):
            return self.serializer_classes[self.action]

        return self.serializer_classes["default"]

    def get_queryset(self):
        """
        Queryset should be restricted based on the user's roles.
        A government user won't see draft, submitted, refused.
        A regular user won't see recommended and not recommended.
        Regular users will only see histories related to their organization
        """
        user = self.request.user
        return CreditTradeHistory.objects.filter(
            Q(create_user__organization_id=user.organization_id)
        )

    @action(detail=False, methods=["post"])
    def paginated(self, request):
        queryset = self.filter_queryset(self.get_queryset())

        sorts = request.data.get("sorts")
        for sort in sorts:
            id = sort.get("id")
            desc = sort.get("desc")
            sort_field = self.column_sort_mappings.get(id)
            if sort_field:
                if desc:
                    queryset = queryset.order_by("-" + sort_field)
                else:
                    queryset = queryset.order_by(sort_field)

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
