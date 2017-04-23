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
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.schemas import SchemaGenerator
from rest_framework.views import APIView
from rest_framework.urlpatterns import format_suffix_patterns
from rest_framework_swagger import renderers
from . import views

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
    url(r'^attachments/bulk$', views.attachmentsBulkPost.as_view()),
    url(r'^attachments$', views.attachmentsGet.as_view()),
    url(r'^attachments/(?P<id>[0-9]+)/delete$', views.attachmentsIdDeletePost.as_view()),
    url(r'^attachments/(?P<id>[0-9]+)/download$', views.attachmentsIdDownloadGet.as_view()),
    url(r'^attachments/(?P<id>[0-9]+)$', views.attachmentsIdGet.as_view()),
    url(r'^complianceperiods/bulk$', views.complianceperiodsBulkPost.as_view()),
    url(r'^complianceperiods$', views.complianceperiodsGet.as_view()),
    url(r'^complianceperiods/(?P<id>[0-9]+)/delete$', views.complianceperiodsIdDeletePost.as_view()),
    url(r'^complianceperiods/(?P<id>[0-9]+)$', views.complianceperiodsIdGet.as_view()),
    url(r'^contacts/bulk$', views.contactsBulkPost.as_view()),
    url(r'^contacts$', views.contactsGet.as_view()),
    url(r'^contacts/(?P<id>[0-9]+)/delete$', views.contactsIdDeletePost.as_view()),
    url(r'^contacts/(?P<id>[0-9]+)$', views.contactsIdGet.as_view()),
    url(r'^creditTrade/(?P<id>[0-9]+)/notes$', views.creditTradeIdNotesGet.as_view()),
    url(r'^credittrades/bulk$', views.credittradesBulkPost.as_view()),
    url(r'^credittrades$', views.credittradesGet.as_view()),
    url(r'^credittrades/(?P<id>[0-9]+)/attachments$', views.credittradesIdAttachmentsGet.as_view()),
    url(r'^credittrades/(?P<id>[0-9]+)/delete$', views.credittradesIdDeletePost.as_view()),
    url(r'^credittrades/(?P<id>[0-9]+)$', views.credittradesIdGet.as_view()),
    url(r'^credittrades/(?P<id>[0-9]+)/history$', views.credittradesIdHistoryGet.as_view()),
    url(r'^credittrades/(?P<id>[0-9]+)/history$', views.credittradesIdHistoryPost.as_view()),
    url(r'^credittrading/search$', views.credittradingSearchGet.as_view()),
    url(r'^credittradetradelogentries/bulk$', views.credittradetradelogentriesBulkPost.as_view()),
    url(r'^credittradetradelogentries$', views.credittradetradelogentriesGet.as_view()),
    url(r'^credittradetradelogentries/(?P<id>[0-9]+)/delete$', views.credittradetradelogentriesIdDeletePost.as_view()),
    url(r'^credittradetradelogentries/(?P<id>[0-9]+)$', views.credittradetradelogentriesIdGet.as_view()),
    url(r'^users/current/favourites/(?P<id>[0-9]+)/delete$', views.usersCurrentFavouritesIdDeletePost.as_view()),
    url(r'^users/current/favourites$', views.usersCurrentFavouritesPost.as_view()),
    url(r'^users/current/favourites$', views.usersCurrentFavouritesPut.as_view()),
    url(r'^users/current/favourites/(?P<id>[0-9]+)$', views.usersCurrentFavouritesTypeGet.as_view()),
    url(r'^users/current$', views.usersCurrentGet.as_view()),
    url(r'^fuelsuppliers/bulk$', views.fuelsuppliersBulkPost.as_view()),
    url(r'^fuelsuppliers$', views.fuelsuppliersGet.as_view()),
    url(r'^fuelsuppliers/(?P<id>[0-9]+)/attachments$', views.fuelsuppliersIdAttachmentsGet.as_view()),
    url(r'^fuelsuppliers/(?P<id>[0-9]+)/delete$', views.fuelsuppliersIdDeletePost.as_view()),
    url(r'^fuelsuppliers/(?P<id>[0-9]+)$', views.fuelsuppliersIdGet.as_view()),
    url(r'^fuelsuppliers/(?P<id>[0-9]+)/history$', views.fuelsuppliersIdHistoryGet.as_view()),
    url(r'^fuelsuppliers/(?P<id>[0-9]+)/history$', views.fuelsuppliersIdHistoryPost.as_view()),
    url(r'^fuelsuppliers/(?P<id>[0-9]+)/notes$', views.fuelsuppliersIdNotesGet.as_view()),
    url(r'^fuelsuppliers/search$', views.fuelsuppliersSearchGet.as_view()),
    url(r'^groups/bulk$', views.groupsBulkPost.as_view()),
    url(r'^groups$', views.groupsGet.as_view()),
    url(r'^groups/(?P<id>[0-9]+)/delete$', views.groupsIdDeletePost.as_view()),
    url(r'^groups/(?P<id>[0-9]+)$', views.groupsIdGet.as_view()),
    url(r'^groups/(?P<id>[0-9]+)/users$', views.groupsIdUsersGet.as_view()),
    url(r'^histories/bulk$', views.historiesBulkPost.as_view()),
    url(r'^histories$', views.historiesGet.as_view()),
    url(r'^histories/(?P<id>[0-9]+)/delete$', views.historiesIdDeletePost.as_view()),
    url(r'^histories/(?P<id>[0-9]+)$', views.historiesIdGet.as_view()),
    url(r'^lookuplists/bulk$', views.lookuplistsBulkPost.as_view()),
    url(r'^lookuplists$', views.lookuplistsGet.as_view()),
    url(r'^lookuplists/(?P<id>[0-9]+)/delete$', views.lookuplistsIdDeletePost.as_view()),
    url(r'^lookuplists/(?P<id>[0-9]+)$', views.lookuplistsIdGet.as_view()),
    url(r'^notes/bulk$', views.notesBulkPost.as_view()),
    url(r'^notes$', views.notesGet.as_view()),
    url(r'^notes/(?P<id>[0-9]+)/delete$', views.notesIdDeletePost.as_view()),
    url(r'^notes/(?P<id>[0-9]+)$', views.notesIdGet.as_view()),
    url(r'^notifications/bulk$', views.notificationsBulkPost.as_view()),
    url(r'^notifications$', views.notificationsGet.as_view()),
    url(r'^notifications/(?P<id>[0-9]+)/delete$', views.notificationsIdDeletePost.as_view()),
    url(r'^notifications/(?P<id>[0-9]+)$', views.notificationsIdGet.as_view()),
    url(r'^notificationevents/bulk$', views.notificationeventsBulkPost.as_view()),
    url(r'^notificationevents$', views.notificationeventsGet.as_view()),
    url(r'^notificationevents/(?P<id>[0-9]+)/delete$', views.notificationeventsIdDeletePost.as_view()),
    url(r'^notificationevents/(?P<id>[0-9]+)$', views.notificationeventsIdGet.as_view()),
    url(r'^permissions/bulk$', views.permissionsBulkPost.as_view()),
    url(r'^permissions$', views.permissionsGet.as_view()),
    url(r'^permissions/(?P<id>[0-9]+)/delete$', views.permissionsIdDeletePost.as_view()),
    url(r'^permissions/(?P<id>[0-9]+)$', views.permissionsIdGet.as_view()),
    url(r'^roles/bulk$', views.rolesBulkPost.as_view()),
    url(r'^roles$', views.rolesGet.as_view()),
    url(r'^roles/(?P<id>[0-9]+)/delete$', views.rolesIdDeletePost.as_view()),
    url(r'^roles/(?P<id>[0-9]+)$', views.rolesIdGet.as_view()),
    url(r'^roles/(?P<id>[0-9]+)/permissions$', views.rolesIdPermissionsGet.as_view()),
    url(r'^roles/(?P<id>[0-9]+)/permissions$', views.rolesIdPermissionsPost.as_view()),
    url(r'^roles/(?P<id>[0-9]+)/permissions$', views.rolesIdPermissionsPut.as_view()),
    url(r'^roles/(?P<id>[0-9]+)/users$', views.rolesIdUsersGet.as_view()),
    url(r'^roles/(?P<id>[0-9]+)/users$', views.rolesIdUsersPut.as_view()),
    url(r'^users/bulk$', views.usersBulkPost.as_view()),
    url(r'^users$', views.usersGet.as_view()),
    url(r'^users/(?P<id>[0-9]+)/delete$', views.usersIdDeletePost.as_view()),
    url(r'^users/(?P<id>[0-9]+)/favourites$', views.usersIdFavouritesGet.as_view()),
    url(r'^users/(?P<id>[0-9]+)/favourites$', views.usersIdFavouritesPost.as_view()),
    url(r'^users/(?P<id>[0-9]+)/favourites$', views.usersIdFavouritesPut.as_view()),
    url(r'^users/(?P<id>[0-9]+)$', views.usersIdGet.as_view()),
    url(r'^users/(?P<id>[0-9]+)/groups$', views.usersIdGroupsGet.as_view()),
    url(r'^users/(?P<id>[0-9]+)/groups$', views.usersIdGroupsPost.as_view()),
    url(r'^users/(?P<id>[0-9]+)/groups$', views.usersIdGroupsPut.as_view()),
    url(r'^users/(?P<id>[0-9]+)/notifications$', views.usersIdNotificationsGet.as_view()),
    url(r'^users/(?P<id>[0-9]+)/permissions$', views.usersIdPermissionsGet.as_view()),
    url(r'^users/(?P<id>[0-9]+)$', views.usersIdPut.as_view()),
    url(r'^users/(?P<id>[0-9]+)/roles$', views.usersIdRolesGet.as_view()),
    url(r'^users/(?P<id>[0-9]+)/roles$', views.usersIdRolesPost.as_view()),
    url(r'^users/(?P<id>[0-9]+)/roles$', views.usersIdRolesPut.as_view()),
    url(r'^users$', views.usersPost.as_view()),
    url(r'^users/search$', views.usersSearchGet.as_view())
]

urlpatterns = format_suffix_patterns(urlpatterns)
