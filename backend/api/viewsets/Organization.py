from django.db.models import Sum

from rest_framework import viewsets, permissions, mixins
from rest_framework.decorators import list_route, detail_route
from rest_framework.response import Response

from auditable.views import AuditableMixin

from api.decorators import permission_required
from api.models.Organization import Organization
from api.models.OrganizationBalance import OrganizationBalance
from api.models.OrganizationHistory import OrganizationHistory
from api.models.OrganizationType import OrganizationType
from api.serializers import OrganizationSerializer
from api.serializers import OrganizationBalanceSerializer
from api.serializers import OrganizationHistorySerializer
from api.serializers import OrganizationMinSerializer
from api.permissions.OrganizationPermissions import OrganizationPermissions


class OrganizationViewSet(AuditableMixin, viewsets.GenericViewSet, mixins.CreateModelMixin,
                          mixins.ListModelMixin, mixins.UpdateModelMixin,
                          mixins.RetrieveModelMixin):
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
        'fuel_suppliers': OrganizationMinSerializer
    }

    def get_serializer_class(self):
        if self.action in list(self.serializer_classes.keys()):
            return self.serializer_classes[self.action]
        else:
            return self.serializer_classes['default']

    @permission_required('VIEW_FUEL_SUPPLIERS')
    def list(self, request, *args, **kwargs):
        """
        Returns a list of Fuel Suppliers
        There are two types of organizations: Government and Fuel Suppliers
        The function needs to separate the organizations based on type
        """
        fuel_suppliers = Organization.objects.filter(
            type=OrganizationType.objects.get(type="Part3FuelSupplier")) \
            .order_by('id')

        serializer = self.get_serializer(fuel_suppliers, many=True)
        return Response(serializer.data)

    @list_route(methods=['get'])
    @permission_required('VIEW_FUEL_SUPPLIERS')
    def search(self, request):
        return self.list(request)

    @detail_route()
    @permission_required('VIEW_FUEL_SUPPLIERS')
    def balance(self, request, pk=None):
        """
        Get the organization balance
        """
        organization = self.get_object()
        # print("Organization")
        balance = OrganizationBalance.objects.get(
            organization=organization,
            expiration_date=None)
        serializer = self.get_serializer(balance)

        return Response(serializer.data)

    @permission_required('VIEW_FUEL_SUPPLIERS')
    @detail_route()
    def users(self, request, pk=None):
        """
        Returns a list of all the users within the given organization
        """
        organization = self.get_object()
        users = organization.users.all()
        return Response([user.display_name for user in users])

    @list_route(methods=['get'])
    def fuel_suppliers(self, request):
        fuel_suppliers = Organization.objects.extra(
            select={'lower_name': 'lower(name)'}) \
            .filter(type=OrganizationType.objects.get(
            type="Part3FuelSupplier")) \
            .order_by('lower_name')

        serializer = self.get_serializer(fuel_suppliers, many=True)
        return Response(serializer.data)
