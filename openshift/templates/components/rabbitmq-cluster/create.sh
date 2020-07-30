### Create secrets for each environment
oc process -f ./rabbitmq-secret.yaml ENV_NAME=dev ADMIN_PASSWORD=*** ZEVA_PASSWORD=*** | oc create -f - -n tbiwaq-tools --dry-run=true



### there are three images for rabbitmq, dev, test and prod
oc process -f ./rabbitmq-bc.yaml ENV_NAME=dev ADMIN_PASSWORD=*** ZEVA_PASSWORD=*** | oc apply -f - -n tbiwaq-tools --dry-run=true

### tag imag to environment
oc tag tbiwaq-tools/rabbitmq:latest tbiwaq-dev/rabbitmq:dev

### deployment
oc process -f ./rabbitmq-dc.yaml ENV_NAME=dev | oc apply -f - -n tbiwaq-dev
