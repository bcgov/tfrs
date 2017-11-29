"""
    REST API Documentation for the NRS TFRS Credit Trading Application

    The Transportation Fuels Reporting System is being designed to streamline compliance reporting for transportation fuel suppliers in accordance with the Renewable & Low Carbon Fuel Requirements Regulation.

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


class CreditTradeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CreditTrade
        fields = ('id', 'status', 'initiator', 'respondent',
                  'type', 'number_of_credits',
                  'fair_market_value_per_credit', 'zero_reason',
                  'trade_effective_date')


class CreditTradeHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = CreditTradeHistory
        fields = ('id', 'credit_trade', 'user', 'credit_trade_update_time',
                  'respondent', 'status', 'type',
                  'number_of_credits', 'fair_market_value_per_credit',
                  'zero_reason', 'trade_effective_date',
                  'note', 'is_internal_history_record')


class CreditTradeStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = CreditTradeStatus
        fields = (
            'id', 'status', 'description', 'effective_date', 'expiration_date',
            'display_order')


class CreditTradeTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CreditTradeType
        fields = (
            'id', 'the_type', 'description', 'effective_date', 'expiration_date',
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
        fields = ('id', 'given_name', 'surname', 'email', 'active', 'user_roles',
                  'sm_authorization_id', 'sm_authorization_directory')


class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = (
            'id', 'name', 'status', 'actions_type',
            'created_date')


class OrganizationActionsTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrganizationActionsType
        fields = (
            'id', 'the_type', 'description', 'effective_date', 'expiration_date',
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
    class Meta:
        model = User
        fields = (
                'id', 'given_name', 'surname', 'email', 'authorization_id',
            'authorization_guid', 'authorization_directory')


class UserDetailsViewModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserDetailsViewModel
        fields = (
            'id', 'given_name', 'surname', 'email', 'active', 'permissions')



class UserRoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserRole
        fields = ('id', 'user', 'role')


class UserRoleViewModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserRoleViewModel
        fields = ('id', 'effective_date', 'expiration_date', 'role_id', 'authorization_id')


class UserViewModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserViewModel
        fields = ('id', 'given_name', 'surname', 'email', 'active', 'sm_authorization_id',
                  'user_roles')


class CreditTradeCreateSerializer(serializers.ModelSerializer):

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
    status = CreditTradeStatusSerializer(read_only=True)
    initiator = OrganizationSerializer(read_only=True)
    respondent = OrganizationSerializer(read_only=True)
    type = CreditTradeTypeSerializer(read_only=True)
    zero_reason = CreditTradeZeroReasonSerializer(read_only=True)
    credits_from = OrganizationSerializer(read_only=True)
    credits_to = OrganizationSerializer(read_only=True)

    class Meta:
        model = CreditTrade
        fields = ('id', 'status', 'initiator', 'respondent',
                  'type', 'number_of_credits',
                  'fair_market_value_per_credit', 'zero_reason',
                  'trade_effective_date', 'credits_from', 'credits_to')
        # exclude = ('note',)


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
