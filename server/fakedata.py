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

# edit this file with appropriate test data.


def AttachmentTestDataCreate():
  return {
    'fileName':'Initial',
    'description':'Initial',
    'type':'Initial',
  }

def AttachmentTestDataUpdate():
  return {
    'fileName':'Changed',
    'description':'Changed',
    'type':'Changed',
  }


def AttachmentViewModelTestDataCreate():
  return {
    'fileName':'Initial',
    'description':'Initial',
    'type':'Initial',
  }

def AttachmentViewModelTestDataUpdate():
  return {
    'fileName':'Changed',
    'description':'Changed',
    'type':'Changed',
  }


def AuditTestDataCreate():
  return {
    'appCreateUserid':'Initial',
    'appCreateUserGuid':'Initial',
    'appCreateUserDirectory':'Initial',
    'appLastUpdateUserid':'Initial',
    'appLastUpdateUserGuid':'Initial',
    'appLastUpdateUserDirectory':'Initial',
    'entityName':'Initial',
    'entityId':1,
    'propertyName':'Initial',
    'oldValue':'Initial',
    'newValue':'Initial',
    'isDelete':True,
  }

def AuditTestDataUpdate():
  return {
    'appCreateUserid':'Changed',
    'appCreateUserGuid':'Changed',
    'appCreateUserDirectory':'Changed',
    'appLastUpdateUserid':'Changed',
    'appLastUpdateUserGuid':'Changed',
    'appLastUpdateUserDirectory':'Changed',
    'entityName':'Changed',
    'entityId':0,
    'propertyName':'Changed',
    'oldValue':'Changed',
    'newValue':'Changed',
    'isDelete':False,
  }


def CompliancePeriodTestDataCreate():
  return {
    'periodName':'Initial',
    'isActive':True,
  }

def CompliancePeriodTestDataUpdate():
  return {
    'periodName':'Changed',
    'isActive':False,
  }


def ContactTestDataCreate():
  return {
    'givenName':'Initial',
    'surname':'Initial',
    'organizationName':'Initial',
    'role':'Initial',
    'notes':'Initial',
    'emailAddress':'Initial',
    'workPhoneNumber':'Initial',
    'mobilePhoneNumber':'Initial',
    'faxPhoneNumber':'Initial',
    'address1':'Initial',
    'address2':'Initial',
    'city':'Initial',
    'province':'Initial',
    'postalCode':'Initial',
  }

def ContactTestDataUpdate():
  return {
    'givenName':'Changed',
    'surname':'Changed',
    'organizationName':'Changed',
    'role':'Changed',
    'notes':'Changed',
    'emailAddress':'Changed',
    'workPhoneNumber':'Changed',
    'mobilePhoneNumber':'Changed',
    'faxPhoneNumber':'Changed',
    'address1':'Changed',
    'address2':'Changed',
    'city':'Changed',
    'province':'Changed',
    'postalCode':'Changed',
  }


def CreditTradeTestDataCreate():
  return {
    'status':'Initial',
    'transactionType':'Initial',
    'numberOfCredits':1,
  }

def CreditTradeTestDataUpdate():
  return {
    'status':'Changed',
    'transactionType':'Changed',
    'numberOfCredits':0,
  }


def CreditTradeLogEntryTestDataCreate():
  return {
    'newStatus':'Initial',
    'newTransactionType':'Initial',
    'newNumberOfCredits':1,
    'newFuelSupplierBalanceAtTransactionTime':1,
  }

def CreditTradeLogEntryTestDataUpdate():
  return {
    'newStatus':'Changed',
    'newTransactionType':'Changed',
    'newNumberOfCredits':0,
    'newFuelSupplierBalanceAtTransactionTime':0,
  }


def CurrentUserViewModelTestDataCreate():
  return {
    'givenName':'Initial',
    'surname':'Initial',
    'email':'Initial',
    'active':True,
    'smUserId':'Initial',
    'smAuthorizationDirectory':'Initial',
  }

def CurrentUserViewModelTestDataUpdate():
  return {
    'givenName':'Changed',
    'surname':'Changed',
    'email':'Changed',
    'active':False,
    'smUserId':'Changed',
    'smAuthorizationDirectory':'Changed',
  }


def FuelSupplierTestDataCreate():
  return {
    'name':'Initial',
    'status':'Initial',
  }

def FuelSupplierTestDataUpdate():
  return {
    'name':'Changed',
    'status':'Changed',
  }


def GroupTestDataCreate():
  return {
    'name':'Initial',
    'description':'Initial',
  }

def GroupTestDataUpdate():
  return {
    'name':'Changed',
    'description':'Changed',
  }


def GroupMembershipTestDataCreate():
  return {
    'active':True,
  }

def GroupMembershipTestDataUpdate():
  return {
    'active':False,
  }


def GroupMembershipViewModelTestDataCreate():
  return {
    'active':True,
    'groupId':1,
    'userId':1,
  }

def GroupMembershipViewModelTestDataUpdate():
  return {
    'active':False,
    'groupId':0,
    'userId':0,
  }


def GroupViewModelTestDataCreate():
  return {
    'name':'Initial',
    'description':'Initial',
  }

def GroupViewModelTestDataUpdate():
  return {
    'name':'Changed',
    'description':'Changed',
  }


def HistoryTestDataCreate():
  return {
    'historyText':'Initial',
  }

def HistoryTestDataUpdate():
  return {
    'historyText':'Changed',
  }


def HistoryViewModelTestDataCreate():
  return {
    'historyText':'Initial',
    'lastUpdateUserid':'Initial',
    'affectedEntityId':1,
  }

def HistoryViewModelTestDataUpdate():
  return {
    'historyText':'Changed',
    'lastUpdateUserid':'Changed',
    'affectedEntityId':0,
  }


def LookupListTestDataCreate():
  return {
    'contextName':'Initial',
    'isDefault':True,
    'displaySortOrder':1,
    'codeName':'Initial',
    'value':'Initial',
  }

def LookupListTestDataUpdate():
  return {
    'contextName':'Changed',
    'isDefault':False,
    'displaySortOrder':0,
    'codeName':'Changed',
    'value':'Changed',
  }


def NoteTestDataCreate():
  return {
    'noteText':'Initial',
    'isNoLongerRelevant':True,
  }

def NoteTestDataUpdate():
  return {
    'noteText':'Changed',
    'isNoLongerRelevant':False,
  }


def NotificationTestDataCreate():
  return {
    'hasBeenViewed':True,
    'isWatchNotification':True,
  }

def NotificationTestDataUpdate():
  return {
    'hasBeenViewed':False,
    'isWatchNotification':False,
  }


def NotificationEventTestDataCreate():
  return {
    'eventTypeCode':'Initial',
    'notes':'Initial',
  }

def NotificationEventTestDataUpdate():
  return {
    'eventTypeCode':'Changed',
    'notes':'Changed',
  }


def NotificationViewModelTestDataCreate():
  return {
    'eventId':1,
    'event2Id':1,
    'hasBeenViewed':True,
    'isWatchNotification':True,
    'isExpired':True,
    'isAllDay':True,
    'priorityCode':'Initial',
    'userId':1,
  }

def NotificationViewModelTestDataUpdate():
  return {
    'eventId':0,
    'event2Id':0,
    'hasBeenViewed':False,
    'isWatchNotification':False,
    'isExpired':False,
    'isAllDay':False,
    'priorityCode':'Changed',
    'userId':0,
  }


def PermissionTestDataCreate():
  return {
    'code':'Initial',
    'name':'Initial',
    'description':'Initial',
  }

def PermissionTestDataUpdate():
  return {
    'code':'Changed',
    'name':'Changed',
    'description':'Changed',
  }


def PermissionViewModelTestDataCreate():
  return {
    'code':'Initial',
    'name':'Initial',
    'description':'Initial',
  }

def PermissionViewModelTestDataUpdate():
  return {
    'code':'Changed',
    'name':'Changed',
    'description':'Changed',
  }


def RoleTestDataCreate():
  return {
    'name':'Initial',
    'description':'Initial',
  }

def RoleTestDataUpdate():
  return {
    'name':'Changed',
    'description':'Changed',
  }


def RolePermissionTestDataCreate():
  return {
  }

def RolePermissionTestDataUpdate():
  return {
  }


def RolePermissionViewModelTestDataCreate():
  return {
    'roleId':1,
    'permissionId':1,
  }

def RolePermissionViewModelTestDataUpdate():
  return {
    'roleId':0,
    'permissionId':0,
  }


def RoleViewModelTestDataCreate():
  return {
    'name':'Initial',
    'description':'Initial',
  }

def RoleViewModelTestDataUpdate():
  return {
    'name':'Changed',
    'description':'Changed',
  }


def UserTestDataCreate():
  return {
    'givenName':'Initial',
    'surname':'Initial',
    'initials':'Initial',
    'email':'Initial',
    'status':'Initial',
    'smUserId':'Initial',
    'guid':'Initial',
    'smAuthorizationDirectory':'Initial',
  }

def UserTestDataUpdate():
  return {
    'givenName':'Changed',
    'surname':'Changed',
    'initials':'Changed',
    'email':'Changed',
    'status':'Changed',
    'smUserId':'Changed',
    'guid':'Changed',
    'smAuthorizationDirectory':'Changed',
  }


def UserDetailsViewModelTestDataCreate():
  return {
    'givenName':'Initial',
    'surname':'Initial',
    'initials':'Initial',
    'email':'Initial',
    'active':True,
  }

def UserDetailsViewModelTestDataUpdate():
  return {
    'givenName':'Changed',
    'surname':'Changed',
    'initials':'Changed',
    'email':'Changed',
    'active':False,
  }


def UserFavouriteTestDataCreate():
  return {
    'type':'Initial',
    'name':'Initial',
    'value':'Initial',
    'isDefault':True,
  }

def UserFavouriteTestDataUpdate():
  return {
    'type':'Changed',
    'name':'Changed',
    'value':'Changed',
    'isDefault':False,
  }


def UserFavouriteViewModelTestDataCreate():
  return {
    'name':'Initial',
    'value':'Initial',
    'isDefault':True,
    'type':'Initial',
  }

def UserFavouriteViewModelTestDataUpdate():
  return {
    'name':'Changed',
    'value':'Changed',
    'isDefault':False,
    'type':'Changed',
  }


def UserRoleTestDataCreate():
  return {
  }

def UserRoleTestDataUpdate():
  return {
  }


def UserRoleViewModelTestDataCreate():
  return {
    'roleId':1,
    'userId':1,
  }

def UserRoleViewModelTestDataUpdate():
  return {
    'roleId':0,
    'userId':0,
  }


def UserViewModelTestDataCreate():
  return {
    'givenName':'Initial',
    'surname':'Initial',
    'email':'Initial',
    'active':True,
    'smUserId':'Initial',
  }

def UserViewModelTestDataUpdate():
  return {
    'givenName':'Changed',
    'surname':'Changed',
    'email':'Changed',
    'active':False,
    'smUserId':'Changed',
  }

