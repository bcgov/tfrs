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
from collections import defaultdict
from enum import Enum

from rest_framework import permissions

from api.models.CreditTradeComment import CreditTradeComment
from api.models.CreditTradeStatus import CreditTradeStatus
from api.services.CreditTradeService import CreditTradeService


class ComplianceReportPermissions(permissions.BasePermission):
    """Used by Viewset to check permissions for API requests"""

    def has_permission(self, request, view):
        """Check permissions When an object does not yet exist (POST)"""

        if request.user.is_government_user and request.method != 'POST':
            return True

        return request.user.has_perm('COMPLIANCE_REPORT_MANAGE')

    def has_object_permission(self, request, view, obj):
        """Check permissions When an object does exist (PUT, GET)"""

        # Users can only update their own compliance reports
        if obj.organization == request.user.organization:
            return True

        # Government users can see compliance reports
        if request.user.is_government_user and \
                request.method in permissions.SAFE_METHODS:
            return True

        return False
