from rest_framework import viewsets, permissions, mixins

from api.models.ExpectedUse import ExpectedUse
from api.serializers.ExpectedUse import ExpectedUseSerializer
from auditable.views import AuditableMixin


class ExpectedUseViewSet(AuditableMixin, mixins.ListModelMixin,
                         viewsets.GenericViewSet):
    """
    This viewset automatically provides `list`
    """

    permission_classes = (permissions.AllowAny,)
    http_method_names = ['get']

    serializer_classes = {
        'default': ExpectedUseSerializer
    }

    queryset = ExpectedUse.objects.all()
    ordering = ('display_order',)

    def get_serializer_class(self):
        if self.action in list(self.serializer_classes.keys()):
            return self.serializer_classes[self.action]

        return self.serializer_classes['default']
