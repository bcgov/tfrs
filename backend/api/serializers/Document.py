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
from api.models.DocumentStatus import DocumentStatus

from api.serializers.CompliancePeriod import CompliancePeriodSerializer
from api.serializers.DocumentComment import DocumentCommentSerializer
from api.serializers.DocumentMilestone import DocumentMilestoneSerializer
from api.serializers.DocumentStatus import DocumentStatusSerializer
from api.serializers.DocumentType import DocumentTypeSerializer
from api.serializers.User import UserMinSerializer
from api.services.DocumentActions import DocumentActions
from api.services.DocumentCommentActions import DocumentCommentActions
from api.services.DocumentService import DocumentService


class DocumentFileAttachmentSerializer(serializers.ModelSerializer):
    """
    Readonly Serializer for Document attachments
    """
    class Meta:
        model = DocumentFileAttachment
        fields = ('id', 'url', 'security_scan_status', 'mime_type', 'size',
                  'filename')
        read_only_fields = ('id', 'url', 'security_scan_status', 'mime_type',
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
    attachments = DocumentFileAttachmentSerializer(many=True, read_only=True)
    comments = DocumentCommentSerializer(many=True, read_only=True)
    milestone = DocumentMilestoneSerializer(read_only=True)

    def validate(self, data):
        request = self.context['request']
        submitted_status = DocumentStatus.objects.get(status="Submitted")

        if data.get('status') == submitted_status:
            attachments = request.data.get('attachments')

            if not attachments:
                raise serializers.ValidationError({
                    'attachments': "At least one file needs to be attached "
                                   "before this can be submitted."
                })

        return data

    def save(self, **kwargs):
        super().save(**kwargs)

        document = self.instance
        request = self.context['request']

        files = request.data.get('attachments')

        if files:
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

        if comment and comment.strip():
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
        extra_kwargs = {
            'compliance_period': {
                'error_messages': {
                    'does_not_exist': "Please specify the Compliance Period "
                                      "in which the request relates."
                }
            },
            'title': {
                'error_messages': {
                    'blank': "Please provide a Title."
                }
            }
        }


class DocumentDeleteSerializer(serializers.ModelSerializer):
    """
    Delete serializer for Documents
    """
    def destroy(self):
        """
        Delete function to mark the document as cancelled.
        Also, sets the file attachments as removed (including sending a
        request to minio to delete the actual files)
        """
        document = self.instance

        if document.status != DocumentStatus.objects.get(status="Draft"):
            raise serializers.ValidationError({
                'readOnly': "Cannot delete a submission that's not a draft."
            })

        attachments_to_be_removed = DocumentFileAttachment.objects.filter(
            document=document,
            is_removed=False).values_list('id')

        if attachments_to_be_removed:
            DocumentService.delete_attachments(
                document_id=document.id,
                attachment_ids=attachments_to_be_removed
            )

        document.status = DocumentStatus.objects.get(status="Cancelled")
        document.save()

    class Meta:
        model = Document
        fields = '__all__'


class DocumentDetailSerializer(serializers.ModelSerializer):
    """
    Document Serializer with Full Details
    """
    actions = serializers.SerializerMethodField()
    attachments = serializers.SerializerMethodField()
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

        if cur_status == "Security Scan Failed":
            return DocumentActions.scan_failed(request)

        if cur_status == "Draft":
            return DocumentActions.draft(request)

        if cur_status == "Submitted":
            return DocumentActions.submitted(request)

        return []

    def get_attachments(self, obj):
        """
        Returns all file attachments for the document.
        We have to make sure not to include attachments that have been
        marked for removal.
        """
        attachments = DocumentFileAttachment.objects.filter(
            document_id=obj.id,
            is_removed=False)

        serializer = DocumentFileAttachmentSerializer(attachments, many=True)

        return serializer.data

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
            'milestone', 'record_number')

        read_only_fields = (
            'id', 'create_timestamp', 'create_user', 'update_timestamp',
            'update_user', 'title', 'status', 'type', 'attachments',
            'compliance_period', 'actions', 'comment_actions', 'milestone',
            'record_number')


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
    attachments = DocumentFileAttachmentSerializer(many=True, read_only=True)
    comments = DocumentCommentSerializer(many=True, read_only=True)
    milestone = DocumentMilestoneSerializer(read_only=True)

    def validate(self, data):
        request = self.context['request']
        document_statuses = DocumentStatus.objects.all().only('id', 'status')
        status_dict = {s.status: s for s in document_statuses}

        document = self.instance
        status = data.get('status')
        draft_status = status_dict["Draft"]
        security_scan_failed_status = status_dict["Security Scan Failed"]

        if document.status != draft_status and \
                document.status != security_scan_failed_status:
            if status == draft_status:
                raise serializers.ValidationError({
                    'readOnly': "Cannot update the status back to draft when "
                                "it's no longer in draft."
                })

            # if there's a key that's not about updating the status or user
            # invalidate the request as we're not allowing modifications
            # to other fields
            for key in data:
                if key not in ('status', 'update_user'):
                    raise serializers.ValidationError({
                        'readOnly': "Cannot update other fields unless the "
                                    "document is in draft."
                    })

        submitted_status = status_dict["Submitted"]

        if data.get('status') == submitted_status:
            current_attachments = document.attachments
            attachments = request.data.get('attachments')

            if not attachments and not current_attachments:
                raise serializers.ValidationError({
                    'attachments': "At least one file needs to be attached "
                                   "before this can be submitted."
                })

        return data

    def save(self, **kwargs):
        super().save(**kwargs)

        document = self.instance
        request = self.context['request']

        attachments_to_be_removed = request.data.get(
            'attachments_to_be_removed')

        if attachments_to_be_removed:
            DocumentService.delete_attachments(
                document_id=document.id,
                attachment_ids=attachments_to_be_removed
            )

        files = request.data.get('attachments')

        if files:
            for file in files:
                DocumentFileAttachment.objects.create(
                    document=document,
                    create_user=document.create_user,
                    **file
                )

        if document.type.the_type == 'Evidence':
            DocumentMilestone.objects.update_or_create(
                document=document,
                defaults={
                    'create_user': document.create_user,
                    'milestone': request.data.get('milestone')
                }
            )

        comment = request.data.get('comment')

        if comment and comment.strip():
            document_comment = DocumentComment.objects.filter(
                document=document).first()

            if document_comment:
                document_comment.comment = comment
                document_comment.update_timestamp = datetime.now()
                document_comment.update_user = request.user
                document_comment.save()
            else:
                DocumentComment.objects.create(
                    document=document,
                    comment=comment,
                    create_user=request.user,
                    create_timestamp=datetime.now(),
                    privileged_access=False
                )

        return self.instance

    class Meta:
        model = Document
        fields = ('compliance_period', 'update_user', 'id',
                  'status', 'title', 'type', 'milestone',
                  'record_number', 'attachments', 'comments')
        read_only_fields = ('id',)
        extra_kwargs = {
            'compliance_period': {
                'error_messages': {
                    'does_not_exist': "Please specify the Compliance Period "
                                      "in which the request relates."
                }
            },
            'title': {
                'error_messages': {
                    'blank': "Please provide a Title."
                }
            }
        }
