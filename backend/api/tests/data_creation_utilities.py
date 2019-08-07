# -*- coding: utf-8 -*-
# pylint: disable=no-member,invalid-name
"""
    REST API Documentation for the NRS TFRS Credit Trading Application

    The Transportation Fuels Reporting System is being designed to streamline compliance reporting
    for transportation fuel suppliers in accordance with the Renewable & Low Carbon Fuel
    Requirements Regulation.

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
import logging
import uuid
from itertools import product

from api.models.ComplianceReport import ComplianceReportStatus, ComplianceReport
from api.models.CreditTrade import CreditTrade
from api.models.CreditTradeStatus import CreditTradeStatus
from api.models.CreditTradeType import CreditTradeType
from api.models.OrganizationActionsType import OrganizationActionsType
from api.models.User import User
from api.models.Organization import Organization
from api.models.OrganizationType import OrganizationType
from api.models.OrganizationStatus import OrganizationStatus
from api.models.CompliancePeriod import CompliancePeriod


class DataCreationUtilities(object):
    """Utilities for creating short-lived test models"""

    @staticmethod
    def create_test_user() -> dict:
        """Create a test fuel supplier user"""
        user = User()

        generated_name = 'test_{0}'.format(str(uuid.uuid4())[8:])
        user.username = generated_name

        user.first_name = 'Test'
        user.last_name = 'User'
        user.display_name = 'Test User'

        user.organization = Organization.objects.get_by_natural_key(
            DataCreationUtilities.create_test_organization()['name']
        )

        user.save()
        user.refresh_from_db()

        return {
            'id': user.id,
            'username': user.username
        }

    @staticmethod
    def create_test_organization() -> dict:
        """Create a test fuel supplier"""
        org = Organization()
        org.status = OrganizationStatus.objects.get_by_natural_key('Active')
        org.type = OrganizationType.objects.get_by_natural_key('Part3FuelSupplier')
        org.name = 'Test org {}'.format(str(uuid.uuid4()))
        org.actions_type = OrganizationActionsType.objects.get_by_natural_key('Buy And Sell')

        org.save()
        org.refresh_from_db()

        return {
            'id': org.id,
            'name': org.name
        }

    @staticmethod
    def create_compliance_period() -> dict:
        """Create a test compliance period"""
        cp = CompliancePeriod()
        cp.description = 'Compliance Period {0!s}'.format(uuid.uuid4())
        cp.display_order = 1

        cp.save()
        cp.refresh_from_db()

        return {
            'id': cp.id
        }

    @staticmethod
    def create_possible_credit_trades(
            initiating_organization: Organization,
            responding_organization: Organization) -> list:
        """Used to setup test data for exhaustive trials """
        created_trades = []

        all_statuses = [s.status for s in CreditTradeStatus.objects.all()]

        # Certain combinations of (status,rescinded) are not logical
        impossible_states = [
            ('Draft', True),
            ('Cancelled', True),
            ('Approved', True),
            ('Declined', True),
            ('Recorded', True),
            ('Refused', True)
        ]

        # Create test data for this test -- one trade with each possible status
        for (ct_status, rescinded) in product(all_statuses, [True, False]):
            if (ct_status, rescinded) not in impossible_states:
                created_trades.append(
                    DataCreationUtilities.create_credit_trade(
                        initiating_organization=initiating_organization,
                        responding_organization=responding_organization,
                        status=CreditTradeStatus.objects.get_by_natural_key(ct_status),
                        is_rescinded=rescinded
                    )
                )

        return created_trades

    @staticmethod
    def create_credit_trade(
            initiating_organization: Organization,
            responding_organization: Organization,
            status: CreditTradeStatus,
            is_rescinded: bool) -> dict:
        """Create a single credit trade"""

        trade = CreditTrade()
        trade.initiator = initiating_organization
        trade.respondent = responding_organization
        trade.type = CreditTradeType.objects.get_by_natural_key("Buy")
        trade.status = status
        trade.fair_market_value_per_credit = 20.0
        trade.number_of_credits = 500
        trade.is_rescinded = is_rescinded
        trade.save()
        trade.refresh_from_db()
        logging.debug("created credit trade %s", trade.id)

        return {
            'status': status.status,
            'rescinded': is_rescinded,
            'id': trade.id
        }
