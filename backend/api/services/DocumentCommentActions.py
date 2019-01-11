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
from api.models.Document import Document
from api.models.DocumentComment import DocumentComment
from api.models.DocumentHistory import DocumentHistory
from api.permissions.DocumentComment import DocumentCommentPermissions


class DocumentCommentActions(object):
    """
    Provide available commenting actions to simplify frontend presentation
    logic
    """

    @staticmethod
    def available_comment_actions(
            request, document: Document):
        """
        Available actions for the user as a whole
        """
        available_actions = []

        if DocumentCommentPermissions.user_can_comment(
                request.user, document, False):
            available_actions.append('ADD_COMMENT')

        if DocumentCommentPermissions.user_can_comment(
                request.user, document, True):
            available_actions.append('ADD_PRIVILEGED_COMMENT')

        return available_actions

    @staticmethod
    def available_individual_comment_actions(
            request, comment: DocumentComment):
        """
        Available actions for the user for individual comments
        """
        available_actions = []

        if DocumentCommentPermissions.user_can_edit_comment(
                request.user, comment):
            available_actions = ['EDIT_COMMENT']

        return available_actions


class DocumentCommentService(object):
    """
    Helper service for Document Comments
    """

    @staticmethod
    def associate_history(document_comment: DocumentComment):
        """
        Associate the Document's latest history with this comment
        """
        try:
            history = DocumentHistory.objects \
                .select_related('status') \
                .filter(document=document_comment.document.id) \
                .latest('create_timestamp')
        except DocumentHistory.DoesNotExist:
            history = None

        document_comment.trade_history_at_creation = history
