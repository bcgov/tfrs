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
from api.models import CreditTrade, CreditTradeComment
from api.permissions.CreditTradeComment import CreditTradeCommentPermissions


class CreditTradeCommentActions(object):
    """
    Provide available commenting actions to simplify frontend presentation logic
    """

    @staticmethod
    def available_comment_actions(request, trade: CreditTrade):
        available_actions = []

        if CreditTradeCommentPermissions.user_can_comment(request.user, trade, False):
            available_actions.append('ADD_COMMENT')

        if CreditTradeCommentPermissions.user_can_comment(request.user, trade, True):
            available_actions.append('ADD_PRIVILEGED_COMMENT')

        return available_actions

    @staticmethod
    def available_individual_comment_actions(request, comment: CreditTradeComment):
        available_actions = []

        if CreditTradeCommentPermissions.user_can_edit_comment(request.user, comment):
            available_actions = ['EDIT_COMMENT']

        return available_actions
