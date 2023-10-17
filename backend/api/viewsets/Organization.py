import datetime

from django.core.cache import caches
from django.http import HttpResponse
from django.utils.decorators import method_decorator

from rest_framework import viewsets, mixins
from rest_framework.decorators import action
from rest_framework.response import Response

from api.models.OrganizationStatus import OrganizationStatus
from api.serializers.OrganizationType import OrganizationTypeSerializer
from api.decorators.PermissionRequired import permission_required
from api.models.Organization import Organization
from api.models.OrganizationBalance import OrganizationBalance
from api.models.OrganizationType import OrganizationType
from api.models.OrganizationActionsType import OrganizationActionsType
from api.models.User import User
from api.serializers import OrganizationSerializer, \
    OrganizationActionsTypeSerializer, OrganizationStatusSerializer, \
    OrganizationUpdateSerializer, OrganizationCreateSerializer
from api.serializers import OrganizationBalanceSerializer
from api.serializers import OrganizationHistorySerializer
from api.serializers import OrganizationMinSerializer
from api.serializers import UserMinSerializer
from api.permissions.OrganizationPermissions import OrganizationPermissions

from api.services.SpreadSheetBuilder import SpreadSheetBuilder
from api.services.CreditTradeService import CreditTradeService

from auditable.views import AuditableMixin


cached_page = caches['cached_pages']
class OrganizationViewSet(AuditableMixin, viewsets.GenericViewSet,
                          mixins.CreateModelMixin, mixins.ListModelMixin,
                          mixins.UpdateModelMixin, mixins.RetrieveModelMixin):
    """
    This viewset automatically provides `list`, `create`, `retrieve`,
    and `update`  actions.
    """

    permission_classes = (OrganizationPermissions,)
    http_method_names = ['get', 'post', 'put', 'patch']
    queryset = Organization.objects.all()
    serializer_class = OrganizationSerializer

    serializer_classes = {
        'balance': OrganizationBalanceSerializer,
        'default': OrganizationSerializer,
        'history': OrganizationHistorySerializer,
        'fuel_suppliers': OrganizationMinSerializer,
        'actions_types': OrganizationActionsTypeSerializer,
        'types': OrganizationTypeSerializer,
        'statuses': OrganizationStatusSerializer,
        'members': UserMinSerializer,
        'users': UserMinSerializer,
        'update': OrganizationUpdateSerializer,
        'create': OrganizationCreateSerializer
    }

    def get_serializer_class(self):
        if self.action in list(self.serializer_classes.keys()):
            return self.serializer_classes[self.action]

        return self.serializer_classes['default']

    @method_decorator(permission_required('VIEW_FUEL_SUPPLIERS'))
    def list(self, request, *args, **kwargs):
        """
        Returns a list of Fuel Suppliers
        There are two types of organizations: Government and Fuel Suppliers
        The function needs to separate the organizations based on type
        """
        query_params = request.GET.urlencode()
        form_data = request.data
        cache_key = f'organizations_{request.user.id}:{request.user.organization.name}:{query_params}:{form_data}'
        sanitized_cache_key = cache_key.replace(' ', '_')

        data = cached_page.get(sanitized_cache_key)
        if data is not None:
            return Response(data)
        fuel_suppliers = Organization.objects.select_related('type').filter(type__type='Part3FuelSupplier').order_by('id')
        serializer = self.get_serializer(fuel_suppliers, many=True)
        data = serializer.data
        cached_page.set(sanitized_cache_key, data, 60 * 15)
        return Response(data)

    @action(detail=False, methods=['get'])
    @method_decorator(permission_required('VIEW_FUEL_SUPPLIERS'))
    def search(self, request):
        """
        Returns a list of organization based on a search term provided
        """
        return self.list(request)

    @action(detail=True)
    @method_decorator(permission_required('VIEW_FUEL_SUPPLIERS'))
    def balance(self, request, pk=None):
        """
        Get the organization balance
        """
        organization = self.get_object()

        # Process future effective dates
        # This future effective_date feature has been disabled so this
        # service method call has been commented out but left here if
        # this feature is needed in the future
        # CreditTradeService.process_future_effective_dates(organization)

        balance = OrganizationBalance.objects.get(
            organization=organization,
            expiration_date=None)

        serializer = self.get_serializer(balance)

        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def fuel_suppliers(self, request):
        """
        Returns a list of organizations that's marked as fuel suppliers
        (Most should be returned, but as an example, government is not
        going to be included here.)
        """
        query_params = request.GET.urlencode()
        form_data = request.data
        cache_key = f'organizations_fuel_suppliers_{request.user.id}:{request.user.organization.name}:{query_params}:{form_data}'
        sanitized_cache_key = cache_key.replace(' ', '_')

        data = cached_page.get(sanitized_cache_key)
        if data is not None:
            return Response(data)
        fuel_suppliers = Organization.objects.extra(
            select={'lower_name': 'lower(name)'}) \
            .filter(type=OrganizationType.objects.get(
                type="Part3FuelSupplier")) \
            .order_by('lower_name')

        serializer = self.get_serializer(fuel_suppliers, many=True)
        data = serializer.data
        cached_page.set(sanitized_cache_key, data, 60 * 15)
        return Response(data)

    @action(detail=False, methods=['get'])
    def actions_types(self, request):
        """
            Reference Data for UI
        """
        actions_types = OrganizationActionsType.objects.all()

        serializer = self.get_serializer(actions_types,
                                         read_only=True,
                                         many=True)

        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def statuses(self, request):
        """
            Reference data for UI
        """
        query_params = request.GET.urlencode()
        form_data = request.data
        cache_key = f'organizations_statuses_{request.user.id}:{request.user.organization.name}:{query_params}:{form_data}'
        sanitized_cache_key = cache_key.replace(' ', '_')

        data = cached_page.get(sanitized_cache_key)
        if data is not None:
            return Response(data)
        statuses = OrganizationStatus.objects.all()

        serializer = self.get_serializer(statuses,
                                         read_only=True,
                                         many=True)
        data = serializer.data
        cached_page.set(sanitized_cache_key, data, 60 * 15)
        return Response(data)

    @action(detail=False, methods=['get'])
    def types(self, request):
        """
            Reference data for UI
        """
        types = OrganizationType.objects.all()

        serializer = self.get_serializer(types,
                                         read_only=True,
                                         many=True)

        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def mine(self, request):
        """
        Provides a shortcut to retrieve the logged-in user's
        organization.
        We can extend this later on to add more details about the
        organization such as address, phone, etc
        """
        organization = Organization.objects.get(
            id=request.user.organization_id)

        serializer = self.get_serializer(organization)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def members(self, request):
        """
        Returns a list of users that belongs to the
        logged-in user's organization.
        """
        users = User.objects.filter(
            organization_id=request.user.organization_id)

        serializer = self.get_serializer(users, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    @method_decorator(permission_required('VIEW_FUEL_SUPPLIERS'))
    def users(self, request, pk=None):
        """
        Returns a list of users that belongs to the
        organization with the matching ID
        """
        organization = self.get_object()

        users = User.objects.filter(
            organization_id=organization.id)

        serializer = self.get_serializer(users, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    @method_decorator(permission_required('VIEW_FUEL_SUPPLIERS'))
    def xls(self, request):
        """
        Exports the Fuel Suppliers as a spreadsheet
        """
        response = HttpResponse(content_type='application/ms-excel')
        response['Content-Disposition'] = (
            'attachment; filename="{}.xls"'.format(
                datetime.datetime.now().strftime(
                    "BC-LCFS_organizations_%Y-%m-%d")
            ))

        fuel_suppliers = Organization.objects.extra(
            select={'lower_name': 'lower(name)'}) \
            .filter(type=OrganizationType.objects.get(
                type="Part3FuelSupplier")) \
            .order_by('lower_name')

        workbook = SpreadSheetBuilder()
        workbook.add_fuel_suppliers(fuel_suppliers)
        workbook.save(response)

        return response
