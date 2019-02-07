# tools
oc project mem-tfrs-tools
oc process -f ./scan-handler-bc-develop.json  | oc create -f -
oc create imagestream scan-handler-develop -n mem-tfrs-tools

# dev
oc project mem-tfrs-dev
oc process -f ./scan-handler-dc.json ENV_NAME=dev IS_NAME=scan-handler-develop | oc create -f -

# test
## Create image stream scan-handler and build the image
oc process -f ./scan-handler-bc.json  TAG-NAME=master -n mem-tfrs-tools 
## Create the deplpoyment config
oc project mem-tfrs-dev
oc process -f ./scan-handler-dc.json ENV_NAME=test IS_NAME=scan-handler | oc create -f -

# prod
## Create the deplpoyment config
oc process -f ./scan-handler-dc.json ENV_NAME=prod IS_NAME=scan-handler | oc create -f -