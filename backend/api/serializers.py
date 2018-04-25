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

from .models.CompliancePeriod import CompliancePeriod
from .models.CreditTrade import CreditTrade
from .models.CreditTradeHistory import CreditTradeHistory
from .models.CreditTradeStatus import CreditTradeStatus
from .models.CreditTradeType import CreditTradeType
from .models.CreditTradeZeroReason import CreditTradeZeroReason
from .models.CurrentUserViewModel import CurrentUserViewModel
from .models.Organization import Organization
from .models.OrganizationActionsType import OrganizationActionsType
from .models.OrganizationAttachment import OrganizationAttachment
from .models.OrganizationBalance import OrganizationBalance
from .models.OrganizationHistory import OrganizationHistory
from .models.OrganizationStatus import OrganizationStatus
from .models.Permission import Permission
from .models.PermissionViewModel import PermissionViewModel
from .models.Role import Role
from .models.RolePermission import RolePermission
from .models.RolePermissionViewModel import RolePermissionViewModel
from .models.RoleViewModel import RoleViewModel
from .models.User import User
from .models.UserDetailsViewModel import UserDetailsViewModel
from .models.UserRole import UserRole
from .models.UserRoleViewModel import UserRoleViewModel
from .models.UserViewModel import UserViewModel


class CompliancePeriodSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompliancePeriod
        fields = ('id', 'description', 'effective_date', 'expiration_date',
                  'display_order')


class CreditTradeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CreditTrade
        fields = ('id', 'status', 'initiator', 'respondent',
                  'type', 'number_of_credits',
                  'fair_market_value_per_credit', 'zero_reason',
                  'trade_effective_date', 'compliance_period')


class CreditTradeHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = CreditTradeHistory
        fields = ('id', 'credit_trade', 'user', 'credit_trade_update_time',
                  'respondent', 'status', 'type',
                  'number_of_credits', 'fair_market_value_per_credit',
                  'zero_reason', 'trade_effective_date',
                  'note', 'is_internal_history_record', 'compliance_period')


class CreditTradeStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = CreditTradeStatus
        fields = (
            'id', 'status', 'description', 'effective_date', 'expiration_date',
            'display_order', 'action')


class CreditTradeStatusMinSerializer(serializers.ModelSerializer):
    class Meta:
        model = CreditTradeStatus
        fields = (
            'id', 'status', 'action')


class CreditTradeTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CreditTradeType
        fields = (
            'id', 'the_type', 'description', 'effective_date',
            'expiration_date',
            'display_order', 'is_gov_only_type')


class CreditTradeZeroReasonSerializer(serializers.ModelSerializer):
    class Meta:
        model = CreditTradeZeroReason
        fields = (
            'id', 'reason', 'description', 'effective_date', 'expiration_date',
            'display_order')


class CurrentUserViewModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = CurrentUserViewModel
        fields = (
            'id', 'first_name', 'last_name', 'email', 'active', 'user_roles',
            'sm_authorization_id', 'sm_authorization_directory')


class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = (
            'id', 'name', 'status', 'status_display', 'actions_type',
            'actions_type_display', 'create_timestamp', 'type',
            'organization_balance')


class OrganizationActionsTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrganizationActionsType
        fields = (
            'id', 'the_type', 'description', 'effective_date',
            'expiration_date',
            'display_order')


class OrganizationAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrganizationAttachment
        fields = (
            'id', 'organization', 'file_name', 'file_location', 'description',
            'compliance_year')


class OrganizationBalanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrganizationBalance
        fields = '__all__'


class OrganizationHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = OrganizationHistory
        fields = ('id', 'organization', 'history_text')


class OrganizationStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrganizationStatus
        fields = (
            'id', 'status', 'description', 'effective_date', 'expiration_date',
            'display_order')


class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = ('id', 'code', 'name', 'description')


class PermissionViewModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = PermissionViewModel
        fields = ('id', 'code', 'name', 'description')


class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = ('id', 'name', 'description', 'is_government_role')


class RolePermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = RolePermission
        fields = ('id', 'role', 'permission')


class RolePermissionViewModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = RolePermissionViewModel
        fields = ('id', 'role_id', 'permission_id')


class RoleViewModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoleViewModel
        fields = ('id', 'name', 'description')


class UserSerializer(serializers.ModelSerializer):
    organization = OrganizationSerializer(read_only=True)

    class Meta:
        model = User
        fields = (
            'id', 'first_name', 'last_name', 'email', 'authorization_id',
            'authorization_guid', 'authorization_directory', 'display_name',
            'organization')


class UserDetailsViewModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserDetailsViewModel
        fields = (
            'id', 'first_name', 'last_name', 'email', 'active', 'permissions')


class UserRoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserRole
        fields = ('id', 'user', 'role')


class UserRoleViewModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserRoleViewModel
        fields = ('id', 'effective_date', 'expiration_date', 'role_id',
                  'authorization_id')


class UserViewModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserViewModel
        fields = ('id', 'first_name', 'last_name', 'email', 'active',
                  'sm_authorization_id',
                  'user_roles')


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
    actions = CreditTradeStatusMinSerializer(many=True, read_only=True)
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


class CreditTradeHistory2Serializer(serializers.ModelSerializer):
    status = CreditTradeStatusSerializer(read_only=True)
    initiator = OrganizationSerializer(read_only=True)
    respondent = OrganizationSerializer(read_only=True)
    type = CreditTradeTypeSerializer(read_only=True)
    zero_reason = CreditTradeZeroReasonSerializer(read_only=True)

    class Meta:
        model = CreditTradeHistory
        fields = '__all__'


class CreditTradeHistoryCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CreditTradeHistory
        fields = '__all__'
