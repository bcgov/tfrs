# TFRS

## Maintenance Mode

### Usage

Maintenance-page pods serving static html are deployed to our prod, dev and test environments.  To enable maintenance mode switch the routes between the tfrs and Maintenance-page services.  A namespace (project) for deployment must be specified.

Expected namespaces:

* mem-tfrs-prod
* mem-tfrs-dev
* mem-tfrs-test

1. ##### Build Maintenance Page Image

    ```
    oc project mem-tfrs-tools
    oc process -f ./maintenance-page.bc.json | oc create -f -
    ```

2. ##### Deploy Maintenance Page Image

    ```
    oc project mem-tfrs-[ENV_NAME]
    oc process -f ./maintenance-page.dc.json ENV_NAME=[ENV_NAME] | oc create -f - 
    ```

2. ##### Enable/Disable by Command line

    Maintenance mode on.

    ```
    oc patch route dev-lowcarbonfuels-frontend -n mem-tfrs-[ENV_NAME] \
    -p '{ "spec": { "to": { "name": "maintenance-page" },"port": { "targetPort": "2015-tcp" }}}'

    ```

    Maintenance mode off.

    ```
    oc patch route dev-lowcarbonfuels-frontend -n mem-tfrs-[ENV_NAME] \
    -p '{ "spec": { "to": { "name": "client" },"port": { "targetPort": "web" }}}'

    ```
