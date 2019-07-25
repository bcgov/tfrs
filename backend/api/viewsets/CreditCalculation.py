from django.views.decorators.cache import cache_page
from django.utils.decorators import method_decorator
from rest_framework import viewsets, filters, mixins
from rest_framework.response import Response

from auditable.views import AuditableMixin

from api.models.ApprovedFuel import ApprovedFuel
from api.permissions.CreditCalculation import \
        CreditCalculationPermissions
from api.serializers.CreditCalculation import CreditCalculationSerializer


class CreditCalculationViewSet(AuditableMixin, mixins.ListModelMixin, viewsets.GenericViewSet):
    """
    This viewset automatically provides `list`
    """
    permission_classes = (CreditCalculationPermissions,)
    http_method_names = ['get']
    queryset = ApprovedFuel.objects.all()
    filter_backends = (filters.OrderingFilter,)
    ordering_fields = '__all__'
    ordering = ('name',)
    serializer_class = CreditCalculationSerializer
    serializer_classes = {
        'default': CreditCalculationSerializer
    }

    def get_serializer_class(self):
        if self.action in list(self.serializer_classes.keys()):
            return self.serializer_classes[self.action]

        return self.serializer_classes['default']

    @method_decorator(cache_page(60 * 15))  # 15 minutes
    def retrieve(self, request, pk=None):
        """
        Retrieves the credit calculation values provided by the
        compliance period, fuel type and fuel class
        """
        approved_fuel = self.get_object()

        serializer = self.get_serializer(approved_fuel, read_only=True)

        return Response(serializer.data)
