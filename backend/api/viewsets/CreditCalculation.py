from rest_framework import viewsets, mixins, filters

from auditable.views import AuditableMixin

from api.models.CompliancePeriod import CompliancePeriod
from api.models.DefaultCarbonIntensityCategory import \
    DefaultCarbonIntensityCategory
from api.models.EnergyDensityCategory import EnergyDensityCategory
from api.models.EnergyEffectivenessRatioCategory import \
    EnergyEffectivenessRatioCategory
from api.permissions.CreditCalculation import \
        CreditCalculationPermissions
from api.serializers.CreditCalculation import \
        CarbonIntensityLimitSerializer, \
        DefaultCarbonIntensitySerializer, \
        DefaultCarbonIntensityDetailSerializer, \
        EnergyDensitySerializer, \
        EnergyDensityDetailSerializer, \
        EnergyEffectivenessRatioSerializer, \
        EnergyEffectivenessRatioDetailSerializer


class CarbonIntensityLimitViewSet(
        AuditableMixin, mixins.ListModelMixin, mixins.RetrieveModelMixin,
        viewsets.GenericViewSet):
    """
    This viewset automatically provides `list`
    """
    permission_classes = (CreditCalculationPermissions,)
    http_method_names = ['get']
    queryset = CompliancePeriod.objects.all()
    filter_backends = (filters.OrderingFilter,)
    ordering_fields = '__all__'
    ordering = ('display_order',)
    serializer_class = CarbonIntensityLimitSerializer
    serializer_classes = {
        'list': CarbonIntensityLimitSerializer,
        'default': CarbonIntensityLimitSerializer
    }

    def get_serializer_class(self):
        if self.action in list(self.serializer_classes.keys()):
            return self.serializer_classes[self.action]

        return self.serializer_classes['default']


class DefaultCarbonIntensityViewSet(
        AuditableMixin, mixins.ListModelMixin, mixins.RetrieveModelMixin,
        viewsets.GenericViewSet):
    """
    This viewset automatically provides `list`
    """
    permission_classes = (CreditCalculationPermissions,)
    http_method_names = ['get']
    queryset = DefaultCarbonIntensityCategory.objects.all()
    filter_backends = (filters.OrderingFilter,)
    ordering_fields = '__all__'
    ordering = ('name',)
    serializer_class = DefaultCarbonIntensitySerializer
    serializer_classes = {
        'list': DefaultCarbonIntensitySerializer,
        'default': DefaultCarbonIntensitySerializer,
        'retrieve': DefaultCarbonIntensityDetailSerializer
    }

    def get_serializer_class(self):
        if self.action in list(self.serializer_classes.keys()):
            return self.serializer_classes[self.action]

        return self.serializer_classes['default']


class EnergyDensityViewSet(
        AuditableMixin, mixins.ListModelMixin, mixins.RetrieveModelMixin,
        viewsets.GenericViewSet):
    """
    This viewset automatically provides `list`
    """
    permission_classes = (CreditCalculationPermissions,)
    http_method_names = ['get']
    queryset = EnergyDensityCategory.objects.all()
    filter_backends = (filters.OrderingFilter,)
    ordering_fields = '__all__'
    ordering = ('name',)
    serializer_class = EnergyDensitySerializer
    serializer_classes = {
        'list': EnergyDensitySerializer,
        'default': EnergyDensitySerializer,
        'retrieve': EnergyDensityDetailSerializer
    }

    def get_serializer_class(self):
        if self.action in list(self.serializer_classes.keys()):
            return self.serializer_classes[self.action]

        return self.serializer_classes['default']


class EnergyEffectivenessRatioViewSet(
        AuditableMixin, mixins.ListModelMixin, mixins.RetrieveModelMixin,
        viewsets.GenericViewSet):
    """
    This viewset automatically provides `list`
    """
    permission_classes = (CreditCalculationPermissions,)
    http_method_names = ['get']
    queryset = EnergyEffectivenessRatioCategory.objects.all()
    filter_backends = (filters.OrderingFilter,)
    ordering_fields = '__all__'
    ordering = ('name',)
    serializer_class = EnergyEffectivenessRatioSerializer
    serializer_classes = {
        'list': EnergyEffectivenessRatioSerializer,
        'default': EnergyEffectivenessRatioSerializer,
        'retrieve': EnergyEffectivenessRatioDetailSerializer
    }

    def get_serializer_class(self):
        if self.action in list(self.serializer_classes.keys()):
            return self.serializer_classes[self.action]

        return self.serializer_classes['default']
