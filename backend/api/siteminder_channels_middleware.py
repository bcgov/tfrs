from uuid import UUID

from channels import exceptions
from django.db import close_old_connections
from django.db.models import Q

from api.middleware import SMUserMiddleware
from api.models.Organization import Organization
from api.models.OrganizationType import OrganizationType
from api.models.User import User
from tfrs import settings


class SMUserAuth:
    """
    Middleware that takes user credentials from SiteMinder Proxy.
    """

    def __init__(self, inner):
        self.inner = inner

    def __call__(self, scope):

        if settings.BYPASS_AUTH:
            user = User.objects.first()
            close_old_connections()
            return self.inner(dict(scope, user=user))

        headers = dict(scope['headers'])

        header_user_guid = UUID(hex=headers.get(b'smgov-userguid').decode('utf-8'))
        header_user_dir = headers.get(b'sm-authdirname').decode('utf-8')
        header_user_id = headers.get(b'sm-universalid').decode('utf-8').lower()
        header_user_type = headers.get(b'smgov_usertype', b'Business').decode('utf-8')

        if not header_user_guid and not header_user_id:
            raise exceptions.DenyConnection(
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

            # Has the user been marked as inactive?
            if not user.is_active:
                raise exceptions.DenyConnection(
                    'Your account has not been activated.'
                    'Please contact your representative.'
                )

            print(scope['headers'])
            close_old_connections()
            # Return the inner application directly and let it run everything else
            return self.inner(dict(scope, user=user))

        except User.DoesNotExist:
            raise exceptions.DenyConnection(
                'User is not authorized to access this application. '
                'Please contact your administrator')
