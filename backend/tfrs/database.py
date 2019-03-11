import os

from django.conf import settings
from django.db.backends.signals import connection_created

engines = {
    'sqlite': 'django.db.backends.sqlite3',
    'postgresql': 'django.db.backends.postgresql_psycopg2',
    'mysql': 'django.db.backends.mysql',
}


def config():
    service_name = os.getenv('DATABASE_SERVICE_NAME', '').upper().replace('-', '_')
    if service_name:
        engine = engines.get(os.getenv('DATABASE_ENGINE'), engines['sqlite'])
    else:
        engine = engines['sqlite']
    name = os.getenv('DATABASE_NAME')
    if not name and engine == engines['sqlite']:
        name = os.path.join(settings.BASE_DIR, 'db.sqlite3')

    if bool(os.getenv('FIX_BROKEN_SQLITE', 'False').lower() in ['true', 1]):
        connection_created.connect(activate_legacy_table_fix)

    return {
            'ENGINE': engine,
            'NAME': name,
            'USER': os.getenv('DATABASE_USER'),
            'PASSWORD': os.getenv('DATABASE_PASSWORD'),
            'HOST': os.getenv('{}_SERVICE_HOST'.format(service_name)),
            'PORT': os.getenv('{}_SERVICE_PORT'.format(service_name)),
        }


def activate_legacy_table_fix(sender, connection, **kwargs):
    """Until Django fixes the sqlite >= 3.26 issue"""
    if connection.vendor == 'sqlite':
        cursor = connection.cursor()
        cursor.execute('PRAGMA legacy_alter_table = ON;')
