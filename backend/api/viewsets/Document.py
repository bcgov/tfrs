import uuid

from django.db.models import Q
from django.utils.decorators import method_decorator
from minio import Minio

from rest_framework import viewsets, status, mixins
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from api.decorators import permission_required
from api.models.CreditTrade import CreditTrade
from api.models.Document import Document
from api.models.DocumentCategory import DocumentCategory
from api.models.DocumentFileAttachment import DocumentFileAttachment
from api.models.DocumentStatus import DocumentStatus
from api.models.DocumentCreditTrade import DocumentCreditTrade
from api.models.DocumentHistory import DocumentHistory
from api.permissions.Documents import DocumentPermissions
from api.serializers.CreditTrade import CreditTradeListSerializer
from api.serializers.Document import \
    DocumentCreateSerializer, DocumentDeleteSerializer, \
    DocumentDetailSerializer, DocumentMinSerializer, DocumentSerializer, \
    DocumentUpdateSerializer
from api.serializers.DocumentCategory import DocumentCategorySerializer
from api.serializers.DocumentStatus import DocumentStatusSerializer
from api.serializers.DocumentCreditTrade import CreditTradeLinkSerializer
from api.services.DocumentService import DocumentService
from api.services.SecurityScan import SecurityScan
from auditable.views import AuditableMixin
from tfrs.settings import MINIO
from api.paginations import BasicPagination
from django.db.models import OuterRef, Subquery
from django.db.models.functions import TruncDate
class DocumentViewSet(AuditableMixin,
                      mixins.CreateModelMixin,
                      mixins.ListModelMixin,
                      mixins.RetrieveModelMixin,
                      mixins.UpdateModelMixin,
                      viewsets.GenericViewSet):
    """
    This viewset automatically provides `list`, `create`, `retrieve`.
    """

    permission_classes = (DocumentPermissions,)
    http_method_names = ['delete', 'get', 'put', 'post', 'patch']
    queryset = Document.objects.all()
    submitted_history = DocumentHistory.objects.filter(document=OuterRef('pk'), status__status='Submitted').order_by('-create_timestamp')
    queryset = queryset.annotate(submitted_date=Subquery(submitted_history.annotate(submitted_date=TruncDate('create_timestamp')).values('submitted_date')[:1]))
    ordering = ('-id',)
    serializer_class = DocumentSerializer
    serializer_classes = {
        'default': DocumentSerializer,
        'destroy': DocumentDeleteSerializer,
        'create': DocumentCreateSerializer,
        'list': DocumentMinSerializer,
        'categories': DocumentCategorySerializer,
        'retrieve': DocumentDetailSerializer,
        'statuses': DocumentStatusSerializer,
        'partial_update': DocumentUpdateSerializer,
        'update': DocumentUpdateSerializer,
        'link': CreditTradeLinkSerializer,
        'unlink': CreditTradeLinkSerializer,
        'linkable_credit_transactions': CreditTradeListSerializer
    }

    pagination_class = BasicPagination

    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def categories(self, request):
        """
        Reference Data for UI
        """
        categories = DocumentCategory.objects.all()

        serializer = self.get_serializer(
            categories, read_only=True, many=True)

        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        """
        'Delete' functionality for individual submissions
        Triggers when a DELETE request has been sent
        """
        document = self.get_object()

        serializer = self.get_serializer(
            document,
            read_only=True)

        serializer.destroy()

        return Response(None, status=status.HTTP_200_OK)

    def get_serializer_class(self):
        if self.action in list(self.serializer_classes.keys()):
            return self.serializer_classes[self.action]

        return self.serializer_classes['default']

    def get_queryset(self):
        user = self.request.user

        if user.organization.id == 1:
            qs = self.queryset.filter(
                ~Q(status__status__in=['Draft',
                                       'Cancelled',
                                       'Pending Submission',
                                       'Security Scan Failed'])
            )
        else:
            qs = self.queryset.filter(
                Q(create_user__organization__id=user.organization.id),
                ~Q(status__status__in=['Cancelled'])
            )
        request = self.request
        if request.path.endswith('paginated') and request.method == 'POST':
            sort = request.data.get('sort')
            filters = request.data.get('filters')
            key_maps = {'title':'title', 'status':'status__status', 'attachment-type':'type__description', 'updateTimestamp': 'submitted_date',  'organization':'create_user__organization__name', 'id': 'id', 'credit-transaction-id':'credit_trades'}
            if sort:
                sortCondition = sort[0].get('desc')
                sortId = sort[0].get('id')
                sortType = "-" if sortCondition else ""
                sortString = f"{sortType}{key_maps[sortId]}"
                qs = qs.order_by(sortString)
            if filters:
                for filter in filters:
                    id = filter.get('id')
                    value = filter.get('value')
                    if id and value:
                        if id == 'id':
                            qs = qs.filter(id__icontains = value)
                        if id == 'organization':
                            organization_split = value.split()
                            q_object = None
                            for x in organization_split:
                                q_sub_object = Q(create_user__organization__name__icontains = x)
                                if not q_object:
                                    q_object = q_sub_object
                                else:
                                    q_object = q_object & q_sub_object
                            qs = qs.filter(q_object)
                        if id =='status':
                            qs = qs.filter(status__status__icontains = value)
                        if id == 'attachment-type':
                            type_split = value.split()
                            q_object = None
                            for x in type_split:
                                q_sub_object = Q(type__description__icontains = x)
                                if not q_object:
                                    q_object = q_sub_object
                                else:
                                    q_object = q_object & q_sub_object
                            qs = qs.filter(q_object)
                        if id == 'title':
                            title_split = value.split()
                            q_object = None
                            for x in title_split:
                                q_sub_object = Q(title__icontains = x)
                                if not q_object:
                                    q_object = q_sub_object
                                else:
                                    q_object = q_object & q_sub_object
                            qs = qs.filter(q_object)
                        if id == 'credit-transaction-id':
                            qs = qs.filter(credit_trades__id__icontains = value)
                        if id == 'updateTimestamp':
                            date_split = value.split("-")
                            q_object = None
                            for x in date_split:
                                q_sub_object = Q(submitted_date__contains = x)
                                if not q_object:
                                    q_object = q_sub_object
                                else:
                                    q_object = q_object & q_sub_object
                            qs = qs.filter(q_object)
        return qs

    def perform_create(self, serializer):
        user = self.request.user
        document = serializer.save()
        DocumentService.create_history(document)

        DocumentService.send_notification(document, user)

    def perform_update(self, serializer):
        user = self.request.user

        document = serializer.save()
        DocumentService.create_history(document)

        DocumentService.send_notification(document, user)

    @action(detail=False, methods=['post'])
    def paginated(self, request):
        return super().list(request)

    @action(detail=True, methods=['put'])
    @method_decorator(permission_required('DOCUMENTS_LINK_TO_CREDIT_TRADE'))
    def link(self, request, pk=None):
        """
        Link a credit trade to this document
        """
        document = self.get_object()

        serializer = CreditTradeLinkSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        credit_trade = serializer.validated_data['credit_trade']

        DocumentCreditTrade.objects.create(credit_trade=credit_trade,
                                           document=document)

        return Response(None, status=status.HTTP_202_ACCEPTED)

    @action(detail=True, methods=['put'])
    def scan_attachments(self, request, pk=None):
        """
        Sends a request to ClamAV to scan the attachments for a specific
        document
        """
        document = self.get_object()

        files = DocumentFileAttachment.objects.filter(
            document=document,
            security_scan_status='NOT RUN')

        if files:
            for file in files:
                SecurityScan.send_scan_request(file)

        return Response(None)

    @action(detail=True, methods=['put'])
    @method_decorator(permission_required('DOCUMENTS_LINK_TO_CREDIT_TRADE'))
    def unlink(self, request, pk=None):
        """
        Unlink a credit trade from this document
        """
        document = self.get_object()

        serializer = CreditTradeLinkSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        credit_trade = serializer.validated_data['credit_trade']

        result = DocumentCreditTrade.objects.filter(credit_trade=credit_trade,
                                                    document=document)

        if not result.exists():
            return Response(None, status=status.HTTP_400_BAD_REQUEST)

        result.first().delete()

        return Response(None, status=status.HTTP_202_ACCEPTED)

    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def statuses(self, request):
        """
        Gets the list of statuses that can be applied to a document
        """
        statuses = DocumentStatus.objects.all()

        serializer = self.get_serializer(
            statuses, read_only=True, many=True)

        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def upload_url(self, request):
        """
        Generates the presigned URL for uploading and retrieving
        the file
        """
        minio = Minio(MINIO['ENDPOINT'],
                      access_key=MINIO['ACCESS_KEY'],
                      secret_key=MINIO['SECRET_KEY'],
                      secure=MINIO['USE_SSL'])

        object_name = uuid.uuid4().hex
        put_url = minio.presigned_put_object(
            bucket_name=MINIO['BUCKET_NAME'],
            object_name=object_name,
            expires=MINIO['EXPIRY'])

        get_url = minio.presigned_get_object(
            bucket_name=MINIO['BUCKET_NAME'],
            object_name=object_name,
            expires=MINIO['EXPIRY'])

        return Response({
            'put': put_url,
            'get': get_url
        })

    @action(detail=True, methods=['get'])
    @method_decorator(permission_required('DOCUMENTS_LINK_TO_CREDIT_TRADE'))
    def linkable_credit_transactions(self, request, pk=None):
        """
        Returns all the credit transactions that are available for the
        File Submission.
        (Returns credit transactions (with certain statuses) that are
        associated with the fuel supplier that haven't been linked to the
        file submission)
        """
        document = self.get_object()

        organization = document.create_user.organization

        # filter out credit transactions that are not associated with
        # the organization attached to the file submission
        # also filter out statuses that don't apply
        credit_trades = CreditTrade.objects.filter(
            (Q(initiator=organization) | Q(respondent=organization)) &
            Q(is_rescinded=False) & (
                (Q(status__status__in=[
                    "Accepted", "Approved", "Declined", "Recommended",
                    "Not Recommended", "Recorded"])) |
                (Q(type__is_gov_only_type=True) &
                 Q(status__status__in=[
                     "Draft", "Submitted"]))
            )
        )

        # filter out already attached credit transactions
        credit_trades = credit_trades.exclude(
            id__in=document.credit_trades.values('id')
        )

        serializer = self.get_serializer(credit_trades, many=True)

        return Response(serializer.data)
