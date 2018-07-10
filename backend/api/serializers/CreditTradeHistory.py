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

from api.models.CreditTradeHistory import CreditTradeHistory

from .CreditTradeStatus import CreditTradeStatusSerializer, \
                               CreditTradeStatusMinSerializer
from .CreditTradeType import CreditTradeTypeSerializer
from .CreditTradeZeroReason import CreditTradeZeroReasonSerializer
from .Organization import OrganizationSerializer, OrganizationMinSerializer


class CreditTradeHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = CreditTradeHistory
        fields = ('id', 'credit_trade', 'user', 'credit_trade_update_time',
                  'respondent', 'status', 'type',
                  'number_of_credits', 'fair_market_value_per_credit',
                  'zero_reason', 'trade_effective_date',
                  'note', 'is_internal_history_record', 'compliance_period',
                  'is_rescinded')


class CreditTradeHistory2Serializer(serializers.ModelSerializer):
    status = CreditTradeStatusSerializer(read_only=True)
    initiator = OrganizationSerializer(read_only=True)
    respondent = OrganizationSerializer(read_only=True)
    type = CreditTradeTypeSerializer(read_only=True)
    zero_reason = CreditTradeZeroReasonSerializer(read_only=True)

    class Meta:
        model = CreditTradeHistory
        fields = '__all__'


class CreditTradeHistoryCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CreditTradeHistory
        fields = '__all__'


class CreditTradeHistoryMinSerializer(serializers.ModelSerializer):
    fuel_supplier = serializers.SerializerMethodField()
    status_id = serializers.SerializerMethodField()
    type = CreditTradeTypeSerializer(read_only=True)

    class Meta:
        model = CreditTradeHistory
        fields = ('id', 'credit_trade_id', 'fuel_supplier', 'is_rescinded',
                  'status_id', 'type', 'credit_trade_update_time')

    def get_fuel_supplier(self, obj):
        """
        Returns the fuel supplier of the opposite end to give more
        context for the credit trade
        """
        if obj.credit_trade.type.id in [1, 3, 5]:
            return obj.credit_trade.initiator.name

        return obj.credit_trade.respondent.name

    def get_status_id(self, obj):
        if obj.is_rescinded is True:
            return None

        return obj.status_id


class CreditTradeHistoryReviewedSerializer(serializers.ModelSerializer):
    from .User import UserMinSerializer

    status = CreditTradeStatusMinSerializer(read_only=True)
    user = UserMinSerializer(read_only=True)

    class Meta:
        model = CreditTradeHistory
        fields = ('credit_trade', 'user', 'status', 'is_rescinded',
                  'credit_trade_update_time')
