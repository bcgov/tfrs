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
from collections import defaultdict
from enum import Enum, auto

import pdb


class CreditTradeCommentActions(object):
    """
    Provide available commenting actions to simplify frontend presentation logic
    """

    class _Relationship(Enum):
        Initiator = auto()
        Respondent = auto()
        GovernmentAnalyst = auto()
        GovernmentDirector = auto()

    @staticmethod
    def available_comment_actions(request, trade):
        action_mapping = defaultdict(lambda: [])
        is_government = request.user.organization.id == 1

        action_mapping[('Draft', False, CreditTradeCommentActions._Relationship.Initiator)] \
            = ['ADD_COMMENT']

        action_mapping[('Recommended', True, CreditTradeCommentActions._Relationship.Initiator)] \
            = ['ADD_COMMENT']

        action_mapping[('Submitted', False, CreditTradeCommentActions._Relationship.Respondent)] \
            = ['ADD_COMMENT']

        action_mapping[('Accepted', False, CreditTradeCommentActions._Relationship.GovernmentAnalyst)] \
            = ['ADD_COMMENT', 'ADD_PRIVILEGED_COMMENT']
        action_mapping[('Recommended', False, CreditTradeCommentActions._Relationship.GovernmentAnalyst)] \
            = ['ADD_COMMENT', 'ADD_PRIVILEGED_COMMENT']
        action_mapping[('Not Recommended', False, CreditTradeCommentActions._Relationship.GovernmentAnalyst)] \
            = ['ADD_COMMENT', 'ADD_PRIVILEGED_COMMENT']

        action_mapping[('Recommended', False, CreditTradeCommentActions._Relationship.GovernmentDirector)] \
            = ['ADD_COMMENT', 'ADD_PRIVILEGED_COMMENT']
        action_mapping[('Not Recommended', False, CreditTradeCommentActions._Relationship.GovernmentDirector)] \
            = ['ADD_COMMENT', 'ADD_PRIVILEGED_COMMENT']

        if trade.initiator.id == request.user.organization.id:
            relationship = CreditTradeCommentActions._Relationship.Initiator
        if trade.respondent.id == request.user.organization.id:
            relationship = CreditTradeCommentActions._Relationship.Respondent
        if is_government and request.user.has_perm('RECOMMEND_CREDIT_TRANSFER'):
            relationship = CreditTradeCommentActions._Relationship.GovernmentAnalyst
        if is_government and (request.user.has_perm('APPROVE_CREDIT_TRANSFER')
                              or request.user.has_perm('DECLINE_CREDIT_TRANSFER')):
                relationship = CreditTradeCommentActions._Relationship.GovernmentDirector

        return action_mapping[(
            trade.status.status,
            trade.is_rescinded,
            relationship
            )]


