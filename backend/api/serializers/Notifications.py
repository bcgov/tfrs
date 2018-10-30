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


class NotificationMessageSerializer(serializers.ModelSerializer):
    """
    Default Serializer for Notification Message
    """
    originating_user = serializers.SerializerMethodField()
    user = serializers.SerializerMethodField()

    def __init__(self, *args, **kwargs):
        super(NotificationMessageSerializer, self).__init__(*args, **kwargs)

        # mark all fields except is_read as read_only
        for field_name in set(self.fields.keys()) - {'is_read'}:
            self.fields[field_name].read_only = True

    def get_originating_user(self, obj):
        """
        Returns the name of the user associated with the notification.
        Not using a serializer as we only need the id and the display name.
        """
        if obj.originating_user is None:
            return None

        return {
            "id": obj.originating_user.id,
            "first_name": obj.originating_user.first_name,
            "last_name": obj.originating_user.last_name
        }

    def get_user(self, obj):
        """
        Returns the name of the user associated with the notification.
        Not using a serializer as we only need the id and the display name.
        """
        return {
            "id": obj.user.id,
            "first_name": obj.user.first_name,
            "last_name": obj.user.last_name
        }

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
