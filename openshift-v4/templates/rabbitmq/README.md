### Files included

* rabbitmq-cluster-dc.yaml deployment config file
* rabbitmq-web-route.yaml create route to rabbitmq gui
* secret-template.yaml create template.rabbitmq-secret

### Before triggering pipeline

1. Create template.rabbitmq-secret
oc process -f ./secret-template.yaml | oc create -f - -n [environment namespace]

### After pipeline completes

1. Create route for gui when needed, remove it when no longer need it
oc process -f ./rabbitmq-web-route.yaml NAME=tfrs \
ENV_NAME=dev \
SUFFIX=-dev-1696 \
OCP_NAME=apps.silver.devops \
| oc create -f - -n [environment namespace]
