from rest_framework import viewsets, permissions, mixins

from api.models.NotionalTransferType import NotionalTransferType
from api.serializers.NotionalTransferType import NotionalTransferTypeSerializer
from auditable.views import AuditableMixin


class NotionalTransferTypeViewSet(
        AuditableMixin, mixins.ListModelMixin, viewsets.GenericViewSet):
    """
    This viewset automatically provides `list`
    """

    permission_classes = (permissions.AllowAny,)
    http_method_names = ['get']
    ordering_fields = '__all__'
    ordering = ('display_order',)
    queryset = NotionalTransferType.objects.all().order_by(*ordering)
    serializer_class = NotionalTransferTypeSerializer
    serializer_classes = {
        'default': NotionalTransferTypeSerializer
    }

    def get_serializer_class(self):
        if self.action in list(self.serializer_classes.keys()):
            return self.serializer_classes[self.action]

        return self.serializer_classes['default']
