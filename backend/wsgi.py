"""
WSGI config for project project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/1.8/howto/deployment/wsgi/
"""

import os
from pathlib import Path
from django.core.wsgi import get_wsgi_application
from dotenv import load_dotenv

try:
    ENV = '.env'
    load_dotenv(dotenv_path=ENV)
except TypeError:
    pass  # path doesn't exist. no cause for alarm.

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "tfrs.settings")

_APPLICATION = get_wsgi_application()


def application(environ, start_response):
    """
    This lets us run the application in a "subfolder"
    using an environment variable
    This function is based from an answer in StackOverflow
    https://stackoverflow.com/questions/33051034/django-not-taking-script-name-header-from-nginx
    """
    script_name = os.getenv('BASE_PATH', '')
    environ['SCRIPT_NAME'] = script_name
    path_info = environ['PATH_INFO']

    if path_info.startswith(script_name):
        environ['PATH_INFO'] = path_info[len(script_name):]

    scheme = environ.get('HTTP_X_SCHEME', '')
    if scheme:
        environ['wsgi.url_scheme'] = scheme
    return _APPLICATION(environ, start_response)
