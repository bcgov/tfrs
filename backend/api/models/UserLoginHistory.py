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


class UserLoginHistory(Auditable):
    """
    Keeps track of all user login attempts.
    """
    keycloak_email = models.EmailField(
        blank=False,
        null=False,
        db_comment="Keycloak email address to associate on first login."
    )
    external_username = models.CharField(
        blank=True,
        max_length=150,
        null=True,
        db_comment="BCeID or IDIR username"
    )
    keycloak_user_id = models.CharField(
        max_length=150,
        blank=True,
        null=True,
        db_comment="This is the unique id returned from Keycloak and is the main" +
          " mapping key between the TFRS user and the Keycloak user. The identity" +
          " provider type will be appended as a suffix after an @ symbol. For ex." +
          " asdf1234@bceidbasic or asdf1234@idir"
    )
    is_login_successful = models.BooleanField(
        default=False,
        db_comment="True if this login attempt was successful, false on failure."
    )
    login_error_message = models.CharField(
        max_length=500, 
        blank=True, 
        null=True,
        db_comment='Error text on unsuccessful login attempt.')

    class Meta:
        db_table = 'user_login_history'

    db_table_comment = "Keeps track of all user login attempts"
