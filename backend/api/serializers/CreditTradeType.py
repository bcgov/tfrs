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

from api.models.CreditTradeType import CreditTradeType


class CreditTradeTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CreditTradeType
        fields = (
            'id', 'the_type', 'description', 'effective_date',
            'expiration_date',
            'display_order', 'is_gov_only_type', 'notification_name')


class CreditTradeTypeMinSerializer(serializers.ModelSerializer):
    class Meta:
        model = CreditTradeType
        fields = ('id', 'the_type')
