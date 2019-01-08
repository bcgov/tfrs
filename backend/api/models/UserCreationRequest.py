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

from django.db import models

from auditable.models import Auditable


class UserCreationRequest(Auditable):
    keycloak_email = models.EmailField(
        blank=False,
        null=False,
        unique=True,
        db_comment='Keycloak email address to associate on first login')

    user = models.OneToOneField(
        'User',
        related_name='creation_request',
        on_delete=models.PROTECT,
        unique=True,
        db_comment='The user to be associated with a Keycloak account'
    )

    is_mapped = models.BooleanField(
        default=False,
        db_comment='True if this request has been acted on')

    class Meta:
        db_table = 'user_creation_request'

    db_table_comment = 'Users who may access the application'
