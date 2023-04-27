import json
import jwt
import requests

from django.core.cache import caches
from django.conf import settings
from django.db.models import Q
from rest_framework import authentication
from rest_framework import exceptions

from api.models.User import User
from api.models.UserCreationRequest import UserCreationRequest
from api.models.UserLoginHistory import UserLoginHistory
from tfrs.settings import WELL_KNOWN_ENDPOINT, KEYCLOAK_AUDIENCE
import tfrs.settings

cache = caches['keycloak']

class UserAuthentication(authentication.BaseAuthentication):
    """
    Class to handle authentication when after logging into keycloak
    """

    def refresh_jwk(self):
        oidc_response = requests.get(WELL_KNOWN_ENDPOINT)
        jwks_uri = json.loads(oidc_response.text)['jwks_uri']
        self.jwks_uri = jwks_uri
        certs_response = requests.get(jwks_uri)
        jwks = json.loads(certs_response.text)
        self.jwks = jwks

    def __init__(self):
        self.unit_testing_enabled = getattr(tfrs.settings, 'UNIT_TESTING_ENABLED', False)
        if not self.unit_testing_enabled:
            self.refresh_jwk()

    def create_login_history(self, user_token, success = False, error = None, path = ''):
        # We only want to create a user_login_request when the current user is fetched
        if path != '/api/users/current':
            return
            
        try:
            email = user_token['email']
            username = parse_external_username(user_token)
            id = user_token['preferred_username']
            print(email, username, id, success, error)
            UserLoginHistory.objects.create(
                keycloak_email=email,
                external_username=username,
                keycloak_user_id=id,
                is_login_successful=success,
                login_error_message=error
            )
        except Exception as exc:
            print('User history object create failed.', exc)
            pass

    def authenticate(self, request):
        """Verify the JWT token and find the correct user in the DB"""

        auth = request.META.get('HTTP_AUTHORIZATION', None)

        if not auth:
            print('Authorization header required')
            raise exceptions.AuthenticationFailed(
                'Authorization header required')

        if self.unit_testing_enabled:
            try:
                user = User.objects.get(keycloak_user_id=auth['preferred_username'])
                return user, None
            except User.DoesNotExist as exc:
                print("Testing User does not exist")
                raise User.DoesNotExist(str(exc))

        print("auth", auth)
        try:
            scheme, token = auth.split()
        except ValueError:
            print('Invalid format for authorization header')
            raise exceptions.AuthenticationFailed(
                'Invalid format for authorization header')
        if scheme != 'Bearer':
            print('Authorization header invalid')
            raise exceptions.AuthenticationFailed(
                'Authorization header invalid'
            )

        if not token:
            print('No token found')
            raise exceptions.AuthenticationFailed(
                'No token found'
            )

        user_token = None
        token_validation_errors = []

        jwks_client = jwt.PyJWKClient(self.jwks_uri)

        try:
            signing_key = jwks_client.get_signing_key_from_jwt(token)
        except Exception as exc:
            print(exc)
            token_validation_errors.append(exc)
            raise Exception(str(exc))

        try:
            user_token = jwt.decode(
                token,
                signing_key.key,
                algorithms=["RS256"],
                audience=KEYCLOAK_AUDIENCE,
                options={"verify_exp": True},
            )
        except (jwt.InvalidTokenError, jwt.DecodeError) as exc:
            print(str(exc))
            token_validation_errors.append(exc)
            raise Exception(str(exc))

        if not user_token:
            raise exceptions.AuthenticationFailed(
                'No successful decode of user token. Exceptions occurred: {}',
                '\n'.join([str(error) for error in token_validation_errors])
            )

        # Check for existing mapped user
        if 'preferred_username' in user_token:
            try:
                user = User.objects.get(keycloak_user_id=user_token['preferred_username'])
                if user:
                    self.create_login_history(user_token, True, None, request.path)
                return user, None
            except User.DoesNotExist:
                pass
        
        external_username = parse_external_username(user_token)

        # fall through to here if no mapped user is found
        if 'email' in user_token:
            # we map users by email and external_username
            creation_request = UserCreationRequest.objects.filter(
                keycloak_email__iexact=user_token['email']
            ).filter(
              external_username__iexact=external_username
            )

            # Ensure that idir users can only be mapped to bcgov org
            # and external users are mapped only to supplier orgs
            if user_token['identity_provider'] == 'idir':
                creation_request.filter(user__organization=1)
            elif user_token['identity_provider'] == 'bceidbusiness':
                creation_request.filter(~Q(user__organization=1))
            else:
                error_text = 'Unknown identity provider.'
                self.create_login_history(user_token, False, error_text, request.path)
                return None

            # filter out if the user has already been mapped
            creation_request.filter(user__keycloak_user_id=None)

            if not creation_request.exists():
                error_text = 'No User with that configuration exists.'
                self.create_login_history(user_token, False, error_text, request.path)
                return None

            user_creation_request = creation_request.first()

            # map keycloak user to tfrs user
            user = user_creation_request.user
            user.keycloak_user_id = user_token['preferred_username']
            if user_token['display_name']:
                user._display_name = user_token['display_name']
            user.save()

            self.create_login_history(user_token, True, None, request.path)
            user_creation_request.is_mapped = True
            user_creation_request.save()
        else:
            error_text = 'preffered_username or email is required in jwt payload.'
            self.create_login_history(user_token, False, error_text, request.path)
            return None
        
        try:
            user = User.objects.get(keycloak_user_id=user_token['preferred_username'])
            if not user.is_active:
                error_text = 'User is not active.'
                self.create_login_history(user_token, False, error_text, request.path)
                return None
        except User.DoesNotExist:
            error_text = 'User does not exist.'
            self.create_login_history(user_token, False, error_text, request.path)
            return None

        return user, None


def parse_external_username(user_token):
    try:
        # Which provider is user logging in with
        if user_token['identity_provider'] == 'idir':
            external_username = user_token['idir_username']
        elif user_token['identity_provider'] == 'bceidbusiness':
            external_username = user_token['bceid_username']
        else:
            raise Exception('Unknown identity provider.')
    except Exception as exc:
        raise Exception('Invalid identity provider.')
    
    return external_username

