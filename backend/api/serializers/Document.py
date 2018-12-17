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

from api.models.CompliancePeriod import CompliancePeriod
from api.models.DocumentFileAttachment import DocumentFileAttachment
from api.models.DocumentStatus import DocumentStatus
from api.models.DocumentType import DocumentType
from api.models.Document import Document
from api.serializers import OrganizationMinSerializer, PrimaryKeyRelatedField
from api.serializers.DocumentStatus import DocumentStatusSerializer
from api.serializers.DocumentType import DocumentTypeSerializer


class DocumentFileAttachmentSerializer(serializers.ModelSerializer):
    """
    Readonly Serializer for Document attachments
    """
    class Meta:
        model = DocumentFileAttachment
        fields = ('url', 'security_scan_status', 'mime_type', 'size')
        read_only_fields = ('url', 'security_scan_status', 'mime_type', 'size')


class DocumentFileAttachmentCreateSerializer(serializers.ModelSerializer):
    """
    Create Serializer for Document attachments
    """
    class Meta:
        model = DocumentFileAttachment
        fields = ('url', 'mime_type', 'size')


class DocumentSerializer(serializers.ModelSerializer):
    """
    Default Serializer for Documents
    """

    creating_organization = OrganizationMinSerializer(read_only=True)
    type = DocumentTypeSerializer(read_only=True)
    status = DocumentStatusSerializer(read_only=True)

    class Meta:
        model = Document
        fields = (
            'id', 'title',
            'create_timestamp', 'update_timestamp', 'create_user',
            'update_user', 'creating_organization',
            'status', 'type')

        read_only_fields = ('id', 'create_timestamp', 'create_user',
                            'update_timestamp', 'update_user',
                            'title', 'creating_organization',
                            'status', 'type')


class DocumentCreateSerializer(serializers.ModelSerializer):
    """
    Creation Serializer for Documents
    """

    type = PrimaryKeyRelatedField(queryset=DocumentType.objects.all())
    compliance_period = PrimaryKeyRelatedField(
        queryset=CompliancePeriod.objects.all())
    attachments = DocumentFileAttachmentCreateSerializer(
        many=True, required=False)

    # def validate(self, data):
    #     return data

    def save(self, **kwargs):
        files = self.validated_data.pop('attachments')

        obj = Document(
            compliance_period=self.validated_data['compliance_period'],
            type=self.validated_data['type'],
            status=DocumentStatus.objects.get_by_natural_key('Submitted'),
            creating_organization=self.context['request'].user.organization
        )
        obj.save()

        for file in files:
            DocumentFileAttachment.objects.create(
                document=obj,
                **file
            )

        return obj

    class Meta:
        model = Document
        fields = ('id', 'type', 'compliance_period', 'attachments')
        read_only_fields = ('id',)


class DocumentMinSerializer(serializers.ModelSerializer):
    creating_organization = OrganizationMinSerializer(read_only=True)
    type = DocumentTypeSerializer(read_only=True)
    status = DocumentStatusSerializer(read_only=True)
    attachments = DocumentFileAttachmentSerializer(many=True)

    """
    Minimal Serializer for Documents
    """

    class Meta:
        model = Document
        fields = ('id', 'title', 'creating_organization', 'status',
                  'type', 'attachments')
        read_only_fields = ('id', 'title', 'creating_organization',
                            'status', 'type', 'attachments')
