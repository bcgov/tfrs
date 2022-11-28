import datetime
import json

from django.db import transaction
from django.db.models import Count
from django.http import JsonResponse, HttpResponse
from rest_framework import viewsets, mixins, filters, status
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from api.models.ComplianceReport import ComplianceReport, \
    ComplianceReportStatus, ComplianceReportType
from api.models.ComplianceReportSnapshot import ComplianceReportSnapshot
from api.permissions.ComplianceReport import ComplianceReportPermissions
from api.serializers.ComplianceReport import \
    ComplianceReportTypeSerializer, ComplianceReportListSerializer, \
    ComplianceReportCreateSerializer, ComplianceReportUpdateSerializer, \
    ComplianceReportDeleteSerializer, ComplianceReportDetailSerializer, \
    ComplianceReportValidationSerializer, ComplianceReportSnapshotSerializer
from api.serializers.ExclusionReport import \
    ExclusionReportDetailSerializer, ExclusionReportUpdateSerializer, ExclusionReportValidationSerializer
from api.services.ComplianceReportService import ComplianceReportService
from api.services.ComplianceReportSpreadSheet import ComplianceReportSpreadsheet
from auditable.views import AuditableMixin
from api.paginations import BasicPagination
from django.db.models import Q


class ComplianceReportViewSet(AuditableMixin, mixins.CreateModelMixin,
                              mixins.RetrieveModelMixin,
                              mixins.UpdateModelMixin,
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
    ordering = ('compliance_period__effective_date', '-update_timestamp', '-create_timestamp',)
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
    pagination_class = BasicPagination

    def get_queryset(self):
        """
        This view should return a list of all the compliance reports
        for the currently authenticated user.
        """
        user = self.request.user
        qs = ComplianceReportService.get_organization_compliance_reports(
            user.organization)
        request = self.request
        if self.action == 'list' or (request.path.endswith('paginated') and request.method == 'POST'):
            qs = qs.annotate(Count('supplements')).filter(supplements__count=0)\
                .order_by('-compliance_period__effective_date')

            if request.path.endswith('paginated') and request.method == 'POST':
                filters = request.data.get('filters')
                if filters:
                    for filter in filters:
                        id = filter.get('id')
                        value = filter.get('value')
                        if id and value:
                            if id == 'compliance-period':
                                qs = qs.filter(compliance_period__description__exact=value)
                            elif id == 'organization':
                                qs = qs.filter(organization__name__icontains=value)
                            elif id == 'displayname':
                                qs = qs.filter(Q(nickname__isnull=True) | Q(nickname__icontains=value))
                                # possible todo: deal with case where generated nicknames are used
                            elif id == 'status':
                                # todo; I think we'll just have to replicate the logic in ComplianceReportStatus.js here...
                                pass
                            elif id == 'supplemental-status':
                                # todo; same as the todo above, along with the fact that we'll have to somehow define (annotate)
                                # a deepest_supplemental_report field (via some sort of aggregation) which we can then filter on
                                pass
                            elif id == 'current-status':
                                # todo; same as the todo above
                                pass
                            elif id == 'updateTimestamp':
                                # the original frontend sorting used sortDate, which is a @property, not a database field
                                pass

        return qs

    def get_serializer_class(self):
        if self.action in list(self.serializer_classes.keys()):
            return self.serializer_classes[self.action]

        return self.serializer_classes['default']

    def destroy(self, request, *args, **kwargs):
        """
        Override the base destroy method.
        This is to explicitly call the destroy function in the serializer.

        """
        instance = self.get_object()

        serializer = self.get_serializer(
            instance)
        serializer.destroy()

        return Response(None, status=status.HTTP_200_OK)

    def perform_create(self, serializer):
        _compliance_report = serializer.save(
            organization=self.request.user.organization
        )

    def perform_update(self, serializer):
        previous_state = self.get_object()
        previous_status = previous_state.status
        compliance_report = serializer.save()
        ComplianceReportService.create_history(compliance_report, False)

        status_deleted = ComplianceReportStatus.objects.get(status="Deleted")

        if compliance_report.status.fuel_supplier_status != status_deleted:
            ComplianceReportService.dispatch_notifications(
                previous_status, compliance_report)

    def retrieve(self, request, *args, **kwargs):
        """
        Override the base retrieve method.
        If the instance is exclusion report, then load the proper serializer.
        Otherwise, call the default function
        """
        instance = self.get_object()

        if instance.type.the_type != 'Exclusion Report':
            return super().retrieve(self, request, *args, **kwargs)

        serializer = ExclusionReportDetailSerializer(
            instance,
            read_only=True,
            context={'request': request}
        )

        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        """
        Copied from auditable.
        This checks if the instance is an Exclusion Report.
        If it is, use the appropriate serializer. Otherwise,
        use the default.
        """

        instance = self.get_object()

        if request.method == 'PATCH':
            partial = kwargs.pop('partial', True)
        else:
            partial = kwargs.pop('partial', False)

        if instance.type.the_type != 'Exclusion Report':
            serializer = self.get_serializer(
                instance,
                data=request.data,
                partial=partial
            )
        else:
            serializer = ExclusionReportUpdateSerializer(
                instance,
                data=request.data,
                context={'request': request},
                partial=partial
            )

        user = request.user
        request.data.update({'update_user': user.id})
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data)

    def list(self, request, *args, **kwargs):
        qs = self.get_queryset()

        sorted_qs = sorted(list(qs.all()), key=lambda x: [x.compliance_period.effective_date, x.sort_date])

        serializer = self.get_serializer(sorted_qs, many=True, context={'request': request})
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def paginated(self, request):
        return super().list(request)

    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def types(self, request):
        """
        Gets the list of types that a compliance report can be
        """
        types = ComplianceReportType.objects.all()

        serializer = self.get_serializer(
            types, read_only=True, many=True)

        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def validate_partial(self, request, pk=None):
        instance = self.get_object()

        if instance.type.the_type == 'Exclusion Report':
            serializer = ExclusionReportValidationSerializer(data=request.data,
                                                             context={'request': request})
        else:
            serializer = self.get_serializer(data=request.data)

        serializer.is_valid()

        return Response(serializer.errors)

    @action(detail=True, methods=['GET'])
    def snapshot(self, request, pk=None):
        obj = self.get_object()

        # failure to find an object will trigger an exception that is
        # translated into a 404
        snapshot = ComplianceReportSnapshot.objects.get(compliance_report=obj)

        return Response(snapshot.snapshot)

    @action(detail=True, methods=['patch'])
    def compute_totals(self, request, pk=None):
        """
        This works much like a regular PATCH, but rolls back the transaction
        """
        validation_deserializer = ComplianceReportValidationSerializer(
            data=request.data
        )
        if not validation_deserializer.is_valid():
            return Response(validation_deserializer.errors)

        sid = transaction.savepoint()
        obj = self.get_object()
        deserializer = ComplianceReportUpdateSerializer(
            obj,
            data=request.data,
            partial=True,
            context={'request': request}
        )
        deserializer.strip_summary = True
        deserializer.disregard_status = True

        if not deserializer.is_valid():
            transaction.savepoint_rollback(sid)
            return Response(deserializer.errors)

        patched_obj = deserializer.save()
        serializer = ComplianceReportDetailSerializer(patched_obj, context={'request': request})

        result = serializer.data
        transaction.savepoint_rollback(sid)

        return Response(result)

    @action(detail=True, methods=['get'])
    def xls(self, request, pk=None):
        """
        Exports the compliance report as a spreadsheet
        """

        obj = self.get_object()

        try:
            snapshot = ComplianceReportSnapshot.objects.get(compliance_report=obj).snapshot
        except:
            if obj.type.the_type == 'Exclusion Report':
                serializer = ExclusionReportDetailSerializer(obj, context={'request': request})
            else:
                serializer = ComplianceReportDetailSerializer(obj, context={'request': request})

            snapshot = serializer.data

        response = HttpResponse(content_type='application/ms-excel')
        response['Content-Disposition'] = (
            'attachment; filename="{}.xls"'.format(
                datetime.datetime.now().strftime(
                    "BC-LCFS_{type}_%Y-%m-%d".format(type=obj.type.the_type))
            ))

        workbook = ComplianceReportSpreadsheet()

        if obj.type.the_type == 'Exclusion Report':
            workbook.add_exclusion_agreement(snapshot['exclusion_agreement'])
        if obj.type.the_type == 'Compliance Report':
            workbook.add_schedule_a(snapshot['schedule_a'])
            workbook.add_schedule_b(snapshot['schedule_b'])
            workbook.add_schedule_c(snapshot['schedule_c'])
            workbook.add_schedule_d(snapshot['schedule_d'])
            workbook.add_schedule_summary(snapshot['summary'])

        workbook.save(response)

        return response
