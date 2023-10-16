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
import re
from datetime import datetime, timedelta

from minio import Minio
from rest_framework import serializers

from api.models.DocumentFileAttachment import DocumentFileAttachment
from api.models.Document import Document
from api.models.DocumentComment import DocumentComment
from api.models.DocumentStatus import DocumentStatus
from api.models.DocumentType import DocumentType

from api.serializers import CreditTradeAuxiliarySerializer
from api.serializers.CompliancePeriod import CompliancePeriodSerializer
from api.serializers.DocumentComment import DocumentCommentSerializer
from api.serializers.DocumentHistory import DocumentHistorySerializer
from api.serializers.DocumentStatus import DocumentStatusSerializer
from api.serializers.DocumentType import DocumentTypeSerializer
from api.serializers.User import UserMinSerializer

from api.services.DocumentActions import DocumentActions
from api.services.DocumentCommentActions import DocumentCommentActions
from api.services.DocumentService import DocumentService
from tfrs.settings import MINIO


class DocumentFileAttachmentSerializer(serializers.ModelSerializer):
    """
    Readonly Serializer for Document attachments
    """

    url = serializers.SerializerMethodField()

    def get_url(self, obj):
        try:
            minio = Minio(MINIO['ENDPOINT'],
                          access_key=MINIO['ACCESS_KEY'],
                          secret_key=MINIO['SECRET_KEY'],
                          secure=MINIO['USE_SSL'])

            object_name = re.search(r".*/([^\?]+)", obj.url).group(1)

            get_url = minio.presigned_get_object(
                bucket_name=MINIO['BUCKET_NAME'],
                object_name=object_name,
                expires=timedelta(seconds=3600))

            return get_url
        except TypeError:
            return 'Minio unconfigured'

    class Meta:
        model = DocumentFileAttachment
        fields = ('id', 'url', 'security_scan_status', 'mime_type', 'size',
                  'filename', 'record_number')
        read_only_fields = ('id', 'url', 'security_scan_status', 'mime_type',
                            'size', 'filename', 'record_number')


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
    create_user = UserMinSerializer(read_only=True)
    type = DocumentTypeSerializer(read_only=True)
    status = DocumentStatusSerializer(read_only=True)
    credit_trades = CreditTradeAuxiliarySerializer(many=True, read_only=True)
    history = DocumentHistorySerializer(many=True, read_only=True)

    class Meta:
        model = Document
        fields = (
            'id', 'title', 'status', 'type', 'create_timestamp', 'create_user',
            'milestone', 'update_timestamp', 'update_user', 'credit_trades', 'history')

        read_only_fields = (
            'id', 'title', 'status', 'type', 'create_timestamp', 'create_user',
            'milestone', 'update_timestamp', 'update_user', 'credit_trades', 'history')


class DocumentCreateSerializer(serializers.ModelSerializer):
    """
    Creation Serializer for Documents
    """
    attachments = DocumentFileAttachmentSerializer(many=True, read_only=True)
    comments = DocumentCommentSerializer(many=True, read_only=True)
    milestone = serializers.CharField(
        required=False, max_length=1000, allow_blank=True)
    # we must allow_blank for custom validation to occur
    title = serializers.CharField(allow_blank=True)

    def validate_title(self, value):
        request = self.context['request']

        if request.data.get('type') == DocumentType.objects.get(
                the_type="Evidence").id:
            if not value:
                raise serializers.ValidationError(
                    "Please provide the name of the Initiative Agreement to which "
                    "the submission relates."
                )

        if not value:
            raise serializers.ValidationError(
                "Please provide a Title"
            )

        return value

    def validate_milestone(self, value):
        """
        Milestone validation so we can include the error message as part of
        the basic validation (instead of a separate check after title and
        compliance period)
        """
        request = self.context['request']

        if request.data.get('type') == DocumentType.objects.get(
                the_type="Evidence").id:
            if not value:
                raise serializers.ValidationError(
                    "Please indicate the Designated Action(s) to which the "
                    "submission relates."
                )

        return value

    def validate(self, data):
        request = self.context['request']
        submitted_status = DocumentStatus.objects.get(status="Submitted")

        attachments = request.data.get('attachments')
        if attachments:
            for attachment in attachments:
                if '?' in attachment['url']:
                    raise serializers.ValidationError({
                        'attachments': 'should not contain query string'
                    })

        if data.get('status') == submitted_status:
            attachments = request.data.get('attachments')

            if not attachments:
                raise serializers.ValidationError({
                    'attachments': "Please attach at least one file"
                                   " before submitting."
                })

        return data

    def create(self, validated_data):
        document = Document.objects.create(**validated_data)

        return document

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
                  'attachments', 'comments')
        read_only_fields = ('id',)
        extra_kwargs = {
            'compliance_period': {
                'error_messages': {
                    'does_not_exist': "Please specify the compliance period "
                                      "to which the submission relates."
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
        if document.status not in DocumentStatus.objects.filter(
                status__in=["Draft", "Security Scan Failed"]):
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
    link_actions = serializers.SerializerMethodField()
    comments = serializers.SerializerMethodField()
    compliance_period = CompliancePeriodSerializer(read_only=True)
    status = DocumentStatusSerializer(read_only=True)
    type = DocumentTypeSerializer(read_only=True)
    credit_trades = serializers.SerializerMethodField()
    create_user = UserMinSerializer(read_only=True)

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

        if cur_status == "Submitted" or cur_status == 'Pending Submission':
            return DocumentActions.submitted(request)

        if cur_status == "Received":
            return DocumentActions.received(request)

        return []

    def get_link_actions(self, obj):
        cur_status = obj.status.status
        request = self.context.get('request')

        # If the user doesn't have any roles assigned, treat as though the user
        # doesn't have available permissions
        if not request.user.roles:
            return []

        return DocumentActions.link_actions(request, cur_status)

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

    def get_credit_trades(self, obj):
        """
        Returns the linked credit transactions to the file submission
        Will also filter based on the user type
        """
        request = self.context.get('request')
        credit_trades = obj.credit_trades

        if not request.user.is_government_user:
            credit_trades = credit_trades.filter(
                status__status__in=["Approved", "Declined"])

        serializer = CreditTradeAuxiliarySerializer(
            credit_trades, many=True, read_only=True)

        return serializer.data

    class Meta:
        model = Document
        fields = (
            'id', 'title',
            'create_timestamp', 'create_user', 'update_timestamp',
            'update_user', 'status', 'type', 'attachments',
            'compliance_period', 'actions', 'comment_actions', 'comments',
            'link_actions', 'milestone', 'credit_trades')

        read_only_fields = (
            'id', 'create_timestamp', 'create_user', 'update_timestamp',
            'update_user', 'title', 'status', 'type', 'attachments',
            'compliance_period', 'actions', 'comment_actions', 'milestone',
            'link_actions', 'credit_trades')


class DocumentMinSerializer(serializers.ModelSerializer):
    """
    Minimal Serializer for Documents
    """
    attachments = DocumentFileAttachmentSerializer(many=True)
    create_user = UserMinSerializer(read_only=True)
    status = DocumentStatusSerializer(read_only=True)
    type = DocumentTypeSerializer(read_only=True)
    credit_trades = CreditTradeAuxiliarySerializer(many=True, read_only=True)
    history = DocumentHistorySerializer(many=True, read_only=True)

    class Meta:
        model = Document
        fields = (
            'id', 'title', 'create_user', 'status', 'type', 'milestone',
            'credit_trades', 'attachments', 'update_timestamp', 'history')
        read_only_fields = (
            'id', 'title', 'create_user', 'status', 'type', 'milestone',
            'credit_trades', 'attachments', 'update_timestamp', 'history')


class DocumentUpdateSerializer(serializers.ModelSerializer):
    """
    Update Serializer for Documents
    """
    attachments = DocumentFileAttachmentSerializer(many=True, read_only=True)
    comments = DocumentCommentSerializer(many=True, read_only=True)
    milestone = serializers.CharField(
        required=False, max_length=1000, allow_blank=True)
    type = DocumentTypeSerializer(read_only=True)
    # we must allow_blank for custom validation to occur
    title = serializers.CharField(allow_blank=True)

    def validate_title(self, value):
        document = self.instance

        if document.type == DocumentType.objects.get(the_type="Evidence").id:
            if not value:
                raise serializers.ValidationError(
                    "Please provide the name of the Initiative Agreement to which "
                    "the submission relates."
                )

        if not value:
            raise serializers.ValidationError(
                "Please provide a Title"
            )

        return value

    def validate_milestone(self, value):
        """
        Milestone validation so we can include the error message as part of
        the basic validation (instead of a separate check after title and
        compliance period)
        """
        document = self.instance

        if document.type == DocumentType.objects.get(
                the_type="Evidence"):
            if not value:
                raise serializers.ValidationError(
                    "Please indicate the Designated Action(s) to which the "
                    "submission relates."
                )

        return value

    def validate(self, data):
        request = self.context['request']

        document = self.instance
        status = data.get('status')

        if status.status in ["Received", "Archived"] and \
                not request.user.has_perm('DOCUMENTS_GOVERNMENT_REVIEW'):
            raise serializers.ValidationError({
                'invalidStatus': "You do not have permission to set "
                                 "the status to `{}`.".format(status.status)
            })

        if not DocumentService.validate_status(document.status, status):
            if status.status == 'Draft':
                raise serializers.ValidationError({
                    'invalidStatus': "The submission cannot be rescinded "
                                     "because it has been marked as received "
                                     "by a Government user. "
                                     "Please refresh your browser."
                })

            raise serializers.ValidationError({
                'invalidStatus': "Submission cannot be set to {} as it "
                                 "currently has a status of {}.".format(
                                     status.status,
                                     document.status.status
                                 )
            })

        if document.status.status != "Draft" and \
                document.status.status != "Security Scan Failed":
            # if there's a key that's not about updating the status or user
            # invalidate the request as we're not allowing modifications
            # to other fields
            for key in data:
                if key not in ('status', 'update_user'):
                    raise serializers.ValidationError({
                        'readOnly': "Cannot update other fields unless the "
                                    "document is in draft."
                    })

        attachments = request.data.get('attachments')
        if attachments:
            for attachment in attachments:
                if '?' in attachment['url']:
                    raise serializers.ValidationError({
                        'attachments': 'should not contain query string'
                    })

        if status.status == "Submitted":
            if document.type.the_type == "Evidence":
                if 'milestone' in request.data and \
                        not request.data.get('milestone'):
                    raise serializers.ValidationError({
                        'milestone': "Please indicate the Designated "
                                     "Action(s) to which the submission relates."
                    })

            current_attachments = document.attachments
            attachments = request.data.get('attachments')

            if not attachments and not current_attachments:
                raise serializers.ValidationError({
                    'attachments': "Please attach at least one file"
                                   " before submitting."
                })

            attachments_to_be_removed = request.data.get(
                'attachments_to_be_removed')

            for attachment in current_attachments:
                if attachment.security_scan_status == 'FAIL' and \
                        not attachment.is_removed and \
                        attachment.id not in attachments_to_be_removed:
                    raise serializers.ValidationError({
                        'attachments': "An attachment failing security scan "
                                       "is preventing this {} from being "
                                       "submitted".format(
                                           document.type.description
                                       )
                    })

                if attachment.security_scan_status == 'IN PROGRESS' and \
                        not attachment.is_removed and \
                        attachment.id not in attachments_to_be_removed:
                    raise serializers.ValidationError({
                        'attachments': "Please wait until the attachments "
                                       "completed security scan before "
                                       "submitting."
                    })

        if status.status == "Archived":
            record_numbers = request.data.get('record_numbers', [])

            record_numbers_dict = {
                record_number.get('id'): record_number for
                record_number in record_numbers if record_number
            }

            errors = {}
            # go through each file attached to the document and make sure
            # that trim numbers are provided
            for attachment in document.attachments:
                if not record_numbers_dict.get(attachment.id):
                    filename = (attachment.filename[:50] + '...') \
                        if len(attachment.filename) > 50 \
                        else attachment.filename
                    errors[attachment.filename] = \
                        "Please provide a TRIM Record # for {}".format(
                            filename
                        )

            if errors:
                raise serializers.ValidationError(errors)

        return data

    def update(self, document, validated_data):
        status = validated_data.get('status', document.status)

        Document.objects.filter(id=document.id).update(**validated_data)

        return document

    def save(self, **kwargs):
        super().save(**kwargs)

        document = Document.objects.get(id=self.instance.id)
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

        if 'record_numbers' in request.data:
            record_numbers_dict = {
                record_number.get('id'): record_number for
                record_number in request.data.get('record_numbers')
                if record_number
            }

            for attachment in document.attachments:
                attachment.record_number = \
                    record_numbers_dict[attachment.id].get('value')
                attachment.save()

        if document.status.status in ['Draft', 'Submitted']:
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

        return document

    class Meta:
        model = Document
        fields = (
            'compliance_period', 'update_user', 'id', 'status',
            'title', 'type', 'milestone', 'attachments', 'comments'
        )
        read_only_fields = ('id',)
        extra_kwargs = {
            'compliance_period': {
                'error_messages': {
                    'does_not_exist': "Please specify the compliance period "
                                      "to which the submission relates."
                }
            },
            'milestone': {
                'error_messages': {
                    'blank': "Please provide a Milestone.",
                    'null': "Please provide a Milestone.",
                    'required': "Please provide a Milestone."
                }
            }
        }
