from rest_framework import viewsets, mixins, filters

from auditable.views import AuditableMixin

from api.models.CompliancePeriod import CompliancePeriod
from api.models.DefaultCarbonIntensityCategory import \
    DefaultCarbonIntensityCategory
from api.models.EnergyDensityCategory import EnergyDensityCategory
from api.models.EnergyEffectivenessRatioCategory import \
    EnergyEffectivenessRatioCategory
from api.models.PetroleumCarbonIntensityCategory import \
    PetroleumCarbonIntensityCategory
from api.permissions.CreditCalculation import \
        CreditCalculationPermissions
from api.serializers.CreditCalculation import \
    CarbonIntensityLimitSerializer, \
    CarbonIntensityLimitUpdateSerializer, \
    DefaultCarbonIntensityDetailSerializer, \
    DefaultCarbonIntensitySerializer, \
    DefaultCarbonIntensityUpdateSerializer, \
    EnergyDensityDetailSerializer, \
    EnergyDensitySerializer, \
    EnergyDensityUpdateSerializer, \
    EnergyEffectivenessRatioDetailSerializer, \
    EnergyEffectivenessRatioSerializer, \
    EnergyEffectivenessRatioUpdateSerializer, \
    PetroleumCarbonIntensitySerializer, \
    PetroleumCarbonIntensityDetailSerializer, \
    PetroleumCarbonIntensityUpdateSerializer


class CarbonIntensityLimitViewSet(
        AuditableMixin, mixins.ListModelMixin, mixins.RetrieveModelMixin,
        mixins.UpdateModelMixin, viewsets.GenericViewSet):
    """
    This viewset automatically provides `list`
    """
    permission_classes = (CreditCalculationPermissions,)
    http_method_names = ['get', 'put']
    queryset = CompliancePeriod.objects.all()
    filter_backends = (filters.OrderingFilter,)
    ordering_fields = '__all__'
    ordering = ('display_order',)
    serializer_class = CarbonIntensityLimitSerializer
    serializer_classes = {
        'list': CarbonIntensityLimitSerializer,
        'update': CarbonIntensityLimitUpdateSerializer,
        'default': CarbonIntensityLimitSerializer
    }

    def get_serializer_class(self):
        if self.action in list(self.serializer_classes.keys()):
            return self.serializer_classes[self.action]

        return self.serializer_classes['default']


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
