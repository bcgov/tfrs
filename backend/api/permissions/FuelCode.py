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


class FuelCodePermissions(permissions.BasePermission):
    """
    Used by Viewset to check permissions for API requests
    This check is made before has_object_permission
    If there's any permission check needed for POST, it has to be in here
    """

    def has_permission(self, request, view):
        if request.user.has_perm('FUEL_CODES_MANAGE'):
            return True

        if request.method != 'POST' and \
                request.user.has_perm('FUEL_CODES_VIEW'):
            return True

        return False

    def has_object_permission(self, request, view, obj):
        """
        Check permissions When an object does exist (GET, PUT, DELETE)
        POST is NOT included here
        """
        if request.method == 'GET' and \
                request.user.has_perm('FUEL_CODES_VIEW'):
            return True

        if request.user.has_perm('FUEL_CODES_MANAGE'):
            return True

        return False
