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
from api.models.DocumentStatus import DocumentStatus

from api.serializers.Document import DocumentStatusSerializer


class DocumentActions(object):
    """
    Service Function to abstract the action builder for the
    Credit Trade Serializer
    """
    __statuses = DocumentStatus.objects.all().only('id', 'status')

    @staticmethod
    def draft(request):
        """
        When the status is draft available actions should be:
        saving the document into a draft and if the user has enough
        permission, submit the document for review
        """
        status_dict = {s.status: s for s in DocumentActions.__statuses}

        available_statuses = []
        if request.user.has_perm('DOCUMENTS_CREATE_DRAFT'):
            available_statuses.extend([
                status_dict["Draft"],
                status_dict["Cancelled"]
            ])

        if request.user.has_perm('DOCUMENTS_SUBMIT'):
            available_statuses.append(
                status_dict["Submitted"]
            )

        serializer = DocumentStatusSerializer(
            available_statuses, many=True)
        return serializer.data

    @staticmethod
    def scan_failed(request):
        """
        When the status is Security Scan Failed, available actions should be:
        draft (to make corrections to the files that failed)
        """
        status_dict = {s.status: s for s in DocumentActions.__statuses}

        available_statuses = []
        if request.user.has_perm('DOCUMENTS_CREATE_DRAFT'):
            available_statuses.extend([
                status_dict["Draft"],
                status_dict["Cancelled"]
            ])

        if request.user.has_perm('DOCUMENTS_SUBMIT'):
            available_statuses.append(
                status_dict["Submitted"]
            )

        serializer = DocumentStatusSerializer(
            available_statuses, many=True)
        return serializer.data

    @staticmethod
    def submitted(request):
        """
        When the status is submitted available actions should be:
        received (done with review and the attachments have been
        downloaded)
        """
        status_dict = {s.status: s for s in DocumentActions.__statuses}

        available_statuses = []
        if request.user.has_perm('DOCUMENTS_GOVERNMENT_REVIEW'):
            available_statuses.append(
                status_dict["Received"]
            )

        if request.user.has_perm('DOCUMENTS_SUBMIT'):
            available_statuses.append(
                status_dict["Draft"]
            )

        serializer = DocumentStatusSerializer(
            available_statuses, many=True)
        return serializer.data
