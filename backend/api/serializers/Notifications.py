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
from datetime import datetime

from django.forms.models import model_to_dict
from rest_framework import serializers

from api.models.CreditTrade import CreditTrade
from api.models.CreditTradeComment import CreditTradeComment
from api.models.CreditTradeStatus import CreditTradeStatus
from api.models.CreditTradeType import CreditTradeType
from api.models.CreditTradeZeroReason import CreditTradeZeroReason
from api.models.NotificationMessage import NotificationMessage
from api.models.User import User
from api.services.CreditTradeActions import CreditTradeActions
from api.services.CreditTradeCommentActions import CreditTradeCommentActions
from api.services.CreditTradeService import CreditTradeService

from .CreditTradeComment import CreditTradeCommentSerializer
from .CreditTradeStatus import CreditTradeStatusMinSerializer
from .CreditTradeType import CreditTradeTypeSerializer
from .CreditTradeZeroReason import CreditTradeZeroReasonSerializer
from .CompliancePeriod import CompliancePeriodSerializer
from .Organization import OrganizationMinSerializer
from .User import UserMinSerializer


class NotificationMessageSerializer(serializers.ModelSerializer):
    """
    Default Serializer for Notification Message
    """

    class Meta:
        model = NotificationMessage
        fields = '__all__'
