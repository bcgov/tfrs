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

from api.models.CreditTrade import CreditTrade
from api.models.CreditTradeStatus import CreditTradeStatus
from api.models.CreditTradeType import CreditTradeType

from .CreditTradeStatus import CreditTradeStatusMinSerializer
from .CreditTradeType import CreditTradeTypeSerializer
from .CreditTradeZeroReason import CreditTradeZeroReasonSerializer
from .CompliancePeriod import CompliancePeriodSerializer
from .Organization import OrganizationSerializer


class CreditTradeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CreditTrade
        fields = ('id', 'status', 'initiator', 'respondent',
                  'type', 'number_of_credits',
                  'fair_market_value_per_credit', 'zero_reason',
                  'trade_effective_date', 'compliance_period')


class CreditTradeCreateSerializer(serializers.ModelSerializer):
    # internal users should be able to create a trade with any status
    def validate(self, data):
        if (self.context['request'].user.organization.id != 1):
            allowed_statuses = list(
                CreditTradeStatus.objects
                .filter(status__in=["Draft", "Submitted"])
                .only('id'))

            credit_trade_status = data.get('status')

            if credit_trade_status not in allowed_statuses:
                raise serializers.ValidationError({
                    'status': 'Status cannot be `{}` on create. '
                    'Use `Draft` or `Submitted` instead.'.format(
                        credit_trade_status.status
                    )})

        if (data.get('fair_market_value_per_credit') == 0 and
                data.get('zero_reason') is None):
            allowed_types = list(
                CreditTradeType.objects
                .filter(the_type__in=[
                    "Credit Validation", "Credit Retirement", "Part 3 Award"
                ])
                .only('id')
            )

            credit_trade_type = data.get('type')

            if credit_trade_type not in allowed_types:
                raise serializers.ValidationError({
                    'zeroDollarReason': 'Zero Dollar Reason is required '
                    'for Credit Transfers with 0 Dollar per Credit'
                })

        return data

    class Meta:
        model = CreditTrade
        fields = '__all__'


class CreditTradeUpdateSerializer(serializers.ModelSerializer):

    def validate(self, data):
        if (data.get('fair_market_value_per_credit') == 0 and
                data.get('zero_reason') is None):
            allowed_types = list(
                CreditTradeType.objects
                .filter(the_type__in=[
                    "Credit Validation", "Credit Retirement", "Part 3 Award"
                ])
                .only('id')
            )

            credit_trade_type = data.get('type')

            if credit_trade_type not in allowed_types:
                raise serializers.ValidationError({
                    'zeroDollarReason': 'Zero Dollar Reason is required '
                    'for Credit Transfers with 0 Dollar per Credit'
                })

        return data

    class Meta:
        model = CreditTrade
        fields = '__all__'


class CreditTradeApproveSerializer(serializers.ModelSerializer):
    class Meta:
        model = CreditTrade
        fields = ('id', 'trade_effective_date', 'note',)
        read_only_fields = ('status', 'number_of_credits',
                            'type',
                            'fair_market_value_per_credit',
                            'zero_reason',
                            )


class CreditTrade2Serializer(serializers.ModelSerializer):
    status = CreditTradeStatusMinSerializer(read_only=True)
    initiator = OrganizationSerializer(read_only=True)
    respondent = OrganizationSerializer(read_only=True)
    type = CreditTradeTypeSerializer(read_only=True)
    zero_reason = CreditTradeZeroReasonSerializer(read_only=True)
    credits_from = OrganizationSerializer(read_only=True)
    credits_to = OrganizationSerializer(read_only=True)
    actions = serializers.SerializerMethodField()
    compliance_period = CompliancePeriodSerializer(read_only=True)

    class Meta:
        model = CreditTrade
        fields = ('id', 'status', 'status_display',
                  'initiator', 'respondent',
                  'type', 'number_of_credits',
                  'fair_market_value_per_credit', 'total_value',
                  'zero_reason',
                  'trade_effective_date', 'credits_from', 'credits_to',
                  'update_timestamp', 'actions', 'note',
                  'compliance_period')

    def get_actions(self, obj):
        cur_status = obj.status.status
        # print self.context.get('request')
        request = self.context.get('request')
        permissions = request.user.user_role.permissions

        statuses = CreditTradeStatus.objects.all().only('id', 'status')
        status_dict = {s.status: s for s in statuses}

        available_statuses = []

        if cur_status == "Draft":
            available_statuses.append(status_dict["Draft"])

            if permissions.filter(permission__code='PROPOSE_CREDIT_TRANSFER'):
                available_statuses.append(status_dict["Submitted"])

        elif cur_status == "Submitted":
            # Allow Accepting of transfers that have been submitted
            if permissions.filter(permission__code='ACCEPT_TRANSFER'):
                available_statuses.append(status_dict["Accepted"])

            # Allow to rescind submitted transfer
            if permissions.filter(permission__code='RESCIND_CREDIT_TRANSFER'):
                available_statuses.append(status_dict["Cancelled"])

        elif cur_status == "Accepted":
            # Allow to recommend for approval for accepted transfer
            if permissions.filter(permission__code='RECOMMEND_TRANSFER'):
                available_statuses.append(status_dict["Recommended"])

            # Allow to rescind submitted transfer
            if permissions.filter(permission__code='RESCIND_CREDIT_TRANSFER'):
                available_statuses.append(status_dict["Cancelled"])

        elif cur_status == "Recommended":
            # Allow to approval for recommended transfer
            if permissions.filter(permission__code='APPROVE_TRANSFER'):
                available_statuses.append(status_dict["Approved"])
                available_statuses.append(status_dict["Declined"])

        serializer = CreditTradeStatusMinSerializer(available_statuses,
                                                    many=True)
        return serializer.data
