Models
-----
All the models can be found in the `models` folder/package.

We consult with the Data Architecture team in IMB for their guidance in what the standards are in enterprise data.

When suggestions come in, we allot time to evaluate them and provide estimates, and open a ticket in Trello so it gets discussed during sprint planning.

When you make any changes to the models, make sure to run your `makemigrations` command so that they would be reflected in the database.

Migrations
---------
Django offers a [powerful migration tool](https://docs.djangoproject.com/en/1.11/topics/migrations/).

**Updating models**

`python manage.py makemigrations`


**Checking for migrations**

This will show you which migrations are applied to the database

`python manage.py showmigrations`

**Migrating**

`python manage.py migrate`


**Other**

- You can squash your migrations to make them cleaner
- You can rollback to a previous migration
- You can check the SQL generated for a migration before it runs
