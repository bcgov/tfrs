from django.db import transaction
from rest_framework import viewsets, mixins, filters
from rest_framework.decorators import list_route, detail_route
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from api.models.ComplianceReport import ComplianceReport, ComplianceReportType
from api.models.ComplianceReportSnapshot import ComplianceReportSnapshot
from api.permissions.ComplianceReport import ComplianceReportPermissions
from api.serializers.ComplianceReport import \
    ComplianceReportTypeSerializer, ComplianceReportListSerializer, \
    ComplianceReportCreateSerializer, ComplianceReportUpdateSerializer, \
    ComplianceReportDeleteSerializer, ComplianceReportDetailSerializer, ComplianceReportValidationSerializer, \
    ComplianceReportSnapshotSerializer
from api.services.ComplianceReportService import ComplianceReportService
from auditable.views import AuditableMixin


class ComplianceReportViewSet(AuditableMixin, mixins.CreateModelMixin,
                              mixins.RetrieveModelMixin,
                              mixins.UpdateModelMixin,
                              mixins.DestroyModelMixin,
                              mixins.ListModelMixin, viewsets.GenericViewSet):
    """
    This viewset automatically provides `list`, `create`, `retrieve`,
    and `update` actions.
    """

    permission_classes = (ComplianceReportPermissions,)
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']
    queryset = ComplianceReport.objects.all()
    filter_backends = (filters.OrderingFilter,)
    ordering_fields = '__all__'
    ordering = ('-create_timestamp',)
    serializer_class = ComplianceReportListSerializer
    serializer_classes = {
        'default': ComplianceReportListSerializer,
        'update': ComplianceReportUpdateSerializer,
        'partial_update': ComplianceReportUpdateSerializer,
        'validate_partial': ComplianceReportValidationSerializer,
        'create': ComplianceReportCreateSerializer,
        'destroy': ComplianceReportDeleteSerializer,
        'retrieve': ComplianceReportDetailSerializer,
        'types': ComplianceReportTypeSerializer,
    }

    def get_queryset(self):
        """
        This view should return a list of all the compliance reports
        for the currently authenticated user.
        """
        user = self.request.user
        return ComplianceReportService.get_organization_compliance_reports(
            user.organization)

    def get_serializer_class(self):
        if self.action in list(self.serializer_classes.keys()):
            return self.serializer_classes[self.action]

        return self.serializer_classes['default']

    def perform_create(self, serializer):
        _compliance_report = serializer.save(
            organization=self.request.user.organization
        )

    def perform_update(self, serializer):
        compliance_report = serializer.save()
        ComplianceReportService.create_history(compliance_report, False)

    @list_route(methods=['get'], permission_classes=[AllowAny])
    def types(self, request):
        """
        Gets the list of types that a compliance report can be
        """
        types = ComplianceReportType.objects.all()

        serializer = self.get_serializer(
            types, read_only=True, many=True)

        return Response(serializer.data)

    @detail_route(methods=['post'])
    def validate_partial(self, request, pk=None):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid()

        return Response(serializer.errors)

    @detail_route(methods=['GET'])
    def snapshot(self, request, pk=None):
        obj = self.get_object()

        # failure to find an object will trigger an exception that is
        # translated into a 404
        snapshot = ComplianceReportSnapshot.objects.get(compliance_report=obj)

        return Response(snapshot.snapshot)

    @detail_route(methods=['patch'])
    def compute_totals(self, request, pk=None):
        """
        This works much like a regular PATCH, but rolls back the transaction
        """

        sid = transaction.savepoint()
        obj = self.get_object()
        deserializer = ComplianceReportUpdateSerializer(
            obj,
            data=request.data,
            partial=True
        )
        deserializer.strip_summary = True
        deserializer.disregard_status = True

        if not deserializer.is_valid():
            transaction.savepoint_rollback(sid)
            return Response(deserializer.errors)

        patched_obj = deserializer.save()
        serializer = ComplianceReportDetailSerializer(patched_obj)
        result = serializer.data
        transaction.savepoint_rollback(sid)

        return Response(result)
