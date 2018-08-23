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

from api.models.User import User
from api.models.CreditTrade import CreditTrade
from api.models.Organization import Organization
from auditable.models import Auditable


class NotificationMessage(Auditable):
    """
    Notification Message
    """

    user = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        null=False,
        db_comment='The user receiving the notification'
    )

    related_organization = models.ForeignKey(
        Organization,
        on_delete=models.PROTECT,
        null=True)

    related_credit_trade = models.ForeignKey(
        CreditTrade,
        on_delete=models.PROTECT,
        null=True)

    related_user = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        related_name='notification_related_user',
        null=True)

    originating_user = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        null=True,
        related_name='notification_originating_user',
        db_comment='The (possibly NULL) user that caused this notification to be created'
    )

    message = models.CharField(
        null=False,
        blank=False,
        max_length=4000,
        db_comment="The text of the message"
    )

    is_read = models.BooleanField(
        default=False,
        null=False,
        db_comment="Flag. True if this message marked as having been read"
    )

    is_warning = models.BooleanField(
        default=False,
        null=False,
        db_comment="Flag. True if this conveys information about a warning"
    )

    is_error = models.BooleanField(
        default=False,
        null=False,
        db_comment="Flag. True if this conveys information about an error"
    )

    class Meta:
        db_table = 'notification_message'

    db_table_comment = "Represents a notification message sent to an application user"
