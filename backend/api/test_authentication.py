from django.test import TestCase, Client, RequestFactory
from rest_framework import status
from .authentication import UserAuthentication
from .models.User import User
from .models.Organization import Organization
from .models.OrganizationType import OrganizationType


class TestAuthentication(TestCase):
    fixtures = ['organization_types.json',
                'organization_government.json',
                'organization_balance_gov.json',
                'credit_trade_statuses.json',
                'organization_actions_types.json',
                'organization_statuses.json',
                'credit_trade_types.json',
                'test_users.json',
                ]

    def setUp(self):
        self.userauth = UserAuthentication()
        self.factory = RequestFactory()
        pass

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

    def test_user_first_login_valid(self):
        # Create mapping by updating the user model
        # (authorization_guid = sm header guid)
        new_user = User.objects.create(authorization_id='TestUser')

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
        assert user.authorization_guid == userguid

    def test_user_first_login_idir_valid(self):
        # Create mapping by updating the user model
        # (authorization_guid = sm header guid)
        new_user = User.objects.create(authorization_id='TUSER')

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

        gov_organization = Organization.objects.get(
            type=OrganizationType.objects.get(type="Government"))

        assert user is not None
        assert user.display_name == display_name
        assert new_user.authorization_id == user.authorization_id
        assert user.authorization_guid == userguid
        assert gov_organization.id == user.organization.id

    def test_user_first_login_idir_invalid(self):
        # User can login through siteminder, but their user id doesn't
        # exist in the database, so they can't log in to the app.
        new_user = User.objects.create(authorization_id='TestUser')

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

        user, auth = self.userauth.authenticate(request)

        assert user is None

