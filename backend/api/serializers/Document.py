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
from datetime import datetime
from rest_framework import serializers

from api.models.DocumentFileAttachment import DocumentFileAttachment
from api.models.Document import Document
from api.models.DocumentComment import DocumentComment
from api.models.DocumentMilestone import DocumentMilestone

from api.serializers.CompliancePeriod import CompliancePeriodSerializer
from api.serializers.DocumentComment import DocumentCommentSerializer
from api.serializers.DocumentMilestone import DocumentMilestoneSerializer
from api.serializers.DocumentStatus import DocumentStatusSerializer
from api.serializers.DocumentType import DocumentTypeSerializer
from api.serializers.User import UserMinSerializer
from api.services.DocumentActions import DocumentActions
from api.services.DocumentCommentActions import DocumentCommentActions


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
    from .DocumentMilestone import DocumentMilestoneSerializer

    attachments = DocumentFileAttachmentSerializer(many=True, read_only=True)
    comments = DocumentCommentSerializer(many=True, read_only=True)
    milestone = DocumentMilestoneSerializer(read_only=True)

    def save(self, **kwargs):
        super().save(**kwargs)

        document = self.instance
        request = self.context['request']

        files = request.data.get('attachments')

        for file in files:
            DocumentFileAttachment.objects.create(
                document=document,
                create_user=document.create_user,
                **file
            )

        if document.type.the_type == 'Evidence':
            DocumentMilestone.objects.create(
                document=document,
                create_user=document.create_user,
                milestone=request.data.get('milestone')
            )

        comment = request.data.get('comment')

        if comment.strip():
            DocumentComment.objects.create(
                document=document,
                comment=comment,
                create_user=request.user,
                update_user=request.user,
                create_timestamp=datetime.now(),
                privileged_access=False
            )

        return self.instance

    class Meta:
        model = Document
        fields = ('compliance_period', 'create_user', 'id',
                  'status', 'title', 'type', 'milestone',
                  'attachments', 'comments', 'record_number')
        read_only_fields = ('id',)


class DocumentDetailSerializer(serializers.ModelSerializer):
    """
    Document Serializer with Full Details
    """
    actions = serializers.SerializerMethodField()
    attachments = DocumentFileAttachmentSerializer(many=True)
    comment_actions = serializers.SerializerMethodField()
    comments = serializers.SerializerMethodField()
    compliance_period = CompliancePeriodSerializer(read_only=True)
    milestone = serializers.SerializerMethodField()
    status = DocumentStatusSerializer(read_only=True)
    type = DocumentTypeSerializer(read_only=True)

    def get_actions(self, obj):
        """
        If the user doesn't have any roles assigned, treat as though the user
        doesn't have available permissions
        """
        cur_status = obj.status.status
        request = self.context.get('request')

        # If the user doesn't have any roles assigned, treat as though the user
        # doesn't have available permissions
        if not request.user.roles:
            return []

        if cur_status == "Draft":
            return DocumentActions.draft(request)

        if cur_status == "Submitted":
            return DocumentActions.submitted(request)

        return []

    def get_comments(self, obj):
        """
        Returns all the attached comments for the credit trade
        """
        request = self.context.get('request')

        # If the user doesn't have any roles assigned, treat as though the user
        # doesn't have available permissions
        if not request.user.roles:
            return []

        if request.user.is_government_user:
            comments = obj.comments
        else:
            comments = obj.unprivileged_comments

        serializer = DocumentCommentSerializer(
            comments,
            many=True,
            context={'request': request})

        return serializer.data

    def get_comment_actions(self, obj):
        """Attach available commenting actions"""
        request = self.context.get('request')
        return DocumentCommentActions.available_comment_actions(request, obj)

    def get_milestone(self, obj):
        """
        Additional information for milestone evidences
        """
        if obj.type.the_type == 'Evidence':
            milestone = obj.milestone
            serializer = DocumentMilestoneSerializer(milestone)

            return serializer.data

        return None

    class Meta:
        model = Document
        fields = (
            'id', 'title',
            'create_timestamp', 'create_user', 'update_timestamp',
            'update_user', 'status', 'type', 'attachments',
            'compliance_period', 'actions', 'comment_actions', 'comments',
            'milestone')

        read_only_fields = (
            'id', 'create_timestamp', 'create_user', 'update_timestamp',
            'update_user', 'title', 'status', 'type', 'attachments',
            'compliance_period', 'actions', 'comment_actions', 'milestone')


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


class DocumentUpdateSerializer(serializers.ModelSerializer):
    """
    Update Serializer for Documents
    """
    class Meta:
        model = Document
        fields = ('compliance_period', 'update_user', 'id',
                  'status', 'title', 'type')
        read_only_fields = ('id',)
