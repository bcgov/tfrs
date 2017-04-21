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

from django.test import TestCase
from django.test import Client

from rest_framework.test import APIRequestFactory
from rest_framework import status

from .models.Attachment import Attachment
from .serializers import AttachmentSerializer
from .models.AttachmentViewModel import AttachmentViewModel
from .serializers import AttachmentViewModelSerializer
from .models.Audit import Audit
from .serializers import AuditSerializer
from .models.CompliancePeriod import CompliancePeriod
from .serializers import CompliancePeriodSerializer
from .models.Contact import Contact
from .serializers import ContactSerializer
from .models.CreditTrade import CreditTrade
from .serializers import CreditTradeSerializer
from .models.CreditTradeLogEntry import CreditTradeLogEntry
from .serializers import CreditTradeLogEntrySerializer
from .models.CurrentUserViewModel import CurrentUserViewModel
from .serializers import CurrentUserViewModelSerializer
from .models.FuelSupplier import FuelSupplier
from .serializers import FuelSupplierSerializer
from .models.Group import Group
from .serializers import GroupSerializer
from .models.GroupMembership import GroupMembership
from .serializers import GroupMembershipSerializer
from .models.GroupMembershipViewModel import GroupMembershipViewModel
from .serializers import GroupMembershipViewModelSerializer
from .models.GroupViewModel import GroupViewModel
from .serializers import GroupViewModelSerializer
from .models.History import History
from .serializers import HistorySerializer
from .models.HistoryViewModel import HistoryViewModel
from .serializers import HistoryViewModelSerializer
from .models.LookupList import LookupList
from .serializers import LookupListSerializer
from .models.Note import Note
from .serializers import NoteSerializer
from .models.Notification import Notification
from .serializers import NotificationSerializer
from .models.NotificationEvent import NotificationEvent
from .serializers import NotificationEventSerializer
from .models.NotificationViewModel import NotificationViewModel
from .serializers import NotificationViewModelSerializer
from .models.Permission import Permission
from .serializers import PermissionSerializer
from .models.PermissionViewModel import PermissionViewModel
from .serializers import PermissionViewModelSerializer
from .models.Role import Role
from .serializers import RoleSerializer
from .models.RolePermission import RolePermission
from .serializers import RolePermissionSerializer
from .models.RolePermissionViewModel import RolePermissionViewModel
from .serializers import RolePermissionViewModelSerializer
from .models.RoleViewModel import RoleViewModel
from .serializers import RoleViewModelSerializer
from .models.User import User
from .serializers import UserSerializer
from .models.UserDetailsViewModel import UserDetailsViewModel
from .serializers import UserDetailsViewModelSerializer
from .models.UserFavourite import UserFavourite
from .serializers import UserFavouriteSerializer
from .models.UserFavouriteViewModel import UserFavouriteViewModel
from .serializers import UserFavouriteViewModelSerializer
from .models.UserRole import UserRole
from .serializers import UserRoleSerializer
from .models.UserRoleViewModel import UserRoleViewModel
from .serializers import UserRoleViewModelSerializer
from .models.UserViewModel import UserViewModel
from .serializers import UserViewModelSerializer


class Test_Api(TestCase):

    def setUp(self):
        # Every test needs a client.
        self.client = Client()


    def test_attachmentsBulkPost(self):
        serializer_class = AttachmentSerializer
        response = self.client.post('/api/attachments/bulk/')
        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        

    def test_attachmentsGet(self):
        response = self.client.get('/api/attachments/')
        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        

    def test_attachmentsIdDeletePost(self):
        testID = 1
        testURL = operation.path.replace ("(.*)",testId)
        response = self.client.post('/api/attachments/(.*)/delete/')
        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        

    def test_attachmentsIdDownloadGet(self):
        self.fail("Not implemented")        

    def test_attachmentsIdGet(self):
        response = self.client.get('/api/attachments/(.*)/')
        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        

    def test_attachmentsIdPut(self):
        response = self.client.put('/api/attachments/(.*)/')
        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        

    def test_attachmentsPost(self):
        serializer_class = AttachmentSerializer
        response = self.client.post('/api/attachments/'
)        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        

    def test_complianceperiodsBulkPost(self):
        serializer_class = CompliancePeriodSerializer
        response = self.client.post('/api/complianceperiods/bulk/')
        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        

    def test_complianceperiodsGet(self):
        response = self.client.get('/api/complianceperiods/')
        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        

    def test_complianceperiodsIdDeletePost(self):
        testID = 1
        testURL = operation.path.replace ("(.*)",testId)
        response = self.client.post('/api/complianceperiods/(.*)/delete/')
        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        

    def test_complianceperiodsIdGet(self):
        response = self.client.get('/api/complianceperiods/(.*)/')
        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        

    def test_complianceperiodsIdPut(self):
        response = self.client.put('/api/complianceperiods/(.*)/')
        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        

    def test_complianceperiodsPost(self):
        serializer_class = CompliancePeriodSerializer
        response = self.client.post('/api/complianceperiods/'
)        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        

    def test_contactsBulkPost(self):
        serializer_class = ContactSerializer
        response = self.client.post('/api/contacts/bulk/')
        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        

    def test_contactsGet(self):
        response = self.client.get('/api/contacts/')
        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        

    def test_contactsIdDeletePost(self):
        testID = 1
        testURL = operation.path.replace ("(.*)",testId)
        response = self.client.post('/api/contacts/(.*)/delete/')
        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        

    def test_contactsIdGet(self):
        response = self.client.get('/api/contacts/(.*)/')
        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        

    def test_contactsIdPut(self):
        response = self.client.put('/api/contacts/(.*)/')
        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        

    def test_contactsPost(self):
        serializer_class = ContactSerializer
        response = self.client.post('/api/contacts/'
)        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        

    def test_creditTradeIdNotesGet(self):
        self.fail("Not implemented")        

    def test_credittradesBulkPost(self):
        serializer_class = CreditTradeSerializer
        response = self.client.post('/api/credittrades/bulk/')
        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        

    def test_credittradesGet(self):
        response = self.client.get('/api/credittrades/')
        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        

    def test_credittradesIdAttachmentsGet(self):
        self.fail("Not implemented")        

    def test_credittradesIdDeletePost(self):
        testID = 1
        testURL = operation.path.replace ("(.*)",testId)
        response = self.client.post('/api/credittrades/(.*)/delete/')
        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        

    def test_credittradesIdGet(self):
        response = self.client.get('/api/credittrades/(.*)/')
        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        

    def test_credittradesIdHistoryGet(self):
        self.fail("Not implemented")        

    def test_credittradesIdHistoryPost(self):
        self.fail("Not implemented")        

    def test_credittradesIdPut(self):
        response = self.client.put('/api/credittrades/(.*)/')
        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        

    def test_credittradesPost(self):
        serializer_class = CreditTradeSerializer
        response = self.client.post('/api/credittrades/'
)        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        

    def test_credittradingSearchGet(self):
        self.fail("Not implemented")        

    def test_credittradetradelogentriesBulkPost(self):
        serializer_class = CreditTradeLogEntrySerializer
        response = self.client.post('/api/credittradetradelogentries/bulk/')
        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        

    def test_credittradetradelogentriesGet(self):
        response = self.client.get('/api/credittradetradelogentries/')
        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        

    def test_credittradetradelogentriesIdDeletePost(self):
        testID = 1
        testURL = operation.path.replace ("(.*)",testId)
        response = self.client.post('/api/credittradetradelogentries/(.*)/delete/')
        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        

    def test_credittradetradelogentriesIdGet(self):
        response = self.client.get('/api/credittradetradelogentries/(.*)/')
        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        

    def test_credittradetradelogentriesIdPut(self):
        response = self.client.put('/api/credittradetradelogentries/(.*)/')
        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        

    def test_credittradetradelogentriesPost(self):
        serializer_class = CreditTradeLogEntrySerializer
        response = self.client.post('/api/credittradetradelogentries/'
)        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        

    def test_usersCurrentFavouritesIdDeletePost(self):
        self.fail("Not implemented")        

    def test_usersCurrentFavouritesPost(self):
        self.fail("Not implemented")        

    def test_usersCurrentFavouritesPut(self):
        self.fail("Not implemented")        

    def test_usersCurrentFavouritesTypeGet(self):
        self.fail("Not implemented")        

    def test_usersCurrentGet(self):
        self.fail("Not implemented")        

    def test_fuelsuppliersBulkPost(self):
        serializer_class = FuelSupplierSerializer
        response = self.client.post('/api/fuelsuppliers/bulk/')
        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        

    def test_fuelsuppliersGet(self):
        response = self.client.get('/api/fuelsuppliers/')
        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        

    def test_fuelsuppliersIdAttachmentsGet(self):
        self.fail("Not implemented")        

    def test_fuelsuppliersIdDeletePost(self):
        testID = 1
        testURL = operation.path.replace ("(.*)",testId)
        response = self.client.post('/api/fuelsuppliers/(.*)/delete/')
        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        

    def test_fuelsuppliersIdGet(self):
        response = self.client.get('/api/fuelsuppliers/(.*)/')
        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        

    def test_fuelsuppliersIdHistoryGet(self):
        self.fail("Not implemented")        

    def test_fuelsuppliersIdHistoryPost(self):
        self.fail("Not implemented")        

    def test_fuelsuppliersIdNotesGet(self):
        self.fail("Not implemented")        

    def test_fuelsuppliersIdPut(self):
        response = self.client.put('/api/fuelsuppliers/(.*)/')
        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        

    def test_fuelsuppliersPost(self):
        serializer_class = FuelSupplierSerializer
        response = self.client.post('/api/fuelsuppliers/'
)        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        

    def test_fuelsuppliersSearchGet(self):
        self.fail("Not implemented")        

    def test_groupsBulkPost(self):
        serializer_class = GroupSerializer
        response = self.client.post('/api/groups/bulk/')
        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        

    def test_groupsGet(self):
        response = self.client.get('/api/groups/')
        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        

    def test_groupsIdDeletePost(self):
        testID = 1
        testURL = operation.path.replace ("(.*)",testId)
        response = self.client.post('/api/groups/(.*)/delete/')
        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        

    def test_groupsIdGet(self):
        response = self.client.get('/api/groups/(.*)/')
        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        

    def test_groupsIdPut(self):
        response = self.client.put('/api/groups/(.*)/')
        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        

    def test_groupsIdUsersGet(self):
        self.fail("Not implemented")        

    def test_groupsPost(self):
        serializer_class = GroupSerializer
        response = self.client.post('/api/groups/'
)        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        

    def test_historiesBulkPost(self):
        serializer_class = HistorySerializer
        response = self.client.post('/api/histories/bulk/')
        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        

    def test_historiesGet(self):
        response = self.client.get('/api/histories/')
        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        

    def test_historiesIdDeletePost(self):
        testID = 1
        testURL = operation.path.replace ("(.*)",testId)
        response = self.client.post('/api/histories/(.*)/delete/')
        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        

    def test_historiesIdGet(self):
        response = self.client.get('/api/histories/(.*)/')
        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        

    def test_historiesIdPut(self):
        response = self.client.put('/api/histories/(.*)/')
        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        

    def test_historiesPost(self):
        serializer_class = HistorySerializer
        response = self.client.post('/api/histories/'
)        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        

    def test_lookuplistsBulkPost(self):
        serializer_class = LookupListSerializer
        response = self.client.post('/api/lookuplists/bulk/')
        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        

    def test_lookuplistsGet(self):
        response = self.client.get('/api/lookuplists/')
        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        

    def test_lookuplistsIdDeletePost(self):
        testID = 1
        testURL = operation.path.replace ("(.*)",testId)
        response = self.client.post('/api/lookuplists/(.*)/delete/')
        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        

    def test_lookuplistsIdGet(self):
        response = self.client.get('/api/lookuplists/(.*)/')
        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        

    def test_lookuplistsIdPut(self):
        response = self.client.put('/api/lookuplists/(.*)/')
        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        

    def test_lookuplistsPost(self):
        serializer_class = LookupListSerializer
        response = self.client.post('/api/lookuplists/'
)        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        

    def test_notesBulkPost(self):
        serializer_class = NoteSerializer
        response = self.client.post('/api/notes/bulk/')
        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        

    def test_notesGet(self):
        response = self.client.get('/api/notes/')
        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        

    def test_notesIdDeletePost(self):
        testID = 1
        testURL = operation.path.replace ("(.*)",testId)
        response = self.client.post('/api/notes/(.*)/delete/')
        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        

    def test_notesIdGet(self):
        response = self.client.get('/api/notes/(.*)/')
        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        

    def test_notesIdPut(self):
        response = self.client.put('/api/notes/(.*)/')
        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        

    def test_notesPost(self):
        serializer_class = NoteSerializer
        response = self.client.post('/api/notes/'
)        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        

    def test_notificationsBulkPost(self):
        serializer_class = NotificationSerializer
        response = self.client.post('/api/notifications/bulk/')
        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        

    def test_notificationsGet(self):
        response = self.client.get('/api/notifications/')
        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        

    def test_notificationsIdDeletePost(self):
        testID = 1
        testURL = operation.path.replace ("(.*)",testId)
        response = self.client.post('/api/notifications/(.*)/delete/')
        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        

    def test_notificationsIdGet(self):
        response = self.client.get('/api/notifications/(.*)/')
        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        

    def test_notificationsIdPut(self):
        response = self.client.put('/api/notifications/(.*)/')
        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        

    def test_notificationsPost(self):
        serializer_class = NotificationSerializer
        response = self.client.post('/api/notifications/'
)        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        

    def test_notificationeventsBulkPost(self):
        serializer_class = NotificationEventSerializer
        response = self.client.post('/api/notificationevents/bulk/')
        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        

    def test_notificationeventsGet(self):
        response = self.client.get('/api/notificationevents/')
        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        

    def test_notificationeventsIdDeletePost(self):
        testID = 1
        testURL = operation.path.replace ("(.*)",testId)
        response = self.client.post('/api/notificationevents/(.*)/delete/')
        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        

    def test_notificationeventsIdGet(self):
        response = self.client.get('/api/notificationevents/(.*)/')
        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        

    def test_notificationeventsIdPut(self):
        response = self.client.put('/api/notificationevents/(.*)/')
        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        

    def test_notificationeventsPost(self):
        serializer_class = NotificationEventSerializer
        response = self.client.post('/api/notificationevents/'
)        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        

    def test_permissionsBulkPost(self):
        serializer_class = PermissionSerializer
        response = self.client.post('/api/permissions/bulk/')
        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        

    def test_permissionsGet(self):
        response = self.client.get('/api/permissions/')
        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        

    def test_permissionsIdDeletePost(self):
        testID = 1
        testURL = operation.path.replace ("(.*)",testId)
        response = self.client.post('/api/permissions/(.*)/delete/')
        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        

    def test_permissionsIdGet(self):
        response = self.client.get('/api/permissions/(.*)/')
        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        

    def test_permissionsIdPut(self):
        response = self.client.put('/api/permissions/(.*)/')
        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        

    def test_permissionsPost(self):
        serializer_class = PermissionSerializer
        response = self.client.post('/api/permissions/'
)        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        

    def test_rolesBulkPost(self):
        serializer_class = RoleSerializer
        response = self.client.post('/api/roles/bulk/')
        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        

    def test_rolesGet(self):
        response = self.client.get('/api/roles/')
        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        

    def test_rolesIdDeletePost(self):
        testID = 1
        testURL = operation.path.replace ("(.*)",testId)
        response = self.client.post('/api/roles/(.*)/delete/')
        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        

    def test_rolesIdGet(self):
        response = self.client.get('/api/roles/(.*)/')
        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        

    def test_rolesIdPermissionsGet(self):
        self.fail("Not implemented")        

    def test_rolesIdPermissionsPost(self):
        self.fail("Not implemented")        

    def test_rolesIdPermissionsPut(self):
        self.fail("Not implemented")        

    def test_rolesIdPut(self):
        response = self.client.put('/api/roles/(.*)/')
        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        

    def test_rolesIdUsersGet(self):
        self.fail("Not implemented")        

    def test_rolesIdUsersPut(self):
        self.fail("Not implemented")        

    def test_rolesPost(self):
        serializer_class = RoleSerializer
        response = self.client.post('/api/roles/'
)        # Check that the response is 200 OK.
        assert status.HTTP_200_OK == response.status_code
        

    def test_usersBulkPost(self):
        self.fail("Not implemented")        

    def test_usersGet(self):
        self.fail("Not implemented")        

    def test_usersIdDeletePost(self):
        self.fail("Not implemented")        

    def test_usersIdFavouritesGet(self):
        self.fail("Not implemented")        

    def test_usersIdFavouritesPost(self):
        self.fail("Not implemented")        

    def test_usersIdFavouritesPut(self):
        self.fail("Not implemented")        

    def test_usersIdGet(self):
        self.fail("Not implemented")        

    def test_usersIdGroupsGet(self):
        self.fail("Not implemented")        

    def test_usersIdGroupsPost(self):
        self.fail("Not implemented")        

    def test_usersIdGroupsPut(self):
        self.fail("Not implemented")        

    def test_usersIdNotificationsGet(self):
        self.fail("Not implemented")        

    def test_usersIdPermissionsGet(self):
        self.fail("Not implemented")        

    def test_usersIdPut(self):
        self.fail("Not implemented")        

    def test_usersIdRolesGet(self):
        self.fail("Not implemented")        

    def test_usersIdRolesPost(self):
        self.fail("Not implemented")        

    def test_usersIdRolesPut(self):
        self.fail("Not implemented")        

    def test_usersPost(self):
        self.fail("Not implemented")        

    def test_usersSearchGet(self):
        self.fail("Not implemented")        

if __name__ == '__main__':
    unittest.main()




