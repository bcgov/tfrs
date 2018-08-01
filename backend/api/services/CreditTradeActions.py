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
from api.models.CreditTradeStatus import CreditTradeStatus

from api.serializers.CreditTradeStatus import CreditTradeStatusMinSerializer


class CreditTradeActions(object):
    """
    Service Function to abstract the action builder for the
    Credit Trade Serializer
    """
    __statuses = CreditTradeStatus.objects.all().only('id', 'status')

    @staticmethod
    def draft(request, credit_trade):
        """
        When the status is draft
        available actions should be:
        saving the credit transfer into a draft
        and if the user has enough permission,
        sign the credit transfer
        """
        status_dict = {s.status: s for s in CreditTradeActions.__statuses}

        available_statuses = []
        if request.user.has_perm('PROPOSE_CREDIT_TRANSFER'):
            available_statuses.append(
                status_dict["Draft"]
            )

        if request.user.has_perm('SIGN_CREDIT_TRANSFER'):
            available_statuses.append(
                status_dict["Submitted"]
            )

        if request.user.has_perm('RECOMMEND_CREDIT_TRANSFER') and \
                credit_trade.type.the_type in [
                        "Credit Validation",
                        "Credit Retirement",
                        "Part 3 Award"
                ]:
            available_statuses.append(
                status_dict["Recommended"]
            )

        serializer = CreditTradeStatusMinSerializer(
            available_statuses, many=True)
        return serializer.data

    @staticmethod
    def submitted(request, credit_trade):
        """
        When the status is submitted (proposed)
        available actions should be:
        signing the credit transfer to accept,
        refusing the credit transfer if the user is the respondent,
        or rescinding the credit transfer if the user is the initiator
        (provided the user has the right permissions)
        """
        status_dict = {s.status: s for s in CreditTradeActions.__statuses}

        available_statuses = []
        if request.user.has_perm('SIGN_CREDIT_TRANSFER'):
            available_statuses.append(
                status_dict["Accepted"]
            )

        if credit_trade.initiator == request.user.organization:
            if request.user.has_perm('RESCIND_CREDIT_TRANSFER'):
                available_statuses.append(
                    status_dict["Cancelled"]
                )
        else:
            if request.user.has_perm('REFUSE_CREDIT_TRANSFER'):
                available_statuses.append(
                    status_dict["Refused"]
                )

        serializer = CreditTradeStatusMinSerializer(
            available_statuses, many=True)
        return serializer.data

    @staticmethod
    def accepted(request):
        """
        When the status is accepted
        available actions should be:
        recommending the credit transfer for approval
        and rescinding the credit transfer
        (provided the user has the right permissions)
        """
        status_dict = {s.status: s for s in CreditTradeActions.__statuses}

        available_statuses = []
        if request.user.has_perm('RECOMMEND_CREDIT_TRANSFER'):
            available_statuses.append(
                status_dict["Recommended"]
            )

        if request.user.has_perm('RESCIND_CREDIT_TRANSFER'):
            available_statuses.append(
                status_dict["Cancelled"]
            )

        serializer = CreditTradeStatusMinSerializer(
            available_statuses, many=True)
        return serializer.data

    @staticmethod
    def reviewed(request):
        """
        When the status is recommended or not recommended
        available actions should be:
        approving the credit transfer,
        declining the credit transfer
        and rescinding the credit transfer
        (provided the user has the right permissions)
        """
        status_dict = {s.status: s for s in CreditTradeActions.__statuses}

        available_statuses = []
        if request.user.has_perm('APPROVE_CREDIT_TRANSFER'):
            available_statuses.append(
                status_dict["Approved"]
            )

        if request.user.has_perm('DECLINE_CREDIT_TRANSFER'):
            available_statuses.append(
                status_dict["Declined"]
            )

        if request.user.has_perm('RESCIND_CREDIT_TRANSFER'):
            available_statuses.append(
                status_dict["Cancelled"]
            )

        serializer = CreditTradeStatusMinSerializer(
            available_statuses, many=True)
        return serializer.data
