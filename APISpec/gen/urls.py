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
# generated views
from . import views
# custom views
from . import views_custom

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
    url(r'^attachments/(?P<id>[0-9]+)/download$', views_custom.attachmentsIdDownloadGet.as_view()),
    url(r'^attachments/(?P<id>[0-9]+)$', views.attachmentsIdGet.as_view()),
    url(r'^attachments/upload$', views_custom.attachmentsUploadPost.as_view()),
    url(r'^contacts/bulk$', views.contactsBulkPost.as_view()),
    url(r'^contacts$', views.contactsGet.as_view()),
    url(r'^contacts/(?P<id>[0-9]+)/delete$', views.contactsIdDeletePost.as_view()),
    url(r'^contacts/(?P<id>[0-9]+)$', views.contactsIdGet.as_view()),
    url(r'^credittrades/bulk$', views.credittradesBulkPost.as_view()),
    url(r'^credittrades$', views.credittradesGet.as_view()),
    url(r'^credittrades/(?P<id>[0-9]+)/attachments$', views_custom.credittradesIdAttachmentsGet.as_view()),
    url(r'^credittrades/(?P<id>[0-9]+)/delete$', views.credittradesIdDeletePost.as_view()),
    url(r'^credittrades/(?P<id>[0-9]+)$', views.credittradesIdGet.as_view()),
    url(r'^credittrades/(?P<id>[0-9]+)/history$', views_custom.credittradesIdHistoryGet.as_view()),
    url(r'^credittrades/(?P<id>[0-9]+)/notes$', views_custom.credittradesIdNotesGet.as_view()),
    url(r'^credittrades/search$', views_custom.credittradesSearchGet.as_view()),
    url(r'^credittradetradelogentries/bulk$', views.credittradetradelogentriesBulkPost.as_view()),
    url(r'^credittradetradelogentries$', views.credittradetradelogentriesGet.as_view()),
    url(r'^credittradetradelogentries/(?P<id>[0-9]+)/delete$', views.credittradetradelogentriesIdDeletePost.as_view()),
    url(r'^credittradetradelogentries/(?P<id>[0-9]+)$', views.credittradetradelogentriesIdGet.as_view()),
    url(r'^users/current/favourites/(?P<id>[0-9]+)/delete$', views_custom.usersCurrentFavouritesIdDeletePost.as_view()),
    url(r'^users/current/favourites$', views_custom.usersCurrentFavouritesPut.as_view()),
    url(r'^users/current/favourites/search$', views_custom.usersCurrentFavouritesSearchGet.as_view()),
    url(r'^users/current$', views_custom.usersCurrentGet.as_view()),
    url(r'^fuelsuppliers/bulk$', views.fuelsuppliersBulkPost.as_view()),
    url(r'^fuelsuppliers$', views.fuelsuppliersGet.as_view()),
    url(r'^fuelsuppliers/(?P<id>[0-9]+)/attachments$', views_custom.fuelsuppliersIdAttachmentsGet.as_view()),
    url(r'^fuelsuppliers/(?P<id>[0-9]+)/delete$', views.fuelsuppliersIdDeletePost.as_view()),
    url(r'^fuelsuppliers/(?P<id>[0-9]+)$', views.fuelsuppliersIdGet.as_view()),
    url(r'^fuelsuppliers/(?P<id>[0-9]+)/history$', views_custom.fuelsuppliersIdHistoryGet.as_view()),
    url(r'^fuelsuppliers/(?P<id>[0-9]+)/notes$', views_custom.fuelsuppliersIdNotesGet.as_view()),
    url(r'^fuelsuppliers/search$', views_custom.fuelsuppliersSearchGet.as_view()),
    url(r'^groups/bulk$', views.groupsBulkPost.as_view()),
    url(r'^groups$', views.groupsGet.as_view()),
    url(r'^groups/(?P<id>[0-9]+)/delete$', views.groupsIdDeletePost.as_view()),
    url(r'^groups/(?P<id>[0-9]+)$', views.groupsIdGet.as_view()),
    url(r'^groups/(?P<id>[0-9]+)/users$', views_custom.groupsIdUsersGet.as_view()),
    url(r'^groupmemberships/bulk$', views.groupmembershipsBulkPost.as_view()),
    url(r'^groupmemberships$', views.groupmembershipsGet.as_view()),
    url(r'^groupmemberships/(?P<id>[0-9]+)/delete$', views.groupmembershipsIdDeletePost.as_view()),
    url(r'^groupmemberships/(?P<id>[0-9]+)$', views.groupmembershipsIdGet.as_view()),
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
    url(r'^offers/bulk$', views.offersBulkPost.as_view()),
    url(r'^offers$', views.offersGet.as_view()),
    url(r'^offers/(?P<id>[0-9]+)/delete$', views.offersIdDeletePost.as_view()),
    url(r'^offers/(?P<id>[0-9]+)$', views.offersIdGet.as_view()),
    url(r'^permissions/bulk$', views.permissionsBulkPost.as_view()),
    url(r'^permissions$', views.permissionsGet.as_view()),
    url(r'^permissions/(?P<id>[0-9]+)/delete$', views.permissionsIdDeletePost.as_view()),
    url(r'^permissions/(?P<id>[0-9]+)$', views.permissionsIdGet.as_view()),
    url(r'^roles/bulk$', views.rolesBulkPost.as_view()),
    url(r'^roles$', views.rolesGet.as_view()),
    url(r'^roles/(?P<id>[0-9]+)/delete$', views.rolesIdDeletePost.as_view()),
    url(r'^roles/(?P<id>[0-9]+)$', views.rolesIdGet.as_view()),
    url(r'^roles/(?P<id>[0-9]+)/permissions$', views_custom.rolesIdPermissionsGet.as_view()),
    url(r'^roles/(?P<id>[0-9]+)/users$', views_custom.rolesIdUsersGet.as_view()),
    url(r'^rolepermissions/bulk$', views.rolepermissionsBulkPost.as_view()),
    url(r'^rolepermissions$', views.rolepermissionsGet.as_view()),
    url(r'^rolepermissions/(?P<id>[0-9]+)/delete$', views.rolepermissionsIdDeletePost.as_view()),
    url(r'^rolepermissions/(?P<id>[0-9]+)$', views.rolepermissionsIdGet.as_view()),
    url(r'^users/bulk$', views.usersBulkPost.as_view()),
    url(r'^users$', views.usersGet.as_view()),
    url(r'^users/(?P<id>[0-9]+)/delete$', views.usersIdDeletePost.as_view()),
    url(r'^users/(?P<id>[0-9]+)/favourites$', views_custom.usersIdFavouritesGet.as_view()),
    url(r'^users/(?P<id>[0-9]+)$', views.usersIdGet.as_view()),
    url(r'^users/(?P<id>[0-9]+)/groups$', views_custom.usersIdGroupsGet.as_view()),
    url(r'^users/(?P<id>[0-9]+)/notifications$', views_custom.usersIdNotificationsGet.as_view()),
    url(r'^users/(?P<id>[0-9]+)/permissions$', views_custom.usersIdPermissionsGet.as_view()),
    url(r'^users/(?P<id>[0-9]+)/roles$', views_custom.usersIdRolesGet.as_view()),
    url(r'^users/search$', views_custom.usersSearchGet.as_view()),
    url(r'^userroles/bulk$', views.userrolesBulkPost.as_view()),
    url(r'^userroles$', views.userrolesGet.as_view()),
    url(r'^userroles/(?P<id>[0-9]+)/delete$', views.userrolesIdDeletePost.as_view()),
    url(r'^userroles/(?P<id>[0-9]+)$', views.userrolesIdGet.as_view())
]

urlpatterns = format_suffix_patterns(urlpatterns)
