# tools
oc project mem-tfrs-tools
oc process -f ./scan-handler-bc-develop.json  | oc create -f -
oc process -f ./scan-handler-bc.json  | oc create -f -

# dev
oc project mem-tfrs-dev
oc process -f ./scan-handler-dc.json ENV_NAME=dev IS_NAME=scan-handler-develop | oc create -f -

# test
oc process -f ./scan-handler-dc.json ENV_NAME=test IS_NAME=scan-handler | oc create -f -

# prod
oc process -f ./scan-handler-dc.json ENV_NAME=prod IS_NAME=scan-handler | oc create -f -