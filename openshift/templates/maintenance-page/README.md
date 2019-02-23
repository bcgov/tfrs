# Groundwater Wells

## Maintenance Mode

### Usage

Caddy pods serving static html are deployed to our prod, dev and test environments.  To enable maintenance mode switch the routes between the frs and Proxy-Caddy services.  A namespace (project) for deployment must be specified.

Expected namespaces:

* mem-tfrs-prod
* mem-tfrs-dev
* mem-tfrs-test

For the sake of simplicity all examples will use mem-tfrs-test and be run on OS X.

1. ##### Enable/Disable by Script

    Maintenance mode on.

    ```
    ./maintenance.sh mem-tfrs-test on
    ```

    Maintenance mode off.

    ```
    ./maintenance.sh mem-tfrs-test off
    ```

2. ##### Enable/Disable by Command line

    Maintenance mode on.

    ```
    oc patch route frs -n mem-tfrs-test -p \
        '{ "spec": { "to": { "name": "proxy-caddy", "port": { "targetPort": "2015-tcp" }}}'
    oc patch route proxy-caddy -n mem-tfrs-test -p \
        '{ "spec": { "to": { "name": "frs" }, "port": { "targetPort": "web" }}}'
    ```

    Maintenance mode off.

    ```
    oc patch route frs -n mem-tfrs-test -p \
        '{ "spec": { "to": { "name": "frs" }, "port": { "targetPort": "web" }}}'
    oc patch route proxy-caddy -n mem-tfrs-test -p \
        '{ "spec": { "to": { "name": "proxy-caddy" }, "port": { "targetPort": "2015-tcp" }}}'
    ```

### Build and Deployment

This application's template has been broken down into build and deploy components.

##### Build

Template:

* ../openshift/templates/caddy.bc.json

Contains:

* ImageStream
* BuildConfig

Default vars:

* NAME: proxy-caddy
* IMG_SRC: bcgov-s2i-caddy
* GIT_REPO: https://github.com/bcgov/frs.git
* GIT_BRANCH: master

Build Project:

* mem-tfrs-tools


1. ##### Build by Script

    ```
    ./maintenance.sh mem-tfrs-tools build
    ```

2. ##### Build by Command line

    ```
    oc process -f ../openshift/templates/caddy.bc.json -p NAME=proxy-caddy \
      GIT_REPO=https://github.com/bcgov/frs.git GIT_BRANCH=master \
      IMG_SRC=bcgov-s2i-caddy | oc apply -f -

    ```

##### Deploy

Template:

* ../openshift/templates/caddy.dc.json

Contains:

* DeploymentConfig
* Service

Default vars:

* NAME: proxy-caddy
* BUILD_PROJECT: mem-tfrs-tools

Build (Source) Project:

* mem-tfrs-tools

Deploy Projects Available:

* mem-tfrs-test
* mem-tfrs-dev
* mem-tfrs-prod


1. ##### Deploy by Script

    ```
    ./maintenance.sh mem-tfrs-tools deploy
    ```

2. ##### Deploy by Command line

    ```
    oc process -f ../openshift/templates/caddy.bc.json -n mem-tfrs-tools -p NAME=proxy-caddy \
        BUILD_PROJECT=mem-tfrs-tools | oc apply -f -
    oc expose svc proxy-caddy
    ```

3. ##### Enable/Disable by OpenShift GUI Console

    a. Navigate to [OpenShift Container Platform Console](https://console.pathfinder.gov.bc.ca:8443/console/)
    - [mem-tfrs-test](https://console.pathfinder.gov.bc.ca:8443/console/project/mem-tfrs-test/browse/routes) 
    - [mem-tfrs-prod](https://console.pathfinder.gov.bc.ca:8443/console/project/mem-tfrs-prod/browse/routes) 

    b. Edit the route to point to `proxy-caddy` service instead of the database
    - [mem-tfrs-test](https://console.pathfinder.gov.bc.ca:8443/console/project/mem-tfrs-test/edit/routes/frs-staging) which is actually `staging`

    c. Confirm that the Maintenance screen is up
    - [mem-tfrs-test](https://frs-test.pathfinder.gov.bc.ca/frs/)

    Maintenance mode off.

    a. Navigate to [OpenShift Container Platform Console](https://console.pathfinder.gov.bc.ca:8443/console/)
    - [mem-tfrs-test](https://console.pathfinder.gov.bc.ca:8443/console/project/mem-tfrs-test/browse/routes) 
    - [mem-tfrs-prod](https://console.pathfinder.gov.bc.ca:8443/console/project/mem-tfrs-prod/browse/routes) 

    b. Edit the route to point back to the original database service (e.g. `frs-production`) instead of the `proxy-caddy`
    - [mem-tfrs-test](https://console.pathfinder.gov.bc.ca:8443/console/project/mem-tfrs-test/edit/routes/frs-staging) which is actually `staging`

    c. Confirm that the Maintenance screen is up
    - [mem-tfrs-test](https://frs-test.pathfinder.gov.bc.ca/frs/)  

### Initial Setup

Starting from scratch the above steps will be reordered:

1. Build
2. Deploy
3. Maintenance on
4. Maintenance off

## License

Code released under the [Apache License, Version 2.0](https://github.com/bcgov/frs/blob/master/LICENSE).
