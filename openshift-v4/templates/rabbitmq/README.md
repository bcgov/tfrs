### Files included

* rabbitmq-cluster-dc.yaml deployment config file
* rabbitmq-secret-configmap-only.yaml create secret from secret template and create configmap, it is also included in rabbitmq-cluster-dc.yaml
* rabbitmq-web-route.yaml create route to rabbitmq gui
* secret-template.yaml create template.rabbitmq-secret

### Before triggering pipeline

1. Create template.rabbitmq-secret
oc process -f ./secret-template.yaml | oc create -f - -n [environment namespace]

### After pipeline completes


1. login to one of rabbitmq cluster pod, run below commands
    rabbitmqctl add_user tfrs [password]    ## password refers to secret tfrs-dev-1696-rabbitmq-cluster-secret.tfrs_password
    rabbitmqctl add_vhost /tfrs     ## yes, it is /tfrs

2. login rabbitmq admin web and go to Admin tab and set as below:
    * Name | Tags | Can access virtual hosts | Has password
    * rabbitmq | administrator | No Access | ●
    * tfrs | | /tfrs | ●