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

from .models.Audit import Audit
from .models.CreditTrade import CreditTrade
from .models.CreditTradeHistory import CreditTradeHistory
from .models.CreditTradeStatus import CreditTradeStatus
from .models.CreditTradeType import CreditTradeType
from .models.CurrentUserViewModel import CurrentUserViewModel
from .models.FuelSupplier import FuelSupplier
from .models.FuelSupplierActionsType import FuelSupplierActionsType
from .models.FuelSupplierAttachment import FuelSupplierAttachment
from .models.FuelSupplierAttachmentTag import FuelSupplierAttachmentTag
from .models.FuelSupplierBalance import FuelSupplierBalance
from .models.FuelSupplierCCData import FuelSupplierCCData
from .models.FuelSupplierContact import FuelSupplierContact
from .models.FuelSupplierContactRole import FuelSupplierContactRole
from .models.FuelSupplierHistory import FuelSupplierHistory
from .models.FuelSupplierStatus import FuelSupplierStatus
from .models.FuelSupplierType import FuelSupplierType
from .models.Notification import Notification
from .models.NotificationEvent import NotificationEvent
from .models.NotificationType import NotificationType
from .models.NotificationViewModel import NotificationViewModel
from .models.Opportunity import Opportunity
from .models.OpportunityHistory import OpportunityHistory
from .models.OpportunityStatus import OpportunityStatus
from .models.Permission import Permission
from .models.PermissionViewModel import PermissionViewModel
from .models.Role import Role
from .models.RolePermission import RolePermission
from .models.RolePermissionViewModel import RolePermissionViewModel
from .models.RoleViewModel import RoleViewModel
from .models.User import User
from .models.UserDetailsViewModel import UserDetailsViewModel
from .models.UserFavourite import UserFavourite
from .models.UserFavouriteViewModel import UserFavouriteViewModel
from .models.UserRole import UserRole
from .models.UserRoleViewModel import UserRoleViewModel
from .models.UserViewModel import UserViewModel

class AuditSerializer(serializers.ModelSerializer):
  class Meta:
    model = Audit
    fields = ('id','appCreateTimestamp','appCreateUserid','appCreateUserGuid','appCreateUserDirectory','appLastUpdateTimestamp','appLastUpdateUserid','appLastUpdateUserGuid','appLastUpdateUserDirectory','entityName','entityId','propertyName','oldValue','newValue','isDelete')

class CreditTradeSerializer(serializers.ModelSerializer):
  class Meta:
    model = CreditTrade
    fields = ('id','creditTradeStatusId','initiator','respondent','tradeEffectiveDate','creditTradeTypeId','numberOfCredits','fairMarketValuePerCredit','history','plainEnglishPhrase')

class CreditTradeHistorySerializer(serializers.ModelSerializer):
  class Meta:
    model = CreditTradeHistory
    fields = ('id','userId','creditTradeUpdateTime','creditTradeStatusId','newTradeEffectiveDate','creditTradeTypeId','newNumberOfCredits','newFairMarketValuePerCredit','note','isInternalHistoryRecord')

class CreditTradeStatusSerializer(serializers.ModelSerializer):
  class Meta:
    model = CreditTradeStatus
    fields = ('id','status','description','effectiveDate','expirationDate','displayOrder')

class CreditTradeTypeSerializer(serializers.ModelSerializer):
  class Meta:
    model = CreditTradeType
    fields = ('id','type','description','effectiveDate','expirationDate','displayOrder','isGovOnlyType')

class CurrentUserViewModelSerializer(serializers.ModelSerializer):
  class Meta:
    model = CurrentUserViewModel
    fields = ('id','givenName','surname','email','active','userRoles','smUserId','smAuthorizationDirectory')

class FuelSupplierSerializer(serializers.ModelSerializer):
  class Meta:
    model = FuelSupplier
    fields = ('id','name','fuelSupplierStatusId','fuelSupplierTypeId','fuelSupplierActionsTypeId','dateCreated')

class FuelSupplierActionsTypeSerializer(serializers.ModelSerializer):
  class Meta:
    model = FuelSupplierActionsType
    fields = ('id','type','description','effectiveDate','expirationDate','displayOrder')

class FuelSupplierAttachmentSerializer(serializers.ModelSerializer):
  class Meta:
    model = FuelSupplierAttachment
    fields = ('id','fuelSupplierId','fileName','fileLocation','description','complianceYear')

class FuelSupplierAttachmentTagSerializer(serializers.ModelSerializer):
  class Meta:
    model = FuelSupplierAttachmentTag
    fields = ('id','fuelSupplierAttachmentId','tag')

class FuelSupplierBalanceSerializer(serializers.ModelSerializer):
  class Meta:
    model = FuelSupplierBalance
    fields = ('id','fuelSupplierId','validatedCredits','encumberedCredits','effectiveDate','endDate','creditTradeId')

class FuelSupplierCCDataSerializer(serializers.ModelSerializer):
  class Meta:
    model = FuelSupplierCCData
    fields = ('id','fuelSupplierId','commonClientOrgId','lastUpdatefromCommonClient','name','corporateAddressLine1','corporateAddressLine2','corporateAddressCity','corporateAddressPostalCode','corporateAddressProvince')

class FuelSupplierContactSerializer(serializers.ModelSerializer):
  class Meta:
    model = FuelSupplierContact
    fields = ('id','fuelSupplierId','givenName','surname','title','userId','notes','emailAddress','workPhoneNumber','mobilePhoneNumber')

class FuelSupplierContactRoleSerializer(serializers.ModelSerializer):
  class Meta:
    model = FuelSupplierContactRole
    fields = ('id','roleId')

class FuelSupplierHistorySerializer(serializers.ModelSerializer):
  class Meta:
    model = FuelSupplierHistory
    fields = ('id','fuelSupplierId','historyText')

class FuelSupplierStatusSerializer(serializers.ModelSerializer):
  class Meta:
    model = FuelSupplierStatus
    fields = ('id','status','description','effectiveDate','expirationDate','displayOrder')

class FuelSupplierTypeSerializer(serializers.ModelSerializer):
  class Meta:
    model = FuelSupplierType
    fields = ('id','type','description','effectiveDate','expirationDate','displayOrder')

class NotificationSerializer(serializers.ModelSerializer):
  class Meta:
    model = Notification
    fields = ('id','notificationEventId','hasBeenViewed','isWatchNotification','userId')

class NotificationEventSerializer(serializers.ModelSerializer):
  class Meta:
    model = NotificationEvent
    fields = ('id','eventTime','eventTypeCode','notes','creditTradeId','opportunityId')

class NotificationTypeSerializer(serializers.ModelSerializer):
  class Meta:
    model = NotificationType
    fields = ('id','type','description','effectiveDate','expirationDate','displayOrder')

class NotificationViewModelSerializer(serializers.ModelSerializer):
  class Meta:
    model = NotificationViewModel
    fields = ('id','eventId','hasBeenViewed','isWatchNotification','isExpired','isAllDay','priorityCode','userId')

class OpportunitySerializer(serializers.ModelSerializer):
  class Meta:
    model = Opportunity
    fields = ('id','fuelSupplierId','opportunityStatusId','creditTradeTypeId','fuelSupplierTypeId','numberOfCredits','suggestedValuePerCredit','hasTradeNow','numberOfViews','datePosted','opportunityBackgroundNote','creditTrades','plainEnglishPhrase')

class OpportunityHistorySerializer(serializers.ModelSerializer):
  class Meta:
    model = OpportunityHistory
    fields = ('id','opportunityId','userId','updateTime','creditTradeTypeId','newNumberOfCredits','newProposedValuePerCredit','fuelSupplierTypeId','newTradeEffectiveDate','note')

class OpportunityStatusSerializer(serializers.ModelSerializer):
  class Meta:
    model = OpportunityStatus
    fields = ('id','status','description','effectiveDate','expirationDate','displayOrder')

class PermissionSerializer(serializers.ModelSerializer):
  class Meta:
    model = Permission
    fields = ('id','code','name','description')

class PermissionViewModelSerializer(serializers.ModelSerializer):
  class Meta:
    model = PermissionViewModel
    fields = ('id','code','name','description')

class RoleSerializer(serializers.ModelSerializer):
  class Meta:
    model = Role
    fields = ('id','name','description')

class RolePermissionSerializer(serializers.ModelSerializer):
  class Meta:
    model = RolePermission
    fields = ('id','roleId','permissionId')

class RolePermissionViewModelSerializer(serializers.ModelSerializer):
  class Meta:
    model = RolePermissionViewModel
    fields = ('id','roleId','permissionId')

class RoleViewModelSerializer(serializers.ModelSerializer):
  class Meta:
    model = RoleViewModel
    fields = ('id','name','description')

class UserSerializer(serializers.ModelSerializer):
  class Meta:
    model = User
    fields = ('id','authorizationID','givenName','surname','email','fuelSupplierId','userId','guid','authorizationDirectory')

class UserDetailsViewModelSerializer(serializers.ModelSerializer):
  class Meta:
    model = UserDetailsViewModel
    fields = ('id','givenName','surname','email','active','permissions')

class UserFavouriteSerializer(serializers.ModelSerializer):
  class Meta:
    model = UserFavourite
    fields = ('id','context','name','value','isDefault','userId')

class UserFavouriteViewModelSerializer(serializers.ModelSerializer):
  class Meta:
    model = UserFavouriteViewModel
    fields = ('id','name','value','isDefault','type')

class UserRoleSerializer(serializers.ModelSerializer):
  class Meta:
    model = UserRole
    fields = ('id','userId','roleId')

class UserRoleViewModelSerializer(serializers.ModelSerializer):
  class Meta:
    model = UserRoleViewModel
    fields = ('id','effectiveDate','expiryDate','roleId','userId')

class UserViewModelSerializer(serializers.ModelSerializer):
  class Meta:
    model = UserViewModel
    fields = ('id','givenName','surname','email','active','smUserId','userRoles')

