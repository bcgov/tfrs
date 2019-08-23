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

from api.models.ComplianceReportHistory import ComplianceReportHistory
from api.serializers import UserMinSerializer
from api.serializers.ComplianceReport import ComplianceReportStatusSerializer, ComplianceReportWorkflowStateSerializer


class ComplianceReportHistorySerializer(serializers.ModelSerializer):
    from .Role import RoleMinSerializer

    status = ComplianceReportWorkflowStateSerializer(read_only=True)
    user = SerializerMethodField()
    user_role = RoleMinSerializer(read_only=True)

    def get_user(self, obj):
        serializer = UserMinSerializer(
            obj.user,
            read_only=True)

        return serializer.data

    class Meta:
        model = ComplianceReportHistory
        fields = ('id', 'user', 'status', 'user', 'user_role')
