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

from django.conf.urls import url, include
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.schemas import SchemaGenerator
from rest_framework.views import APIView
from rest_framework_swagger import renderers
# generated views
from . import views
# custom views
from . import views_custom
from .viewsets.CreditTrade import CreditTradeViewSet
from .viewsets.Organization import OrganizationViewSet

from rest_framework.routers import DefaultRouter

# Create a router and register our views with it.
router = DefaultRouter(trailing_slash=False)
router.register(r'credit_trades', CreditTradeViewSet)
router.register(r'organizations', OrganizationViewSet)


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
    url(r'^doc$', SwaggerSchemaView.as_view()),
    url(r'^', include(router.urls)),
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
    url(r'^credittradezeroreason/bulk$', views.credittradezeroreasonBulkPost.as_view()),
    url(r'^credittradezeroreason$', views.credittradezeroreasonGet.as_view()),
    url(r'^credittradezeroreason/(?P<id>[0-9]+)/delete$', views.credittradezeroreasonIdDeletePost.as_view()),
    url(r'^credittradezeroreason/(?P<id>[0-9]+)$', views.credittradezeroreasonIdGet.as_view()),
    url(r'^users/current$', views_custom.usersCurrentGet.as_view()),
    # url(r'^organizations/bulk$', views.organizationsBulkPost.as_view()),
    # url(r'^organizations$', views.organizationsGet.as_view()),
    # url(r'^organizations/(?P<id>[0-9]+)/attachments$', views_custom.organizationsIdAttachmentsGet.as_view()),
    # url(r'^organizations/(?P<id>[0-9]+)/delete$', views.organizationsIdDeletePost.as_view()),
    # url(r'^organizations/(?P<id>[0-9]+)$', views.organizationsIdGet.as_view()),
    # url(r'^organizations/(?P<id>[0-9]+)/history$', views_custom.organizationsIdHistoryGet.as_view()),
    # url(r'^organizations/search$', views_custom.organizationsSearchGet.as_view()),
    url(r'^organization_actions_types/bulk$', views.organizationactionstypesBulkPost.as_view()),
    url(r'^organization_actions_types$', views.organizationactionstypesGet.as_view()),
    url(r'^organization_actions_types/(?P<id>[0-9]+)/delete$', views.organizationactionstypesIdDeletePost.as_view()),
    url(r'^organization_actions_types/(?P<id>[0-9]+)$', views.organizationactionstypesIdGet.as_view()),
    url(r'^organization_attachments/bulk$', views.organizationattachmentsBulkPost.as_view()),
    url(r'^organization_attachments$', views.organizationattachmentsGet.as_view()),
    url(r'^organization_attachments/(?P<id>[0-9]+)/delete$', views.organizationattachmentsIdDeletePost.as_view()),
    url(r'^organization_attachments/(?P<id>[0-9]+)$', views.organizationattachmentsIdGet.as_view()),
    url(r'^organization_balances$', views.organizationbalancesGet.as_view()),
    url(r'^organization_balances/(?P<id>[0-9]+)/delete$', views.organizationbalancesIdDeletePost.as_view()),
    url(r'^organization_balances/(?P<id>[0-9]+)$', views.organizationbalancesIdGet.as_view()),
    url(r'^organization_history/bulk$', views.organizationhistoriesBulkPost.as_view()),
    url(r'^organization_history$', views.organizationhistoriesGet.as_view()),
    url(r'^organization_history/(?P<id>[0-9]+)/delete$', views.organizationhistoriesIdDeletePost.as_view()),
    url(r'^organization_history/(?P<id>[0-9]+)$', views.organizationhistoriesIdGet.as_view()),
    url(r'^organization_statuses/bulk$', views.organizationstatusesBulkPost.as_view()),
    url(r'^organization_statuses$', views.organizationstatusesGet.as_view()),
    url(r'^organization_statuses/(?P<id>[0-9]+)/delete$', views.organizationstatusesIdDeletePost.as_view()),
    url(r'^organization_statuses/(?P<id>[0-9]+)$', views.organizationstatusesIdGet.as_view()),
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
    url(r'^users/(?P<id>[0-9]+)$', views.usersIdGet.as_view()),
    url(r'^users/(?P<id>[0-9]+)/permissions$', views_custom.usersIdPermissionsGet.as_view()),
    url(r'^users/(?P<id>[0-9]+)/roles$', views_custom.usersIdRolesGet.as_view()),
    url(r'^users/search$', views_custom.usersSearchGet.as_view()),
    url(r'^userroles/bulk$', views.userrolesBulkPost.as_view()),
    url(r'^userroles$', views.userrolesGet.as_view()),
    url(r'^userroles/(?P<id>[0-9]+)/delete$', views.userrolesIdDeletePost.as_view()),
    url(r'^userroles/(?P<id>[0-9]+)$', views.userrolesIdGet.as_view())
]

# urlpatterns = format_suffix_patterns(urlpatterns)
urlpatterns += router.urls
