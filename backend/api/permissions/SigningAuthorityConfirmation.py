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

from api.models.ComplianceReport import ComplianceReport
from api.services.CreditTradeService import CreditTradeService


class SigningAuthorityConfirmationPermissions(permissions.BasePermission):
    """Used by Viewset to check permissions for API requests"""

    class _Relationship(Enum):
        INITIATOR = 1
        RESPONDENT = 2

    action_mapping = defaultdict(lambda: False)

    # key (relationship, status, rescinded?)

    action_mapping[(_Relationship.INITIATOR, 'Draft', False)] = True
    action_mapping[(_Relationship.INITIATOR, 'Submitted', False)] = True
    action_mapping[(_Relationship.RESPONDENT, 'Submitted', False)] = True  # There's a client-side race
    action_mapping[(_Relationship.RESPONDENT, 'Accepted', False)] = True

    @staticmethod
    def user_can_sign(user, credit_trade):
        """Return true if this user can sign this trade in this status"""
        relationship = None

        if credit_trade.initiator.id == user.organization.id:
            relationship = SigningAuthorityConfirmationPermissions._Relationship.INITIATOR
        if credit_trade.respondent.id == user.organization.id:
            relationship = SigningAuthorityConfirmationPermissions._Relationship.RESPONDENT

        return SigningAuthorityConfirmationPermissions.action_mapping[(
            relationship,
            credit_trade.status.status,
            credit_trade.is_rescinded
        )]

    def has_permission(self, request, view):
        """Check permissions When an object does not yet exist (POST)"""

        if not request.user.has_perm('SIGN_CREDIT_TRANSFER'):
            return False

        if isinstance(request.data, list):
            to_check = request.data
        else:
            to_check = [request.data]

        if len(to_check) == 0:
            return False

        # Need this information to make a decision

        for obj in to_check:
            if 'credit_trade' in obj:
                credit_trade = obj['credit_trade']

                # Check if the user is a party to this credit_trade
                # (or Government) using CreditTradeService logic
                found = CreditTradeService.get_organization_credit_trades(
                    request.user.organization
                ).filter(id=credit_trade).first()

                if not found:
                    return False

                if not SigningAuthorityConfirmationPermissions.user_can_sign(
                        request.user,
                        found
                ):
                    return False
            elif 'compliance_report' in obj:
                # check that the compliance report does exist and the user can
                # sign it
                compliance_report = obj['compliance_report']

                found = ComplianceReport.objects.filter(
                    id=compliance_report,
                    organization=request.user.organization
                )

                if not found:
                    return False
            else:  # Neither credit trade or compliance report was provided
                return False

        return True
