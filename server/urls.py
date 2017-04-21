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
    url(r'^attachments/bulk/$', views.attachmentsBulkPost.as_view()),
    url(r'^attachments/$', views.attachmentsGet.as_view()),
    url(r'^attachments/(.*)/delete/$', views.attachmentsIdDeletePost.as_view()),
    url(r'^attachments/(.*)/download/$', views.attachmentsIdDownloadGet.as_view()),
    url(r'^attachments/(.*)/$', views.attachmentsIdGet.as_view()),
    url(r'^attachments/(.*)/$', views.attachmentsIdPut.as_view()),
    url(r'^attachments/$', views.attachmentsPost.as_view()),
    url(r'^complianceperiods/bulk/$', views.complianceperiodsBulkPost.as_view()),
    url(r'^complianceperiods/$', views.complianceperiodsGet.as_view()),
    url(r'^complianceperiods/(.*)/delete/$', views.complianceperiodsIdDeletePost.as_view()),
    url(r'^complianceperiods/(.*)/$', views.complianceperiodsIdGet.as_view()),
    url(r'^complianceperiods/(.*)/$', views.complianceperiodsIdPut.as_view()),
    url(r'^complianceperiods/$', views.complianceperiodsPost.as_view()),
    url(r'^contacts/bulk/$', views.contactsBulkPost.as_view()),
    url(r'^contacts/$', views.contactsGet.as_view()),
    url(r'^contacts/(.*)/delete/$', views.contactsIdDeletePost.as_view()),
    url(r'^contacts/(.*)/$', views.contactsIdGet.as_view()),
    url(r'^contacts/(.*)/$', views.contactsIdPut.as_view()),
    url(r'^contacts/$', views.contactsPost.as_view()),
    url(r'^creditTrade/(.*)/notes/$', views.creditTradeIdNotesGet.as_view()),
    url(r'^credittrades/bulk/$', views.credittradesBulkPost.as_view()),
    url(r'^credittrades/$', views.credittradesGet.as_view()),
    url(r'^credittrades/(.*)/attachments/$', views.credittradesIdAttachmentsGet.as_view()),
    url(r'^credittrades/(.*)/delete/$', views.credittradesIdDeletePost.as_view()),
    url(r'^credittrades/(.*)/$', views.credittradesIdGet.as_view()),
    url(r'^credittrades/(.*)/history/$', views.credittradesIdHistoryGet.as_view()),
    url(r'^credittrades/(.*)/history/$', views.credittradesIdHistoryPost.as_view()),
    url(r'^credittrades/(.*)/$', views.credittradesIdPut.as_view()),
    url(r'^credittrades/$', views.credittradesPost.as_view()),
    url(r'^credittrading/search/$', views.credittradingSearchGet.as_view()),
    url(r'^credittradetradelogentries/bulk/$', views.credittradetradelogentriesBulkPost.as_view()),
    url(r'^credittradetradelogentries/$', views.credittradetradelogentriesGet.as_view()),
    url(r'^credittradetradelogentries/(.*)/delete/$', views.credittradetradelogentriesIdDeletePost.as_view()),
    url(r'^credittradetradelogentries/(.*)/$', views.credittradetradelogentriesIdGet.as_view()),
    url(r'^credittradetradelogentries/(.*)/$', views.credittradetradelogentriesIdPut.as_view()),
    url(r'^credittradetradelogentries/$', views.credittradetradelogentriesPost.as_view()),
    url(r'^users/current/favourites/(.*)/delete/$', views.usersCurrentFavouritesIdDeletePost.as_view()),
    url(r'^users/current/favourites/$', views.usersCurrentFavouritesPost.as_view()),
    url(r'^users/current/favourites/$', views.usersCurrentFavouritesPut.as_view()),
    url(r'^users/current/favourites/(.*)/$', views.usersCurrentFavouritesTypeGet.as_view()),
    url(r'^users/current/$', views.usersCurrentGet.as_view()),
    url(r'^fuelsuppliers/bulk/$', views.fuelsuppliersBulkPost.as_view()),
    url(r'^fuelsuppliers/$', views.fuelsuppliersGet.as_view()),
    url(r'^fuelsuppliers/(.*)/attachments/$', views.fuelsuppliersIdAttachmentsGet.as_view()),
    url(r'^fuelsuppliers/(.*)/delete/$', views.fuelsuppliersIdDeletePost.as_view()),
    url(r'^fuelsuppliers/(.*)/$', views.fuelsuppliersIdGet.as_view()),
    url(r'^fuelsuppliers/(.*)/history/$', views.fuelsuppliersIdHistoryGet.as_view()),
    url(r'^fuelsuppliers/(.*)/history/$', views.fuelsuppliersIdHistoryPost.as_view()),
    url(r'^fuelsuppliers/(.*)/notes/$', views.fuelsuppliersIdNotesGet.as_view()),
    url(r'^fuelsuppliers/(.*)/$', views.fuelsuppliersIdPut.as_view()),
    url(r'^fuelsuppliers/$', views.fuelsuppliersPost.as_view()),
    url(r'^fuelsuppliers/search/$', views.fuelsuppliersSearchGet.as_view()),
    url(r'^groups/bulk/$', views.groupsBulkPost.as_view()),
    url(r'^groups/$', views.groupsGet.as_view()),
    url(r'^groups/(.*)/delete/$', views.groupsIdDeletePost.as_view()),
    url(r'^groups/(.*)/$', views.groupsIdGet.as_view()),
    url(r'^groups/(.*)/$', views.groupsIdPut.as_view()),
    url(r'^groups/(.*)/users/$', views.groupsIdUsersGet.as_view()),
    url(r'^groups/$', views.groupsPost.as_view()),
    url(r'^histories/bulk/$', views.historiesBulkPost.as_view()),
    url(r'^histories/$', views.historiesGet.as_view()),
    url(r'^histories/(.*)/delete/$', views.historiesIdDeletePost.as_view()),
    url(r'^histories/(.*)/$', views.historiesIdGet.as_view()),
    url(r'^histories/(.*)/$', views.historiesIdPut.as_view()),
    url(r'^histories/$', views.historiesPost.as_view()),
    url(r'^lookuplists/bulk/$', views.lookuplistsBulkPost.as_view()),
    url(r'^lookuplists/$', views.lookuplistsGet.as_view()),
    url(r'^lookuplists/(.*)/delete/$', views.lookuplistsIdDeletePost.as_view()),
    url(r'^lookuplists/(.*)/$', views.lookuplistsIdGet.as_view()),
    url(r'^lookuplists/(.*)/$', views.lookuplistsIdPut.as_view()),
    url(r'^lookuplists/$', views.lookuplistsPost.as_view()),
    url(r'^notes/bulk/$', views.notesBulkPost.as_view()),
    url(r'^notes/$', views.notesGet.as_view()),
    url(r'^notes/(.*)/delete/$', views.notesIdDeletePost.as_view()),
    url(r'^notes/(.*)/$', views.notesIdGet.as_view()),
    url(r'^notes/(.*)/$', views.notesIdPut.as_view()),
    url(r'^notes/$', views.notesPost.as_view()),
    url(r'^notifications/bulk/$', views.notificationsBulkPost.as_view()),
    url(r'^notifications/$', views.notificationsGet.as_view()),
    url(r'^notifications/(.*)/delete/$', views.notificationsIdDeletePost.as_view()),
    url(r'^notifications/(.*)/$', views.notificationsIdGet.as_view()),
    url(r'^notifications/(.*)/$', views.notificationsIdPut.as_view()),
    url(r'^notifications/$', views.notificationsPost.as_view()),
    url(r'^notificationevents/bulk/$', views.notificationeventsBulkPost.as_view()),
    url(r'^notificationevents/$', views.notificationeventsGet.as_view()),
    url(r'^notificationevents/(.*)/delete/$', views.notificationeventsIdDeletePost.as_view()),
    url(r'^notificationevents/(.*)/$', views.notificationeventsIdGet.as_view()),
    url(r'^notificationevents/(.*)/$', views.notificationeventsIdPut.as_view()),
    url(r'^notificationevents/$', views.notificationeventsPost.as_view()),
    url(r'^permissions/bulk/$', views.permissionsBulkPost.as_view()),
    url(r'^permissions/$', views.permissionsGet.as_view()),
    url(r'^permissions/(.*)/delete/$', views.permissionsIdDeletePost.as_view()),
    url(r'^permissions/(.*)/$', views.permissionsIdGet.as_view()),
    url(r'^permissions/(.*)/$', views.permissionsIdPut.as_view()),
    url(r'^permissions/$', views.permissionsPost.as_view()),
    url(r'^roles/bulk/$', views.rolesBulkPost.as_view()),
    url(r'^roles/$', views.rolesGet.as_view()),
    url(r'^roles/(.*)/delete/$', views.rolesIdDeletePost.as_view()),
    url(r'^roles/(.*)/$', views.rolesIdGet.as_view()),
    url(r'^roles/(.*)/permissions/$', views.rolesIdPermissionsGet.as_view()),
    url(r'^roles/(.*)/permissions/$', views.rolesIdPermissionsPost.as_view()),
    url(r'^roles/(.*)/permissions/$', views.rolesIdPermissionsPut.as_view()),
    url(r'^roles/(.*)/$', views.rolesIdPut.as_view()),
    url(r'^roles/(.*)/users/$', views.rolesIdUsersGet.as_view()),
    url(r'^roles/(.*)/users/$', views.rolesIdUsersPut.as_view()),
    url(r'^roles/$', views.rolesPost.as_view()),
    url(r'^users/bulk/$', views.usersBulkPost.as_view()),
    url(r'^users/$', views.usersGet.as_view()),
    url(r'^users/(.*)/delete/$', views.usersIdDeletePost.as_view()),
    url(r'^users/(.*)/favourites/$', views.usersIdFavouritesGet.as_view()),
    url(r'^users/(.*)/favourites/$', views.usersIdFavouritesPost.as_view()),
    url(r'^users/(.*)/favourites/$', views.usersIdFavouritesPut.as_view()),
    url(r'^users/(.*)/$', views.usersIdGet.as_view()),
    url(r'^users/(.*)/groups/$', views.usersIdGroupsGet.as_view()),
    url(r'^users/(.*)/groups/$', views.usersIdGroupsPost.as_view()),
    url(r'^users/(.*)/groups/$', views.usersIdGroupsPut.as_view()),
    url(r'^users/(.*)/notifications/$', views.usersIdNotificationsGet.as_view()),
    url(r'^users/(.*)/permissions/$', views.usersIdPermissionsGet.as_view()),
    url(r'^users/(.*)/$', views.usersIdPut.as_view()),
    url(r'^users/(.*)/roles/$', views.usersIdRolesGet.as_view()),
    url(r'^users/(.*)/roles/$', views.usersIdRolesPost.as_view()),
    url(r'^users/(.*)/roles/$', views.usersIdRolesPut.as_view()),
    url(r'^users/$', views.usersPost.as_view()),
    url(r'^users/search/$', views.usersSearchGet.as_view())
]

urlpatterns = format_suffix_patterns(urlpatterns)
