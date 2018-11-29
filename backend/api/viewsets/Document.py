import base64
import random

from django.views.decorators.cache import never_cache

from rest_framework import viewsets, serializers, mixins, status
from rest_framework.decorators import list_route
from rest_framework.response import Response

from api.models.Document import Document
from api.models.DocumentCategory import DocumentCategory
from api.models.DocumentStatus import DocumentStatus
from api.models.NotificationMessage import NotificationMessage
from api.notifications.notifications import AMQPNotificationService, \
    EffectiveSubscriptionSerializer, EffectiveSubscriptionUpdateSerializer
from api.permissions.Documents import DocumentPermissions
from api.permissions.Notifications import NotificationPermissions
from api.serializers.Document import DocumentSerializer, DocumentMinSerializer
from api.serializers.DocumentCategory import DocumentCategorySerializer
from api.serializers.DocumentStatus import DocumentStatusSerializer
from api.serializers.Notifications import NotificationMessageSerializer
from auditable.views import AuditableMixin


class DocumentViewSet(AuditableMixin,
                      mixins.ListModelMixin,
                      mixins.RetrieveModelMixin,
                      viewsets.GenericViewSet):

    permission_classes = (DocumentPermissions,)
    http_method_names = ['get']

    serializer_classes = {
        'default': DocumentSerializer,
        'list': DocumentMinSerializer,
        'categories': DocumentCategorySerializer,
        'statuses': DocumentStatusSerializer
    }

    queryset = Document.objects.all()
    ordering = ('-id',)

    @list_route(methods=['get'])
    def categories(self, request):
        """
            Reference Data for UI
        """
        categories = DocumentCategory.objects.all()

        serializer = self.get_serializer(categories,
                                         read_only=True,
                                         many=True)

        return Response(serializer.data)

    @list_route(methods=['get'])
    def statuses(self, request):
        """
            Reference data for UI
        """
        statuses = DocumentStatus.objects.all()

        serializer = self.get_serializer(statuses,
                                         read_only=True,
                                         many=True)

        return Response(serializer.data)

    def get_serializer_class(self):
        if self.action in list(self.serializer_classes.keys()):
            return self.serializer_classes[self.action]

        return self.serializer_classes['default']

    # def get_queryset(self):
    #     user = self.request.user
    #     return self.queryset.objects.filter(
    #         is_archived=False,
    #         user=user
    #     ).all()

    # def list(self, request, *args, **kwargs):
    #     """
    #     Lists all the documents.
    #     """
    #     return super().list(self, request, *args, **kwargs)
    #
