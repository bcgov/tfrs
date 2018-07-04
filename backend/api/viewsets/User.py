from api.decorators import permission_required
from auditable.views import AuditableMixin
from rest_framework import viewsets, mixins
from rest_framework.decorators import list_route, detail_route
from rest_framework.response import Response

from api.models.User import User
from api.serializers import UserSerializer
from api.permissions.User import UserPermissions


class UserViewSet(AuditableMixin, viewsets.GenericViewSet, mixins.CreateModelMixin,
                  mixins.ListModelMixin, mixins.UpdateModelMixin, mixins.RetrieveModelMixin
                  ):
    """
    This viewset automatically provides `list`, `create`, `retrieve`,
    and  `update`  actions.
    """
    permission_classes = (UserPermissions,)
    http_method_names = ['get', 'post', 'put', 'patch']
    queryset = User.objects.all()
    serializer_class = UserSerializer

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
    def search(self, request, organizations=None, surname=None, includeInactive=None):
        result = User.objects.all()
        if surname is not None:
            result = result.filter(surname__icontains=surname)

        serializer = self.get_serializer(result, many=True)
        return Response(serializer.data)

    @list_route(methods=['post'])
    def bulk(self):
        pass
