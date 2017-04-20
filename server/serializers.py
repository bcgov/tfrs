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
from models import Attachment
from models import AttachmentViewModel
from models import Audit
from models import CompliancePeriod
from models import Contact
from models import CreditTrade
from models import CreditTradeLogEntry
from models import CurrentUserViewModel
from models import FuelSupplier
from models import Group
from models import GroupMembership
from models import GroupMembershipViewModel
from models import GroupViewModel
from models import History
from models import HistoryViewModel
from models import LookupList
from models import Note
from models import Notification
from models import NotificationEvent
from models import NotificationViewModel
from models import Permission
from models import PermissionViewModel
from models import Role
from models import RolePermission
from models import RolePermissionViewModel
from models import RoleViewModel
from models import User
from models import UserDetailsViewModel
from models import UserFavourite
from models import UserFavouriteViewModel
from models import UserRole
from models import UserRoleViewModel
from models import UserViewModel

class AttachmentSerializer(serializers.ModelSerializer):
  class Meta:
    model=Attachment
	fields = ('id','fileName','fileContents','description','type')

class AttachmentViewModelSerializer(serializers.ModelSerializer):
  class Meta:
    model=AttachmentViewModel
	fields = ('id','fileName','description','type')

class AuditSerializer(serializers.ModelSerializer):
  class Meta:
    model=Audit
	fields = ('id','appCreateTimestamp','appCreateUserid','appCreateUserGuid','appCreateUserDirectory','appLastUpdateTimestamp','appLastUpdateUserid','appLastUpdateUserGuid','appLastUpdateUserDirectory','entityName','entityId','propertyName','oldValue','newValue','isDelete')

class CompliancePeriodSerializer(serializers.ModelSerializer):
  class Meta:
    model=CompliancePeriod
	fields = ('id','periodName','isActive')

class ContactSerializer(serializers.ModelSerializer):
  class Meta:
    model=Contact
	fields = ('id','givenName','surname','organizationName','role','notes','emailAddress','workPhoneNumber','mobilePhoneNumber','faxPhoneNumber','address1','address2','city','province','postalCode')

class CreditTradeSerializer(serializers.ModelSerializer):
  class Meta:
    model=CreditTrade
	fields = ('id','status','fuelSupplier','transactionPartnerFuelSupplier','compliancePeriod','fuelSupplierLastUpdatedBy','partnerLastUpdatedBy','reviewedRejectedBy','approvedRejectedBy','cancelledBy','tradeExecutionDate','transactionType','numberOfCredits','fairMarketValuePrice','fuelSupplierBalanceAtTransactionTime','notes','attachments','history')

class CreditTradeLogEntrySerializer(serializers.ModelSerializer):
  class Meta:
    model=CreditTradeLogEntry
	fields = ('id','creditTrade','user','logEntryTime','newCompliancePeriod','newStatus','newTradeExecutionDate','newTransactionType','newNumberOfCredits','newFairMarketValuePrice','newFuelSupplierBalanceAtTransactionTime')

class CurrentUserViewModelSerializer(serializers.ModelSerializer):
  class Meta:
    model=CurrentUserViewModel
	fields = ('id','givenName','surname','email','active','userRoles','smUserId','smAuthorizationDirectory','groupMemberships')

class FuelSupplierSerializer(serializers.ModelSerializer):
  class Meta:
    model=FuelSupplier
	fields = ('id','name','status','dateCreated','primaryContact','contacts','notes','attachments','history')

class GroupSerializer(serializers.ModelSerializer):
  class Meta:
    model=Group
	fields = ('id','name','description')

class GroupMembershipSerializer(serializers.ModelSerializer):
  class Meta:
    model=GroupMembership
	fields = ('id','active','group','user')

class GroupMembershipViewModelSerializer(serializers.ModelSerializer):
  class Meta:
    model=GroupMembershipViewModel
	fields = ('id','active','groupId','userId')

class GroupViewModelSerializer(serializers.ModelSerializer):
  class Meta:
    model=GroupViewModel
	fields = ('id','name','description')

class HistorySerializer(serializers.ModelSerializer):
  class Meta:
    model=History
	fields = ('id','historyText')

class HistoryViewModelSerializer(serializers.ModelSerializer):
  class Meta:
    model=HistoryViewModel
	fields = ('id','historyText','lastUpdateUserid','lastUpdateTimestamp','affectedEntityId')

class LookupListSerializer(serializers.ModelSerializer):
  class Meta:
    model=LookupList
	fields = ('id','contextName','isDefault','displaySortOrder','codeName','value')

class NoteSerializer(serializers.ModelSerializer):
  class Meta:
    model=Note
	fields = ('id','noteText','isNoLongerRelevant')

class NotificationSerializer(serializers.ModelSerializer):
  class Meta:
    model=Notification
	fields = ('id','event','hasBeenViewed','isWatchNotification','user')

class NotificationEventSerializer(serializers.ModelSerializer):
  class Meta:
    model=NotificationEvent
	fields = ('id','eventTime','eventTypeCode','notes','creditTrade')

class NotificationViewModelSerializer(serializers.ModelSerializer):
  class Meta:
    model=NotificationViewModel
	fields = ('id','eventId','event2Id','hasBeenViewed','isWatchNotification','isExpired','isAllDay','priorityCode','userId')

class PermissionSerializer(serializers.ModelSerializer):
  class Meta:
    model=Permission
	fields = ('id','code','name','description')

class PermissionViewModelSerializer(serializers.ModelSerializer):
  class Meta:
    model=PermissionViewModel
	fields = ('id','code','name','description')

class RoleSerializer(serializers.ModelSerializer):
  class Meta:
    model=Role
	fields = ('id','name','description')

class RolePermissionSerializer(serializers.ModelSerializer):
  class Meta:
    model=RolePermission
	fields = ('id','role','permission')

class RolePermissionViewModelSerializer(serializers.ModelSerializer):
  class Meta:
    model=RolePermissionViewModel
	fields = ('id','roleId','permissionId')

class RoleViewModelSerializer(serializers.ModelSerializer):
  class Meta:
    model=RoleViewModel
	fields = ('id','name','description')

class UserSerializer(serializers.ModelSerializer):
  class Meta:
    model=User
	fields = ('id','givenName','surname','initials','email','status','fuelSupplier','smUserId','guid','smAuthorizationDirectory')

class UserDetailsViewModelSerializer(serializers.ModelSerializer):
  class Meta:
    model=UserDetailsViewModel
	fields = ('id','givenName','surname','initials','email','active','permissions')

class UserFavouriteSerializer(serializers.ModelSerializer):
  class Meta:
    model=UserFavourite
	fields = ('id','type','name','value','isDefault','User')

class UserFavouriteViewModelSerializer(serializers.ModelSerializer):
  class Meta:
    model=UserFavouriteViewModel
	fields = ('id','name','value','isDefault','type')

class UserRoleSerializer(serializers.ModelSerializer):
  class Meta:
    model=UserRole
	fields = ('id','effectiveDate','expiryDate','user','role')

class UserRoleViewModelSerializer(serializers.ModelSerializer):
  class Meta:
    model=UserRoleViewModel
	fields = ('id','effectiveDate','expiryDate','roleId','userId')

class UserViewModelSerializer(serializers.ModelSerializer):
  class Meta:
    model=UserViewModel
	fields = ('id','givenName','surname','email','active','smUserId','userRoles','groupMemberships')
