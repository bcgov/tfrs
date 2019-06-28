# tools
oc project mem-tfrs-tools
oc process -f ./scan-coordinator-bc-develop.json
oc process -f ./scan-coordinator-bc.json

# dev
oc project mem-tfrs-dev
oc process -f ./scan-coordinator-dc.json ENV_NAME=dev SOURCE_IS_NAME=scan-coordinator-develop | oc create -f - --dry-run=true

# test
oc project mem-tfrs-test
oc process -f ./scan-coordinator-dc.json ENV_NAME=test SOURCE_IS_NAME=scan-coordinator | oc create -f - --dry-run=true

# prod
oc project mem-tfrs-prod
oc process -f ./scan-coordinator-dc.json ENV_NAME=prod SOURCE_IS_NAME=scan-coordinator | oc create -f - --dry-run=true