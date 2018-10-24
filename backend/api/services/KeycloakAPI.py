import random

import requests
from tfrs.settings import KEYCLOAK


def get_token():
    token_url = '{keycloak}/auth/realms/{realm}/protocol/openid-connect/token'.format(
        keycloak=KEYCLOAK['SERVICE_ACCOUNT_KEYCLOAK_API_BASE'],
        realm=KEYCLOAK['SERVICE_ACCOUNT_REALM'])

    response = requests.post(token_url,
                             auth=(KEYCLOAK['SERVICE_ACCOUNT_CLIENT_ID'],
                                   KEYCLOAK['SERVICE_ACCOUNT_CLIENT_SECRET']),
                             data={'grant_type': 'client_credentials'})

    # print ('response: {}'.format(response.text))

    token = response.json()['access_token']

    # print('have token: {}'.format(token))

    return token


def list_users(token):
    users_url = '{keycloak}/auth/admin/realms/{realm}/users'.format(
        keycloak=KEYCLOAK['SERVICE_ACCOUNT_KEYCLOAK_API_BASE'],
        realm=KEYCLOAK['SERVICE_ACCOUNT_REALM'])

    headers = {'Authorization': 'Bearer {}'.format(token)}

    response = requests.get(users_url,
                            headers=headers)

    print(response.text)

    all_users = response.json()
    for user in all_users:
        users_detail_url = '{keycloak}/auth/admin/realms/{realm}/users/{user_id}/federated-identity'.format(
            keycloak=KEYCLOAK['SERVICE_ACCOUNT_KEYCLOAK_API_BASE'],
            realm=KEYCLOAK['SERVICE_ACCOUNT_REALM'],
            user_id=user['id'])

        response = requests.get(users_detail_url,
                                headers=headers)

        print('user detail for {username}:\n{json}\n--\n'.format(username=user['username'], json=response.text))

    if response.status_code != 200:
        raise RuntimeError('bad response code: {}'.format(response.status_code))


def associate_federated_identity_with_user(token, id, provider, username):
    users_url = '{keycloak}/auth/admin/realms/{realm}/users/{user_id}/federated-identity/{provider}'.format(
        keycloak=KEYCLOAK['SERVICE_ACCOUNT_KEYCLOAK_API_BASE'],
        realm=KEYCLOAK['SERVICE_ACCOUNT_REALM'],
        user_id=id,
        provider=provider)

    print(users_url)

    headers = {'Authorization': 'Bearer {}'.format(token)}

    data = {
        'userName': username
    }

    response = requests.post(users_url,
                             headers=headers,
                             json=data)

    print(response.status_code)
    print(response.text)


def map_user(keycloak_user_id, tfrs_user_id):

    users_url = '{keycloak}/auth/admin/realms/{realm}/users/{user_id}'.format(
        keycloak=KEYCLOAK['SERVICE_ACCOUNT_KEYCLOAK_API_BASE'],
        realm=KEYCLOAK['SERVICE_ACCOUNT_REALM'],
        user_id=keycloak_user_id)

    headers = {'Authorization': 'Bearer {}'.format(get_token())}

    data = {
        'attributes': {
            'user_id': tfrs_user_id
        }
    }

    print('posting: {} to {}'.format(data, keycloak_user_id))

    response = requests.put(
        users_url,
        headers=headers,
        json=data
    )

    if response.status_code not in [200, 201, 204]:
        raise RuntimeError('bad response code: {}'.format(response.status_code))

    #created_user_response = requests.get(response.headers['Location'], headers=headers)

    #return created_user_response.json()['id']


def create_user(token, user_name, maps_to_id):
    users_url = '{keycloak}/auth/admin/realms/{realm}/users'.format(
        keycloak=KEYCLOAK['SERVICE_ACCOUNT_KEYCLOAK_API_BASE'],
        realm=KEYCLOAK['SERVICE_ACCOUNT_REALM'])

    headers = {'Authorization': 'Bearer {}'.format(token)}

    data = {
        'enabled': True,
        'username': user_name,
        'attributes': {
            'user_id': maps_to_id
        }
    }

    response = requests.post(users_url,
                             headers=headers,
                             json=data)

    if response.status_code != 204:
        raise RuntimeError('bad response code: {}'.format(response.status_code))

    created_user_response = requests.get(response.headers['Location'], headers=headers)

    return created_user_response.json()['id']


def main():
    token = get_token()
    user_name = 'generated-{}'.format(str(random.randint(1000, 100000000)))

    print('using username {}'.format(user_name))
    # list_users(token)
    user_id = create_user(token,
                          user_name,
                          'fs3')

    associate_federated_identity_with_user(token, user_id, 'github', 'plasticviking')


if __name__ == "__main__":
    main()
