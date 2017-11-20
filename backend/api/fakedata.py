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


def CreditTradeTestDataCreate():
  return {
    'numberOfCredits': 1,
  }

def CreditTradeTestDataUpdate():
  return {
    'numberOfCredits':0,
  }


def CreditTradeHistoryTestDataCreate():
  return {
    'newNumberOfCredits':1,
    'note':'Initial',
    'isInternalHistoryRecord':True,
  }

def CreditTradeHistoryTestDataUpdate():
  return {
    'newNumberOfCredits':0,
    'note':'Changed',
    'isInternalHistoryRecord':False,
  }


def CreditTradeStatusTestDataCreate():
  return {
    'status':'Initial',
    'description':'Initial',
    'displayOrder':1,
    'effective_date': '2017-01-01',
  }

def CreditTradeStatusTestDataUpdate():
  return {
    'status':'Changed',
    'description':'Changed',
    'displayOrder':0,
    'effective_date': '2017-01-01',
  }


def CreditTradeTypeTestDataCreate():
  return {
    'theType':'Initial',
    'description':'Initial',
    'displayOrder':1,
    'isGovOnlyType':True,
    'effective_date': '2017-01-01',
    'expiration_date': '2017-02-01',
  }

def CreditTradeTypeTestDataUpdate():
  return {
    'theType':'Changed',
    'description':'Changed',
    'displayOrder':0,
    'isGovOnlyType':False,
    'effective_date': '2017-01-01',
    'expiration_date': '2017-02-01',
  }


def CreditTradeZeroReasonTestDataCreate():
  return {
    'reason':'Initial',
    'description':'Initial',
    'displayOrder':1,
    'effective_date': '2017-01-01',
  }

def CreditTradeZeroReasonTestDataUpdate():
  return {
    'reason':'Changed',
    'description':'Changed',
    'displayOrder':0,
    'effective_date': '2017-01-01',
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


def OrganizationTestDataCreate():
  return {
    'name':'Initial',
  }

def OrganizationTestDataUpdate():
  return {
    'name':'Changed',
  }


def OrganizationActionsTypeTestDataCreate():
  return {
    'theType':'Initial',
    'description':'Initial',
    'displayOrder':1,
    'effective_date': '2017-01-01',
  }

def OrganizationActionsTypeTestDataUpdate():
  return {
    'theType':'Changed',
    'description':'Changed',
    'displayOrder':0,
    'effective_date': '2018-01-01',
  }


def OrganizationAttachmentTestDataCreate():
  return {
    'fileName':'Initial',
    'fileLocation':'Initial',
    'description':'Initial',
    'complianceYear':'Initial',
  }

def OrganizationAttachmentTestDataUpdate():
  return {
    'fileName':'Changed',
    'fileLocation':'Changed',
    'description':'Changed',
    'complianceYear':'Changed',
  }


def OrganizationBalanceTestDataCreate():
  return {
    'validatedCredits':1,
  }

def OrganizationBalanceTestDataUpdate():
  return {
    'validatedCredits':0,
  }


def OrganizationHistoryTestDataCreate():
  return {
    'historyText':'Initial',
  }

def OrganizationHistoryTestDataUpdate():
  return {
    'historyText':'Changed',
  }


def OrganizationStatusTestDataCreate():
  return {
    'status':'Initial',
    'description':'Initial',
    'displayOrder':1,
    'effective_date': '2017-01-01',
    'expiration_date': '2017-02-01',
  }

def OrganizationStatusTestDataUpdate():
  return {
    'status':'Changed',
    'description':'Changed',
    'displayOrder':0,
    'effective_date': '2017-01-01',
    'expiration_date': '2017-02-01',
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


def NotificationTypeTestDataCreate():
  return {
    'theType':'Initial',
    'description':'Initial',
    'displayOrder':1,
    'effective_date': '2017-01-01',
  }

def NotificationTypeTestDataUpdate():
  return {
    'theType':'Changed',
    'description':'Changed',
    'displayOrder':0,
    'effective_date': '2018-01-01',
  }


def NotificationViewModelTestDataCreate():
  return {
    'eventId':1,
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
    'authorizationID':'Initial',
    'givenName':'Initial',
    'surname':'Initial',
    'email':'Initial',
    'userId':'Initial',
    'guid':'Initial',
    'authorizationDirectory':'Initial',
  }

def UserTestDataUpdate():
  return {
    'authorizationID':'Changed',
    'givenName':'Changed',
    'surname':'Changed',
    'email':'Changed',
    'userId':'Changed',
    'guid':'Changed',
    'authorizationDirectory':'Changed',
  }


def UserDetailsViewModelTestDataCreate():
  return {
    'givenName':'Initial',
    'surname':'Initial',
    'email':'Initial',
    'active':True,
  }

def UserDetailsViewModelTestDataUpdate():
  return {
    'givenName':'Changed',
    'surname':'Changed',
    'email':'Changed',
    'active':False,
  }


def UserRoleTestDataCreate():
  return {
    'effective_date': '2017-01-01',
    'expiration_date': '2017-02-01',
  }

def UserRoleTestDataUpdate():
  return {
    'effective_date': '2018-01-01',
    'expiration_date': '2018-02-01',
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

