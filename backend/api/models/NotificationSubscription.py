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

from api.models.NotificationChannel import NotificationChannel
from api.models.User import User
from api.notifications.notification_types import NotificationType
from auditable.models import Auditable


class NotificationSubscription(Auditable):
    """
    Notification Subscription
    """

    user = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        null=False,
        db_comment='The user subscribing to notifications on this channel'
    )

    notification_type = models.CharField(db_comment='The event that can trigger this notification',
                                         choices=[(d, d.value) for d in NotificationType],
                                         max_length=128,
                                         null=False,
                                         blank=False)

    channel = models.ForeignKey(
        NotificationChannel,
        on_delete=models.CASCADE,
        null=False
    )

    enabled = models.BooleanField(db_comment='Enable subscription',
                                  null=False)

    class Meta:
        db_table = 'notification_subscription'
        unique_together = ('user', 'channel', 'notification_type')

    db_table_comment = "Represents a user's subscription to notification events"
