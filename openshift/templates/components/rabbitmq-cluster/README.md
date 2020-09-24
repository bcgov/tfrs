### Files included

* rabbitmq-bc.yaml not being used
* rabbitmq-cluster-dc.yaml deployment config file
* rabbitmq-web-route.yaml create route to rabbitmq gui
* secret-template.yaml not being used, only used in pr based pipeline
* zeva-rabbitmq-secret not being used

### Deoploy Rabbitmq-cluster

1. tag rabbitmq to projects
oc tag rabbitmq:3.8.3-management mem-tfrs-dev:rabbitmq/3.8.3-management
oc tag rabbitmq:3.8.3-management mem-tfrs-test:rabbitmq/3.8.3-management
oc tag rabbitmq:3.8.3-management mem-tfrs-prod:rabbitmq/3.8.3-management

2. oc process -f ./rabbitmq-cluster-dc.yaml \
NAME=tfrs \
ENV_NAME=dev \
SUFFIX=-dev \
NAMESPACE=mem-tfrs-dev \
CLUSTER_NAME=rabbitmq-cluster \
ISTAG=docker-registry.default.svc:5000/mem-tfrs-dev/rabbitmq:3.8.3-management \
SERVICE_ACCOUNT=rabbitmq-discovery \
VOLUME_SIZE=5G \
CPU_REQUEST=250m \
CPU_LIMIT=700m \
MEMORY_REQUEST=500M \
MEMORY_LIMIT=1G \
REPLICA=2 \
POST_START_SLEEP=120 \
STORAGE_CLASS=netapp-block-standard \
| oc create -n mem-tfrs-dev --dry-run=true -f -

3. tfrs-dev-rabbitmq-cluster-secret is created and has
    cookie:
    password:
    username:
4. Create secret rabbitmq-tfrs, it is the one being used by applications, the value of TFRS_PASSWORD is random
    TFRS_PASSWORD: 

5. login to one of rabbitmq cluster pod, run below commands
    rabbitmqctl add_user tfrs [rabbitmq-tfrs ]    ## refer to secret rabbitmq-tfrs.TFRS_PASSWORD
    rabbitmqctl add_vhost /tfrs     ## yes, it is /tfrs

6. Create route for gui when needed, remove it when no longer need it
oc process -f ./rabbitmq-web-route.yaml NAME=tfrs \
ENV_NAME=dev \
SUFFIX=-dev \
| oc create -f - -n mem-tfrs-dev

7. login https://tfrs-rabbitmq-web-dev.pathfinder.gov.bc.ca and go to admin tab and set as below:
    * Name | Tags | Can access virtual hosts | Has password
    * rabbitmq | administrator | No Access | ●
    * tfrs | | /tfrs | ●

