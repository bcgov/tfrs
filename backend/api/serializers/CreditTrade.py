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
from api.models.User import User
from api.services.CreditTradeActions import CreditTradeActions

from .CreditTradeComment import CreditTradeCommentSerializer
from .CreditTradeHistory import CreditTradeHistoryReviewedSerializer
from .CreditTradeStatus import CreditTradeStatusMinSerializer
from .CreditTradeType import CreditTradeTypeSerializer
from .CreditTradeZeroReason import CreditTradeZeroReasonSerializer
from .CompliancePeriod import CompliancePeriodSerializer
from .Organization import OrganizationMinSerializer
from .User import UserMinSerializer


class CreditTradeSerializer(serializers.ModelSerializer):
    """
    Default Serializer for Credit Trade
    """
    class Meta:
        model = CreditTrade
        fields = ('id', 'status', 'initiator', 'respondent',
                  'type', 'number_of_credits',
                  'fair_market_value_per_credit', 'zero_reason',
                  'trade_effective_date', 'compliance_period',
                  'is_rescinded')


class CreditTradeCreateSerializer(serializers.ModelSerializer):
    """
    Serializer used when creating a Credit Trade
    """
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

        credit_trade_type = data.get('type')

        if (data.get('fair_market_value_per_credit') == 0 and
                data.get('zero_reason') is None):
            allowed_types = list(
                CreditTradeType.objects
                .filter(the_type__in=[
                    "Credit Validation", "Credit Retirement", "Part 3 Award"
                ])
                .only('id')
            )

            if credit_trade_type not in allowed_types:
                raise serializers.ValidationError({
                    'zeroDollarReason': "Zero Dollar Reason is required "
                                        "for Credit Transfers with 0 "
                                        "Dollar per Credit"
                })

        # If the initiator is 'selling', make sure that the organization
        # has enough credits
        sell_type = CreditTradeType.objects.get(the_type="Sell")
        draft_propose_statuses = list(
            CreditTradeStatus.objects
            .filter(status__in=["Draft", "Submitted"])
            .only('id'))

        if credit_trade_type == sell_type and \
           data.get('initiator') == request.user.organization and \
           credit_trade_status in draft_propose_statuses:

            balance = request.user.organization.organization_balance[
                'validated_credits']

            if balance < data.get('number_of_credits'):
                raise serializers.ValidationError({
                    'insufficientCredits': "{} does not have enough credits "
                                           "for the proposal.".format(
                                               request.user.organization.name)
                })

        return data

    class Meta:
        model = CreditTrade
        fields = '__all__'


class CreditTradeListSerializer(serializers.ModelSerializer):
    """
    Serializer for Lists
    Should have less data being eager loaded compared to
    CreditTrade2Serializer, since we expect multiple records
    returned
    """
    compliance_period = CompliancePeriodSerializer(read_only=True)
    credits_from = OrganizationMinSerializer(read_only=True)
    credits_to = OrganizationMinSerializer(read_only=True)
    initiator = OrganizationMinSerializer(read_only=True)
    respondent = OrganizationMinSerializer(read_only=True)
    status = CreditTradeStatusMinSerializer(read_only=True)
    type = CreditTradeTypeSerializer(read_only=True)
    zero_reason = CreditTradeZeroReasonSerializer(read_only=True)

    class Meta:
        model = CreditTrade
        fields = ('id', 'compliance_period', 'credits_from', 'credits_to',
                  'fair_market_value_per_credit', 'initiator',
                  'is_rescinded', 'number_of_credits', 'respondent',
                  'status', 'total_value', 'trade_effective_date', 'type',
                  'update_timestamp', 'zero_reason')


class CreditTradeUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for Updating the Credit Trade
    """
    def validate(self, data):
        request = self.context['request']
        available_statuses = []

        if self.instance.is_rescinded:
            raise serializers.ValidationError({
                'readOnly': "Cannot update a transaction that's already "
                            "been rescinded."
            })

        if self.instance.status.status in [
                "Cancelled", "Completed", "Declined", "Refused"
        ]:
            raise serializers.ValidationError({
                'readOnly': "Cannot update a transaction that's already "
                            "been `{}`.".format(self.instance.status.status)
            })

        if 'status' in request.data:
            if self.instance.status.status == "Draft":
                if request.user.has_perm('PROPOSE_CREDIT_TRANSFER'):
                    available_statuses.append("Cancelled")
                    available_statuses.append("Draft")

            if request.user.has_perm('APPROVE_CREDIT_TRANSFER'):
                available_statuses.append("Approved")

            if request.user.has_perm('DECLINE_CREDIT_TRANSFER'):
                available_statuses.append("Declined")

            if request.user.has_perm('RECOMMEND_CREDIT_TRANSFER') and \
               self.instance.status.status == "Accepted":
                available_statuses.append("Recommended")
                available_statuses.append("Not Recommended")

            if request.user.has_perm('REFUSE_CREDIT_TRANSFER') and \
               self.instance.respondent == request.user.organization:
                available_statuses.append("Refused")

            if request.user.has_perm('SIGN_CREDIT_TRANSFER'):
                if self.instance.initiator == request.user.organization:
                    available_statuses.append("Submitted")

                if self.instance.respondent == request.user.organization:
                    available_statuses.append("Accepted")

            allowed_statuses = list(
                CreditTradeStatus.objects
                .filter(status__in=available_statuses)
                .only('id'))

            credit_trade_status = data.get('status')

            if credit_trade_status not in allowed_statuses:
                raise serializers.ValidationError({
                    'invalidStatus': "You do not have permission to set the "
                                     "status to `{}`.".format(
                                         credit_trade_status.status)
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
                                        "for Credit Transfers with 0 "
                                        "Dollar per Credit"
                })

        # If the type is a sell, make sure that the organization
        # selling has enough credits, before they try to save the draft
        # or propose
        # If the type is buy, make sure the organization the credit is
        # coming from has enough credits before they can accept the proposal
        balance = request.user.organization.organization_balance[
            'validated_credits']

        buy_sell_type = CreditTradeType.objects.filter(
            the_type__in=["Buy", "Sell"]
        ).only('id')

        if 'type' in data:
            credit_trade_type = data.get('type')
        else:
            credit_trade_type = self.instance.type

        if 'number_of_credits' in data:
            number_of_credits = data.get('number_of_credits')
        else:
            number_of_credits = self.instance.number_of_credits

        accepted_status = CreditTradeStatus.objects.get(status="Accepted")
        draft_propose_statuses = list(
            CreditTradeStatus.objects
            .filter(status__in=["Draft", "Submitted"])
            .only('id'))

        if credit_trade_type in buy_sell_type and balance < number_of_credits:
            if (self.instance.initiator == request.user.organization and
                    credit_trade_status in draft_propose_statuses) or \
                (self.instance.respondent == request.user.organization and
                 credit_trade_status == accepted_status):
                raise serializers.ValidationError({
                    'insufficientCredits': "{} does not have enough credits "
                                           "for the proposal.".format(
                                               request.user.organization.name)
                })

        return data

    class Meta:
        model = CreditTrade
        fields = '__all__'


class CreditTradeApproveSerializer(serializers.ModelSerializer):
    """
    Serializer for Approving the Credit Trade
    """
    def validate(self, data):
        request = self.context['request']

        if self.instance.is_rescinded:
            raise serializers.ValidationError({
                'readOnly': "Cannot approve a transaction that's already "
                            "been rescinded."
            })

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
                            'zero_reason')


class CreditTrade2Serializer(serializers.ModelSerializer):
    """
    Credit Trade Serializer with the eager loading
    """
    status = CreditTradeStatusMinSerializer(read_only=True)
    initiator = OrganizationMinSerializer(read_only=True)
    respondent = OrganizationMinSerializer(read_only=True)
    type = CreditTradeTypeSerializer(read_only=True)
    zero_reason = CreditTradeZeroReasonSerializer(read_only=True)
    credits_from = OrganizationMinSerializer(read_only=True)
    credits_to = OrganizationMinSerializer(read_only=True)
    actions = serializers.SerializerMethodField()
    comment_actions = serializers.SerializerMethodField()
    compliance_period = CompliancePeriodSerializer(read_only=True)
    comments = serializers.SerializerMethodField()
    reviewed = serializers.SerializerMethodField()
    signatures = serializers.SerializerMethodField()

    class Meta:
        model = CreditTrade
        fields = ('id', 'status', 'status_display',
                  'initiator', 'respondent',
                  'type', 'number_of_credits',
                  'fair_market_value_per_credit', 'total_value',
                  'zero_reason',
                  'trade_effective_date', 'credits_from', 'credits_to',
                  'update_timestamp', 'actions', 'comment_actions', 'note',
                  'compliance_period', 'comments', 'is_rescinded',
                  'signatures', 'reviewed')

    def get_actions(self, obj):
        """
        If the user doesn't have any roles assigned, treat as though the user
        doesn't have available permissions
        """
        cur_status = obj.status.status
        request = self.context.get('request')

        # If the user doesn't have any roles assigned, treat as though the user
        # doesn't have available permissions
        if request.user.role is None:
            return []

        if cur_status == "Draft":
            return CreditTradeActions.draft(request)

        elif cur_status == "Submitted":
            return CreditTradeActions.submitted(request, obj)

        elif cur_status == "Accepted":
            return CreditTradeActions.accepted(request)

        elif cur_status == "Recommended" or cur_status == "Not Recommended":
            return CreditTradeActions.reviewed(request)

        return []

    def get_comment_actions(self, obj):
        """Attach available commenting actions"""
        request = self.context.get('request')
        return CreditTradeCommentActions.available_comment_actions(request, obj)

    def get_comments(self, obj):
        request = self.context.get('request')

        # If the user doesn't have any roles assigned, treat as though the user
        # doesn't have available permissions
        if request.user.role is None:
            return []

        if request.user.has_perm('VIEW_PRIVILEGED_COMMENTS'):
            comments = obj.comments
        else:
            comments = obj.unprivileged_comments

        serializer = CreditTradeCommentSerializer(comments,
                                                  many=True)

        return serializer.data

    def get_reviewed(self, obj):
        serializer = CreditTradeHistoryReviewedSerializer(obj.reviewed)

        return serializer.data

    def get_signatures(self, obj):
        signatures = []
        for signature in obj.signatures:
            user = User.objects.get(id=signature['create_user_id'])
            serializer = UserMinSerializer(user, read_only=True)

            signatures.append({
                'user': serializer.data,
                'create_timestamp': signature['timestamp']
            })

        return signatures
