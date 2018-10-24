import os


def config():
    return {
        'ENABLED': bool(os.getenv('KEYCLOAK_ENABLED', 'False').lower() in ['true', 1]),
        'REALM': os.getenv('KEYCLOAK_REALM_URL', 'http://localhost:8888/auth/realms/tfrs'),
        'CLIENT_ID': os.getenv('KEYCLOAK_CLIENT_ID', 'tfrs-app'),
        'AUDIENCE': os.getenv('KEYCLOAK_AUDIENCE', 'tfrs-app'),
        'ISSUER': os.getenv('KEYCLOAK_ISSUER', 'http://localhost:8888/auth/realms/tfrs'),
        'CERTS_URL': os.getenv('KEYCLOAK_CERTS_URL',
                               'http://localhost:8888/auth/realms/tfrs/protocol/openid-connect/certs'),
        'DOWNLOAD_CERTS': bool(os.getenv('KEYCLOAK_DOWNLOAD_CERTS', 'true').lower() in ['true', '1']),
        'SERVICE_ACCOUNT_REALM': os.getenv('KEYCLOAK_SA_REALM', 'tfrs'),
        'SERVICE_ACCOUNT_CLIENT_ID': os.getenv('KEYCLOAK_SA_CLIENT_ID', 'tfrs'),
        'SERVICE_ACCOUNT_KEYCLOAK_API_BASE': os.getenv('KEYCLOAK_SA_BASEURL', 'http://localhost:8888'),
        'SERVICE_ACCOUNT_CLIENT_SECRET': os.getenv('KEYCLOAK_SA_CLIENT_SECRET', ''),
        'RS256_KEY': None
    }
