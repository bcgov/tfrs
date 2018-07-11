from rest_framework import mixins, viewsets, permissions
from rest_framework.decorators import list_route
from rest_framework.response import Response

from api.decorators import permission_required
from api.models.User import User
from api.permissions.User import UserPermissions
from api.serializers import UserSerializer, UserViewSerializer

from auditable.views import AuditableMixin


class UserViewSet(AuditableMixin, viewsets.GenericViewSet,
                  mixins.CreateModelMixin, mixins.ListModelMixin,
                  mixins.UpdateModelMixin, mixins.RetrieveModelMixin):
    """
    This viewset automatically provides `list`, `create`, `retrieve`,
    and  `update`  actions.
    """
    permission_classes = (UserPermissions,)
    http_method_names = ['get', 'post', 'put', 'patch']
    queryset = User.objects.all()

    serializer_classes = {
        'default': UserSerializer,
        'retrieve': UserViewSerializer
    }

    def get_serializer_class(self):
        if self.action in list(self.serializer_classes.keys()):
            return self.serializer_classes[self.action]

        return self.serializer_classes['default']

    @list_route()
    def current(self, request):
        """
        Get the current user
        """
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

    @permission_required('USER_MANAGEMENT')
    def list(self, request, *args, **kwargs):
        result = User.objects.all()
        serializer = self.get_serializer(result, many=True)
        return Response(serializer.data)

    @list_route()
    @permission_required('USER_MANAGEMENT')
    def search(self, request, organizations=None, surname=None,
               include_inactive=None):
        result = User.objects.all()
        if surname is not None:
            result = result.filter(surname__icontains=surname)

        serializer = self.get_serializer(result, many=True)
        return Response(serializer.data)
