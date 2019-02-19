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

from db_comments.model_mixins import DBComments


class Auditable(models.Model, DBComments):
    """
    Parent model class to provide timestamps and users involved
    in creating and updating the model
    """
    create_timestamp = models.DateTimeField(
        auto_now_add=True, blank=True, null=True,
        db_comment='Creation timestamp'
    )
    create_user = models.ForeignKey(
        'User',
        related_name='%(app_label)s_%(class)s_CREATE_USER',
        blank=True, null=True,
        on_delete=models.CASCADE,
        db_comment='creating user'
    )
    update_timestamp = models.DateTimeField(
        auto_now=True, blank=True, null=True,
        db_comment='Last updated/saved timestamp'
    )
    update_user = models.ForeignKey(
        'User',
        related_name='%(app_label)s_%(class)s_UPDATE_USER',
        blank=True, null=True,
        on_delete=models.CASCADE,
        db_comment='last updating user'
    )

    # Supplemental mapping for base class
    db_column_supplemental_comments = {
        'id': 'Primary key'
    }

    class Meta:
        abstract = True
