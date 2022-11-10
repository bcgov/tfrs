import os


def config():
    return {
        'ENABLED': True,
        'REALM': os.getenv('KEYCLOAK_REALM_URL', 'https://dev.loginproxy.gov.bc.ca/auth/realms/standard'),
        'CLIENT_ID': os.getenv('KEYCLOAK_CLIENT_ID', 'tfrs-on-gold-4308'),
        'AUDIENCE': os.getenv('KEYCLOAK_AUDIENCE', 'tfrs-on-gold-4308'),
        'ISSUER': os.getenv('KEYCLOAK_ISSUER', 'https://dev.loginproxy.gov.bc.ca/auth/realms/standard'),
        'CERTS_URL': os.getenv('KEYCLOAK_CERTS_URL',
                               'https://dev.loginproxy.gov.bc.ca/auth/realms/standard/protocol/openid-connect/certs'),
        'DOWNLOAD_CERTS': bool(os.getenv('KEYCLOAK_DOWNLOAD_CERTS', 'true').lower() in ['true', '1']),
        'SERVICE_ACCOUNT_REALM': os.getenv('KEYCLOAK_SA_REALM', 'standard'),
        'SERVICE_ACCOUNT_CLIENT_ID': os.getenv('KEYCLOAK_SA_CLIENT_ID', 'tfrs-on-gold-4308'),
        'SERVICE_ACCOUNT_KEYCLOAK_API_BASE': os.getenv('KEYCLOAK_SA_BASEURL', 'https://dev.loginproxy.gov.bc.ca'),
        'SERVICE_ACCOUNT_CLIENT_SECRET': os.getenv('KEYCLOAK_SA_CLIENT_SECRET', ''),
        'RS256_KEY': None
    }
