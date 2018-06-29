from rest_framework import filters, mixins, permissions, viewsets

from auditable.views import AuditableMixin

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
