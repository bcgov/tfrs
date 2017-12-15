# from django.contrib.auth.models import User
from api.models.User import User
from api.models.Organization import Organization
from api.models.OrganizationType import OrganizationType
from rest_framework import authentication
from rest_framework import exceptions


class UserAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        header_user_id = request.META.get('HTTP_SMAUTH_USER')
        header_user_guid = request.META.get('HTTP_SMAUTH_USERGUID')
        header_user_dir = request.META.get('HTTP_SMAUTH_DIRNAME')
        header_username = request.META.get('HTTP_SMAUTH_UNIVERSALID')
        header_user_email = request.META.get('HTTP_SMAUTH_USEREMAIL')
        header_user_displayname = request.META.get(
            'HTTP_SMAUTH_USERDISPLAYNAME')

        if not header_user_guid:
            raise exceptions.AuthenticationFailed('No Siteminder headers found')

        organization = None
        if (request.META.get('HTTP_SMAUTH_USERTYPE') == 'Internal' and
                    request.META.get('HTTP_SMAUTH_DIRNAME') == 'IDIR'):
            organization = Organization.objects.get(
                type=OrganizationType.objects.get(type="Government"))

        # TODO: Update this so it doesn't create a user. Instead, display
        # a prompt to ask the administrator to add their GUID to the system
        user, created = User.objects.update_or_create(
            authorization_guid=header_user_guid,
            defaults={'username': header_username,
                      'email': header_user_email,
                      'authorization_id': header_user_id,
                      'authorization_directory': header_user_dir,
                      'display_name': header_user_displayname,
                      'organization': organization},
        )


        # print("User is", vars(user))

        return user, None
