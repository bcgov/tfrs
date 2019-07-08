# tools
oc project mem-tfrs-tools
oc process -f ./scan-handler-bc-develop.json  | oc create -f -
oc process -f ./scan-handler-bc.json  | oc create -f -

# dev
oc project mem-tfrs-dev
oc process -f ./scan-handler-dc.json ENV_NAME=dev SOURCE_IS_NAME=scan-handler-develop -n mem-tfrs-dev | oc create -f - --dry-run=true

# test
oc process -f ./scan-handler-dc.json ENV_NAME=test SOURCE_IS_NAME=scan-handler -n mem-tfrs-dev | oc create -f - --dry-run=true

# prod
oc process -f ./scan-handler-dc.json ENV_NAME=prod SOURCE_IS_NAME=scan-handler -n mem-tfrs-dev | oc create -f - --dry-run=true