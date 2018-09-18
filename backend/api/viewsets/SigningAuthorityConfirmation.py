from rest_framework import filters, mixins, permissions, viewsets

from api.permissions.SigningAuthorityConfirmation \
  import SigningAuthorityConfirmationPermissions
from api.models.SigningAuthorityConfirmation \
  import SigningAuthorityConfirmation
from api.serializers import SigningAuthorityConfirmationSerializer
from auditable.views import AuditableMixin


class SigningAuthorityConfirmationViewSet(AuditableMixin,
                                          mixins.CreateModelMixin,
                                          viewsets.GenericViewSet):
    """
    This viewset mixin automatically provides `create`
    """
    permission_classes = (SigningAuthorityConfirmationPermissions,)
    http_method_names = ['post']
    queryset = SigningAuthorityConfirmation.objects.all()
    filter_backends = (filters.OrderingFilter,)
    ordering_fields = '__all__'
    ordering = ('display_order',)
    serializer_class = SigningAuthorityConfirmationSerializer
