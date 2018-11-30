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

from api.models.Document import Document
from api.serializers import OrganizationMinSerializer
from api.serializers.DocumentStatus import DocumentStatusSerializer
from api.serializers.DocumentType import DocumentTypeSerializer


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
            'id', 'title', 'url',
            'create_timestamp', 'update_timestamp', 'create_user',
            'update_user', 'creating_organization',
            'status', 'type', 'mime_type', 'size')

        read_only_fields = ('id', 'create_timestamp', 'create_user',
                            'update_timestamp', 'update_user', 'url',
                            'title', 'creating_organization',
                            'status', 'type', 'mime_type', 'size')


class DocumentMinSerializer(serializers.ModelSerializer):
    creating_organization = OrganizationMinSerializer(read_only=True)
    type = DocumentTypeSerializer(read_only=True)
    status = DocumentStatusSerializer(read_only=True)

    """
    Minimal Serializer for Documents
    """

    class Meta:
        model = Document
        fields = ('id', 'title', 'url', 'creating_organization', 'status',
                  'type', 'mime_type', 'size')
        read_only_fields = ('id', 'title', 'url', 'creating_organization',
                            'status', 'type')
