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
    url(r'^credittrades/bulk$', views.credittradesBulkPost.as_view()),
    url(r'^credittrades$', views.credittradesGet.as_view()),
    url(r'^credittrades/(?P<id>[0-9]+)/delete$', views.credittradesIdDeletePost.as_view()),
    url(r'^credittrades/(?P<id>[0-9]+)$', views.credittradesIdGet.as_view()),
    url(r'^credittrades/search$', views_custom.credittradesSearchGet.as_view()),
    url(r'^credittradehistories/bulk$', views.credittradehistoriesBulkPost.as_view()),
    url(r'^credittradehistories$', views.credittradehistoriesGet.as_view()),
    url(r'^credittradehistories/(?P<id>[0-9]+)/delete$', views.credittradehistoriesIdDeletePost.as_view()),
    url(r'^credittradehistories/(?P<id>[0-9]+)$', views.credittradehistoriesIdGet.as_view()),
    url(r'^credittradestatuses/bulk$', views.credittradestatusesBulkPost.as_view()),
    url(r'^credittradestatuses$', views.credittradestatusesGet.as_view()),
    url(r'^credittradestatuses/(?P<id>[0-9]+)/delete$', views.credittradestatusesIdDeletePost.as_view()),
    url(r'^credittradestatuses/(?P<id>[0-9]+)$', views.credittradestatusesIdGet.as_view()),
    url(r'^credittradetypes/bulk$', views.credittradetypesBulkPost.as_view()),
    url(r'^credittradetypes$', views.credittradetypesGet.as_view()),
    url(r'^credittradetypes/(?P<id>[0-9]+)/delete$', views.credittradetypesIdDeletePost.as_view()),
    url(r'^credittradetypes/(?P<id>[0-9]+)$', views.credittradetypesIdGet.as_view()),
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
    url(r'^fuelsuppliers/search$', views_custom.fuelsuppliersSearchGet.as_view()),
    url(r'^fuelsupplieractionstypes/bulk$', views.fuelsupplieractionstypesBulkPost.as_view()),
    url(r'^fuelsupplieractionstypes$', views.fuelsupplieractionstypesGet.as_view()),
    url(r'^fuelsupplieractionstypes/(?P<id>[0-9]+)/delete$', views.fuelsupplieractionstypesIdDeletePost.as_view()),
    url(r'^fuelsupplieractionstypes/(?P<id>[0-9]+)$', views.fuelsupplieractionstypesIdGet.as_view()),
    url(r'^fuelsupplierattachments/bulk$', views.fuelsupplierattachmentsBulkPost.as_view()),
    url(r'^fuelsupplierattachments$', views.fuelsupplierattachmentsGet.as_view()),
    url(r'^fuelsupplierattachments/(?P<id>[0-9]+)/delete$', views.fuelsupplierattachmentsIdDeletePost.as_view()),
    url(r'^fuelsupplierattachments/(?P<id>[0-9]+)$', views.fuelsupplierattachmentsIdGet.as_view()),
    url(r'^fuelsupplierattachmenttags/bulk$', views.fuelsupplierattachmenttagsBulkPost.as_view()),
    url(r'^fuelsupplierattachmenttags$', views.fuelsupplierattachmenttagsGet.as_view()),
    url(r'^fuelsupplierattachmenttags/(?P<id>[0-9]+)/delete$', views.fuelsupplierattachmenttagsIdDeletePost.as_view()),
    url(r'^fuelsupplierattachmenttags/(?P<id>[0-9]+)$', views.fuelsupplierattachmenttagsIdGet.as_view()),
    url(r'^fuelsupplierbalances/bulk$', views.fuelsupplierbalancesBulkPost.as_view()),
    url(r'^fuelsupplierbalances$', views.fuelsupplierbalancesGet.as_view()),
    url(r'^fuelsupplierbalances/(?P<id>[0-9]+)/delete$', views.fuelsupplierbalancesIdDeletePost.as_view()),
    url(r'^fuelsupplierbalances/(?P<id>[0-9]+)$', views.fuelsupplierbalancesIdGet.as_view()),
    url(r'^fuelsuppliersCCDatum/bulk$', views.fuelsuppliersCCDatumBulkPost.as_view()),
    url(r'^fuelsuppliersCCDatum$', views.fuelsuppliersCCDatumGet.as_view()),
    url(r'^fuelsuppliersCCDatum/(?P<id>[0-9]+)/delete$', views.fuelsuppliersCCDatumIdDeletePost.as_view()),
    url(r'^fuelsuppliersCCDatum/(?P<id>[0-9]+)$', views.fuelsuppliersCCDatumIdGet.as_view()),
    url(r'^fuelsuppliercontacts/bulk$', views.fuelsuppliercontactsBulkPost.as_view()),
    url(r'^fuelsuppliercontacts$', views.fuelsuppliercontactsGet.as_view()),
    url(r'^fuelsuppliercontacts/(?P<id>[0-9]+)/delete$', views.fuelsuppliercontactsIdDeletePost.as_view()),
    url(r'^fuelsuppliercontacts/(?P<id>[0-9]+)$', views.fuelsuppliercontactsIdGet.as_view()),
    url(r'^fuelsuppliercontactroles/bulk$', views.fuelsuppliercontactrolesBulkPost.as_view()),
    url(r'^fuelsuppliercontactroles$', views.fuelsuppliercontactrolesGet.as_view()),
    url(r'^fuelsuppliercontactroles/(?P<id>[0-9]+)/delete$', views.fuelsuppliercontactrolesIdDeletePost.as_view()),
    url(r'^fuelsuppliercontactroles/(?P<id>[0-9]+)$', views.fuelsuppliercontactrolesIdGet.as_view()),
    url(r'^fuelsupplierhistories/bulk$', views.fuelsupplierhistoriesBulkPost.as_view()),
    url(r'^fuelsupplierhistories$', views.fuelsupplierhistoriesGet.as_view()),
    url(r'^fuelsupplierhistories/(?P<id>[0-9]+)/delete$', views.fuelsupplierhistoriesIdDeletePost.as_view()),
    url(r'^fuelsupplierhistories/(?P<id>[0-9]+)$', views.fuelsupplierhistoriesIdGet.as_view()),
    url(r'^fuelsupplierstatuses/bulk$', views.fuelsupplierstatusesBulkPost.as_view()),
    url(r'^fuelsupplierstatuses$', views.fuelsupplierstatusesGet.as_view()),
    url(r'^fuelsupplierstatuses/(?P<id>[0-9]+)/delete$', views.fuelsupplierstatusesIdDeletePost.as_view()),
    url(r'^fuelsupplierstatuses/(?P<id>[0-9]+)$', views.fuelsupplierstatusesIdGet.as_view()),
    url(r'^fuelsuppliertypes/bulk$', views.fuelsuppliertypesBulkPost.as_view()),
    url(r'^fuelsuppliertypes$', views.fuelsuppliertypesGet.as_view()),
    url(r'^fuelsuppliertypes/(?P<id>[0-9]+)/delete$', views.fuelsuppliertypesIdDeletePost.as_view()),
    url(r'^fuelsuppliertypes/(?P<id>[0-9]+)$', views.fuelsuppliertypesIdGet.as_view()),
    url(r'^notifications/bulk$', views.notificationsBulkPost.as_view()),
    url(r'^notifications$', views.notificationsGet.as_view()),
    url(r'^notifications/(?P<id>[0-9]+)/delete$', views.notificationsIdDeletePost.as_view()),
    url(r'^notifications/(?P<id>[0-9]+)$', views.notificationsIdGet.as_view()),
    url(r'^notificationevents/bulk$', views.notificationeventsBulkPost.as_view()),
    url(r'^notificationevents$', views.notificationeventsGet.as_view()),
    url(r'^notificationevents/(?P<id>[0-9]+)/delete$', views.notificationeventsIdDeletePost.as_view()),
    url(r'^notificationevents/(?P<id>[0-9]+)$', views.notificationeventsIdGet.as_view()),
    url(r'^notificationtypes/bulk$', views.notificationtypesBulkPost.as_view()),
    url(r'^notificationtypes$', views.notificationtypesGet.as_view()),
    url(r'^notificationtypes/(?P<id>[0-9]+)/delete$', views.notificationtypesIdDeletePost.as_view()),
    url(r'^notificationtypes/(?P<id>[0-9]+)$', views.notificationtypesIdGet.as_view()),
    url(r'^opportunities/bulk$', views.opportunitiesBulkPost.as_view()),
    url(r'^opportunities$', views.opportunitiesGet.as_view()),
    url(r'^opportunities/(?P<id>[0-9]+)/delete$', views.opportunitiesIdDeletePost.as_view()),
    url(r'^opportunities/(?P<id>[0-9]+)$', views.opportunitiesIdGet.as_view()),
    url(r'^opportunityhistories/bulk$', views.opportunityhistoriesBulkPost.as_view()),
    url(r'^opportunityhistories$', views.opportunityhistoriesGet.as_view()),
    url(r'^opportunityhistories/(?P<id>[0-9]+)/delete$', views.opportunityhistoriesIdDeletePost.as_view()),
    url(r'^opportunityhistories/(?P<id>[0-9]+)$', views.opportunityhistoriesIdGet.as_view()),
    url(r'^opportunitystatuses/bulk$', views.opportunitystatusesBulkPost.as_view()),
    url(r'^opportunitystatuses$', views.opportunitystatusesGet.as_view()),
    url(r'^opportunitystatuses/(?P<id>[0-9]+)/delete$', views.opportunitystatusesIdDeletePost.as_view()),
    url(r'^opportunitystatuses/(?P<id>[0-9]+)$', views.opportunitystatusesIdGet.as_view()),
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
    url(r'^users/(?P<id>[0-9]+)/notifications$', views_custom.usersIdNotificationsGet.as_view()),
    url(r'^users/(?P<id>[0-9]+)/permissions$', views_custom.usersIdPermissionsGet.as_view()),
    url(r'^users/(?P<id>[0-9]+)/roles$', views_custom.usersIdRolesGet.as_view()),
    url(r'^users/search$', views_custom.usersSearchGet.as_view())
]

urlpatterns = format_suffix_patterns(urlpatterns)
