### Files included

* rabbitmq-bc.yaml not being used
* rabbitmq-cluster-dc.yaml deployment config file
* rabbitmq-web-route.yaml create route to rabbitmq gui
* secret-template.yaml not being used, only used in pr based pipeline
* zeva-rabbitmq-secret not being used

### Deoploy Rabbitmq-cluster

1. tag rabbitmq to projects
oc tag rabbitmq:3.8.3-management mem-tfrs-dev:rabbitmq:3.8.3-management
oc tag rabbitmq:3.8.3-management mem-tfrs-test:rabbitmq:3.8.3-management
oc tag rabbitmq:3.8.3-management mem-tfrs-prod:rabbitmq:3.8.3-management

2. oc process -f ./rabbitmq-cluser-dc.yaml \
NAME=tfrs \
ENV_NAME=[ENV NAME, dev, test and prod] \
NAMESPACE=[mem-tfrs-dev, mem-tfrs-test, mem-tfrs-prod] \
CLUSTER_NAME=rabbitmq-cluster \
ISTAG=docker-registry.default.svc:5000/[mem-tfrs-dev, mem-tfrs-test, mem-tfrs-prod]/rabbitmq:3.8.3-management \
SERVICE_ACCOUNT=rabbitmq-discovery \
VOLUME_SIZE=5G \
CPU_REQUEST=250m \
CPU_LIMIT=700m \
MEMORY_REQUEST=500M \
MEMORY_LIMIT=1G \ 
REPLICA=3 \
POST_START_SLEEP=120 \
STORAGE_CLASS=netapp-block-standard

### After pipeline completes

1. Create route for gui when needed, remove it when no longer need it
oc process -f ./rabbitmq-web-route.yaml NAME=zeva \
ENV_NAME=dev \
SUFFIX=-dev-133 \
| oc create -f - -n [environment namespace]
