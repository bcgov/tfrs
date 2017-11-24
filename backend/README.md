
## Getting Started

Once you have python, install the required modules

`pip install -r requirements.txt`

Once you have postgres setup, set the following environment variables

```bash
DATABASE_SERVICE_NAME=localhost
DATABASE_ENGINE=postgresql
DATABASE_ENGINE=postgresql
DATABASE_NAME=<database name>
DATABASE_USER=<postgres user>
DATABASE_PASSWORD=<password>
```

Once you have django, set up the database tables

`python manage.py migrate`

Run the tests

`python manage.py test`

Collect the static Files

`python manage.py collectstatic`

You can choose to initialize the data (see Initializing Data below)

...and run the server

`python manage.py runserver`


## Initializing data

Load core fixtures
```
python manage.py loaddata credit_trade_statuses credit_trade_types organization_actions_types organization_balance_gov organization_government organization_statuses organization_types
```

Load test data fixtures
```
python manage.py loaddata test_credit_trades.json test_organization_fuel_suppliers.json test_organization_balances.json test_users.json
```
