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

from api.models.ComplianceReport import ComplianceReport
from api.models.ComplianceReportHistory import ComplianceReportHistory
from api.models.CreditTrade import CreditTrade
from api.models.CreditTradeHistory import CreditTradeHistory
from api.models.CreditTradeStatus import CreditTradeStatus
from api.models.ComplianceReport import ComplianceReportWorkflowState
from .ComplianceReport import ComplianceReportWorkflowStateSerializer, \
    ComplianceReportTypeSerializer
from .CreditTradeStatus import CreditTradeStatusSerializer, \
    CreditTradeStatusMinSerializer
from .CreditTradeType import CreditTradeTypeMinSerializer, \
    CreditTradeTypeSerializer
from .CreditTradeZeroReason import CreditTradeZeroReasonSerializer
from .Organization import OrganizationMinSerializer
from .User import UserMinSerializer


class UserHistorySerializer(serializers.Serializer):
    """
    Credit History Serializer in perspective of the User
    - What was the Credit Trade associated with the entry
    - Which fuel supplier involved
    - Was it rescinded
    - What type of Credit Trade was it
    """
    create_timestamp = serializers.SerializerMethodField()
    fuel_supplier = serializers.SerializerMethodField()
    history_type = serializers.SerializerMethodField()
    object_id = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()
    type = serializers.SerializerMethodField()

    def get_create_timestamp(self, obj):
        return obj['create_timestamp']

    def get_fuel_supplier(self, obj):
        """
        Returns the fuel supplier of the opposite end to give more
        context for the credit trade
        """
        if obj['type'] == 'Credit Trade':
            history = CreditTradeHistory.objects.get(id=obj['id'])

            if history.credit_trade.type.id in [1, 3, 5]:
                fuel_supplier = history.credit_trade.initiator
            else:
                fuel_supplier = history.credit_trade.respondent
        else:
            history = ComplianceReportHistory.objects.get(id=obj['id'])

            fuel_supplier = history.compliance_report.organization

        serializer = OrganizationMinSerializer(fuel_supplier, read_only=True)
        return serializer.data

    def get_history_type(self, obj):
        return obj['type']

    def get_object_id(self, obj):
        return obj['object_id']

    def get_status(self, obj):
        """
        Returns the status_id unless it's rescinded.
        This is to hide the review information from non-government users
        """
        if obj['type'] == 'Credit Trade':
            history = CreditTradeHistory.objects.get(id=obj['id'])

            if history.is_rescinded is True:
                return {
                    'action': "Rescind",
                    'status': "Rescinded"
                }

            credit_trade_status = CreditTradeStatus.objects.get(
                id=history.status_id
            )

            serializer = CreditTradeStatusMinSerializer(
                credit_trade_status,
                read_only=True
            )
        else:
            request = self.context['request']

            workflow_state = ComplianceReportWorkflowState.objects.get(
                id=obj['status_id']
            )

            serializer = ComplianceReportWorkflowStateSerializer(
                workflow_state,
                read_only=True,
                context={'request': request}
            )

        return serializer.data

    def get_type(self, obj):
        if obj['type'] == 'Credit Trade':
            credit_trade = CreditTrade.objects.get(id=obj['object_id'])

            serializer = CreditTradeTypeMinSerializer(
                credit_trade.type,
                read_only=True
            )
        else:
            compliance_report = ComplianceReport.objects.get(id=obj['object_id'])

            serializer = ComplianceReportTypeSerializer(
                compliance_report.type,
                read_only=True
            )

        return serializer.data

    class Meta:
        fields = (
            'create_timestamp', 'fuel_supplier', 'history_type', 'id',
            'object_id', 'status', 'type',
        )
