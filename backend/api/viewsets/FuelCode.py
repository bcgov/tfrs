from django.db.models import Q

from rest_framework import viewsets, mixins
from rest_framework.decorators import list_route
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from api.models.FuelCode import FuelCode
from api.models.FuelCodeStatus import FuelCodeStatus
from api.permissions.FuelCode import FuelCodePermissions
from api.serializers.FuelCode import \
    FuelCodeCreateSerializer, FuelCodeSerializer
from api.serializers.FuelCodeStatus import FuelCodeStatusSerializer
from auditable.views import AuditableMixin


class FuelCodeViewSet(AuditableMixin,
                      mixins.CreateModelMixin,
                      mixins.ListModelMixin,
                      mixins.RetrieveModelMixin,
                      mixins.UpdateModelMixin,
                      viewsets.GenericViewSet):
    """
    This viewset automatically provides `list`, `create`, `retrieve`.
    """

    permission_classes = (FuelCodePermissions,)
    http_method_names = ['delete', 'get', 'post', 'patch']

    serializer_classes = {
        'default': FuelCodeSerializer,
        'create': FuelCodeCreateSerializer,
        'statuses': FuelCodeStatusSerializer,
    }

    queryset = FuelCode.objects.all()
    ordering = ('-id',)

    def get_serializer_class(self):
        if self.action in list(self.serializer_classes.keys()):
            return self.serializer_classes[self.action]

        return self.serializer_classes['default']

    def get_queryset(self):
        user = self.request.user

        if user.is_government_user:
            return self.queryset.filter(
                ~Q(status__status__in=['Cancelled', 'Draft'])
            ).all()

        return self.queryset.filter(
            ~Q(status__status__in=['Cancelled'])
        ).all()

    @list_route(methods=['get'], permission_classes=[AllowAny])
    def statuses(self, request):
        """
        Gets the list of statuses that can be applied to a fuel code
        """
        statuses = FuelCodeStatus.objects.all()

        serializer = self.get_serializer(
            statuses, read_only=True, many=True)

        return Response(serializer.data)
