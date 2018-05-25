from rest_framework import viewsets, permissions, status, mixins, exceptions
from rest_framework.decorators import list_route, detail_route
from rest_framework.response import Response
from rest_framework import filters

from auditable.views import AuditableMixin
from django.db.models import Q
import datetime

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
