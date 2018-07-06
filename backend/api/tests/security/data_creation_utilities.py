# -*- coding: utf-8 -*-
# pylint: disable=no-member
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
import uuid

from api.models.OrganizationActionsType import OrganizationActionsType
from api.models.User import User
from api.models.Organization import Organization
from api.models.OrganizationType import OrganizationType
from api.models.OrganizationStatus import OrganizationStatus
from api.models.CompliancePeriod import CompliancePeriod


class DataCreationUtilities(object):
    """Utilities for creating short-lived test models"""

    @staticmethod
    def create_test_user():
        """Create a test fuel supplier user"""
        user = User()
        user.authorization_guid = str(uuid.uuid4())

        generated_name = 'test_{0}'.format(user.authorization_guid[8:])
        user.username = generated_name
        user.authorization_email = '{0}@test.com'.format(generated_name)

        user.first_name = 'Test'
        user.last_name = 'User'
        user.display_name = 'Test User'

        user.organization = Organization.objects.get_by_natural_key(
            DataCreationUtilities.create_test_organization()['name']
        )

        user.save()
        user.refresh_from_db()

        return {
            'id': user.id
        }

    @staticmethod
    def create_test_organization():
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
    def create_compliance_period():
        """Create a test compliance period"""
        cp = CompliancePeriod()
        cp.description = 'Compliance Period {0!s}'.format(uuid.uuid4())
        cp.display_order = 1

        cp.save()
        cp.refresh_from_db()

        return {
            'id': cp.id
        }
