from rest_framework import viewsets, permissions, mixins

from api.models.ExpectedUse import ExpectedUse
from api.serializers.ExpectedUse import ExpectedUseSerializer
from auditable.views import AuditableMixin
from rest_framework.response import Response


class ExpectedUseViewSet(AuditableMixin, mixins.ListModelMixin,
                         viewsets.GenericViewSet):
    """
    This viewset automatically provides `list`
    """

    permission_classes = (permissions.AllowAny,)
    http_method_names = ['get']
    ordering_fields = '__all__'
    ordering = ('display_order',)
    queryset = ExpectedUse.objects.all().order_by(*ordering)
    serializer_class = ExpectedUseSerializer
    serializer_classes = {
        'default': ExpectedUseSerializer
    }

    def get_serializer_class(self):
        if self.action in list(self.serializer_classes.keys()):
            return self.serializer_classes[self.action]

        return self.serializer_classes['default']
