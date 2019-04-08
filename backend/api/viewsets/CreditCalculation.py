from rest_framework import viewsets, mixins, filters

from auditable.views import AuditableMixin

from api.models.ApprovedFuel import ApprovedFuel
from api.models.CompliancePeriod import CompliancePeriod
from api.permissions.CreditCalculation import \
        CreditCalculationPermissions
from api.serializers.CreditCalculation import \
        CarbonIntensityLimitSerializer, \
        CarbonIntensitySerializer, \
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


class CarbonIntensityViewSet(
        AuditableMixin, mixins.ListModelMixin, viewsets.GenericViewSet):
    """
    This viewset automatically provides `list`
    """
    permission_classes = (CreditCalculationPermissions,)
    http_method_names = ['get']
    queryset = ApprovedFuel.objects.all()
    filter_backends = (filters.OrderingFilter,)
    ordering_fields = '__all__'
    ordering = ('name',)
    serializer_class = CarbonIntensitySerializer
    serializer_classes = {
        'list': CarbonIntensitySerializer
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
    queryset = ApprovedFuel.objects.all()
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
    queryset = ApprovedFuel.objects.all()
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