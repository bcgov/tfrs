# from django.contrib.auth.models import User
from api.models.User import User
from rest_framework import authentication
from rest_framework import exceptions


class UserAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        user_guid = request.META.get('HTTP_SMAUTH_USERGUID')
        if not user_guid:
            return None

        try:
            user = User.objects.get(authorizaion_guid=user_guid)
        except User.DoesNotExist:
            raise exceptions.AuthenticationFailed(
                'No such user')  # raise exception if user does not exist

        return user, None
