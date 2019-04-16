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
        EnergyDensitySerializer, \
        EnergyEffectivenessRatioSerializer


class CarbonIntensityLimitViewSet(
        AuditableMixin, mixins.ListModelMixin, viewsets.GenericViewSet):
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
        'list': CarbonIntensityLimitSerializer
    }

    def get_serializer_class(self):
        if self.action in list(self.serializer_classes.keys()):
            return self.serializer_classes[self.action]

        return self.serializer_classes['default']


class DefaultCarbonIntensityViewSet(
        AuditableMixin, mixins.ListModelMixin, viewsets.GenericViewSet):
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
        'list': DefaultCarbonIntensitySerializer
    }

    def get_serializer_class(self):
        if self.action in list(self.serializer_classes.keys()):
            return self.serializer_classes[self.action]

        return self.serializer_classes['default']


class EnergyDensityViewSet(
        AuditableMixin, mixins.ListModelMixin, viewsets.GenericViewSet):
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
        'list': EnergyDensitySerializer
    }

    def get_serializer_class(self):
        if self.action in list(self.serializer_classes.keys()):
            return self.serializer_classes[self.action]

        return self.serializer_classes['default']


class EnergyEffectivenessRatioViewSet(
        AuditableMixin, mixins.ListModelMixin, viewsets.GenericViewSet):
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
        'list': EnergyEffectivenessRatioSerializer
    }

    def get_serializer_class(self):
        if self.action in list(self.serializer_classes.keys()):
            return self.serializer_classes[self.action]

        return self.serializer_classes['default']
