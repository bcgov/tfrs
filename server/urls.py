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

from django.conf.urls import url
from .views.Attachment import *
from .views.CompliancePeriod import *
from .views.Contact import *
from .views.CreditTrade import *
from .views.CreditTradeLogEntry import *
from .views.CurrentUser import *
from .views.FuelSupplier import *
from .views.Group import *
from .views.History import *
from .views.LookupList import *
from .views.Note import *
from .views.Notification import *
from .views.NotificationEvent import *
from .views.Permission import *
from .views.Role import *
from .views.User import *
from rest_framework.urlpatterns import format_suffix_patterns
from rest_framework_swagger.views import get_swagger_view
from . import views

from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.schemas import SchemaGenerator
from rest_framework.views import APIView
from rest_framework_swagger import renderers

class SwaggerSchemaView(APIView):
    permission_classes = [AllowAny]
    renderer_classes = [
        renderers.OpenAPIRenderer,
        renderers.SwaggerUIRenderer
    ]
    _ignore_model_permissions = True
    exclude_from_schema = True  
    def get(self, request):
        generator = SchemaGenerator()
        schema = generator.get_schema(request=request)
        return Response(schema)

urlpatterns = [
    # Swagger documentation
    url(r'^$', SwaggerSchemaView.as_view()),
    url(r'^/attachments/bulk/$', views.Attachment.attachmentsBulkPost.as_view()),
    url(r'^/attachments/$', views.Attachment.attachmentsGet.as_view()),
    url(r'^/attachments/(.*)/delete/$', views.Attachment.attachmentsIdDeletePost.as_view()),
    url(r'^/attachments/(.*)/download/$', views.Attachment.attachmentsIdDownloadGet.as_view()),
    url(r'^/attachments/(.*)/$', views.Attachment.attachmentsIdGet.as_view()),
    url(r'^/attachments/(.*)/$', views.Attachment.attachmentsIdPut.as_view()),
    url(r'^/attachments/$', views.Attachment.attachmentsPost.as_view()),
    url(r'^/complianceperiods/bulk/$', views.CompliancePeriod.complianceperiodsBulkPost.as_view()),
    url(r'^/complianceperiods/$', views.CompliancePeriod.complianceperiodsGet.as_view()),
    url(r'^/complianceperiods/(.*)/delete/$', views.CompliancePeriod.complianceperiodsIdDeletePost.as_view()),
    url(r'^/complianceperiods/(.*)/$', views.CompliancePeriod.complianceperiodsIdGet.as_view()),
    url(r'^/complianceperiods/(.*)/$', views.CompliancePeriod.complianceperiodsIdPut.as_view()),
    url(r'^/complianceperiods/$', views.CompliancePeriod.complianceperiodsPost.as_view()),
    url(r'^/contacts/bulk/$', views.Contact.contactsBulkPost.as_view()),
    url(r'^/contacts/$', views.Contact.contactsGet.as_view()),
    url(r'^/contacts/(.*)/delete/$', views.Contact.contactsIdDeletePost.as_view()),
    url(r'^/contacts/(.*)/$', views.Contact.contactsIdGet.as_view()),
    url(r'^/contacts/(.*)/$', views.Contact.contactsIdPut.as_view()),
    url(r'^/contacts/$', views.Contact.contactsPost.as_view()),
    url(r'^/creditTrade/(.*)/notes/$', views.CreditTrade.creditTradeIdNotesGet.as_view()),
    url(r'^/credittrades/bulk/$', views.CreditTrade.credittradesBulkPost.as_view()),
    url(r'^/credittrades/$', views.CreditTrade.credittradesGet.as_view()),
    url(r'^/credittrades/(.*)/attachments/$', views.CreditTrade.credittradesIdAttachmentsGet.as_view()),
    url(r'^/credittrades/(.*)/delete/$', views.CreditTrade.credittradesIdDeletePost.as_view()),
    url(r'^/credittrades/(.*)/$', views.CreditTrade.credittradesIdGet.as_view()),
    url(r'^/credittrades/(.*)/history/$', views.CreditTrade.credittradesIdHistoryGet.as_view()),
    url(r'^/credittrades/(.*)/history/$', views.CreditTrade.credittradesIdHistoryPost.as_view()),
    url(r'^/credittrades/(.*)/$', views.CreditTrade.credittradesIdPut.as_view()),
    url(r'^/credittrades/$', views.CreditTrade.credittradesPost.as_view()),
    url(r'^/credittrading/search/$', views.CreditTrade.credittradingSearchGet.as_view()),
    url(r'^/credittradetradelogentries/bulk/$', views.CreditTradeLogEntry.credittradetradelogentriesBulkPost.as_view()),
    url(r'^/credittradetradelogentries/$', views.CreditTradeLogEntry.credittradetradelogentriesGet.as_view()),
    url(r'^/credittradetradelogentries/(.*)/delete/$', views.CreditTradeLogEntry.credittradetradelogentriesIdDeletePost.as_view()),
    url(r'^/credittradetradelogentries/(.*)/$', views.CreditTradeLogEntry.credittradetradelogentriesIdGet.as_view()),
    url(r'^/credittradetradelogentries/(.*)/$', views.CreditTradeLogEntry.credittradetradelogentriesIdPut.as_view()),
    url(r'^/credittradetradelogentries/$', views.CreditTradeLogEntry.credittradetradelogentriesPost.as_view()),
    url(r'^/users/current/favourites/(.*)/delete/$', views.CurrentUser.usersCurrentFavouritesIdDeletePost.as_view()),
    url(r'^/users/current/favourites/$', views.CurrentUser.usersCurrentFavouritesPost.as_view()),
    url(r'^/users/current/favourites/$', views.CurrentUser.usersCurrentFavouritesPut.as_view()),
    url(r'^/users/current/favourites/(.*)/$', views.CurrentUser.usersCurrentFavouritesTypeGet.as_view()),
    url(r'^/users/current/$', views.CurrentUser.usersCurrentGet.as_view()),
    url(r'^/fuelsuppliers/bulk/$', views.FuelSupplier.fuelsuppliersBulkPost.as_view()),
    url(r'^/fuelsuppliers/$', views.FuelSupplier.fuelsuppliersGet.as_view()),
    url(r'^/fuelsuppliers/(.*)/attachments/$', views.FuelSupplier.fuelsuppliersIdAttachmentsGet.as_view()),
    url(r'^/fuelsuppliers/(.*)/delete/$', views.FuelSupplier.fuelsuppliersIdDeletePost.as_view()),
    url(r'^/fuelsuppliers/(.*)/$', views.FuelSupplier.fuelsuppliersIdGet.as_view()),
    url(r'^/fuelsuppliers/(.*)/history/$', views.FuelSupplier.fuelsuppliersIdHistoryGet.as_view()),
    url(r'^/fuelsuppliers/(.*)/history/$', views.FuelSupplier.fuelsuppliersIdHistoryPost.as_view()),
    url(r'^/fuelsuppliers/(.*)/notes/$', views.FuelSupplier.fuelsuppliersIdNotesGet.as_view()),
    url(r'^/fuelsuppliers/(.*)/$', views.FuelSupplier.fuelsuppliersIdPut.as_view()),
    url(r'^/fuelsuppliers/$', views.FuelSupplier.fuelsuppliersPost.as_view()),
    url(r'^/fuelsuppliers/search/$', views.FuelSupplier.fuelsuppliersSearchGet.as_view()),
    url(r'^/groups/bulk/$', views.Group.groupsBulkPost.as_view()),
    url(r'^/groups/$', views.Group.groupsGet.as_view()),
    url(r'^/groups/(.*)/delete/$', views.Group.groupsIdDeletePost.as_view()),
    url(r'^/groups/(.*)/$', views.Group.groupsIdGet.as_view()),
    url(r'^/groups/(.*)/$', views.Group.groupsIdPut.as_view()),
    url(r'^/groups/(.*)/users/$', views.Group.groupsIdUsersGet.as_view()),
    url(r'^/groups/$', views.Group.groupsPost.as_view()),
    url(r'^/histories/bulk/$', views.History.historiesBulkPost.as_view()),
    url(r'^/histories/$', views.History.historiesGet.as_view()),
    url(r'^/histories/(.*)/delete/$', views.History.historiesIdDeletePost.as_view()),
    url(r'^/histories/(.*)/$', views.History.historiesIdGet.as_view()),
    url(r'^/histories/(.*)/$', views.History.historiesIdPut.as_view()),
    url(r'^/histories/$', views.History.historiesPost.as_view()),
    url(r'^/lookuplists/bulk/$', views.LookupList.lookuplistsBulkPost.as_view()),
    url(r'^/lookuplists/$', views.LookupList.lookuplistsGet.as_view()),
    url(r'^/lookuplists/(.*)/delete/$', views.LookupList.lookuplistsIdDeletePost.as_view()),
    url(r'^/lookuplists/(.*)/$', views.LookupList.lookuplistsIdGet.as_view()),
    url(r'^/lookuplists/(.*)/$', views.LookupList.lookuplistsIdPut.as_view()),
    url(r'^/lookuplists/$', views.LookupList.lookuplistsPost.as_view()),
    url(r'^/notes/bulk/$', views.Note.notesBulkPost.as_view()),
    url(r'^/notes/$', views.Note.notesGet.as_view()),
    url(r'^/notes/(.*)/delete/$', views.Note.notesIdDeletePost.as_view()),
    url(r'^/notes/(.*)/$', views.Note.notesIdGet.as_view()),
    url(r'^/notes/(.*)/$', views.Note.notesIdPut.as_view()),
    url(r'^/notes/$', views.Note.notesPost.as_view()),
    url(r'^/notifications/bulk/$', views.Notification.notificationsBulkPost.as_view()),
    url(r'^/notifications/$', views.Notification.notificationsGet.as_view()),
    url(r'^/notifications/(.*)/delete/$', views.Notification.notificationsIdDeletePost.as_view()),
    url(r'^/notifications/(.*)/$', views.Notification.notificationsIdGet.as_view()),
    url(r'^/notifications/(.*)/$', views.Notification.notificationsIdPut.as_view()),
    url(r'^/notifications/$', views.Notification.notificationsPost.as_view()),
    url(r'^/notificationevents/bulk/$', views.NotificationEvent.notificationeventsBulkPost.as_view()),
    url(r'^/notificationevents/$', views.NotificationEvent.notificationeventsGet.as_view()),
    url(r'^/notificationevents/(.*)/delete/$', views.NotificationEvent.notificationeventsIdDeletePost.as_view()),
    url(r'^/notificationevents/(.*)/$', views.NotificationEvent.notificationeventsIdGet.as_view()),
    url(r'^/notificationevents/(.*)/$', views.NotificationEvent.notificationeventsIdPut.as_view()),
    url(r'^/notificationevents/$', views.NotificationEvent.notificationeventsPost.as_view()),
    url(r'^/permissions/bulk/$', views.Permission.permissionsBulkPost.as_view()),
    url(r'^/permissions/$', views.Permission.permissionsGet.as_view()),
    url(r'^/permissions/(.*)/delete/$', views.Permission.permissionsIdDeletePost.as_view()),
    url(r'^/permissions/(.*)/$', views.Permission.permissionsIdGet.as_view()),
    url(r'^/permissions/(.*)/$', views.Permission.permissionsIdPut.as_view()),
    url(r'^/permissions/$', views.Permission.permissionsPost.as_view()),
    url(r'^/roles/bulk/$', views.Role.rolesBulkPost.as_view()),
    url(r'^/roles/$', views.Role.rolesGet.as_view()),
    url(r'^/roles/(.*)/delete/$', views.Role.rolesIdDeletePost.as_view()),
    url(r'^/roles/(.*)/$', views.Role.rolesIdGet.as_view()),
    url(r'^/roles/(.*)/permissions/$', views.Role.rolesIdPermissionsGet.as_view()),
    url(r'^/roles/(.*)/permissions/$', views.Role.rolesIdPermissionsPost.as_view()),
    url(r'^/roles/(.*)/permissions/$', views.Role.rolesIdPermissionsPut.as_view()),
    url(r'^/roles/(.*)/$', views.Role.rolesIdPut.as_view()),
    url(r'^/roles/(.*)/users/$', views.Role.rolesIdUsersGet.as_view()),
    url(r'^/roles/(.*)/users/$', views.Role.rolesIdUsersPut.as_view()),
    url(r'^/roles/$', views.Role.rolesPost.as_view()),
    url(r'^/users/bulk/$', views.User.usersBulkPost.as_view()),
    url(r'^/users/$', views.User.usersGet.as_view()),
    url(r'^/users/(.*)/delete/$', views.User.usersIdDeletePost.as_view()),
    url(r'^/users/(.*)/favourites/$', views.User.usersIdFavouritesGet.as_view()),
    url(r'^/users/(.*)/favourites/$', views.User.usersIdFavouritesPost.as_view()),
    url(r'^/users/(.*)/favourites/$', views.User.usersIdFavouritesPut.as_view()),
    url(r'^/users/(.*)/$', views.User.usersIdGet.as_view()),
    url(r'^/users/(.*)/groups/$', views.User.usersIdGroupsGet.as_view()),
    url(r'^/users/(.*)/groups/$', views.User.usersIdGroupsPost.as_view()),
    url(r'^/users/(.*)/groups/$', views.User.usersIdGroupsPut.as_view()),
    url(r'^/users/(.*)/notifications/$', views.User.usersIdNotificationsGet.as_view()),
    url(r'^/users/(.*)/permissions/$', views.User.usersIdPermissionsGet.as_view()),
    url(r'^/users/(.*)/$', views.User.usersIdPut.as_view()),
    url(r'^/users/(.*)/roles/$', views.User.usersIdRolesGet.as_view()),
    url(r'^/users/(.*)/roles/$', views.User.usersIdRolesPost.as_view()),
    url(r'^/users/(.*)/roles/$', views.User.usersIdRolesPut.as_view()),
    url(r'^/users/$', views.User.usersPost.as_view()),
    url(r'^/users/search/$', views.User.usersSearchGet.as_view())
]

urlpatterns = format_suffix_patterns(urlpatterns)
