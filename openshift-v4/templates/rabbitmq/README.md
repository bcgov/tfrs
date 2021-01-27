### Files included

* rabbitmq-cluster-dc.yaml deployment config file
* rabbitmq-secret-configmap-only.yaml create secret from secret template and create configmap, it is also included in rabbitmq-cluster-dc.yaml
* rabbitmq-web-route.yaml create route to rabbitmq gui
* secret-template.yaml create template.rabbitmq-secret

### Before triggering pipeline

1. Create template.rabbitmq-secret
oc process -f ./secret-template.yaml | oc create -f - -n [environment namespace]

### After pipeline completes

N/A