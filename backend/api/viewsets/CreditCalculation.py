from rest_framework import viewsets, mixins, filters
from rest_framework.decorators import list_route
from rest_framework.response import Response

from auditable.views import AuditableMixin

from api.models.ApprovedFuel import ApprovedFuel
from api.models.CompliancePeriod import CompliancePeriod
from api.permissions.CreditCalculation import \
        CreditCalculationPermissions
from api.serializers.CreditCalculation import \
        CarbonIntensityLimitSerializer, EnergyEffectivenessRatioSerializer


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
        'list_carbon_intensity_limit': CarbonIntensityLimitSerializer,
        'list_energy_effectiveness_ratio': EnergyEffectivenessRatioSerializer
    }

    def get_serializer_class(self):
        if self.action in list(self.serializer_classes.keys()):
            return self.serializer_classes[self.action]

        return self.serializer_classes['default']


    @list_route(methods=['get'])
    def list_carbon_intensity_limit(self, request):
        """
        Returns a list of Carbon Intensity Limits
        """
        compliance_periods = self.get_queryset().order_by(*self.ordering)
        serializer = self.get_serializer(compliance_periods, many=True)

        return Response(serializer.data)

    @list_route(methods=['get'])
    def list_energy_effectiveness_ratio(self, request):
        """
        Returns a list of Energy Effectiveness Ratio
        """
        fuels = ApprovedFuel.objects.all().order_by('name')
        serializer = self.get_serializer(fuels, many=True)

        return Response(serializer.data)
