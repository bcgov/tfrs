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
from rest_framework import serializers

from api.models.NotificationMessage import NotificationMessage
from .CreditTrade import CreditTradeMinSerializer
from .Organization import OrganizationMinSerializer
from .User import UserBasicSerializer


class NotificationMessageSerializer(serializers.ModelSerializer):
    """
    Default Serializer for Notification Message
    """
    originating_user = UserBasicSerializer(read_only=True)
    user = UserBasicSerializer(read_only=True)
    related_credit_trade = CreditTradeMinSerializer(read_only=True)
    related_organization = OrganizationMinSerializer(read_only=True)

    def __init__(self, *args, **kwargs):
        super(NotificationMessageSerializer, self).__init__(*args, **kwargs)

        # mark all fields except is_read as read_only
        for field_name in set(self.fields.keys()) - {'is_read'}:
            self.fields[field_name].read_only = True

    class Meta:
        model = NotificationMessage
        fields = '__all__'


class NotificationMessageUpdateSerializer(serializers.ModelSerializer):
    """
    Update Serializer for Notification Message
    """
    class Meta:
        model = NotificationMessage
        fields = '__all__'
