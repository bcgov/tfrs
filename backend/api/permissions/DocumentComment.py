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
from rest_framework import permissions

from api.models.Document import Document
from api.models.DocumentComment import DocumentComment
from api.models.DocumentStatus import DocumentStatus


class DocumentCommentPermissions(permissions.BasePermission):
    """Used by Viewset to check permissions for API requests"""

    @staticmethod
    def user_can_comment(user, document, privileged):
        """
        Check whether the user should have authority to add a comment.
        Government Users with abilities to review the documents should
        always have authority to add a comment, unless it's archived.
        Fuel Suppliers with abilities to add or submit can add a comment
        if the document is either in draft or submitted status.
        """
        if user.is_government_user and \
                user.has_perm('DOCUMENTS_GOVERNMENT_REVIEW') and \
                document.status.status in ['Received', 'Submitted']:
            return True

        if not user.is_government_user and not privileged and \
                document.status.status in ['Draft', 'Submitted']:
            return True

        return False

    @staticmethod
    def user_can_edit_comment(user, comment: DocumentComment):
        """
        Check whether the user should be able to edit their own comment.
        Conditions for now is simple: Only the user that made the comment
        can update their comment. And the status of the document has to be
        in draft state.
        """
        current_status = comment.document.status.id

        if user.id == comment.create_user_id and \
                current_status == \
                DocumentStatus.objects.get_by_natural_key('Draft').id:
            return True

        return False

    def has_permission(self, request, view):
        """Check permissions When an object does not yet exist (POST)"""

        # Fallback to has_object_permission unless it's a POST
        if request.method != 'POST':
            return True

        # Need this information to make a decision
        if 'privileged_access' not in request.data and \
                'document' in request.data:
            return False

        document = request.data['document']
        privileged_access = request.data['privileged_access']

        found = Document.objects.filter(id=document).first()

        if not found:
            return False

        if found.create_user.organization != request.user.organization and \
                not request.user.is_government_user:
            return False

        return DocumentCommentPermissions.user_can_comment(
            request.user,
            found,
            privileged_access
        )

    def has_object_permission(self, request, view, obj):
        """Check permissions When an object does exist (PUT, GET)"""

        # Users can always see and edit their own comments
        if obj.create_user == request.user:
            return True

        # And see but not edit those from their others in their own
        # organization
        if obj.create_user.organization == request.user.organization and \
                request.method in permissions.SAFE_METHODS:
            return True

        # Government roles can always view comments
        # and can view or edit privileged comments with correct permission
        if request.user.is_government_user:
            # read
            if request.method in permissions.SAFE_METHODS:
                if obj.privileged_access:
                    return request.user.has_perm('DOCUMENTS_VIEW')
                return True

            # write
            if request.method not in permissions.SAFE_METHODS:
                if obj.privileged_access:
                    return request.user.has_perm('DOCUMENTS_GOVERNMENT_REVIEW')
                return True

        # not authorized
        return False
