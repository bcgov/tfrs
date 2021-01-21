### Files included

* rabbitmq-cluster-dc.yaml deployment config file
* rabbitmq-web-route.yaml create route to rabbitmq gui
* secret-template.yaml create template.rabbitmq-secret

### Before triggering pipeline

1. Create template.rabbitmq-secret
oc process -f ./secret-template.yaml | oc create -f - -n [environment namespace]

2. create zeva-${ENV}-rabbitmq-cluster-config


### After pipeline completes

