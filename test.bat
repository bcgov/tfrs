rem setup the test environment.
set DATABASE_SERVICE_NAME=localhost
set DATABASE_ENGINE=postgresql
set DATABASE_ENGINE=SQLite
set DATABASE_NAME=tfrstest
set DATABASE_USER=tfrstest
set DATABASE_PASSWORD=tfrstest
set DJANGO_DEBUG=true

python manage.py test server --failfast -v 3