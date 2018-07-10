from rest_framework import viewsets, permissions
from rest_framework.decorators import list_route
from rest_framework.response import Response

from api.models.User import User
from api.serializers import UserSerializer, UserViewSerializer

from auditable.views import AuditableMixin


class UserViewSet(AuditableMixin, viewsets.ModelViewSet):
    """
    This viewset automatically provides `list`, `create`, `retrieve`,
    `update` and `destroy` actions.
    """
    permission_classes = (permissions.AllowAny,)
    http_method_names = ['get', 'post', 'put']
    queryset = User.objects.all()

    serializer_classes = {
        'default': UserSerializer,
        'retrieve': UserViewSerializer
    }

    def get_serializer_class(self):
        if self.action in list(self.serializer_classes.keys()):
            return self.serializer_classes[self.action]
        else:
            return self.serializer_classes['default']

    @list_route()
    def current(self, request):
        """
        Get the current user
        """
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

    @list_route()
    def search(self, request, organizations=None, surname=None,
               include_inactive=None):
        result = User.objects.all()
        if surname is not None:
            result = result.filter(surname__icontains=surname)

        serializer = self.get_serializer(result, many=True)
        return Response(serializer.data)

    @list_route(methods=['post'])
    def bulk(self):
        pass
