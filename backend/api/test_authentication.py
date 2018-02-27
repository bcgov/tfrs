from django.test import TestCase, Client, RequestFactory
from rest_framework import exceptions
from django.conf import settings

from .authentication import UserAuthentication
from .models.User import User
from .models.Organization import Organization
from .models.OrganizationStatus import OrganizationStatus
from .models.OrganizationActionsType import OrganizationActionsType
from .models.OrganizationType import OrganizationType


class TestAuthentication(TestCase):
    fixtures = ['organization_types.json',
                'organization_government.json',
                'organization_balance_gov.json',
                'credit_trade_statuses.json',
                'organization_actions_types.json',
                'organization_statuses.json',
                'credit_trade_types.json',
                'test_organization_fuel_suppliers.json',
                'test_users.json',
                ]

    def setUp(self):
        self.userauth = UserAuthentication()
        self.factory = RequestFactory()
        settings.DEBUG = False
        pass

    def tearDown(self):
        settings.BYPASS_AUTH = False

    def test_user_has_mapping(self):
        # Return user
        request = self.factory.get('/')
        display_name = 'Brad Smith'
        request.META = {
            'HTTP_SMAUTH_USERGUID': 'c9804c52-05f1-4a6a-9d24-332d9d8be2a9',
            'HTTP_SMAUTH_USERDISPLAYNAME': display_name,
            'HTTP_SMAUTH_USEREMAIL': 'BradJSmith@cuvox.de',
            'HTTP_SMAUTH_UNIVERSALID': 'BSmith',
        }

        user, auth = self.userauth.authenticate(request)
        # print(user)
        # print(user.display_name)

        assert user is not None
        assert user.display_name == display_name

    def test_user_has_mapping_uuid_formatted_and_matched(self):
        # Return user
        request = self.factory.get('/')
        display_name = 'Brad Smith'
        request.META = {
            'HTTP_SMAUTH_USERGUID': 'C9804C5205F14A6A9D24332D9D8BE2A9',
            'HTTP_SMAUTH_USERDISPLAYNAME': display_name,
            'HTTP_SMAUTH_USEREMAIL': 'BradJSmith@cuvox.de',
            'HTTP_SMAUTH_UNIVERSALID': 'BSmith',
        }

        user, auth = self.userauth.authenticate(request)
        assert user is not None
        assert user.display_name == display_name

    def test_user_first_login_valid(self):
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

    def test_user_first_login_idir_valid(self):
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

    def test_user_first_login_idir_different_case_valid(self):
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
        settings.BYPASS_AUTH = True

        request = self.factory.get('/')

        user, auth = self.userauth.authenticate(request)
        # First user in the database
        assert user.username == 'business_bsmith'

    def test_bypass_auth_error(self):
        settings.BYPASS_AUTH = False

        request = self.factory.get('/')

        # Will throw error on this line on authentication.py:
        # header_user_guid = uuid.UUID(request.META.get('HTTP_SMAUTH_USERGUID'))
        # raise TypeError('one of the hex, bytes, bytes_le, fields, '

        with self.assertRaises(TypeError):
            user, auth = self.userauth.authenticate(request)
