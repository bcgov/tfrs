# dev
## Create image stream scan-supervisor-develop and build the image
oc process -f ./scan-supervisor-bc-develop.json -n mem-tfrs-tools
## Create the deplpoyment config
oc project mem-tfrs-dev
oc process -f ./scan-supervisor-dc.json ENV_NAME=dev IS_NAME=scan-supervisor-develop | oc create -f -

# test
## Create image stream scan-supervisor and build the image
oc process -f ./scan-supervisor-bc.json  TAG-NAME=master -n mem-tfrs-tools 
## Create the deplpoyment config
oc project mem-tfrs-dev
oc process -f ./scan-supervisor-dc.json ENV_NAME=test IS_NAME=scan-supervisor | oc create -f -

# prod
## Create the deplpoyment config
oc process -f ./scan-supervisor-dc.json ENV_NAME=prod IS_NAME=scan-supervisor | oc create -f -