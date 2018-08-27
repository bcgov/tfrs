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
from enum import Enum

from django.db import models

from auditable.models import Auditable


class NotificationChannel(Auditable):
    """A channel for communicating notifications"""

    class AvailableChannels(Enum):
        IN_APP = "In-Application"
        SMS = "SMS"
        EMAIL = "Email"

    channel = models.CharField(db_comment='The unique channel ID (delivery-mode) for this subscription',
                               choices=[(d, d.name) for d in AvailableChannels],
                               max_length=64,
                               null=False,
                               blank=False,
                               unique=True)

    enabled = models.BooleanField(db_comment='Enable delivery',
                                  null=False)

    subscribe_by_default = models.BooleanField(db_comment='Flag. Should a notification be dispatched on this '
                                                          'channel if the user does not have a subscription record?',
                                               null=False)

    class Meta:
        db_table = 'notification_channel'

    db_table_comment = "Tracks the state and defaults for communication channels"
