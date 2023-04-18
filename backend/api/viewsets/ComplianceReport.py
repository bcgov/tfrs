import datetime
import json

from django.db import transaction
from django.db.models import Count
from django.http import HttpResponse
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
    ComplianceReportValidationSerializer, ComplianceReportDashboardListSerializer
from api.serializers.ExclusionReport import \
    ExclusionReportDetailSerializer, ExclusionReportUpdateSerializer, ExclusionReportValidationSerializer
from api.services.ComplianceReportService import ComplianceReportService
from api.services.ComplianceReportSpreadSheet import ComplianceReportSpreadsheet
from auditable.views import AuditableMixin
from api.paginations import BasicPagination
from django.db.models import Q, F, Value, DateField
from django.db.models.functions import Concat, Cast
from django.db.models import Max

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
    ordering = ('compliance_period__effective_date',
                '-update_timestamp', '-create_timestamp',)
    serializer_class = ComplianceReportListSerializer
    serializer_classes = {
        'default': ComplianceReportListSerializer,
        'dashboard': ComplianceReportDashboardListSerializer,
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
        # print('69:', qs.values())
        request = self.request
        query_result = []
        if self.action == 'list' or self.action == 'paginated':
            # qs = qs.annotate(Count('supplements')).filter(supplements__count=0)
            if self.action == 'paginated':
                sorts = request.data.get('sorts')
                if sorts:
                    sortCondition = sorts[0].get('desc')
                    sortId = sorts[0].get('id')
                    key_maps = {'compliance-period':'compliance_period__description',
                                 'organization':'organization__name',
                                   'updateTimestamp':'compliance_period__effective_date',
                                    'submissionDate':'compliance_reports__update_timestamp'}
                    if sortId=='displayname':
                        if sortCondition:
                            qs = qs.annotate(display_name=Concat(F('type__the_type'), Value(' '), F('compliance_period__description'))).order_by('-display_name')
                        else:
                            qs = qs.annotate(display_name=Concat(F('type__the_type'), Value(' '), F('compliance_period__description'))).order_by('display_name')
                    elif sortId in ['status', 'current-status']:
                        if sortCondition:
                            qs =qs.order_by('-status__director_status__status', '-status__manager_status__status', '-status__analyst_status__status', '-status__fuel_supplier_status__status')
                        else:
                            qs = qs.order_by('status__director_status__status', 'status__manager_status__status', 'status__analyst_status__status', 'status__fuel_supplier_status__status')
                    elif  sortId == 'supplemental-status':
                        if sortCondition:
                            qs =qs.order_by('-supplements__status__director_status__status', '-supplements__status__manager_status__status', '-supplements__status__analyst_status__status', '-supplements__status__fuel_supplier_status__status')
                        else:
                            qs = qs.order_by('supplements__status__director_status__status', 'supplements__status__manager_status__status', 'supplements__status__analyst_status__status', 'supplements__status__fuel_supplier_status__status')
                    else:
                        sortType = "-" if sortCondition else ""
                        sortString = f"{sortType}{key_maps[sortId]}"
                        if sortType:
                            qs = qs.annotate(reports_updatedtime=Max('compliance_reports__update_timestamp')).order_by('-reports_updatedtime')
                        else:
                            qs = qs.annotate(reports_updatedtime=Max('compliance_reports__update_timestamp')).order_by('reports_updatedtime')
                        
                # else:
                #     qs=qs.order_by('-compliance_period__effective_date')
                filters = request.data.get('filters')
                if filters:
                    for filter in filters:
                        id = filter.get('id')
                        value = filter.get('value')
                        if id and value:
                            if id == 'compliance-period':
                                qs = qs.filter(
                                    compliance_period__description__icontains=value)
                            elif id == 'organization':
                                qs = qs.filter(
                                    organization__name__icontains=value)
                            elif id == 'managerIds':
                                qs = self.filter_manager_status(
                                    qs, value['ids'])
                                pass
                            elif id == 'display-name':
                                qs = self.filter_displayname(qs, value)
                            elif id == 'status':
                                qs = self.filter_compliance_status(
                                    qs, value.lower())
                            elif id == 'supplemental-status':
                                qs = self.filter_supplemental_status(
                                    qs, value)
                            elif id == 'current-status':
                                qs = self.filter_current_status(
                                    qs, value)
                                query_result.extend(qs)
                            elif id == 'updateTimestamp':
                                qs = self.filter_timestamp(qs, value)
                            elif id == 'supplier':
                                qs = ComplianceReportService.get_organization_compliance_reports(
                                            user.organization, value)
                                qs = self.filter_supplier(qs, value)
        return qs

    def filter_supplier(self, qs, value):
        qs_supplier = qs.filter(
            organization_id=value
        )
        return qs_supplier

    def filter_displayname(self, qs, value):
        query_result = []
        for val in value:
            if val == 'Compliance Report':
                qs_com = qs.filter(Q(type__the_type='Compliance Report'))
                query_result.extend(qs_com)
            if val == 'Exclusion Report':
                qs_exc = qs.filter(Q(type__the_type='Exclusion Report'))
                query_result.extend(qs_exc)
        return query_result

    def filter_timestamp(self, qs, date):
        date_query = None
        date_tuple = date.split('-')
        for x in date_tuple:
            q_sub_object = Q(update_timestamp__contains = x)
            if not date_query:
                date_query = q_sub_object
            else:
                date_query = date_query & q_sub_object
        qs = qs.filter(date_query)
        return qs

    def filter_compliance_status_old(self, qs, value):
        if 'submitted'.find(value[0]) != -1:
          return qs.filter(
              Q(status__analyst_status__status='Unreviewed') &
              Q(status__director_status__status='Unreviewed') &
              Q(status__fuel_supplier_status__status='Submitted') &
              Q(status__manager_status__status='Unreviewed')
          )
        if 'Accepted' in value:
            return qs.filter(
                Q(status__director_status__status='Accepted')
            )

        if 'supplemental requested' in value:
            return qs.filter(
                Q(status__manager_status__status='Requested Supplemental') |
                Q(status__analyst_status__status='Requested Supplemental')
            )

        if 'awaiting government review' in value:
            return qs.filter(
                Q(status__manager_status__status='awaiting government review') |
                Q(status__analyst_status__status='awaiting government review')
            )

        if 'Rejected' in value:
            return qs.filter(
                Q(status__director_status__status='Rejected')
            )
        if 'Draft' in value:
            return qs.filter(
                Q(status__fuel_supplier_status__status='Draft')
            )
        if 'recommended'.find(value) != -1:
            return qs.filter(
                (Q(status__manager_status__status='Recommended') &
                ~Q(status__director_status__status__in=['Accepted', 'Rejected']) &
                ~Q(status__analyst_status__status='Requested Supplemental')) |
                (Q(status__analyst_status__status='Recommended') &
                Q(status__director_status__status='Unreviewed') &
                Q(status__manager_status__status='Unreviewed'))
            )

        if 'recommended acceptance - analyst'.find(value) != -1 or 'analyst'.find(value) != -1:
            return qs.filter(
                Q(status__analyst_status__status='Recommended') &
                Q(status__director_status__status='Unreviewed') &
                Q(status__manager_status__status='Unreviewed')
            )
        
        if 'recommended rejection - analyst'.find(value) != -1 or 'rejection'.find(value) != -1:
            return qs.filter(
                Q(status__analyst_status__status='Not Recommended')
            )
        
        if 'recommended acceptance - manager'.find(value) != -1 or 'manager'.find(value) != -1:
            return qs.filter(
                Q(status__manager_status__status='Recommended') &
                ~Q(status__director_status__status='Accepted') &
                ~Q(status__director_status__status='Rejected') &
                ~Q(status__analyst_status__status='Requested Supplemental')
            )

        if 'recommended rejection - manager'.find(value) != -1 or 'rejection'.find(value) != -1:
            return qs.filter(
                Q(status__manager_status__status='Not Recommended')
            )
        
        return qs
    
    def filter_compliance_status(self, qs, value):
        query_result = []
        for val in value:
            if val == 'Accepted' :     
                qs1 = qs.filter(
                    Q(status__director_status__status='Accepted')
                )
                query_result.extend(qs1)

            if val == 'supplemental requested':
                qs_sup = qs.filter(
                    Q(status__manager_status__status='Requested Supplemental') |
                    Q(status__analyst_status__status='Requested Supplemental')
                )
                query_result.extend(qs_sup)

            if val == 'Rejected':
                qs_rej = qs.filter(
                    Q(status__director_status__status='Rejected')
                )
                query_result.extend(qs_rej)
            if val == 'In Draft':
                qs_draft = qs.filter(
                    Q(status__fuel_supplier_status__status='Draft'))
                qs_supp = qs.filter(
                    Q(supplements__status__fuel_supplier_status__status='Draft')
                )
                query_result.extend(qs_draft)
                query_result.extend(qs_supp)

            if val == 'For Analyst Review':
                qs_analyst = qs.filter(    
                    Q(status__analyst_status__status='Unreviewed') &
                    Q(status__director_status__status='Unreviewed') &
                    Q(status__fuel_supplier_status__status='Submitted') &
                    Q(status__manager_status__status='Unreviewed')
                )
                query_result.extend(qs_analyst)

            if val == 'For Manager Review':
                qs_manager = qs.filter(
                    
                    Q(status__analyst_status__status='Recommended') &
                    Q(status__director_status__status='Unreviewed') &
                    Q(status__manager_status__status='Unreviewed') 
                    
                )
                query_result.extend(qs_manager)
                qs_man_rej = qs.filter(
                    Q(status__analyst_status__status='Not Recommended') &
                    Q(status__director_status__status='Unreviewed') &
                    Q(status__manager_status__status='Unreviewed')
                )
                query_result.extend(qs_man_rej)
            
            if val == 'For Director Review':
                qs_director = qs.filter(
                    
                     Q(status__manager_status__status='Recommended') &
                    ~Q(status__director_status__status='Accepted') &
                    ~Q(status__director_status__status='Rejected') &
                    ~Q(status__analyst_status__status='Requested Supplemental')
                )
                query_result.extend(qs_director)
                qs_dir_rej = qs.filter(
                    Q(status__manager_status__status='Not Recommended') &
                    ~Q(status__director_status__status='Accepted') &
                    ~Q(status__director_status__status='Rejected') &
                    ~Q(status__analyst_status__status='Requested Supplemental')
                )
                query_result.extend(qs_dir_rej)

            if val == 'awaiting government review':

                qs_agr = qs.filter(    
                    Q(status__analyst_status__status='Unreviewed') &
                    Q(status__director_status__status='Unreviewed') &
                    Q(status__fuel_supplier_status__status='Submitted') &
                    Q(status__manager_status__status='Unreviewed')
                )

                query_result.extend(qs_agr)
            """ Old Filters """
            """
            if val == 'submitted':
                return qs.filter(
                    Q(status__analyst_status__status='Unreviewed') &
                    Q(status__director_status__status='Unreviewed') &
                    Q(status__fuel_supplier_status__status='Submitted') &
                    Q(status__manager_status__status='Unreviewed')
                )

            if val == 'recommended':
                return qs.filter(
                    (Q(status__manager_status__status='Recommended') &
                    ~Q(status__director_status__status__in=['Accepted', 'Rejected']) &
                    ~Q(status__analyst_status__status='Requested Supplemental')) |
                    (Q(status__analyst_status__status='Recommended') &
                    Q(status__director_status__status='Unreviewed') &
                    Q(status__manager_status__status='Unreviewed'))
                )

            if val == 'recommended acceptance - analyst' or val == 'analyst':
                return qs.filter(
                    Q(status__analyst_status__status='Recommended') &
                    Q(status__director_status__status='Unreviewed') &
                    Q(status__manager_status__status='Unreviewed')
                )
            
            if val == 'recommended rejection - analyst' or val == 'rejection':
                return qs.filter(
                    Q(status__analyst_status__status='Not Recommended')
                )
            
            if val == 'recommended acceptance - manager' or val =='manager':
                return qs.filter(
                    Q(status__manager_status__status='Recommended') &
                    ~Q(status__director_status__status='Accepted') &
                    ~Q(status__director_status__status='Rejected') &
                    ~Q(status__analyst_status__status='Requested Supplemental')
                )

            if val == 'recommended rejection - manager' or val == 'rejection':
                return qs.filter(
                    Q(status__manager_status__status='Not Recommended')
                )
            """
                
        return query_result


    def filter_supplemental_report_status(self, qs, value):
        if 'submitted'.find(value) != -1:
            return  qs.filter(
                Q(supplements__status__analyst_status__status='Unreviewed') &
                Q(supplements__status__director_status__status='Unreviewed') &
                Q(supplements__status__fuel_supplier_status__status='Submitted') &
                Q(supplements__status__manager_status__status='Unreviewed')
            )

        if 'accepted'.find(value) != -1:
            return qs.filter(
                Q(supplements__status__director_status__status='Accepted')
            )

        if 'supplemental requested'.find(value) != -1:
            return qs.filter(
                Q(supplements__status__manager_status__status='Requested Supplemental') |
                Q(supplements__status__analyst_status__status='Requested Supplemental')
            )

        if 'rejected'.find(value) != -1:
            return qs.filter(
                Q(status__director_status__status='Rejected')
            )
        
        if 'recommended'.find(value) != -1:
            return qs.filter(
                (Q(supplements__status__manager_status__status='Recommended') &
                ~Q(supplements__status__director_status__status__in=['Accepted', 'Rejected']) &
                ~Q(supplements__status__analyst_status__status='Requested Supplemental')) |
                (Q(supplements__status__analyst_status__status='Recommended') &
                Q(supplements__status__director_status__status='Unreviewed') &
                Q(supplements__status__manager_status__status='Unreviewed'))
            )

        if 'recommended acceptance - manager'.find(value) != -1 or 'manager'.find(value) != -1:
            return qs.filter(
                Q(supplements__status__manager_status__status='Recommended') &
                ~Q(supplements__status__director_status__status='Accepted') &
                ~Q(supplements__status__director_status__status='Rejected') &
                ~Q(supplements__status__analyst_status__status='Requested Supplemental')
            )

        if 'recommended acceptance - analyst'.find(value) != -1 or 'analyst'.find(value) != -1:
            return qs.filter(
                Q(supplements__status__analyst_status__status='Recommended') &
                Q(supplements__status__director_status__status='Unreviewed') &
                Q(supplements__status__manager_status__status='Unreviewed')
            )

        if 'recommended rejection - manager'.find(value) != -1 or 'rejection'.find(value) != -1:
            return qs.filter(
                Q(supplements__status__manager_status__status='Not Recommended')
            )
        if 'recommended rejection - analyst'.find(value) != -1 or 'rejection'.find(value) != -1:
            return qs.filter(
                Q(supplements__status__analyst_status__status='Not Recommended')
            )
        return qs

    def filter_supplemental_status(self, qs, value):
        try:
            latest_supplementals = self.get_latest_supplemental_reports()
            ids = [s.id for s in latest_supplementals]
            supplemental_reports = ComplianceReportService.get_organization_compliance_reports(
            self.request.user.organization).filter(id__in=ids)
            unique_reports = supplemental_reports.filter(Q(supplements_id__isnull=False))
            qs = self.filter_supplemental_report_status(unique_reports, value)
        except Exception as e:
            print(e)
        return qs

    def filter_current_status(self, qs, value):
        try:
            latest_supplementals = self.get_latest_supplemental_reports()
            ids = [s.id for s in latest_supplementals]
            supplemental_reports = ComplianceReportService.get_organization_compliance_reports(
            self.request.user.organization).filter(id__in=ids)
            original_reports = qs.filter(Q(supplements_id__isnull=True))
            unique_reports = original_reports | supplemental_reports
            unique_reports = unique_reports.filter(Q(supplements_id__isnull=True))
            qs = self.filter_compliance_status(unique_reports, value)
        except Exception as e:
            print(e)
        return qs

    def filter_manager_status(self, qs, value):
        try:
            supplemental_reports = ComplianceReport.objects.filter(id__in=value)           
        except Exception as e:
            print(e)
        return supplemental_reports


    def get_latest_supplemental_reports(self):
        latest_supplementals = ComplianceReport.objects.raw("""
            select distinct on (p.id) c.*
            from compliance_report p 
              left join compliance_report c on p.id = c.supplements_id
            where c.status_id is not NULL
            order by p.id desc, c.create_timestamp desc
        """)
        return latest_supplementals

    def get_simple_queryset(self):
        """
        This view should return a list of all the compliance reports
        for the currently authenticated user.
        """
        user = self.request.user
        qs = ComplianceReportService.get_organization_compliance_reports(
            user.organization)
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

        sorted_qs = sorted(list(qs.all()), key=lambda x: [
                           x.compliance_period.effective_date, x.sort_date])

        serializer = self.get_serializer(
            sorted_qs, many=True, context={'request': request})
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def paginated(self, request):
        try:
            queryset = self.get_queryset()
            page = self.paginate_queryset(queryset)
            sorts = request.data.get('sorts')
            if sorts:
                if request.data.get('sorts')[0].get('id') == 'updateTimestamp':
                    if request.data.get('sorts')[0].get('desc'):
                        page = sorted(page, key=lambda x: [x.sort_date])
                    else:
                        page = sorted(page, key=lambda x: [x.sort_date], reverse=True)
        
            if page is not None:
                serializer = self.get_serializer(page, many=True)
                return self.get_paginated_response(serializer.data)

            serializer = self.get_serializer(queryset, many=True)
        except Exception as e:
            print(e, "2nd ")
        return Response(serializer.data)
        

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
        serializer = ComplianceReportDetailSerializer(
            patched_obj, context={'request': request})

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
            snapshot = ComplianceReportSnapshot.objects.get(
                compliance_report=obj).snapshot
        except:
            if obj.type.the_type == 'Exclusion Report':
                serializer = ExclusionReportDetailSerializer(
                    obj, context={'request': request})
            else:
                serializer = ComplianceReportDetailSerializer(
                    obj, context={'request': request})

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

    @action(detail=False, methods=['get'])
    def dashboard(self, request):
        qs = self.get_simple_queryset()
        serializer = self.get_serializer(
            qs, many=True, context={'request': request})
        return Response(serializer.data)
