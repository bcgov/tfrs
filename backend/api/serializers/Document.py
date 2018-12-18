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
from rest_framework import serializers

from api.models.DocumentFileAttachment import DocumentFileAttachment
from api.models.Document import Document
from api.serializers.CompliancePeriod import CompliancePeriodSerializer
from api.serializers.DocumentStatus import DocumentStatusSerializer
from api.serializers.DocumentType import DocumentTypeSerializer
from api.serializers.User import UserMinSerializer


class DocumentFileAttachmentSerializer(serializers.ModelSerializer):
    """
    Readonly Serializer for Document attachments
    """
    class Meta:
        model = DocumentFileAttachment
        fields = ('url', 'security_scan_status', 'mime_type', 'size',
                  'filename')
        read_only_fields = ('url', 'security_scan_status', 'mime_type',
                            'size', 'filename')


class DocumentFileAttachmentCreateSerializer(serializers.ModelSerializer):
    """
    Create Serializer for Document attachments
    """
    class Meta:
        model = DocumentFileAttachment
        fields = ('url', 'mime_type', 'size', 'filename')


class DocumentSerializer(serializers.ModelSerializer):
    """
    Default Serializer for Documents
    """
    type = DocumentTypeSerializer(read_only=True)
    status = DocumentStatusSerializer(read_only=True)

    class Meta:
        model = Document
        fields = (
            'id', 'title', 'status', 'type', 'create_timestamp',
            'create_user', 'update_timestamp', 'update_user')

        read_only_fields = ('id', 'title', 'status', 'type',
                            'create_timestamp', 'create_user',
                            'update_timestamp', 'update_user')


class DocumentCreateSerializer(serializers.ModelSerializer):
    """
    Creation Serializer for Documents
    """
    def save(self, **kwargs):
        super().save(**kwargs)
        request = self.context['request']
        files = request.data.get('attachments')

        for file in files:
            DocumentFileAttachment.objects.create(
                document=self.instance,
                **file
            )

        return self.instance

    class Meta:
        model = Document
        fields = ('comment', 'compliance_period', 'create_user', 'id',
                  'status', 'title', 'type')
        read_only_fields = ('id',)


class DocumentDetailSerializer(serializers.ModelSerializer):
    """
    Document Serializer with Full Details
    """
    compliance_period = CompliancePeriodSerializer(read_only=True)
    type = DocumentTypeSerializer(read_only=True)
    status = DocumentStatusSerializer(read_only=True)
    attachments = DocumentFileAttachmentSerializer(many=True)

    class Meta:
        model = Document
        fields = (
            'id', 'title',
            'create_timestamp', 'create_user', 'update_timestamp',
            'update_user', 'status', 'type', 'attachments',
            'compliance_period', 'comment')

        read_only_fields = ('id', 'create_timestamp', 'create_user',
                            'update_timestamp', 'update_user',
                            'title', 'status', 'type', 'attachments',
                            'compliance_period', 'comment')


class DocumentMinSerializer(serializers.ModelSerializer):
    """
    Minimal Serializer for Documents
    """
    attachments = DocumentFileAttachmentSerializer(many=True)
    create_user = UserMinSerializer(read_only=True)
    status = DocumentStatusSerializer(read_only=True)
    type = DocumentTypeSerializer(read_only=True)

    class Meta:
        model = Document
        fields = (
            'id', 'title', 'create_user', 'status', 'type',
            'attachments', 'update_timestamp')
        read_only_fields = (
            'id', 'title', 'create_user', 'status', 'type',
            'attachments', 'update_timestamp')
