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
from collections import defaultdict, namedtuple
from enum import Enum

from rest_framework import permissions


class ComplianceReportPermissions(permissions.BasePermission):
    """Used by Viewset to check permissions for API requests"""

    class _Relationship(Enum):
        FuelSupplier = "FUEL_SUPPLIER"
        GovernmentAnalyst = "ANALYST"
        GovernmentComplianceManager = "MANAGER"
        GovernmentDirector = "DIRECTOR"

    actions = []
    ActionMap = namedtuple('ActionMap', [
        'relationship',
        'fuel_supplier_status_regex',
        'analyst_status_regex',
        'manager_status_regex',
        'director_status_regex',
        'resulting_actions'
    ])

    actions.append(ActionMap(
        _Relationship.FuelSupplier,
        'Draft', '.*', '.*', '.*',
        lambda c: ['SUBMIT', 'DELETE']
    ))

    actions.append(ActionMap(
        _Relationship.FuelSupplier,
        'Submitted', '.*', '.*', '(Unreviewed|Accepted|Rejected)',
        lambda c: ['CREATE_SUPPLEMENTAL']
        if len(c.supplemental_reports.exclude(
            status__fuel_supplier_status="Deleted"
        ).all()) == 0 else []
    ))

    actions.append(ActionMap(
        _Relationship.GovernmentAnalyst, 'Submitted',
        '(Unreviewed|Returned|Retracted)', '.*', 'Unreviewed',
        lambda c: ['RECOMMEND', 'DISCOMMEND', 'REQUEST_SUPPLEMENTAL']
    ))

    actions.append(ActionMap(
        _Relationship.GovernmentAnalyst, 'Submitted',
        '(Recommended|Not Recommended)', 'Unreviewed', 'Unreviewed',
        lambda c: ['RETRACT', 'REQUEST_SUPPLEMENTAL']
    ))

    actions.append(ActionMap(
        _Relationship.GovernmentAnalyst, 'Submitted',
        '(Recommended|Not Recommended)', '(Recommended|Not Recommended)',
        '(Accepted|Unreviewed)',
        lambda c: ['REQUEST_SUPPLEMENTAL']
    ))

    actions.append(ActionMap(
        _Relationship.GovernmentComplianceManager, 'Submitted',
        'Unreviewed', 'Unreviewed', 'Unreviewed',
        lambda c: ['REQUEST_SUPPLEMENTAL']
    ))

    actions.append(ActionMap(
        _Relationship.GovernmentComplianceManager, 'Submitted',
        '(Recommended|Not Recommended)', '(Unreviewed|Returned|Retracted)',
        'Unreviewed',
        lambda c: ['RECOMMEND', 'DISCOMMEND', 'RETURN', 'REQUEST_SUPPLEMENTAL']
    ))

    actions.append(ActionMap(
        _Relationship.GovernmentComplianceManager, 'Submitted',
        '(Recommended|Not Recommended)', '(Recommended|Not Recommended)',
        'Unreviewed',
        lambda c: ['RETRACT', 'REQUEST_SUPPLEMENTAL']
    ))

    actions.append(ActionMap(
        _Relationship.GovernmentComplianceManager, 'Submitted',
        '(Recommended|Not Recommended)', '(Recommended|Not Recommended)',
        'Accepted',
        lambda c: ['REQUEST_SUPPLEMENTAL']
    ))

    actions.append(ActionMap(
        _Relationship.GovernmentDirector, 'Submitted',
        '(Recommended|Not Recommended)', '(Recommended|Not Recommended)',
        'Unreviewed',
        lambda c: ['ACCEPT', 'REJECT', 'RETURN']
    ))

    @staticmethod
    def get_relationship(compliance_report, user):
        is_government = user.organization.id == 1

        if compliance_report.organization.id == user.organization.id:
            return ComplianceReportPermissions._Relationship.FuelSupplier
        if is_government and user.has_perm(
                'ANALYST_RECOMMEND_ACCEPTANCE_COMPLIANCE_REPORT'
        ):
            return ComplianceReportPermissions._Relationship.GovernmentAnalyst
        if is_government and user.has_perm(
                'MANAGER_RECOMMEND_ACCEPTANCE_COMPLIANCE_REPORT'
        ):
            return ComplianceReportPermissions._Relationship.GovernmentComplianceManager
        if is_government and (
                user.has_perm('APPROVE_COMPLIANCE_REPORT') or
                user.has_perm('REJECT_COMPLIANCE_REPORT')
        ):
            return ComplianceReportPermissions._Relationship.GovernmentDirector

        return None

    @staticmethod
    def get_available_actions(compliance_report, relationship):
        for action in ComplianceReportPermissions.actions:
            if action.relationship != relationship:
                continue

            if not re.match(
                    action.fuel_supplier_status_regex,
                    compliance_report.status.fuel_supplier_status.status
            ):
                continue

            if not re.match(
                    action.analyst_status_regex,
                    compliance_report.status.analyst_status.status
            ):
                continue

            if not re.match(
                    action.manager_status_regex,
                    compliance_report.status.manager_status.status
            ):
                continue

            if not re.match(
                    action.director_status_regex,
                    compliance_report.status.director_status.status
            ):
                continue

            return action.resulting_actions(compliance_report)

        return []

    @staticmethod
    def user_can_change_status(
            user,
            compliance_report,
            new_fuel_supplier_status=None,
            new_analyst_status=None,
            new_manager_status=None,
            new_director_status=None
    ):
        """
        Check if a status change is possible.
        User by update serializer
        """
        oldstatus = compliance_report.status

        total_changes = 0
        if new_fuel_supplier_status is not None and \
                oldstatus.fuel_supplier_status.status != \
                new_fuel_supplier_status:
            total_changes += 1
        if new_analyst_status is not None and \
                oldstatus.analyst_status.status != new_analyst_status:
            total_changes += 1
        if new_manager_status is not None and \
                oldstatus.manager_status.status != new_manager_status:
            total_changes += 1
        if new_director_status is not None and \
                oldstatus.director_status.status != new_director_status:
            total_changes += 1

        if total_changes > 1:
            return False  # Can only change one at a time

        if total_changes == 0:
            return True  # Nothing changed

        relationship = ComplianceReportPermissions.get_relationship(
            compliance_report, user
        )

        if relationship == \
                ComplianceReportPermissions._Relationship.FuelSupplier:
            if oldstatus.fuel_supplier_status.status == 'Draft':
                return new_fuel_supplier_status in ['Deleted', 'Submitted']
            return False

        if relationship == \
                ComplianceReportPermissions._Relationship.GovernmentAnalyst:
            if oldstatus.fuel_supplier_status.status not in ['Submitted']:
                return False  # Not submitted
            # if either analyst or compliance manager requested supplemental
            # prevent further status change
            if oldstatus.analyst_status.status in ['Requested Supplemental'] \
                or oldstatus.manager_status.status in \
                    ['Requested Supplemental']:
                return False  # already requested supplemental
            if new_analyst_status == 'Requested Supplemental':
                return True
            if oldstatus.manager_status.status not in [
                    'Unreviewed', 'Returned'
            ]:
                return False  # Manager has reviewed it
            if oldstatus.analyst_status.status not in ['Unreviewed']:
                return False  # Already reviewed
            return new_analyst_status in [
                'Recommended', 'Not Recommended',
                'Requested Supplemental'
            ]

        if relationship == \
                ComplianceReportPermissions._Relationship.GovernmentComplianceManager:
            if oldstatus.fuel_supplier_status.status not in ['Submitted']:
                return False  # Not submitted
            # if either analyst or compliance manager requested supplemental
            # prevent further status change
            if oldstatus.analyst_status.status in ['Requested Supplemental'] \
                or oldstatus.manager_status.status in \
                    ['Requested Supplemental']:
                return False  # already requested supplemental
            if new_manager_status == 'Requested Supplemental':
                return True
            if oldstatus.director_status.status not in [
                    'Unreviewed', 'Returned'
            ]:
                return False  # Director has reviewed it
            if oldstatus.analyst_status.status in ['Unreviewed']:
                return False  # Analyst hasn't reviewed
            if oldstatus.manager_status.status not in ['Unreviewed']:
                return False  # Already reviewed
            return new_manager_status in [
                'Recommended', 'Not Recommended', 'Returned',
                'Requested Supplemental'
            ]

        if relationship == \
                ComplianceReportPermissions._Relationship.GovernmentDirector:
            if oldstatus.fuel_supplier_status.status not in ['Submitted']:
                return False  # Not submitted
            if oldstatus.analyst_status.status in ['Unreviewed']:
                return False  # Analyst hasn't reviewed
            if oldstatus.manager_status.status in ['Unreviewed']:
                return False  # Manager hasn't reviewed
            if oldstatus.director_status.status not in ['Unreviewed']:
                return False  # Already reviewed
            return new_director_status in ['Accepted', 'Rejected', 'Returned']

        return False

    def has_permission(self, request, view):
        """Check permissions When an object does not yet exist (POST, GET /)"""

        if request.user.is_government_user:
            return request.method not in ('POST',)

        return request.user.has_perm('COMPLIANCE_REPORT_MANAGE')

    def has_object_permission(self, request, view, obj):
        """Check permissions When an object does exist (PUT, GET)"""

        # Users can only update their own compliance reports
        if obj.organization == request.user.organization:
            return True

        if request.user.is_government_user:
            # Government users can see compliance reports
            if request.method in permissions.SAFE_METHODS:
                return True

            # Government users can manage compliance report statuses
            if request.user.has_perm(
                    'ANALYST_RECOMMEND_ACCEPTANCE_COMPLIANCE_REPORT'
            ) or request.user.has_perm(
                'ANALYST_RECOMMEND_REJECTION_COMPLIANCE_REPORT'
            ) or request.user.has_perm(
                'MANAGER_RECOMMEND_ACCEPTANCE_COMPLIANCE_REPORT'
            ) or request.user.has_perm(
                'MANAGER_RECOMMEND_REJECTION_COMPLIANCE_REPORT'
            ) or request.user.has_perm(
                'APPROVE_CREDIT_TRANSFER'  # Director
            ):
                return True

        return False
