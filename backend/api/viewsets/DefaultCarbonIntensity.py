from rest_framework import viewsets, mixins, filters

from auditable.views import AuditableMixin

from api.models.DefaultCarbonIntensityCategory import \
    DefaultCarbonIntensityCategory
from api.permissions.CreditCalculation import \
        CreditCalculationPermissions
from api.serializers.DefaultCarbonIntensity import \
    DefaultCarbonIntensityDetailSerializer, \
    DefaultCarbonIntensitySerializer, \
    DefaultCarbonIntensityUpdateSerializer


class DefaultCarbonIntensityViewSet(
        AuditableMixin, mixins.ListModelMixin, mixins.RetrieveModelMixin,
        mixins.UpdateModelMixin, viewsets.GenericViewSet):
    """
    This viewset automatically provides `list`
    """
    permission_classes = (CreditCalculationPermissions,)
    http_method_names = ['get', 'put']
    queryset = DefaultCarbonIntensityCategory.objects.all()
    filter_backends = (filters.OrderingFilter,)
    ordering_fields = '__all__'
    ordering = ('name',)
    serializer_class = DefaultCarbonIntensitySerializer
    serializer_classes = {
        'list': DefaultCarbonIntensitySerializer,
        'default': DefaultCarbonIntensitySerializer,
        'update': DefaultCarbonIntensityUpdateSerializer,
        'retrieve': DefaultCarbonIntensityDetailSerializer
    }

    def get_serializer_class(self):
        if self.action in list(self.serializer_classes.keys()):
            return self.serializer_classes[self.action]

        return self.serializer_classes['default']
