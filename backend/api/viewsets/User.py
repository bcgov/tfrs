from auditable.views import AuditableMixin
from rest_framework import viewsets, permissions
from rest_framework.decorators import list_route, detail_route
from rest_framework.response import Response

from api.models.User import User


class UserViewSet(AuditableMixin, viewsets.ModelViewSet):
    """
    This viewset automatically provides `list`, `create`, `retrieve`,
    `update` and `destroy` actions.
    """
    permission_classes = (permissions.AllowAny,)
    # http_method_names = ['get', 'post', 'put']
    queryset = Organization.objects.all()
    serializer_class = OrganizationSerializer

    serializer_classes = {
        'balance': OrganizationBalanceSerializer,
        'default': OrganizationSerializer,
        'history': OrganizationHistorySerializer
    }

    def get_serializer_class(self):
        if self.action in list(self.serializer_classes.keys()):
            return self.serializer_classes[self.action]
        else:
            return self.serializer_classes['default']

    @detail_route()
    def current(self, request, pk=None):
        """
        Get the current user
        """

        user, created = User.objects.get_or_create(

        )
        # print("Organization")
        serializer = self.get_serializer(user)

        return Response(serializer.data)
