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
from django.utils.timezone import now

from api.models.User import User
from db_comments.model_mixins import DBComments


class AutosavedFormData(models.Model, DBComments):
    """
    Autosaved Form Data from client app
    """

    user = models.ForeignKey(
        User,
        blank=False, null=False,
        on_delete=models.CASCADE,
        db_comment='The creating user'
    )

    key = models.CharField(
        'key',
        blank=False,
        null=False,
        max_length=256,
        db_comment='A uniquely-identifying key for this form and instance. A client-generated string composed of '
                   'entity name, API version, and instance identifier.'
    )

    data = models.TextField('data',
                            blank=False, null=True,
                            db_comment='The (probably JSON) persisted values')

    last_access = models.DateTimeField('last_access',
                                       blank=False, null=False,
                                       default=now,
                                       db_comment='When the field was last updated or read via the API'
                                                  ' (for cache expiration)')

    class Meta:
        db_table = 'autosaved_form_data'
        unique_together = ['user', 'key']

    db_table_comment = "Autosaved (potentially uncommitted) form data from " \
                       "the client-side React app. This table is a temporary store for the client " \
                       "to retain state for in-progress editing processes."
