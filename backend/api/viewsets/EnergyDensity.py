from rest_framework import viewsets, mixins, filters

from auditable.views import AuditableMixin

from api.models.EnergyDensityCategory import EnergyDensityCategory
from api.permissions.CreditCalculation import \
        CreditCalculationPermissions
from api.serializers.EnergyDensity import \
    EnergyDensityDetailSerializer, \
    EnergyDensitySerializer, \
    EnergyDensityUpdateSerializer


class EnergyDensityViewSet(
        AuditableMixin, mixins.ListModelMixin, mixins.RetrieveModelMixin,
        mixins.UpdateModelMixin, viewsets.GenericViewSet):
    """
    This viewset automatically provides `list`
    """
    permission_classes = (CreditCalculationPermissions,)
    http_method_names = ['get', 'put']
    queryset = EnergyDensityCategory.objects.all()
    filter_backends = (filters.OrderingFilter,)
    ordering_fields = '__all__'
    ordering = ('name',)
    serializer_class = EnergyDensitySerializer
    serializer_classes = {
        'list': EnergyDensitySerializer,
        'default': EnergyDensitySerializer,
        'update': EnergyDensityUpdateSerializer,
        'retrieve': EnergyDensityDetailSerializer
    }

    def get_serializer_class(self):
        if self.action in list(self.serializer_classes.keys()):
            return self.serializer_classes[self.action]

        return self.serializer_classes['default']
