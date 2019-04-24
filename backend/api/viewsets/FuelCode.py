import datetime

from django.db.models import Q
from django.http import HttpResponse

from rest_framework import viewsets, status, mixins
from rest_framework.decorators import list_route
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from api.models.ApprovedFuel import ApprovedFuel
from api.models.FuelCode import FuelCode
from api.models.FuelCodeStatus import FuelCodeStatus
from api.models.TransportMode import TransportMode
from api.permissions.FuelCode import FuelCodePermissions
from api.serializers.ApprovedFuel import ApprovedFuelSerializer
from api.serializers.FuelCode import \
    FuelCodeCreateSerializer, FuelCodeSaveSerializer, FuelCodeSerializer
from api.serializers.FuelCodeStatus import FuelCodeStatusSerializer
from api.serializers.TransportMode import TransportModeSerializer
from api.services.SpreadSheetBuilder import SpreadSheetBuilder
from auditable.views import AuditableMixin


class FuelCodeViewSet(AuditableMixin,
                      mixins.CreateModelMixin,
                      mixins.ListModelMixin,
                      mixins.RetrieveModelMixin,
                      mixins.UpdateModelMixin,
                      viewsets.GenericViewSet):
    """
    This viewset automatically provides `list`, `create`, `retrieve`.
    """

    permission_classes = (FuelCodePermissions,)
    http_method_names = ['delete', 'get', 'post', 'patch']

    serializer_classes = {
        'default': FuelCodeSerializer,
        'approved_fuels': ApprovedFuelSerializer,
        'create': FuelCodeCreateSerializer,
        'destroy': FuelCodeSaveSerializer,
        'partial_update': FuelCodeSaveSerializer,
        'statuses': FuelCodeStatusSerializer,
        'transport_modes': TransportModeSerializer,
        'update': FuelCodeSaveSerializer
    }

    queryset = FuelCode.objects.all()
    ordering = ('-id',)

    def get_serializer_class(self):
        if self.action in list(self.serializer_classes.keys()):
            return self.serializer_classes[self.action]

        return self.serializer_classes['default']

    def get_queryset(self):
        user = self.request.user

        if user.is_government_user:
            return self.queryset.filter(
                ~Q(status__status__in=['Cancelled'])
            ).all()

        return self.queryset.filter(
            ~Q(status__status__in=['Cancelled', 'Draft'])
        ).all()

    def destroy(self, request, *args, **kwargs):
        """
        Marks the fuel code as 'Cancelled'
        """
        fuel_code = self.get_object()

        serializer = self.get_serializer(
            fuel_code)

        serializer.destroy()

        return Response(None, status=status.HTTP_200_OK)

    @list_route(methods=['get'], permission_classes=[AllowAny])
    def statuses(self, request):
        """
        Gets the list of statuses that can be applied to a fuel code
        """
        statuses = FuelCodeStatus.objects.all()

        serializer = self.get_serializer(
            statuses, read_only=True, many=True)

        return Response(serializer.data)

    @list_route(methods=['get'], permission_classes=[AllowAny])
    def transport_modes(self, request):
        """
        Gets the list of transport modes
        """
        transport_modes = TransportMode.objects.all()

        serializer = self.get_serializer(
            transport_modes, read_only=True, many=True)

        return Response(serializer.data)

    @list_route(methods=['get'], permission_classes=[AllowAny])
    def approved_fuels(self, request):
        """
        Gets the list of transport modes
        """
        approved_fuels = ApprovedFuel.objects.filter(
            credit_calculation_only=False
        ).order_by('name')

        serializer = self.get_serializer(
            approved_fuels, read_only=True, many=True)

        return Response(serializer.data)

    @list_route(methods=['get'])
    def xls(self, request):
        """
        Exports the fuel codes table as a spreadsheet
        """
        response = HttpResponse(content_type='application/ms-excel')
        response['Content-Disposition'] = (
            'attachment; filename="{}.xls"'.format(
                datetime.datetime.now().strftime(
                    "BC-LCFS_fuel_codes_%Y-%m-%d")
            ))

        fuel_codes = self.get_queryset().filter(
            ~Q(status__status__in=['Cancelled'])
        ).order_by('fuel_code', 'fuel_code_version', 'fuel_code_version_minor')

        workbook = SpreadSheetBuilder()
        workbook.add_fuel_codes(fuel_codes)

        workbook.save(response)

        return response
