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

from django.test import RequestFactory
from django.conf import settings
from rest_framework import exceptions

from api.authentication import UserAuthentication
from api.models.User import User
from api.models.Organization import Organization
from api.models.OrganizationStatus import OrganizationStatus
from api.models.OrganizationActionsType import OrganizationActionsType
from api.models.OrganizationType import OrganizationType

from .base_test_case import BaseTestCase

class TestAuthentication(BaseTestCase):
    """Tests for authentication module"""


    def setUp(self):
        """Prepare test resources"""
        self.userauth = UserAuthentication()
        self.factory = RequestFactory()
        settings.DEBUG = False
        super().setUp()

    def tearDown(self):
        """Restore settings"""
        settings.BYPASS_AUTH = False

    def test_user_first_login_valid(self):
        """Test BCeID user first login"""

        # Create mapping by updating the user model
        # (authorization_guid = sm header guid)
        new_user = User.objects.create(authorization_id='testuser')

        assert new_user.authorization_guid is None

        display_name = 'Test User'
        userguid = '05fa1e10-08e1-454c-b1a3-cee38e825d47'
        request = self.factory.get('/')
        request.META = {
            'HTTP_SMAUTH_USERGUID': userguid,
            'HTTP_SMAUTH_USERDISPLAYNAME': display_name,
            'HTTP_SMAUTH_USEREMAIL': 'TestUser@testcompany.ca',
            'HTTP_SMAUTH_UNIVERSALID': 'TestUser',
        }

        # authenticate should match authorization_id and create the user
        user, auth = self.userauth.authenticate(request)

        assert user is not None
        assert user.display_name == display_name
        assert new_user.authorization_id == user.authorization_id
        assert str(user.authorization_guid) == userguid

    def test_user_first_login_idir(self):
        """Test IDIR user first login"""

        # Create mapping by updating the user model
        # (authorization_guid = sm header guid)
        gov_organization = Organization.objects.get(
            type=OrganizationType.objects.get(type="Government"))
        new_user = User.objects.create(authorization_id='tuser',
                                       organization=gov_organization)

        display_name = 'Test User'
        userguid = 'af2a7728-1228-4aea-9461-b0464cba8fa1'
        request = self.factory.get('/')
        request.META = {
            'HTTP_SMAUTH_USERGUID': userguid,
            'HTTP_SMAUTH_USERDISPLAYNAME': display_name,
            'HTTP_SMAUTH_USEREMAIL': 'TestUser@testcompany.ca',
            'HTTP_SMAUTH_UNIVERSALID': 'TUSER',
            'HTTP_SMAUTH_DIRNAME': 'IDIR',
            'HTTP_SMAUTH_USERTYPE': 'Internal'
        }

        # authenticate should match authorization_id and create the user
        user, auth = self.userauth.authenticate(request)

        assert user is not None
        assert user.display_name == display_name
        assert new_user.authorization_id == user.authorization_id
        assert str(user.authorization_guid) == userguid
        assert gov_organization.id == user.organization.id

    def test_user_first_login_idir_invalid(self):
        """Test IDIR user with no application account can't login"""

        # User can login through siteminder, but their user id doesn't
        # exist in the database, so they can't log in to the app.

        display_name = 'Test User'
        userguid = 'af2a7728-1228-4aea-9461-b0464cba8fa1'
        request = self.factory.get('/')
        request.META = {
            'HTTP_SMAUTH_USERGUID': userguid,
            'HTTP_SMAUTH_USERDISPLAYNAME': display_name,
            'HTTP_SMAUTH_USEREMAIL': 'TestUser@testcompany.ca',
            'HTTP_SMAUTH_UNIVERSALID': 'TUSER',
            'HTTP_SMAUTH_DIRNAME': 'IDIR',
            'HTTP_SMAUTH_USERTYPE': 'Internal'
        }

        with self.assertRaises(exceptions.AuthenticationFailed):
            user, auth = self.userauth.authenticate(request)

    def test_user_same_username_external_internal(self):
        """Test external and internal users can have the same authorization id"""

        gov_organization = Organization.objects.get(
            type=OrganizationType.objects.get(type="Government"))

        org_status = OrganizationStatus.objects.get(pk=1)
        org_actions_type = OrganizationActionsType.objects.get(pk=1)
        org_type = OrganizationType.objects.get(pk=2)

        external_organization = Organization.objects.create(
            name="Test", status=org_status, actions_type=org_actions_type,
            type=org_type)

        new_user1 = User.objects.create(authorization_id='tuser',
                                        username="internal_tuser",
                                        organization=gov_organization)

        new_user2 = User.objects.create(authorization_id='tuser',
                                        username="business_tuser",
                                        organization=external_organization)

        userguid1 = 'af2a7728-1228-4aea-9461-b0464cba8fa1'
        userguid2 = '05fa1e10-08e1-454c-b1a3-cee38e825d47'

        request = self.factory.get('/')
        request.META = {
            'HTTP_SMAUTH_USERGUID': userguid1,
            'HTTP_SMAUTH_USERDISPLAYNAME': "Test User",
            'HTTP_SMAUTH_USEREMAIL': 'TestUser@gov.bc.ca',
            'HTTP_SMAUTH_UNIVERSALID': 'TUSER',
            'HTTP_SMAUTH_DIRNAME': 'IDIR',
            'HTTP_SMAUTH_USERTYPE': 'Internal'
        }

        user1, auth = self.userauth.authenticate(request)
        assert user1.organization.id == gov_organization.id
        assert user1.username == "internal_tuser"
        assert user1.authorization_id == new_user1.authorization_id

        request.META = {
            'HTTP_SMAUTH_USERGUID': userguid2,
            'HTTP_SMAUTH_USERDISPLAYNAME': "Test User",
            'HTTP_SMAUTH_USEREMAIL': 'TestUser@testcompany.ca',
            'HTTP_SMAUTH_UNIVERSALID': 'TUSER',
            'HTTP_SMAUTH_DIRNAME': 'CAP TBCEID',
            'HTTP_SMAUTH_USERTYPE': 'Business'
        }

        user2, auth = self.userauth.authenticate(request)
        assert user2.organization.id == external_organization.id
        assert user2.username == "business_tuser"
        assert user2.authorization_id == new_user2.authorization_id

    def test_bypass_auth(self):
        """Test bypassing authentication"""
        settings.BYPASS_AUTH = True

        request = self.factory.get('/')

        user, auth = self.userauth.authenticate(request)

        # First user in the database
        assert user.username == User.objects.first().username

    def test_bypass_auth_error(self):
        """Test bypassing authentication disabled throws error"""
        settings.BYPASS_AUTH = False

        request = self.factory.get('/')

        # Will throw error on this line on authentication.py:
        # header_user_guid = uuid.UUID(request.META.get('HTTP_SMAUTH_USERGUID'))
        # raise TypeError('one of the hex, bytes, bytes_le, fields, '

        with self.assertRaises(TypeError):
            self.userauth.authenticate(request)
