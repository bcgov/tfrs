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

from .CreditTradeComment import CreditTradeCommentSerializer
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
        read_only_fields = ('comments')


class CreditTradeCreateSerializer(serializers.ModelSerializer):
    def validate(self, data):
        request = self.context['request']

        available_statuses = []

        if request.user.has_perm('APPROVE_CREDIT_TRANSFER'):
            available_statuses.append('Approved')

        if request.user.has_perm('PROPOSE_CREDIT_TRANSFER'):
            available_statuses.append('Draft')

        if request.user.has_perm('SIGN_CREDIT_TRANSFER') and \
                data.get('initiator') == request.user.organization:
            available_statuses.append('Submitted')

        allowed_statuses = list(
            CreditTradeStatus.objects
                .filter(status__in=available_statuses)
                .only('id'))

        credit_trade_status = data.get('status')

        if credit_trade_status not in allowed_statuses:
            raise serializers.ValidationError({
                'invalidStatus': "You do not have permission to set statuses "
                                 "to `{}`.".format(credit_trade_status.status)
            })

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
                    'zeroDollarReason': "Zero Dollar Reason is required "
                                        "for Credit Transfers with 0 Dollar per Credit"
                })

        return data

    class Meta:
        model = CreditTrade
        fields = '__all__'


class CreditTradeUpdateSerializer(serializers.ModelSerializer):
    def validate(self, data):
        request = self.context['request']
        available_statuses = []

        if self.instance.status.status in [
            "Approved", "Cancelled", "Completed", "Declined", "Refused"
        ]:
            raise serializers.ValidationError({
                'readOnly': "Cannot update a transaction that's already "
                            "been `{}`.".format(self.instance.status.status)
            })

        if request.user.has_perm('APPROVE_CREDIT_TRANSFER'):
            available_statuses.append("Approved")

        if request.user.has_perm('DECLINE_CREDIT_TRANSFER'):
            available_statuses.append("Declined")

        if request.user.has_perm('PROPOSE_CREDIT_TRANSFER') and \
                self.instance.status.status == "Draft":
            available_statuses.append("Draft")

        if request.user.has_perm('RECOMMEND_CREDIT_TRANSFER') and \
                self.instance.status.status == "Accepted":
            available_statuses.append("Recommended")
            available_statuses.append("Not Recommended")

        if request.user.has_perm('REFUSE_CREDIT_TRANSFER') and \
<<<<<<< HEAD
           data.get('respondent') == request.user.organization:
            available_statuses.append("Refused")
=======
                data.get('respondent') == request.user.organization:
            available_statuses.append("Cancelled")
>>>>>>> Working on Credit Trade Permissions

        if request.user.has_perm('RESCIND_CREDIT_TRANSFER'):
            available_statuses.append("Cancelled")

        if request.user.has_perm('SIGN_CREDIT_TRANSFER'):
            if data.get('initiator') == request.user.organization:
                available_statuses.append("Submitted")

            if data.get('respondent') == request.user.organization:
                available_statuses.append("Accepted")

        allowed_statuses = list(
            CreditTradeStatus.objects
                .filter(status__in=available_statuses)
                .only('id'))

        credit_trade_status = data.get('status')

        if credit_trade_status not in allowed_statuses:
            raise serializers.ValidationError({
                'invalidStatus': "You do not have permission to set the "
                                 "status to `{}`.".format(credit_trade_status.status)
            })

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
    def validate(self, data):
        request = self.context['request']
        available_statuses = []

        if self.instance.status.status in [
            "Approved", "Cancelled", "Completed", "Declined"
        ]:
            raise serializers.ValidationError({
                'readOnly': "Cannot approve a transaction that's already "
                            "been `{}`.".format(self.instance.status.status)
            })

        if not request.user.has_perm('APPROVE_CREDIT_TRANSFER'):
            raise serializers.ValidationError({
                'invalidStatus': "You do not have permission approve "
                                 "transactions"
            })

        return data

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
    comments = serializers.SerializerMethodField()

    class Meta:
        model = CreditTrade
        fields = ('id', 'status', 'status_display',
                  'initiator', 'respondent',
                  'type', 'number_of_credits',
                  'fair_market_value_per_credit', 'total_value',
                  'zero_reason',
                  'trade_effective_date', 'credits_from', 'credits_to',
                  'update_timestamp', 'actions', 'note',
                  'compliance_period', 'comments')

    def get_actions(self, obj):
        cur_status = obj.status.status
        request = self.context.get('request')

        '''
        If the user doesn't have any roles assigned, treat as though the user
        doesn't have available permissions
        '''
        if request.user.role is None:
            return []

        available_statuses = []
        statuses = CreditTradeStatus.objects.all().only('id', 'status')
        status_dict = {s.status: s for s in statuses}

        if cur_status == "Draft":
            available_statuses.append(status_dict["Draft"])

            if request.user.has_perm('SIGN_CREDIT_TRANSFER'):
                available_statuses.append(status_dict["Submitted"])

        elif cur_status == "Submitted":
            # Allow to accept submitted transfers
            if request.user.has_perm('SIGN_CREDIT_TRANSFER'):
                available_statuses.append(status_dict["Accepted"])

            # Allow to rescind submitted transfers
            if request.user.has_perm('RESCIND_CREDIT_TRANSFER'):
                available_statuses.append(status_dict["Cancelled"])

            # Allow to refuse submitted transfers
            if request.user.has_perm('REFUSE_CREDIT_TRANSFER'):
                available_statuses.append(status_dict["Cancelled"])

        elif cur_status == "Accepted":
            # Allow to recommend for approval accepted transfers
            if request.user.has_perm('RECOMMEND_CREDIT_TRANSFER'):
                available_statuses.append(status_dict["Recommended"])

            # Allow to rescind submitted transfer
            if request.user.has_perm('RESCIND_CREDIT_TRANSFER'):
                available_statuses.append(status_dict["Cancelled"])

        elif cur_status == "Recommended" or cur_status == "Not Recommended":
            # Allow to approval for recommended/not recommended transfer
            if request.user.has_perm('APPROVE_CREDIT_TRANSFER'):
                available_statuses.append(status_dict["Approved"])

            # Allow to decline recommended transfers
            if request.user.has_perm('DECLINE_CREDIT_TRANSFER'):
                available_statuses.append(status_dict["Declined"])

        serializer = CreditTradeStatusMinSerializer(available_statuses,
                                                    many=True)
        return serializer.data

    def get_comments(self, obj):
        request = self.context.get('request')

        '''
        If the user doesn't have any roles assigned, treat as though the user
        doesn't have available permissions
        '''
        if request.user.role is None:
            return []

        if request.user.has_perm('APPROVE_CREDIT_TRANSFER'):
            comments = obj.comments
        else:
            comments = obj.unprivileged_comments

        serializer = CreditTradeCommentSerializer(comments,
                                                  many=True)

        return serializer.data
