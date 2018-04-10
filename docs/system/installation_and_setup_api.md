Installation and setup
------------------------
This instruction works with the current version of Python (3.6) as of 2018-03-22.

## Development

The API runs on Django as an app. There are currently two apps in this codebase:
- tfrs - This is the core app
- api - The codebase for the api

_________
### Using virtual environments

Using virtualenv is handy for development work

```
$ sudo pip install virtualenv
```

Go to the `tfrs/backend` folder and create your virtualenv folder

```
$ cd ~/projects/tfrs/backend
$ virtualenv venv
New python executable in venv/bin/python
Installing setuptools, pip............done.
```

Activate the environment
On OS X and Linux
```
$ . venv/bin/activate
```

On Windows
```
venv\Scripts\activate
```

To deactivate the virtual environment
```
$ deactivate
```
_________
### Python modules
Once you have python and virtualenv (optional) setup, install the required modules

```
$ pip install -r requirements.txt
```

_________

### Setup the database
You can use sqlite or postgres.
_________
Once you have a database setup, set the following environment variables

```bash
DATABASE_SERVICE_NAME=localhost
DATABASE_ENGINE=<postgresql or sqlite>
DATABASE_NAME=<database name>
DATABASE_USER=<database user>
DATABASE_PASSWORD=<password>
```

Run the migrations
```
$ python manage.py migrate
```

Run the tests

```
$ python manage.py test
```

Collect the static Files

```
$ python manage.py collectstatic
```

You can choose to initialize the data (see Initializing Data below)

...and run the server

```
$ python manage.py runserver
```


## Initializing data

Load core fixtures
```
$ python manage.py loaddata credit_trade_statuses credit_trade_types organization_actions_types organization_government organization_balance_gov organization_statuses organization_types
```

Load test data fixtures
```
$ python manage.py loaddata test_credit_trades.json test_organization_fuel_suppliers.json test_organization_balances.json test_users.json
```

## Contributing
See our [contributing guidelines](api_contributing.md)
