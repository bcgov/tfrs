# dev
## Create image stream scan-coordinator-develop and build the image
oc process -f ./scan-coordinator-bc-develop.json -n mem-tfrs-tools
## Create the deplpoyment config
oc project mem-tfrs-dev
oc process -f ./scan-coordinator-dc.json ENV_NAME=dev IS_NAME=scan-coordinator-develop BYPASS_CLAMAV=false CLAMAV_HOST=clamav.mem-tfrs-dev.svc CLAMAV_PORT=3310 AMQP_HOST=rabbit.mem-tfrs-dev.svc AMQP_VHOST=/tfrs AMQP_PORT=5672 AMQP_USER=tfrs MINIO_ENDPOINT=docs-mem-tfrs-dev.pathfinder.gov.bc.ca:443 MINIO_USE_SSL=true | oc create -f -

# test
## Create image stream scan-coordinator and build the image
oc process -f ./scan-coordinator-bc.json  -n mem-tfrs-tools 
## Create the deplpoyment config
oc project mem-tfrs-dev
oc process -f ./scan-coordinator-dc.json ENV_NAME=test IS_NAME=scan-coordinator BYPASS_CLAMAV=false CLAMAV_HOST=clamav.mem-tfrs-test.svc CLAMAV_PORT=3310 AMQP_HOST=rabbit.mem-tfrs-test.svc AMQP_VHOST=/tfrs AMQP_PORT=5672 AMQP_USER=tfrs MINIO_ENDPOINT=docs-mem-tfrs-test.pathfinder.gov.bc.ca:443 MINIO_USE_SSL=true | oc create -f -

# prod
## Create the deplpoyment config
oc process -f ./scan-coordinator-dc.json ENV_NAME=prod IS_NAME=scan-coordinator BYPASS_CLAMAV=false CLAMAV_HOST=clamav.mem-tfrs-prod.svc CLAMAV_PORT=3310 AMQP_HOST=rabbit.mem-tfrs-prod.svc AMQP_VHOST=/tfrs AMQP_PORT=5672 AMQP_USER=tfrs MINIO_ENDPOINT=docs-mem-tfrs-prod.pathfinder.gov.bc.ca:443 MINIO_USE_SSL=true | oc create -f -