import uuid

from django.db.models import Q
from minio import Minio

from rest_framework import viewsets, status, mixins
from rest_framework.decorators import list_route
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from api.models.Document import Document
from api.models.DocumentCategory import DocumentCategory
from api.models.DocumentFileAttachment import DocumentFileAttachment
from api.models.DocumentStatus import DocumentStatus
from api.notifications.notification_types import NotificationType
from api.notifications.notifications import AMQPNotificationService
from api.permissions.Documents import DocumentPermissions
from api.serializers.Document import \
    DocumentCreateSerializer, DocumentDeleteSerializer, \
    DocumentDetailSerializer, DocumentMinSerializer, DocumentSerializer, \
    DocumentUpdateSerializer
from api.serializers.DocumentCategory import DocumentCategorySerializer
from api.serializers.DocumentStatus import DocumentStatusSerializer
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
    http_method_names = ['delete', 'get', 'post', 'patch']

    serializer_classes = {
        'default': DocumentSerializer,
        'destroy': DocumentDeleteSerializer,
        'create': DocumentCreateSerializer,
        'list': DocumentMinSerializer,
        'categories': DocumentCategorySerializer,
        'retrieve': DocumentDetailSerializer,
        'statuses': DocumentStatusSerializer,
        'partial_update': DocumentUpdateSerializer,
        'update': DocumentUpdateSerializer
    }

    queryset = Document.objects.all()
    ordering = ('-id',)

    @list_route(methods=['get'], permission_classes=[AllowAny])
    def categories(self, request):
        """
            Reference Data for UI
        """
        categories = DocumentCategory.objects.all()

        serializer = self.get_serializer(categories,
                                         read_only=True,
                                         many=True)

        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
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
                ~Q(status__status__in=['Draft', 'Cancelled'])
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

            AMQPNotificationService.send_notification(
                interested_organization=user.organization,
                message=NotificationType.DOCUMENT_PENDING_SUBMISSION.name,
                notification_type=NotificationType.DOCUMENT_PENDING_SUBMISSION,
                originating_user=user,
                related_document=document
            )

        for file in files:
            SecurityScan.send_scan_request(file)

    def perform_update(self, serializer):
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

            AMQPNotificationService.send_notification(
                interested_organization=user.organization,
                message=NotificationType.DOCUMENT_PENDING_SUBMISSION.name,
                notification_type=NotificationType.DOCUMENT_PENDING_SUBMISSION,
                originating_user=user,
                related_document=document
            )

        for file in files:
            SecurityScan.send_scan_request(file)

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
