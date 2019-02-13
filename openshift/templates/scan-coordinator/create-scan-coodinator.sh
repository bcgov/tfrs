# tools
oc project mem-tfrs-tools
oc process -f ./scan-coordinator-bc-develop.json
oc process -f ./scan-coordinator-bc.json

# dev
oc project mem-tfrs-dev
oc process -f ./scan-coordinator-dc.json ENV_NAME=dev IS_NAME=scan-coordinator-develop | oc create -f -

# test
oc project mem-tfrs-test
oc process -f ./scan-coordinator-dc.json ENV_NAME=test IS_NAME=scan-coordinator | oc create -f -

# prod
oc project mem-tfrs-prod
oc process -f ./scan-coordinator-dc.json ENV_NAME=prod IS_NAME=scan-coordinator | oc create -f -