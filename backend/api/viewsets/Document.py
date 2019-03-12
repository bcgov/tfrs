import uuid

from django.db.models import Q
from minio import Minio

from rest_framework import viewsets, status, mixins
from rest_framework.decorators import list_route, detail_route
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from api.decorators import permission_required
from api.models.CreditTrade import CreditTrade
from api.models.CreditTradeStatus import CreditTradeStatus
from api.models.Document import Document
from api.models.DocumentCategory import DocumentCategory
from api.models.DocumentFileAttachment import DocumentFileAttachment
from api.models.DocumentStatus import DocumentStatus
from api.models.DocumentCreditTrade import DocumentCreditTrade
from api.permissions.Documents import DocumentPermissions
from api.serializers.CreditTrade import CreditTradeListSerializer
from api.serializers.Document import \
    DocumentCreateSerializer, DocumentDeleteSerializer, \
    DocumentDetailSerializer, DocumentMinSerializer, DocumentSerializer, \
    DocumentUpdateSerializer
from api.serializers.DocumentCategory import DocumentCategorySerializer
from api.serializers.DocumentStatus import DocumentStatusSerializer
from api.serializers.DocumentCreditTrade import CreditTradeLinkSerializer
from api.services.CreditTradeService import CreditTradeService
from api.services.DocumentService import DocumentService
from api.services.SecurityScan import SecurityScan
from auditable.views import AuditableMixin
from tfrs.settings import MINIO


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

    queryset = Document.objects.all()
    ordering = ('-id',)

    @list_route(methods=['get'], permission_classes=[AllowAny])
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
            return self.queryset.filter(
                ~Q(status__status__in=['Draft',
                                       'Cancelled',
                                       'Pending Submission'])
            ).all()

        return self.queryset.filter(
            Q(create_user__organization__id=user.organization.id),
            ~Q(status__status__in=['Cancelled'])
        ).all()

    def perform_create(self, serializer):
        user = self.request.user
        document = serializer.save()
        DocumentService.create_history(document)

        files = DocumentFileAttachment.objects.filter(
            document=document,
            security_scan_status='NOT RUN')

        if files and document.status.status != 'Draft':
            document.status = DocumentStatus.objects.get(
                status='Pending Submission')
            document.save()

            for file in files:
                SecurityScan.send_scan_request(file)

        DocumentService.send_notification(document, user)

    def perform_update(self, serializer):
        user = self.request.user

        document = serializer.save()
        DocumentService.create_history(document)
        files = document.attachments.filter(
            security_scan_status='NOT RUN'
        )

        if files and document.status.status == 'Submitted':
            document.status = DocumentStatus.objects.get(
                status='Pending Submission')
            document.save()

            for file in files:
                SecurityScan.send_scan_request(file)

        DocumentService.send_notification(document, user)

    @detail_route(methods=['put'])
    @permission_required('DOCUMENTS_LINK_TO_CREDIT_TRADE')
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

    @detail_route(methods=['put'])
    @permission_required('DOCUMENTS_LINK_TO_CREDIT_TRADE')
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

    @list_route(methods=['get'], permission_classes=[AllowAny])
    def statuses(self, request):
        """
        Gets the list of statuses that can be applied to a document
        """
        statuses = DocumentStatus.objects.all()

        serializer = self.get_serializer(
            statuses, read_only=True, many=True)

        return Response(serializer.data)

    @list_route(methods=['get'])
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

    @detail_route(methods=['get'])
    @permission_required('DOCUMENTS_LINK_TO_CREDIT_TRADE')
    def linkable_credit_transactions(self, request, pk=None):
        """
        Returns all the credit transactions that are available for the
        File Submission.
        (Returns all credit transactions that are associated with the fuel
        supplier that haven't been linked to the file submission)
        """
        document = self.get_object()

        credit_trades = CreditTradeService.get_organization_credit_trades(
            document.create_user.organization
        )

        credit_trades = credit_trades.exclude(
            id__in=document.credit_trades.values('id')
        )

        serializer = self.get_serializer(credit_trades, many=True)

        return Response(serializer.data)
