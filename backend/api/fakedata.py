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
    'number_of_credits': 1,
  }

def CreditTradeTestDataUpdate():
  return {
    'number_of_credits':0,
  }


def CreditTradeHistoryTestDataCreate():
  return {
    'number_of_credits':1,
    'note':'Initial',
    'is_internal_history_record':True,
  }

def CreditTradeHistoryTestDataUpdate():
  return {
    'number_of_credits':0,
    'note':'Changed',
    'is_internal_history_record':False,
  }


def CreditTradeStatusTestDataCreate():
  return {
    'status':'Initial',
    'description':'Initial',
    'display_order':1,
    'effective_date': '2017-01-01',
  }

def CreditTradeStatusTestDataUpdate():
  return {
    'status':'Changed',
    'description':'Changed',
    'display_order':0,
    'effective_date': '2017-01-01',
  }


def CreditTradeTypeTestDataCreate():
  return {
    'the_type':'Initial',
    'description':'Initial',
    'display_order':1,
    'is_gov_only_type':True,
    'effective_date': '2017-01-01',
    'expiration_date': '2017-02-01',
  }

def CreditTradeTypeTestDataUpdate():
  return {
    'the_type':'Changed',
    'description':'Changed',
    'display_order':0,
    'is_gov_only_type':False,
    'effective_date': '2017-01-01',
    'expiration_date': '2017-02-01',
  }


def CreditTradeZeroReasonTestDataCreate():
  return {
    'reason':'Initial',
    'description':'Initial',
    'display_order':1,
    'effective_date': '2017-01-01',
  }

def CreditTradeZeroReasonTestDataUpdate():
  return {
    'reason':'Changed',
    'description':'Changed',
    'display_order':0,
    'effective_date': '2017-01-01',
  }


def CurrentUserViewModelTestDataCreate():
  return {
    'given_name':'Initial',
    'surname':'Initial',
    'email':'Initial',
    'active':True,
    'sm_authorization_id':'Initial',
    'smAuthorizationDirectory':'Initial',
  }

def CurrentUserViewModelTestDataUpdate():
  return {
    'given_name':'Changed',
    'surname':'Changed',
    'email':'Changed',
    'active':False,
    'sm_authorization_id':'Changed',
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
    'the_type':'Initial',
    'description':'Initial',
    'display_order':1,
    'effective_date': '2017-01-01',
  }

def OrganizationActionsTypeTestDataUpdate():
  return {
    'the_type':'Changed',
    'description':'Changed',
    'display_order':0,
    'effective_date': '2018-01-01',
  }


def OrganizationAttachmentTestDataCreate():
  return {
    'file_name':'Initial',
    'file_location':'Initial',
    'description':'Initial',
    'compliance_year':'Initial',
  }

def OrganizationAttachmentTestDataUpdate():
  return {
    'file_name':'Changed',
    'file_location':'Changed',
    'description':'Changed',
    'compliance_year':'Changed',
  }


def OrganizationBalanceTestDataCreate():
  return {
    'validated_credits':1,
  }

def OrganizationBalanceTestDataUpdate():
  return {
    'validated_credits':0,
  }


def OrganizationHistoryTestDataCreate():
  return {
    'history_text':'Initial',
  }

def OrganizationHistoryTestDataUpdate():
  return {
    'history_text':'Changed',
  }


def OrganizationStatusTestDataCreate():
  return {
    'status':'Initial',
    'description':'Initial',
    'display_order':1,
    'effective_date': '2017-01-01',
    'expiration_date': '2017-02-01',
  }

def OrganizationStatusTestDataUpdate():
  return {
    'status':'Changed',
    'description':'Changed',
    'display_order':0,
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
    'the_type':'Initial',
    'description':'Initial',
    'display_order':1,
    'effective_date': '2017-01-01',
  }

def NotificationTypeTestDataUpdate():
  return {
    'the_type':'Changed',
    'description':'Changed',
    'display_order':0,
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
    'authorization_id':1,
  }

def NotificationViewModelTestDataUpdate():
  return {
    'eventId':0,
    'hasBeenViewed':False,
    'isWatchNotification':False,
    'isExpired':False,
    'isAllDay':False,
    'priorityCode':'Changed',
    'authorization_id':0,
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
    'role_id':1,
    'permission_id':1,
  }

def RolePermissionViewModelTestDataUpdate():
  return {
    'role_id':0,
    'permission_id':0,
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
    'given_name':'Initial',
    'surname':'Initial',
    'email':'Initial',
    'authorization_id':'Initial',
    'authorization_guid':'Initial',
    'authorization_directory':'Initial',
  }

def UserTestDataUpdate():
  return {
    'authorizationID':'Changed',
    'given_name':'Changed',
    'surname':'Changed',
    'email':'Changed',
    'authorization_id':'Changed',
    'authorization_guid':'Changed',
    'authorization_directory':'Changed',
  }


def UserDetailsViewModelTestDataCreate():
  return {
    'given_name':'Initial',
    'surname':'Initial',
    'email':'Initial',
    'active':True,
  }

def UserDetailsViewModelTestDataUpdate():
  return {
    'given_name':'Changed',
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
    'role_id':1,
    'authorization_id':1,
  }

def UserRoleViewModelTestDataUpdate():
  return {
    'role_id':0,
    'authorization_id':0,
  }


def UserViewModelTestDataCreate():
  return {
    'given_name':'Initial',
    'surname':'Initial',
    'email':'Initial',
    'active':True,
    'sm_authorization_id':'Initial',
  }

def UserViewModelTestDataUpdate():
  return {
    'given_name':'Changed',
    'surname':'Changed',
    'email':'Changed',
    'active':False,
    'sm_authorization_id':'Changed',
  }

