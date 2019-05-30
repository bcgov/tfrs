from rest_framework import viewsets, mixins, filters

from auditable.views import AuditableMixin

from api.models.PetroleumCarbonIntensityCategory import \
    PetroleumCarbonIntensityCategory
from api.permissions.CreditCalculation import \
        CreditCalculationPermissions
from api.serializers.PetroleumCarbonIntensity import \
    PetroleumCarbonIntensitySerializer, \
    PetroleumCarbonIntensityDetailSerializer, \
    PetroleumCarbonIntensityUpdateSerializer


class PetroleumCarbonIntensityViewSet(
        AuditableMixin, mixins.ListModelMixin, mixins.RetrieveModelMixin,
        mixins.UpdateModelMixin, viewsets.GenericViewSet):
    """
    This viewset automatically provides `list`
    """
    permission_classes = (CreditCalculationPermissions,)
    http_method_names = ['get', 'put']
    queryset = PetroleumCarbonIntensityCategory.objects.all()
    filter_backends = (filters.OrderingFilter,)
    ordering_fields = '__all__'
    ordering = ('name',)
    serializer_class = PetroleumCarbonIntensitySerializer
    serializer_classes = {
        'list': PetroleumCarbonIntensitySerializer,
        'default': PetroleumCarbonIntensitySerializer,
        'update': PetroleumCarbonIntensityUpdateSerializer,
        'retrieve': PetroleumCarbonIntensityDetailSerializer
    }

    def get_serializer_class(self):
        if self.action in list(self.serializer_classes.keys()):
            return self.serializer_classes[self.action]

        return self.serializer_classes['default']
