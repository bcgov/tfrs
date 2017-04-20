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
from rest_framework.test import APIRequestFactory

class Test_Api(TestCase):

    def test_attachmentsBulkPost(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.POST('/api/attachments/bulk', {})


    def test_attachmentsGet(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.GET('/api/attachments', {})


    def test_attachmentsIdDeletePost(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.POST('/api/attachments/{id}/delete', {})


    def test_attachmentsIdDownloadGet(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.GET('/api/attachments/{id}/download', {})


    def test_attachmentsIdGet(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.GET('/api/attachments/{id}', {})


    def test_attachmentsIdPut(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.PUT('/api/attachments/{id}', {})


    def test_attachmentsPost(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.POST('/api/attachments', {})


    def test_complianceperiodsBulkPost(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.POST('/api/complianceperiods/bulk', {})


    def test_complianceperiodsGet(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.GET('/api/complianceperiods', {})


    def test_complianceperiodsIdDeletePost(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.POST('/api/complianceperiods/{id}/delete', {})


    def test_complianceperiodsIdGet(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.GET('/api/complianceperiods/{id}', {})


    def test_complianceperiodsIdPut(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.PUT('/api/complianceperiods/{id}', {})


    def test_complianceperiodsPost(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.POST('/api/complianceperiods', {})


    def test_contactsBulkPost(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.POST('/api/contacts/bulk', {})


    def test_contactsGet(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.GET('/api/contacts', {})


    def test_contactsIdDeletePost(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.POST('/api/contacts/{id}/delete', {})


    def test_contactsIdGet(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.GET('/api/contacts/{id}', {})


    def test_contactsIdPut(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.PUT('/api/contacts/{id}', {})


    def test_contactsPost(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.POST('/api/contacts', {})


    def test_creditTradeIdNotesGet(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.GET('/api/creditTrade/{id}/notes', {})


    def test_credittradesBulkPost(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.POST('/api/credittrades/bulk', {})


    def test_credittradesGet(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.GET('/api/credittrades', {})


    def test_credittradesIdAttachmentsGet(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.GET('/api/credittrades/{id}/attachments', {})


    def test_credittradesIdDeletePost(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.POST('/api/credittrades/{id}/delete', {})


    def test_credittradesIdGet(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.GET('/api/credittrades/{id}', {})


    def test_credittradesIdHistoryGet(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.GET('/api/credittrades/{id}/history', {})


    def test_credittradesIdHistoryPost(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.POST('/api/credittrades/{id}/history', {})


    def test_credittradesIdPut(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.PUT('/api/credittrades/{id}', {})


    def test_credittradesPost(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.POST('/api/credittrades', {})


    def test_credittradingSearchGet(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.GET('/api/credittrading/search', {})


    def test_credittradetradelogentriesBulkPost(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.POST('/api/credittradetradelogentries/bulk', {})


    def test_credittradetradelogentriesGet(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.GET('/api/credittradetradelogentries', {})


    def test_credittradetradelogentriesIdDeletePost(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.POST('/api/credittradetradelogentries/{id}/delete', {})


    def test_credittradetradelogentriesIdGet(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.GET('/api/credittradetradelogentries/{id}', {})


    def test_credittradetradelogentriesIdPut(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.PUT('/api/credittradetradelogentries/{id}', {})


    def test_credittradetradelogentriesPost(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.POST('/api/credittradetradelogentries', {})


    def test_usersCurrentFavouritesIdDeletePost(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.POST('/api/users/current/favourites/{id}/delete', {})


    def test_usersCurrentFavouritesPost(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.POST('/api/users/current/favourites', {})


    def test_usersCurrentFavouritesPut(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.PUT('/api/users/current/favourites', {})


    def test_usersCurrentFavouritesTypeGet(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.GET('/api/users/current/favourites/{type}', {})


    def test_usersCurrentGet(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.GET('/api/users/current', {})


    def test_fuelsuppliersBulkPost(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.POST('/api/fuelsuppliers/bulk', {})


    def test_fuelsuppliersGet(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.GET('/api/fuelsuppliers', {})


    def test_fuelsuppliersIdAttachmentsGet(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.GET('/api/fuelsuppliers/{id}/attachments', {})


    def test_fuelsuppliersIdDeletePost(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.POST('/api/fuelsuppliers/{id}/delete', {})


    def test_fuelsuppliersIdGet(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.GET('/api/fuelsuppliers/{id}', {})


    def test_fuelsuppliersIdHistoryGet(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.GET('/api/fuelsuppliers/{id}/history', {})


    def test_fuelsuppliersIdHistoryPost(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.POST('/api/fuelsuppliers/{id}/history', {})


    def test_fuelsuppliersIdNotesGet(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.GET('/api/fuelsuppliers/{id}/notes', {})


    def test_fuelsuppliersIdPut(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.PUT('/api/fuelsuppliers/{id}', {})


    def test_fuelsuppliersPost(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.POST('/api/fuelsuppliers', {})


    def test_fuelsuppliersSearchGet(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.GET('/api/fuelsuppliers/search', {})


    def test_groupsBulkPost(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.POST('/api/groups/bulk', {})


    def test_groupsGet(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.GET('/api/groups', {})


    def test_groupsIdDeletePost(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.POST('/api/groups/{id}/delete', {})


    def test_groupsIdGet(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.GET('/api/groups/{id}', {})


    def test_groupsIdPut(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.PUT('/api/groups/{id}', {})


    def test_groupsIdUsersGet(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.GET('/api/groups/{id}/users', {})


    def test_groupsPost(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.POST('/api/groups', {})


    def test_historiesBulkPost(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.POST('/api/histories/bulk', {})


    def test_historiesGet(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.GET('/api/histories', {})


    def test_historiesIdDeletePost(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.POST('/api/histories/{id}/delete', {})


    def test_historiesIdGet(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.GET('/api/histories/{id}', {})


    def test_historiesIdPut(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.PUT('/api/histories/{id}', {})


    def test_historiesPost(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.POST('/api/histories', {})


    def test_lookuplistsBulkPost(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.POST('/api/lookuplists/bulk', {})


    def test_lookuplistsGet(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.GET('/api/lookuplists', {})


    def test_lookuplistsIdDeletePost(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.POST('/api/lookuplists/{id}/delete', {})


    def test_lookuplistsIdGet(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.GET('/api/lookuplists/{id}', {})


    def test_lookuplistsIdPut(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.PUT('/api/lookuplists/{id}', {})


    def test_lookuplistsPost(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.POST('/api/lookuplists', {})


    def test_notesBulkPost(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.POST('/api/notes/bulk', {})


    def test_notesGet(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.GET('/api/notes', {})


    def test_notesIdDeletePost(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.POST('/api/notes/{id}/delete', {})


    def test_notesIdGet(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.GET('/api/notes/{id}', {})


    def test_notesIdPut(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.PUT('/api/notes/{id}', {})


    def test_notesPost(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.POST('/api/notes', {})


    def test_notificationsBulkPost(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.POST('/api/notifications/bulk', {})


    def test_notificationsGet(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.GET('/api/notifications', {})


    def test_notificationsIdDeletePost(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.POST('/api/notifications/{id}/delete', {})


    def test_notificationsIdGet(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.GET('/api/notifications/{id}', {})


    def test_notificationsIdPut(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.PUT('/api/notifications/{id}', {})


    def test_notificationsPost(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.POST('/api/notifications', {})


    def test_notificationeventsBulkPost(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.POST('/api/notificationevents/bulk', {})


    def test_notificationeventsGet(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.GET('/api/notificationevents', {})


    def test_notificationeventsIdDeletePost(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.POST('/api/notificationevents/{id}/delete', {})


    def test_notificationeventsIdGet(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.GET('/api/notificationevents/{id}', {})


    def test_notificationeventsIdPut(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.PUT('/api/notificationevents/{id}', {})


    def test_notificationeventsPost(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.POST('/api/notificationevents', {})


    def test_permissionsBulkPost(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.POST('/api/permissions/bulk', {})


    def test_permissionsGet(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.GET('/api/permissions', {})


    def test_permissionsIdDeletePost(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.POST('/api/permissions/{id}/delete', {})


    def test_permissionsIdGet(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.GET('/api/permissions/{id}', {})


    def test_permissionsIdPut(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.PUT('/api/permissions/{id}', {})


    def test_permissionsPost(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.POST('/api/permissions', {})


    def test_rolesBulkPost(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.POST('/api/roles/bulk', {})


    def test_rolesGet(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.GET('/api/roles', {})


    def test_rolesIdDeletePost(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.POST('/api/roles/{id}/delete', {})


    def test_rolesIdGet(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.GET('/api/roles/{id}', {})


    def test_rolesIdPermissionsGet(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.GET('/api/roles/{id}/permissions', {})


    def test_rolesIdPermissionsPost(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.POST('/api/roles/{id}/permissions', {})


    def test_rolesIdPermissionsPut(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.PUT('/api/roles/{id}/permissions', {})


    def test_rolesIdPut(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.PUT('/api/roles/{id}', {})


    def test_rolesIdUsersGet(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.GET('/api/roles/{id}/users', {})


    def test_rolesIdUsersPut(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.PUT('/api/roles/{id}/users', {})


    def test_rolesPost(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.POST('/api/roles', {})


    def test_usersBulkPost(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.POST('/api/users/bulk', {})


    def test_usersGet(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.GET('/api/users', {})


    def test_usersIdDeletePost(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.POST('/api/users/{id}/delete', {})


    def test_usersIdFavouritesGet(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.GET('/api/users/{id}/favourites', {})


    def test_usersIdFavouritesPost(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.POST('/api/users/{id}/favourites', {})


    def test_usersIdFavouritesPut(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.PUT('/api/users/{id}/favourites', {})


    def test_usersIdGet(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.GET('/api/users/{id}', {})


    def test_usersIdGroupsGet(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.GET('/api/users/{id}/groups', {})


    def test_usersIdGroupsPost(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.POST('/api/users/{id}/groups', {})


    def test_usersIdGroupsPut(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.PUT('/api/users/{id}/groups', {})


    def test_usersIdNotificationsGet(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.GET('/api/users/{id}/notifications', {})


    def test_usersIdPermissionsGet(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.GET('/api/users/{id}/permissions', {})


    def test_usersIdPut(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.PUT('/api/users/{id}', {})


    def test_usersIdRolesGet(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.GET('/api/users/{id}/roles', {})


    def test_usersIdRolesPost(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.POST('/api/users/{id}/roles', {})


    def test_usersIdRolesPut(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.PUT('/api/users/{id}/roles', {})


    def test_usersPost(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.POST('/api/users', {})


    def test_usersSearchGet(self):
        # Using the standard RequestFactory API to create a form request
        factory = APIRequestFactory()
        request = factory.GET('/api/users/search', {})


if __name__ == '__main__':
    unittest.main()




