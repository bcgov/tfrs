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

from api.viewsets.Autocomplete import AutocompleteViewSet
from api.viewsets.Autosave import AutosaveViewSet
from api.viewsets.ComplianceReport import ComplianceReportViewSet
from api.viewsets.Document import DocumentViewSet
from api.viewsets.DocumentComments import DocumentCommentsViewSet
from api.viewsets.FuelCode import FuelCodeViewSet
from api.viewsets.Notification import NotificationViewSet
from tfrs.settings import DOCUMENTS_API, FUEL_CODES_API, \
    CREDIT_CALCULATION_API, TESTING, COMPLIANCE_REPORTING_API, \
    EXCLUSION_REPORTS_API
from .viewsets.CompliancePeriod import CompliancePeriodViewSet
from .viewsets.CreditTrade import CreditTradeViewSet
from .viewsets.CreditTradeHistory import CreditTradeHistoryViewSet
from .viewsets.Organization import OrganizationViewSet
from .viewsets.Role import RoleViewSet
from .viewsets.SigningAuthorityAssertion \
    import SigningAuthorityAssertionViewSet
from .viewsets.SigningAuthorityConfirmation \
    import SigningAuthorityConfirmationViewSet
from .viewsets.User import UserViewSet
from .viewsets.CreditTradeComments import CreditTradeCommentsViewSet

from .viewsets.CarbonIntensityLimit import CarbonIntensityLimitViewSet
from .viewsets.CreditCalculation import CreditCalculationViewSet
from .viewsets.DefaultCarbonIntensity import DefaultCarbonIntensityViewSet
from .viewsets.EnergyDensity import EnergyDensityViewSet
from .viewsets.EnergyEffectivenessRatio import EnergyEffectivenessRatioViewSet
from .viewsets.PertroleumCarbonIntensity import PetroleumCarbonIntensityViewSet

from .viewsets.ExpectedUse import ExpectedUseViewSet
from .viewsets.FuelClass import FuelClassViewSet
from .viewsets.NotionalTransferType import NotionalTransferTypeViewSet
from .viewsets.TransactionType import TransactionTypeViewSet
from .viewsets.UserLoginHistory import UserLoginHistoryViewSet

# Create a router and register our views with it.
ROUTER = DefaultRouter(trailing_slash=False)
ROUTER.register(r'compliance_periods', CompliancePeriodViewSet)
ROUTER.register(r'credit_trades', CreditTradeViewSet)
ROUTER.register(r'credit_trades_history', CreditTradeHistoryViewSet)
ROUTER.register(r'comments', CreditTradeCommentsViewSet)
ROUTER.register(r'organizations', OrganizationViewSet)
ROUTER.register(r'roles', RoleViewSet)
ROUTER.register(r'signing_authority_assertions',
                SigningAuthorityAssertionViewSet)
ROUTER.register(r'signing_authority_confirmations',
                SigningAuthorityConfirmationViewSet)
ROUTER.register(r'users', UserViewSet)
ROUTER.register(r'notifications',
                NotificationViewSet,
                basename='notification')

ROUTER.register(r'autocomplete',
                AutocompleteViewSet,
                basename='autocomplete')

ROUTER.register(r'autosave',
                AutosaveViewSet,
                basename='autosave')

if DOCUMENTS_API['ENABLED'] or TESTING:
    ROUTER.register(r'documents', DocumentViewSet)
    ROUTER.register(r'documents_comments', DocumentCommentsViewSet)

if FUEL_CODES_API['ENABLED'] or TESTING:
    ROUTER.register(r'fuel_codes', FuelCodeViewSet)

if CREDIT_CALCULATION_API['ENABLED'] or TESTING:
    ROUTER.register(
        r'credit_calculation/carbon_intensity_limits',
        CarbonIntensityLimitViewSet
    )
    ROUTER.register(
        r'credit_calculation/default_carbon_intensities',
        DefaultCarbonIntensityViewSet
    )
    ROUTER.register(
        r'credit_calculation/energy_densities',
        EnergyDensityViewSet
    )
    ROUTER.register(
        r'credit_calculation/energy_effectiveness_ratios',
        EnergyEffectivenessRatioViewSet
    )
    ROUTER.register(
        r'credit_calculation/expected_uses',
        ExpectedUseViewSet
    )
    ROUTER.register(
        r'credit_calculation/fuel_classes',
        FuelClassViewSet
    )
    ROUTER.register(
        r'credit_calculation/notional_transfer_types',
        NotionalTransferTypeViewSet
    )
    ROUTER.register(
        r'credit_calculation/petroleum_carbon_intensities',
        PetroleumCarbonIntensityViewSet
    )
    ROUTER.register(
        r'credit_calculation/fuel_types',
        CreditCalculationViewSet
    )
    ROUTER.register(
        r'user_login_history', 
        UserLoginHistoryViewSet
    )


if COMPLIANCE_REPORTING_API['ENABLED'] or TESTING:
    ROUTER.register(r'compliance_reports', ComplianceReportViewSet)

if EXCLUSION_REPORTS_API['ENABLED'] or TESTING:
    ROUTER.register(
        r'exclusion_reports/transaction_types',
        TransactionTypeViewSet
    )

urlpatterns = [
    # Swagger documentation
    url(r'^doc/', include_docs_urls(title='TFRS API Documentation')),
    url(r'^', include(ROUTER.urls))
]

urlpatterns += ROUTER.urls
