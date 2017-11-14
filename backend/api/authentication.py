from api.models.User import User
from rest_framework import authentication
from rest_framework import exceptions


class UserAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        user_id = request.META.get('HTTP_SM_USER')
        if not user_id:
            return None

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            raise exceptions.AuthenticationFailed(
                'No such user')  # raise exception if user does not exist
        return (user, None)
