"""
    REST API Documentation for the NRS TFRS Credit Trading Application

    The Transportation Fuels Reporting System is being designed to streamline
    compliance reporting for transportation fuel suppliers in accordance with
    the Renewable & Low Carbon Fuel Requirements Regulation.

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
from rest_framework.documentation import include_docs_urls
from rest_framework.routers import DefaultRouter

from api.viewsets.Notification import NotificationViewSet
from .viewsets.CompliancePeriod import CompliancePeriodViewSet
from .viewsets.CreditTrade import CreditTradeViewSet
from .viewsets.CreditTradeHistory import CreditTradeHistoryViewSet
from .viewsets.Organization import OrganizationViewSet
from .viewsets.SigningAuthorityAssertion \
    import SigningAuthorityAssertionViewSet
from .viewsets.SigningAuthorityConfirmation \
    import SigningAuthorityConfirmationViewSet
from .viewsets.User import UserViewSet
from .viewsets.CreditTradeComments import CreditTradeCommentsViewSet

# Create a router and register our views with it.
ROUTER = DefaultRouter(trailing_slash=False)
ROUTER.register(r'compliance_periods', CompliancePeriodViewSet)
ROUTER.register(r'credit_trades', CreditTradeViewSet)
ROUTER.register(r'credit_trades_history', CreditTradeHistoryViewSet)
ROUTER.register(r'comments', CreditTradeCommentsViewSet)
ROUTER.register(r'organizations', OrganizationViewSet)
ROUTER.register(r'signing_authority_assertions',
                SigningAuthorityAssertionViewSet)
ROUTER.register(r'signing_authority_confirmations',
                SigningAuthorityConfirmationViewSet)
ROUTER.register(r'users', UserViewSet)
ROUTER.register(r'notifications', NotificationViewSet, base_name='notification')

urlpatterns = [
    # Swagger documentation
    url(r'^doc/', include_docs_urls(title='TFRS API Documentation')),
    url(r'^', include(ROUTER.urls))
]

urlpatterns += ROUTER.urls
