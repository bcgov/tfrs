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

from api.models.DocumentComment import DocumentComment
from api.services.DocumentCommentActions import DocumentCommentActions

from .User import UserMinSerializer


class DocumentCommentSerializer(serializers.ModelSerializer):
    """
    Default Serializer for comments
    """
    create_user = UserMinSerializer(read_only=True)
    actions = serializers.SerializerMethodField()

    class Meta:
        model = DocumentComment
        fields = (
            'id', 'document', 'comment', 'privileged_access',
            'create_timestamp', 'update_timestamp', 'create_user', 'actions')

        read_only_fields = (
            'id', 'create_timestamp', 'update_timestamp', 'create_user')

    def get_actions(self, obj):
        """Attach available commenting actions"""

        request = self.context.get('request')

        return DocumentCommentActions.available_individual_comment_actions(
            request, obj)


class DocumentCommentUpdateSerializer(serializers.ModelSerializer):
    """
    Identical to above except that document and privileged_access are also
    read_only.
    Used for update operations (like PUT)
    """
    create_user = UserMinSerializer(read_only=True)

    class Meta:
        model = DocumentComment
        fields = (
            'id', 'document', 'comment', 'privileged_access',
            'create_timestamp', 'update_timestamp', 'create_user',
            'update_user')

        read_only_fields = ('id', 'create_timestamp', 'create_user',
                            'document')


class DocumentCommentCreateSerializer(serializers.ModelSerializer):
    """
    Serializer to create comments for documents.
    Has the basic fields needed.
    """
    class Meta:
        model = DocumentComment
        fields = ('id', 'document', 'comment', 'privileged_access',
                  'create_user', 'update_user')

        read_only_fields = ('id',)
