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

from rest_framework import exceptions


def permission_required(permission):
    def wrapper(func):
        def wrapped(self, request, *args, **kwargs):
            if not request.user.has_perm(permission):
                raise exceptions.PermissionDenied(
                    'You do not have sufficient authorization to use this '
                    'functionality.'
                )

            return func(self, request, *args, **kwargs)
        return wrapped
    return wrapper
