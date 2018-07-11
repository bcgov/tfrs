import uuid
from django.db.models import Q
from rest_framework import authentication
from rest_framework import exceptions
from api.models.User import User
from api.models.Organization import Organization
from api.models.OrganizationType import OrganizationType
from api.utils import get_firstname_lastname
from django.conf import settings


class UserAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):

        # Bypass auth env variable
        if settings.BYPASS_AUTH:
            return (User.objects.first(), None)

        header_username = request.META.get('HTTP_SMAUTH_USER',
                                           request.META.get(
                                               'HTTP_SMAUTH_UNIVERSALID'
                                           ))
        header_user_guid = uuid.UUID(request.META.get('HTTP_SMAUTH_USERGUID'))
        header_user_dir = request.META.get('HTTP_SMAUTH_DIRNAME')
        header_user_id = request.META.get('HTTP_SMAUTH_UNIVERSALID').lower()
        header_user_email = request.META.get('HTTP_SMAUTH_USEREMAIL')
        header_user_displayname = request.META.get(
            'HTTP_SMAUTH_USERDISPLAYNAME')
        header_user_type = request.META.get('HTTP_SMAUTH_USERTYPE', 'Business')

        if not header_user_guid and not header_user_id:
            raise exceptions.AuthenticationFailed(
                'No SiteMinder headers found'
            )

        try:
            gov_organization = Organization.objects.get(
                type=OrganizationType.objects.get(type="Government"))

            if header_user_type == 'Internal' and header_user_dir == 'IDIR':
                # User is a government/Internal user
                user = User.objects.get(
                    Q(organization_id=gov_organization.id),
                    Q(authorization_guid=header_user_guid) |
                    Q(authorization_id=header_user_id))

            else:
                user = User.objects.get(
                    ~Q(organization_id=gov_organization.id),
                    Q(authorization_guid=header_user_guid) |
                    Q(authorization_id=header_user_id))

            # First time logging in, map the GUID to the user and set
            # fname & lname
            if user.authorization_guid is None:
                user.authorization_guid = header_user_guid
                first_name, last_name = get_firstname_lastname(
                    header_user_displayname, header_user_type)
                user.first_name = first_name if first_name else ""
                user.last_name = last_name if last_name else ""

            # If we have a guid in the system, but it doesn't match the user's
            if user.authorization_guid != header_user_guid:
                raise exceptions.AuthenticationFailed(
                    'Invalid user identifier. '
                    'Please contact your administrator.')

            username = "_".join([header_user_type.lower(),
                                header_username.lower()])
            user.username = user.username if user.username else username
            user.authorization_email = header_user_email
            user.authorization_id = header_user_id
            user.authorization_directory = header_user_dir
            user.display_name = header_user_displayname

            user.save()

        except User.DoesNotExist:
            # Log this attempt
            raise exceptions.AuthenticationFailed(
                'User is not authorized to access this application. '
                'Please contact your administrator')

        return (user, None)
