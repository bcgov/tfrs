import os
import json
import jwt
import requests

from cryptography.hazmat.primitives import serialization
from django.core.cache import caches
from django.conf import settings
from rest_framework import authentication
from rest_framework import exceptions

from api.models.User import User
from api.models.UserCreationRequest import UserCreationRequest
from api.services.KeycloakAPI import map_user
from tfrs.settings import WELL_KNOWN_ENDPOINT

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
        self.refresh_jwk()

    def authenticate(self, request):
        """Verify the JWT token and find the correct user in the DB"""

        if not settings.KEYCLOAK['ENABLED']:
            # fall through
            return None

        auth = request.META.get('HTTP_AUTHORIZATION', None)

        if not auth:
            print('Authorization header required')
            raise exceptions.AuthenticationFailed(
                'Authorization header required')

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
                audience=settings.KEYCLOAK['AUDIENCE'],
                options={"verify_exp": True},
            )
        except (jwt.InvalidTokenError, jwt.ExpiredSignature, jwt.DecodeError) as exc:
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
                return user, None
            except User.DoesNotExist: 
                print("User does not exist, falling through")
                pass
        
        try:
            # Which provider is user logging in with
            if token['identity_provider'] == 'idir':
                external_username = token['idir_username']
            elif token['identity_provider'] == 'bceidbusiness':
                external_username = token['bceid_username']
            else:
                raise Exception('unknown identity provider')
        except Exception as exc:
            raise Exception('identity provider invalid')

        # fall through to here if no mapped user is found
        if 'email' in user_token:
            creation_request = UserCreationRequest.objects.filter(
                keycloak_email__iexact=user_token['email']
            ).filter(
              external_username__iexact=external_username
            ).filter(
              user__keycloak_user_id=None
            )

            if not creation_request.exists():
                print("No User with that email/username exists.")
                raise exceptions.AuthenticationFailed(
                    "No User with that email/username exists.")

            user_creation_request = creation_request.first()

            # map keycloak user to tfrs user
            user = user_creation_request.user
            user.keycloak_user_id = user_token['preferred_username']
            if user_token['display_name']:
                user._display_name = user_token['display_name']
            user.save()

            user_creation_request.is_mapped = True
            user_creation_request.save()
        else:
            raise exceptions.AuthenticationFailed(
                'preffered_username or email is required in jwt payload')
        
        try:
            user = User.objects.get(keycloak_user_id=user_token['preferred_username'])
            if not user.is_active:
                raise exceptions.AuthenticationFailed('User is not active')
        except User.DoesNotExist:
            raise exceptions.AuthenticationFailed('User does not exist')

        return user, None
