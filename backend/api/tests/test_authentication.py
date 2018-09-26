# -*- coding: utf-8 -*-
# pylint: disable=no-member,invalid-name
"""
    REST API Documentation for the NRS TFRS Credit Trading Application

    The Transportation Fuels Reporting System is being designed to streamline
    compliance reporting for transportation fuel suppliers in accordance with
    the Renewable & Low Carbon Fuel
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

from django.test import RequestFactory
from django.conf import settings
from rest_framework import exceptions

from api.keycloak_authentication import UserAuthentication
import jwt
from api.models.User import User
from api.models.Organization import Organization
from api.models.OrganizationStatus import OrganizationStatus
from api.models.OrganizationActionsType import OrganizationActionsType
from api.models.OrganizationType import OrganizationType

from .base_test_case import BaseTestCase


class TestAuthentication(BaseTestCase):
    """Tests for authentication module"""

    fixtures = [
        'test/test_compliance_periods.json',
        'test/test_organization_fuel_suppliers.json',
        'test/test_organization_balances.json',
        'test/test_prodlike_government_users_and_roles.json',
        'test/test_users_and_organizations_v0.3.1.json',
        'test/test_users_multiple_roles.json'
    ]

    def setUp(self):
        """Prepare test resources"""
        self.factory = RequestFactory()
        self.userauth = UserAuthentication()
        super().setUp()

    def test_jwt_invalid_token(self):
        """Test invalid token"""

        request = self.factory.get('/')
        request.META = {
            'HTTP_AUTHORIZATION': 'garbage'
        }

        with self.assertRaises(exceptions.AuthenticationFailed):
            _user, _auth = self.userauth.authenticate(request)

    def test_jwt_no_token(self):
        """Test no token"""

        request = self.factory.get('/')

        with self.assertRaises(exceptions.AuthenticationFailed):
            _user, _auth = self.userauth.authenticate(request)

    def test_jwt_valid_token(self):
        request = self.factory.get('/')

        payload = {
            'user_id': 'fs_user_3',
            'iss': 'tfrs-test',
            'aud': 'tfrs-app'
        }
        key = self.private_key

        request.META = {
            'HTTP_AUTHORIZATION': 'Bearer {}'.format(
                jwt.encode(payload,
                           key,
                           algorithm='RS256'
                           ).decode('utf-8')
            )
        }

        print (request.META['HTTP_AUTHORIZATION'])

        _user, _auth = self.userauth.authenticate(request)
