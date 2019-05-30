from rest_framework import viewsets, mixins, filters

from auditable.views import AuditableMixin

from api.models.EnergyEffectivenessRatioCategory import \
    EnergyEffectivenessRatioCategory
from api.permissions.CreditCalculation import \
        CreditCalculationPermissions
from api.serializers.EnergyEffectivenessRatio import \
    EnergyEffectivenessRatioDetailSerializer, \
    EnergyEffectivenessRatioSerializer, \
    EnergyEffectivenessRatioUpdateSerializer


class EnergyEffectivenessRatioViewSet(
        AuditableMixin, mixins.ListModelMixin, mixins.RetrieveModelMixin,
        mixins.UpdateModelMixin, viewsets.GenericViewSet):
    """
    This viewset automatically provides `list`
    """
    permission_classes = (CreditCalculationPermissions,)
    http_method_names = ['get', 'put']
    queryset = EnergyEffectivenessRatioCategory.objects.all()
    filter_backends = (filters.OrderingFilter,)
    ordering_fields = '__all__'
    ordering = ('name',)
    serializer_class = EnergyEffectivenessRatioSerializer
    serializer_classes = {
        'list': EnergyEffectivenessRatioSerializer,
        'default': EnergyEffectivenessRatioSerializer,
        'update': EnergyEffectivenessRatioUpdateSerializer,
        'retrieve': EnergyEffectivenessRatioDetailSerializer
    }

    def get_serializer_class(self):
        if self.action in list(self.serializer_classes.keys()):
            return self.serializer_classes[self.action]

        return self.serializer_classes['default']
