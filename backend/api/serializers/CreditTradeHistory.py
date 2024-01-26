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
from rest_framework.fields import SerializerMethodField

from api.models.CreditTradeHistory import CreditTradeHistory
from api.serializers import UserMinSerializer

from .CreditTradeStatus import CreditTradeStatusSerializer, \
                               CreditTradeStatusMinSerializer
from .CreditTradeType import CreditTradeTypeSerializer
from .CreditTradeZeroReason import CreditTradeZeroReasonSerializer
from .Organization import OrganizationMinSerializer


class CreditTradeHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = CreditTradeHistory
        fields = ('id', 'credit_trade', 'user',
                  'respondent', 'status', 'type',
                  'number_of_credits', 'fair_market_value_per_credit',
                  'zero_reason', 'trade_effective_date', 'compliance_period',
                  'is_rescinded', 'date_of_written_agreement', 'category_d_selected')


class CreditTradeHistory2Serializer(serializers.ModelSerializer):
    status = CreditTradeStatusSerializer(read_only=True)
    initiator = OrganizationMinSerializer(read_only=True)
    respondent = OrganizationMinSerializer(read_only=True)
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
    """
    Credit History Serializer in perspective of the User
    - What was the Credit Trade associated with the entry
    - Which fuel supplier involved
    - Was it rescinded
    - What type of Credit Trade was it
    """
    fuel_supplier = serializers.SerializerMethodField()
    status_id = serializers.SerializerMethodField()
    type = CreditTradeTypeSerializer(read_only=True)

    class Meta:
        model = CreditTradeHistory
        fields = ('id', 'credit_trade_id', 'fuel_supplier', 'is_rescinded',
                  'status_id', 'type', 'credit_trade_update_timestamp')

    def get_fuel_supplier(self, obj):
        """
        Returns the fuel supplier of the opposite end to give more
        context for the credit trade
        """
        if obj.credit_trade.type.id in [1, 3, 5]:
            fuel_supplier = obj.credit_trade.initiator
        else:
            fuel_supplier = obj.credit_trade.respondent

        serializer = OrganizationMinSerializer(fuel_supplier, read_only=True)
        return serializer.data

    def get_status_id(self, obj):
        """
        Returns the status_id unless it's rescinded.
        This is to hide the review information from non-government users
        """
        if obj.is_rescinded is True:
            return None

        return obj.status_id


class CreditTradeHistoryReviewedSerializer(serializers.ModelSerializer):
    """
    Credit Trade History Serializer in perspective of the Credit Trade
    - Who signed the credit trade
    - What status was it updated to
    - Was the proposal rescinded
    """
    from .CreditTrade import CreditTradeMinSerializer
    from .Role import RoleMinSerializer

    credit_trade = CreditTradeMinSerializer(read_only=True)
    status = CreditTradeStatusMinSerializer(read_only=True)
    user = SerializerMethodField()
    user_role = RoleMinSerializer(read_only=True)

    def get_user(self, obj):
        serializer = UserMinSerializer(
            obj.user,
            read_only=True)

        return serializer.data

    class Meta:
        model = CreditTradeHistory
        fields = ('credit_trade', 'status', 'is_rescinded',
                  'create_timestamp', 'user', 'user_role',
                  'trade_effective_date')
