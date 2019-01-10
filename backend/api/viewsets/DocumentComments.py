"""
    REST API Documentation for the NRS TFRS Credit Trading Application

    The Transportation Fuels Reporting System is being designed to streamline
    compliance reporting for transportation fuel suppliers in accordance with
    the Renewable & Low Carbon Fuel Requirements Regulation.

    OpenAPI spec version: v1

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
"""
from rest_framework import viewsets, mixins
from rest_framework import filters

from api.models.DocumentComment import DocumentComment
from api.permissions.DocumentComment import DocumentCommentPermissions
from api.serializers.DocumentComment import DocumentCommentSerializer, \
    DocumentCommentCreateSerializer, DocumentCommentUpdateSerializer
from api.services.DocumentCommentActions import DocumentCommentService

from auditable.views import AuditableMixin


class DocumentCommentsViewSet(AuditableMixin,
                              mixins.RetrieveModelMixin,
                              mixins.CreateModelMixin,
                              mixins.UpdateModelMixin,
                              viewsets.GenericViewSet):

    permission_classes = (DocumentCommentPermissions,)
    http_method_names = ['get', 'put', 'post']
    queryset = DocumentComment.objects.all()
    filter_backends = (filters.OrderingFilter,)
    ordering_fields = '__all__'
    ordering = ('create_timestamp',)

    serializer_class = DocumentCommentSerializer

    serializer_classes = {
        'default': DocumentCommentSerializer,
        'create': DocumentCommentCreateSerializer,
        'update': DocumentCommentUpdateSerializer
    }

    def get_serializer_class(self):
        if self.action in list(self.serializer_classes.keys()):
            return self.serializer_classes[self.action]

        return self.serializer_classes['default']

    def perform_create(self, serializer):
        comment = serializer.save()
        DocumentCommentService.associate_history(comment)
        comment.save()
