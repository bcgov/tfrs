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
import datetime
from rest_framework import filters, mixins, permissions, viewsets
from django.db.models import Q

from auditable.views import AuditableMixin

from api.models.SigningAuthorityAssertion import SigningAuthorityAssertion
from api.serializers import SigningAuthorityAssertionSerializer


class SigningAuthorityAssertionViewSet(AuditableMixin, mixins.ListModelMixin,
                                       viewsets.GenericViewSet):
    """
    This viewset automatically provides `list`
    """
    permission_classes = (permissions.AllowAny,)
    http_method_names = ['get']
    queryset = SigningAuthorityAssertion.objects.all()
    filter_backends = (filters.OrderingFilter,)
    ordering_fields = '__all__'
    ordering = ('display_order',)
    serializer_class = SigningAuthorityAssertionSerializer

    def get_queryset(self):
        """
        This view should return a list of all the assertions that don't have
        an expiration date
        """
        expiration_date = datetime.date.today()
        return SigningAuthorityAssertion.objects.filter(
            Q(expiration_date__gte=expiration_date) |
            Q(expiration_date=None)
        )
