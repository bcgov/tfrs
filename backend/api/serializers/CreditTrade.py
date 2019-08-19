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

from rest_framework import serializers
from rest_framework.relations import PrimaryKeyRelatedField

from api.models.CreditTrade import CreditTrade
from api.models.CreditTradeComment import CreditTradeComment
from api.models.CreditTradeStatus import CreditTradeStatus
from api.models.CreditTradeType import CreditTradeType
from api.models.CreditTradeZeroReason import CreditTradeZeroReason
from api.models.User import User
from api.serializers.DocumentCreditTrade import DocumentAuxiliarySerializer
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


class CreditTradeCreateSerializer(serializers.ModelSerializer):
    """
    Serializer used when creating a Credit Trade
    """
    def validate(self, data):
        request = self.context['request']

        # no user should be allowed to create a rescinded proposal
        if data.get('is_rescinded') is True:
            raise serializers.ValidationError({
                'invalidStatus': "You cannot create a rescinded proposal"
            })

        # if the user creating the proposal is not the initiator.
        # they should be a government user
        if data.get('initiator') != request.user.organization and \
                not request.user.is_government_user:
            raise serializers.ValidationError({
                'invalidStatus': "You cannot create a proposal for another "
                                 "organization."
            })

        available_statuses = []

        if request.user.has_perm('APPROVE_CREDIT_TRANSFER') or \
                request.user.has_perm('USE_HISTORICAL_DATA_ENTRY'):
            available_statuses.append('Recorded')

        if request.user.has_perm('PROPOSE_CREDIT_TRANSFER'):
            available_statuses.append('Draft')

        if request.user.has_perm('RECOMMEND_CREDIT_TRANSFER'):
            available_statuses.append('Recommended')

        if request.user.has_perm('SIGN_CREDIT_TRANSFER') and \
                data.get('initiator') == request.user.organization:
            available_statuses.append('Submitted')

        allowed_statuses = list(
            CreditTradeStatus.objects.filter(
                status__in=available_statuses).only('id'))

        credit_trade_status = data.get('status')

        will_create_a_comment = (True if 'comment' in data and
                                 data['comment'] is not None and
                                 len(data['comment'].strip()) > 0
                                 else False)

        if credit_trade_status.id == \
                CreditTradeStatus.objects.get(status='Submitted').id:
            zero_reason = data.get('zero_reason')

            if zero_reason is not None and \
                    zero_reason in CreditTradeZeroReason.objects.filter(
                            reason='Other'):
                if not will_create_a_comment:
                    raise serializers.ValidationError({
                        'forbidden': "Please provide an explanation in the "
                                     "comments as to why the Credit Transfer "
                                     "Proposal has a fair market value of zero "
                                     "dollars per credit."
                    })

        if credit_trade_status not in allowed_statuses:
            raise serializers.ValidationError({
                'invalidStatus': "You do not have permission to set statuses "
                                 "to `{}`.".format(credit_trade_status.status)
            })

        credit_trade_type = data.get('type')

        if (data.get('fair_market_value_per_credit') == 0 and
                data.get('zero_reason') is None):

            allowed_types = list(
                CreditTradeType.objects.filter(
                    the_type__in=[
                        "Credit Validation",
                        "Credit Reduction",
                        "Part 3 Award"
                    ]
                ).only('id')
            )

            if credit_trade_type not in allowed_types:
                raise serializers.ValidationError({
                    'zeroDollarReason': "Please select a reason as to "
                                        "why the Credit Transfer Proposal "
                                        "has a fair market value of zero "
                                        "dollars per credit. "
                })

        if data.get('fair_market_value_per_credit') is not None and \
                data.get('fair_market_value_per_credit') > 0 and \
                data.get('zero_reason') is not None:
            raise serializers.ValidationError(
                {'zeroDollarReason': "Zero dollar reason supplied but this "
                                     "trade has a non-zero value-per-credit"})

        # If the initiator is 'selling', make sure that the organization
        # has enough credits
        sell_type = CreditTradeType.objects.get(the_type="Sell")
        draft_propose_statuses = list(
            CreditTradeStatus.objects.filter(
                status__in=["Draft", "Submitted"]).only('id'))

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

    def save(self, **kwargs):
        super().save(**kwargs)

        request = self.context['request']

        if 'comment' in self.validated_data \
                and self.validated_data['comment'] is not None\
                and len(self.validated_data['comment'].strip()) > 0:
            comment = CreditTradeComment(
                credit_trade=self.instance,
                comment=self.validated_data['comment'],
                create_user=request.user,
                update_user=request.user,
                create_timestamp=datetime.now(),
                privileged_access=False
            )
            comment.save()

        return self.instance

    class Meta:
        model = CreditTrade
        fields = ('id', 'status', 'initiator', 'respondent', 'type',
                  'number_of_credits', 'fair_market_value_per_credit',
                  'total_value', 'zero_reason', 'trade_effective_date',
                  'update_timestamp', 'create_user', 'update_user',
                  'compliance_period', 'is_rescinded', 'comment')
        extra_kwargs = {
            'compliance_period': {
                'error_messages': {
                    'does_not_exist': "Please specify the Compliance Period "
                                      "in which the transaction relates."
                }
            },
            'fair_market_value_per_credit': {
                'error_messages': {
                    'invalid': "Please enter a valid value per credit."
                }
            },
            'number_of_credits': {
                'error_messages': {
                    'null': "Number of Credits can't be null.",
                    'invalid': "Please enter at least 1 credit."
                }
            },
            'respondent': {
                'error_messages': {
                    'does_not_exist': "Please specify the company involved in "
                                      "the transaction."
                }
            }
        }

    comment = serializers.CharField(
        max_length=4000, allow_null=True, allow_blank=True, required=False)


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
    status = serializers.SerializerMethodField()
    type = CreditTradeTypeSerializer(read_only=True)
    zero_reason = CreditTradeZeroReasonSerializer(read_only=True)

    def get_status(self, obj):
        """
        Should just return the status, but with an exception for
        non-government users when the status is Recommended or
        Not Recommended
        """
        request = self.context.get('request')

        if ((obj.status.status == 'Recommended' or
             obj.status.status == 'Not Recommended') and
                not request.user.is_government_user):
            accepted = CreditTradeStatus.objects.get(status="Accepted")

            return {
                'id': accepted.id,
                'status': accepted.status
            }

        serializer = CreditTradeStatusMinSerializer(
            obj.status,
            read_only=True)

        return serializer.data

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
    def __init__(self, *args, **kwargs):
        """
        This is to always ensure that we have a status for the credit
        transfer
        """
        super(CreditTradeUpdateSerializer, self).__init__(*args, **kwargs)
        data = kwargs.get('data')

        if 'status' not in data:
            data['status'] = self.instance.status.id

    def validate(self, data):
        """
        Makes sure that the status the credit trade is being updated to
        is valid.
        There are certain states that should lock a credit trade from being
        modified.
        """
        request = self.context['request']
        available_statuses = []

        if self.instance.is_rescinded:
            raise serializers.ValidationError({
                'readOnly': "Cannot update a transaction that's already "
                            "been rescinded."
            })

        if self.instance.status.status in [
                "Approved", "Cancelled", "Declined", "Refused"
        ]:
            raise serializers.ValidationError({
                'readOnly': "Cannot update a transaction that's already "
                            "been `{}`.".format(self.instance.status.status)
            })

        # if the user is the respondent, they really shouldn't be modifying
        # other fields. So reset those to be sure that they weren't changed
        if self.instance.respondent == request.user.organization:
            orig_data = data
            data = {
                'compliance_period': self.instance.compliance_period,
                'fair_market_value_per_credit':
                    self.instance.fair_market_value_per_credit,
                'initiator': self.instance.initiator,
                'is_rescinded': bool(data.get('is_rescinded')),
                'number_of_credits': self.instance.number_of_credits,
                'respondent': self.instance.respondent,
                'status': data.get('status'),
                'type': self.instance.type,
                'update_user': request.user,
                'zero_reason': self.instance.zero_reason
            }

            # Preserve the comment, if they are making one
            if 'comment' in orig_data:
                data['comment'] = orig_data['comment']

        # if status is being modified, make sure the next state is valid
        if 'status' in request.data:
            credit_trade_status = data.get('status')

            if not data.get('is_rescinded') is True:
                available_statuses = CreditTradeService.get_allowed_statuses(
                    self.instance, request)

                allowed_statuses = list(
                    CreditTradeStatus.objects.filter(
                        status__in=available_statuses).only('id'))

                if credit_trade_status not in allowed_statuses:
                    raise serializers.ValidationError({
                        'invalidStatus': "You do not have permission to set "
                                         "the status to `{}`.".format(
                                             credit_trade_status.status)
                    })

            if (credit_trade_status != self.instance.status and
                    data.get('is_rescinded') is True):
                raise serializers.ValidationError({
                    'invalidStatus': "Cannot update status and rescind at the "
                                     "same time."
                })

            will_create_a_comment = True if 'comment' in data \
                and data['comment'] is not None \
                and len(data['comment'].strip()) > 0 else False

            if credit_trade_status.status == 'Submitted':
                zero_reason = data.get('zero_reason')
                if zero_reason is not None and zero_reason.reason == 'Other':
                    if not (will_create_a_comment or
                            CreditTradeComment.objects.filter(
                                credit_trade_id=self.instance.id,
                                create_user__organization=request.user.organization
                            ).exists()):
                        raise serializers.ValidationError({
                            'forbidden': "Please provide an explanation in "
                                         "the comments as to why the Credit "
                                         "Transfer Proposal has a fair market "
                                         "value of zero dollars per credit."
                        })

        if data.get('is_rescinded') is True:
            if request.user.organization not in [self.instance.initiator,
                                                 self.instance.respondent]:
                raise serializers.ValidationError({
                    'forbidden': "Cannot rescind unless organization is part "
                                 "of the proposal."
                })

            if self.instance.status.status == 'Draft':
                raise serializers.ValidationError({
                    'forbidden': "Cannot rescind a draft"
                })

            if (self.instance.status.status == 'Submitted' and
                    self.instance.respondent == request.user.organization):
                raise serializers.ValidationError({
                    'forbidden': "Cannot rescind a proposed trade when you're "
                                 " the respondent"
                })

        if data.get('fair_market_value_per_credit') is not None and \
                data.get('fair_market_value_per_credit') > 0 and \
                data.get('zero_reason') is not None:
            raise serializers.ValidationError(
                {'zeroDollarReason': "Zero dollar reason supplied but this "
                                     "trade has a non-zero value-per-credit"})

        if data.get('fair_market_value_per_credit') == 0 and \
                data.get('zero_reason') is None:
            allowed_types = list(CreditTradeType.objects.filter(the_type__in=[
                "Credit Validation", "Credit Reduction", "Part 3 Award"
            ]).only('id'))

            credit_trade_type = data.get('type')

            if credit_trade_type not in allowed_types:
                raise serializers.ValidationError({
                    'zeroDollarReason': "Please select a reason as to "
                                        "why the Credit Transfer Proposal "
                                        "has a fair market value of zero "
                                        "dollars per credit. "
                })

        # If the type is a sell, make sure that the organization
        # selling has enough credits, before they try to save the draft
        # or propose
        # If the type is buy, make sure the organization the credit is
        # coming from has enough credits before they can accept the proposal
        balance = request.user.organization.organization_balance[
            'validated_credits']

        buy_type = CreditTradeType.objects.get(
            the_type="Buy"
        )

        sell_type = CreditTradeType.objects.get(
            the_type="Sell"
        )

        if 'type' in data:
            credit_trade_type = data.get('type')
        else:
            credit_trade_type = self.instance.type

        if 'number_of_credits' in data:
            number_of_credits = data.get('number_of_credits')
        else:
            number_of_credits = self.instance.number_of_credits

        previous_state = CreditTrade.objects.get(id=self.instance.id)

        if 'comment' in data and data['comment'] is not None and \
                len(data['comment'].strip()) > 0:
            if 'ADD_COMMENT' not in CreditTradeCommentActions.\
                    available_comment_actions(request, previous_state):
                raise serializers.ValidationError(
                    "Cannot add a comment in this state")

        accepted_status = CreditTradeStatus.objects.get(status="Accepted")
        draft_propose_statuses = list(
            CreditTradeStatus.objects.filter(
                status__in=["Draft", "Submitted"]
            ).only('id')
        )

        if (self.instance.initiator == request.user.organization and
                credit_trade_status in draft_propose_statuses and
                credit_trade_type == sell_type) or \
            (self.instance.respondent == request.user.organization and
             credit_trade_status == accepted_status and
             credit_trade_type == buy_type):
            if balance < number_of_credits:
                raise serializers.ValidationError({
                    'insufficientCredits': "{} does not have enough credits "
                                           "for the proposal.".format(
                                               request.user.organization.name)
                })

        return data

    def save(self, **kwargs):
        super().save(**kwargs)

        request = self.context['request']

        if 'comment' in self.validated_data \
                and self.validated_data['comment'] is not None \
                and len(self.validated_data['comment'].strip()) > 0:
            comment = CreditTradeComment(
                credit_trade=self.instance,
                comment=self.validated_data['comment'],
                create_user=request.user,
                update_user=request.user,
                create_timestamp=datetime.now(),
                privileged_access=False
            )
            comment.save()

        return self.instance

    class Meta:
        model = CreditTrade
        fields = ('id', 'status',
                  'initiator', 'respondent',
                  'type', 'number_of_credits',
                  'fair_market_value_per_credit', 'total_value',
                  'zero_reason',
                  'trade_effective_date',
                  'update_timestamp',
                  'create_user', 'update_user',
                  'compliance_period', 'is_rescinded', 'comment')
        extra_kwargs = {
            'compliance_period': {
                'error_messages': {
                    'does_not_exist': "Please specify the Compliance Period "
                                      "in which the transaction relates."
                }
            },
            'fair_market_value_per_credit': {
                'error_messages': {
                    'invalid': "Please enter a valid value per credit."
                }
            },
            'number_of_credits': {
                'error_messages': {
                    'null': "Number of Credits can't be null.",
                    'invalid': "Please enter at least 1 credit."
                }
            },
            'respondent': {
                'error_messages': {
                    'does_not_exist': "Please specify the company involved in "
                                      "the transaction."
                }
            }
        }

    comment = serializers.CharField(
        max_length=4000, allow_null=True, allow_blank=True, required=False)


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
                "Approved", "Cancelled", "Declined", "Recorded"
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
        fields = ('id', 'trade_effective_date',)
        read_only_fields = ('status', 'number_of_credits',
                            'type',
                            'fair_market_value_per_credit',
                            'zero_reason')


class CreditTrade2Serializer(serializers.ModelSerializer):

    """
    Credit Trade Serializer with the eager loading
    """
    status = serializers.SerializerMethodField()
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
    history = serializers.SerializerMethodField()
    signatures = serializers.SerializerMethodField()
    documents = DocumentAuxiliarySerializer(many=True, read_only=True)

    class Meta:
        model = CreditTrade
        fields = ('id', 'status',
                  'initiator', 'respondent', 'documents',
                  'type', 'number_of_credits',
                  'fair_market_value_per_credit', 'total_value',
                  'zero_reason',
                  'trade_effective_date', 'credits_from', 'credits_to',
                  'update_timestamp', 'actions', 'comment_actions',
                  'compliance_period', 'comments', 'is_rescinded',
                  'signatures', 'history')

    def get_actions(self, obj):
        """
        If the user doesn't have any roles assigned, treat as though the user
        doesn't have available permissions
        """
        cur_status = obj.status.status
        request = self.context.get('request')

        # If the user doesn't have any roles assigned, treat as though the user
        # doesn't have available permissions
        if not request.user.roles:
            return []

        if cur_status == "Draft":
            return CreditTradeActions.draft(request, obj)

        if cur_status == "Submitted":
            return CreditTradeActions.submitted(request, obj)

        if cur_status == "Accepted":
            return CreditTradeActions.accepted(request)

        if cur_status in ["Recommended", "Not Recommended"]:
            return CreditTradeActions.reviewed(request, obj)

        return []

    def get_comment_actions(self, obj):
        """Attach available commenting actions"""
        request = self.context.get('request')
        return CreditTradeCommentActions.available_comment_actions(request, obj)

    def get_comments(self, obj):
        """
        Returns all the attached comments for the credit trade
        """
        request = self.context.get('request')

        # If the user doesn't have any roles assigned, treat as though the user
        # doesn't have available permissions
        if not request.user.roles:
            return []

        if request.user.has_perm('VIEW_PRIVILEGED_COMMENTS'):
            comments = obj.comments
        else:
            comments = obj.unprivileged_comments

        serializer = CreditTradeCommentSerializer(comments,
                                                  many=True,
                                                  context={'request': request})

        return serializer.data

    def get_history(self, obj):
        """
        Returns all the previous status changes for the credit trade
        """
        from .CreditTradeHistory import CreditTradeHistoryReviewedSerializer
        request = self.context.get('request')

        # if the user is not a government user we should limit what we show
        # so no recommended/not recommended
        if not request.user.is_government_user:
            history = obj.get_history(["Accepted", "Approved", "Declined",
                                       "Refused", "Submitted"])
        else:
            history = obj.get_history(["Accepted", "Approved", "Declined",
                                       "Not Recommended", "Recommended",
                                       "Recorded", "Refused", "Submitted"])

        serializer = CreditTradeHistoryReviewedSerializer(history,
                                                          many=True)

        return serializer.data

    def get_signatures(self, obj):
        """
        Returns all the users that have signed the credit trade
        """
        signatures = []

        for signature in obj.signatures:
            user = User.objects.get(id=signature['create_user_id'])
            serializer = UserMinSerializer(user, read_only=True)

            signatures.append({
                'user': serializer.data,
                'create_timestamp': signature['timestamp']
            })

        return signatures

    def get_status(self, obj):
        """
        Should just return the status, but with an exception for
        non-government users when the status is Recommended or
        Not Recommended
        """
        request = self.context.get('request')

        if obj.status.status in ["Recommended", "Not Recommended"] and \
                not request.user.is_government_user:
            accepted = CreditTradeStatus.objects.get(status="Accepted")

            return {
                'id': accepted.id,
                'status': accepted.status
            }

        serializer = CreditTradeStatusMinSerializer(
            obj.status,
            read_only=True)

        return serializer.data


class CreditTradeMinSerializer(serializers.ModelSerializer):
    """
    Credit Trade Serializer with just the basic information
    """
    status = CreditTradeStatusMinSerializer(read_only=True)
    initiator = OrganizationMinSerializer(read_only=True)
    respondent = OrganizationMinSerializer(read_only=True)
    type = CreditTradeTypeSerializer(read_only=True)

    class Meta:
        model = CreditTrade
        fields = ('id', 'status', 'initiator', 'respondent', 'type',
                  'number_of_credits', 'fair_market_value_per_credit',
                  'is_rescinded')
