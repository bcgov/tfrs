from rest_framework import viewsets, permissions, mixins

from api.models.TransactionType import TransactionType
from api.serializers.TransactionType import TransactionTypeSerializer
from auditable.views import AuditableMixin


class TransactionTypeViewSet(
        AuditableMixin, mixins.ListModelMixin, viewsets.GenericViewSet):
    """
    This viewset automatically provides `list`
    """

    permission_classes = (permissions.AllowAny,)
    http_method_names = ['get']
    ordering_fields = '__all__'
    ordering = ('display_order',)
    queryset = TransactionType.objects.all().order_by(*ordering)
    serializer_class = TransactionTypeSerializer
    serializer_classes = {
        'default': TransactionTypeSerializer
    }

    def get_serializer_class(self):
        if self.action in list(self.serializer_classes.keys()):
            return self.serializer_classes[self.action]

        return self.serializer_classes['default']
