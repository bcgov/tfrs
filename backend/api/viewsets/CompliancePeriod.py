from rest_framework import viewsets, permissions, status, mixins, filters

from api.models.CompliancePeriod import CompliancePeriod
from api.permissions.CompliancePeriod import CompliancePeriodPermissions
from api.serializers import CompliancePeriodSerializer
from auditable.views import AuditableMixin


class CompliancePeriodViewSet(AuditableMixin, mixins.CreateModelMixin,
                              mixins.RetrieveModelMixin,
                              mixins.UpdateModelMixin,
                              mixins.ListModelMixin, viewsets.GenericViewSet):
    """
    This viewset automatically provides `list`, `create`, `retrieve`,
    and `update` actions.
    """

    permission_classes = (CompliancePeriodPermissions,)
    http_method_names = ['get', 'post', 'put', 'patch']
    queryset = CompliancePeriod.objects.all()
    filter_backends = (filters.OrderingFilter,)
    ordering_fields = '__all__'
    ordering = ('display_order',)
    serializer_class = CompliancePeriodSerializer
    serializer_classes = {
        'default': CompliancePeriodSerializer,
    }

    def get_serializer_class(self):
        if self.action in list(self.serializer_classes.keys()):
            return self.serializer_classes[self.action]
        else:
            return self.serializer_classes['default']
