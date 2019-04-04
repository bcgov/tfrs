from rest_framework import viewsets, mixins, filters
from rest_framework.decorators import list_route
from rest_framework.response import Response

from auditable.views import AuditableMixin

from api.models.CompliancePeriod import CompliancePeriod
from api.permissions.CreditCalculation import \
        CreditCalculationPermissions
from api.serializers.CreditCalculation import CarbonIntensityLimitSerializer


class CreditCalculationViewSet(
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
