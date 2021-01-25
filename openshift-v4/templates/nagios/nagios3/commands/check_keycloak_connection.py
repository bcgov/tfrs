import os
import requests

KEYCLOAK = {
        'REALM': os.getenv('KEYCLOAK_REALM', 'http://localhost:8888/auth/realms/tfrs'),
        'CLIENT_ID': os.getenv('KEYCLOAK_CLIENT_ID', 'tfrs-app'),
        'SERVICE_ACCOUNT_REALM': os.getenv('KEYCLOAK_SA_REALM', 'tfrs'),
        'SERVICE_ACCOUNT_CLIENT_ID': os.getenv('KEYCLOAK_SA_CLIENT_ID', 'tfrs'),
        'SERVICE_ACCOUNT_KEYCLOAK_API_BASE': os.getenv('KEYCLOAK_SA_BASEURL', 'http://localhost:8888'),
        'SERVICE_ACCOUNT_CLIENT_SECRET': os.getenv('KEYCLOAK_SA_CLIENT_SECRET', '')
    }

"""
This function will generate the token for the Service Account.
This token is most likely going to be used to update information
for the logged-in user (not to be confused with the service account)
such as auto-mapping the user upon first login.
"""
token_url = '{keycloak}/auth/realms/{realm}/protocol/openid-connect/token'.format(
    keycloak=KEYCLOAK['SERVICE_ACCOUNT_KEYCLOAK_API_BASE'],
    realm=KEYCLOAK['SERVICE_ACCOUNT_REALM'])

response = requests.post(token_url,
                            auth=(KEYCLOAK['SERVICE_ACCOUNT_CLIENT_ID'],
                                KEYCLOAK['SERVICE_ACCOUNT_CLIENT_SECRET']),
                            data={'grant_type': 'client_credentials'})

token = response.json()['access_token']

"""
Retrieves the list of users found in Keycloak.
Not to be confused with the list of users found in the actual
database.
"""
users_url = '{keycloak}/auth/admin/realms/{realm}/users'.format(
    keycloak=KEYCLOAK['SERVICE_ACCOUNT_KEYCLOAK_API_BASE'],
    realm=KEYCLOAK['SERVICE_ACCOUNT_REALM'])

headers = {'Authorization': 'Bearer {}'.format(token)}

response = requests.get(users_url,
                        headers=headers)

i=0
all_users = response.json()
for user in all_users:
    i=i+1
    users_detail_url = '{keycloak}/auth/admin/realms/{realm}/users/{user_id}/federated-identity'.format(
        keycloak=KEYCLOAK['SERVICE_ACCOUNT_KEYCLOAK_API_BASE'],
        realm=KEYCLOAK['SERVICE_ACCOUNT_REALM'],
        user_id=user['id'])

    response = requests.get(users_detail_url,
                            headers=headers)
    if i>=1:
        break


if response.status_code == 200:
    print('OK - Keycloak connection checking passed')
else:
    print('CRITICAL - Keycloak connection checking failed')
