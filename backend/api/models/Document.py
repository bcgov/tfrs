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
from api.models.mixins.DocumentData import DocumentData
from auditable.models import Auditable

from .DocumentComment import DocumentComment
from .DocumentFileAttachment import DocumentFileAttachment


class Document(Auditable, DocumentData):
    """
    Holds the documents that constitute evidence or compliance records etc.
    """

    @property
    def attachments(self):
        """
        File(s) attached to the Document
        """
        attachments = DocumentFileAttachment.objects.filter(
            document=self.id,
            is_removed=False
        )

        return attachments

    @property
    def comments(self):
        """
        Comments that are only viewable for roles that have a
        specific permission
        """
        comments = DocumentComment.objects.filter(
            document=self.id
        )

        return comments

    @property
    def unprivileged_comments(self):
        """
        Comments that are unrestricted
        """
        comments = DocumentComment.objects.filter(
            document=self.id
        ).filter(
            privileged_access=False
        )

        return comments

    @property
    def milestone(self):
        """
        Additional information for document type: Evidence
        """
        from .DocumentMilestone import DocumentMilestone

        return DocumentMilestone.objects.filter(document_id=self.id).first()

    class Meta:
        db_table = 'document'

    db_table_comment = "Document File Submissions." \
                       "Contains a list of requests from fuel suppliers for " \
                       "compliance reporting, part 3 agreement evidence, etc."
