# Developer Guidelines

## Setting up the development environment

There is a docker-compose file in the root directory that will spin up the local development environment for you. If you don't have docker installed then head over to the docker homepage to get that started.

There are 6 services that make up the TFRS application:

smtplogger-1
tfrs-db
rabbit-1
minio-1
node-1
django-1

## Running on an M1 Macbook
M1 macbooks run on a different chip than intel macbooks and pcs, which can cause problems with Docker. For TFRS, we have specified that all images must be amd64. If there are issues with anything, ensure that all images are amd64, and if not delete all images, fix the code and rebuild.


## Code style and Linting

We use [Eslint](https://eslint.org/) to lint the app's code. The following npm scripts can be used to trigger linting and formatting:

- `npm lint`: Runs Eslint and prints all the errors and warnings


### VSCode plugin

The ESLint VSCode plugins is recommended.
Adding the following setting to your VSCode workspace settings is required for the ESLint plugin to work:

```
"eslint.workingDirectories": ["app"]
```

## Testing

Tests on the database uses unittest the python testing framework
You can run the tests from your local container first by launching an interactive shell
`docker exec -it <container_name> sh`
to run tests use a terminal in the api container and type
`python manage.py test`

or to run specific test files, point to the folder or file
`python manage.py test api.services.tests.test_credit_transfers.py`

Tests on the frontend use Jest

- `npm test`: Runs Jest for all unit tests in the project

To run a specific test make sure jest is installed globally and then run:
`jest -t 'fix-order-test'`
This will only run tests that match the test name pattern you provide.



## Code Changes

Code changes are merged into tracking branches: `ex. release-1.40.0`
Releases are made from the tracking branches into the test environment, and then production

Pull Requests should have descriptions of changes and a title that references the
ticket number the task is associated with

### Commit Message Conventions

This project follows the commit message conventions outlined by [Convential Commits](https://www.conventionalcommits.org/). Besides the standard commit types (message prefixes) **feat** and **fix**, we use some other types described there based on the Angular convention; some common ones among those are **test**, **docs**, **chore** and **refactor**.

We also extend this prefix convention to the naming of **branches**, eg: `docs/add-readme` or `feat/some-feature`.

### Database Postgres

to view the database via docker use:
docker exec -it tfrs_db psql tfrs -U tfrs

## User Authentication

The application requires users to be authenticated using keycloak.

To login the first time you will need to add a record to your local database. 
 
INSERT INTO user_creation_request (
    keycloak_email,
    is_mapped,
    user_id,
    external_username
  )

VALUES (
    'idir.email@gov.bc.ca',
    false,
    5,
    'IDIRUSERNAME'
  );


the 5 is the id of the user you want to impersonate. 5 is the director

the email should match your idir email

#### Copy down Test/Prod data from Openshift

Copy test/prod data into your local database using the /openshift/import-data.sh script
This is a bash script that creates a pg_dump .tar file from and openshift postgres container
and imports it into a local postgres container

There are # 2 Arguments

- $1 = 'test' or 'prod'
- #2 = 'local container name or id'

# example command

- . import-data.sh test 398cd4661173

You will need to be logged into Openshift using oc
You will also need your ZEVA postgres docker container running

if theres permission issues with lchown while running the script, run the script step by step (comment out after line 57, double check that it copied the tar file into it, then comment out the earlier steps and run it again with just the later lines)

if there's still issues, it might be a corrupted .tar file. See if someone else can export it and put it in the openshift folder. Then comment out the import script up until the tar gets copied into a local container. Then try running it.
