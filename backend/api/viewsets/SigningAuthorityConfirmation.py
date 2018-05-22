from rest_framework import viewsets, permissions, status, mixins, exceptions
from rest_framework.decorators import list_route, detail_route
from rest_framework.response import Response
from rest_framework import filters

from auditable.views import AuditableMixin
from django.db.models import Q
import datetime

from api.models.SigningAuthorityConfirmation \
  import SigningAuthorityConfirmation
from api.serializers import SigningAuthorityConfirmationSerializer


class SigningAuthorityConfirmationViewSet(AuditableMixin,
                                          mixins.CreateModelMixin,
                                          viewsets.GenericViewSet):
    """
    This viewset automatically provides `list`, `create`, `retrieve`,
    `update` and `destroy` actions.
    """
    permission_classes = (permissions.AllowAny,)
    http_method_names = ['post']
    queryset = SigningAuthorityConfirmation.objects.all()
    filter_backends = (filters.OrderingFilter,)
    ordering_fields = '__all__'
    ordering = ('display_order',)
    serializer_class = SigningAuthorityConfirmationSerializer
