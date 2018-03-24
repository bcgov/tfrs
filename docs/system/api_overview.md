## Description

The api (backend) code serves API endpoints consumed by the UI client.

## Code
The codebase is written in Python 3 and uses the Django web framework.

This project uses `pip` for managing dependencies. All the package dependencies can be found in `requirements.txt`.

### Django
The project is currently using Django 1.11.

There are currently two apps within the backend source code.
* `tfrs` - the core app and the entry for all routing. Also contains all the settings
* `api` - the api app

### Django Rest Framework
The project uses the package [Django Rest Framework](http://www.django-rest-framework.org/) to build the API.

### Unit tests (nose)
The project uses a combination of Python and Django to build unit tests. You can run the tests either using Django's `python manage.py test` command or using nose as a test runner `nosetests`

### Database
The project uses a PostgresQL database
