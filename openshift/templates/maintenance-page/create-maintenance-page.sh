## tools
oc process -f ./maintenance-page.bc.json | oc create -f -

## dev
oc process -f ./maintenance-page.dc.json ENV_NAME=dev | oc create -f - 

## test
oc process -f ./maintenance-page.dc.json ENV_NAME=test | oc create -f - 

## prod
oc process -f ./maintenance-page.dc.json ENV_NAME=prod | oc create -f - 

## turn on maintenance page
oc patch route dev-lowcarbonfuels-frontend -n mem-tfrs-[ENV_NAME] -p '{ "spec": { "to": { "name": "maintenance-page" },"port": { "targetPort": "2015-tcp" }}}'
# turn off maintenance page
oc patch route dev-lowcarbonfuels-frontend -n mem-tfrs-[ENV_NAME] -p '{ "spec": { "to": { "name": "client" },"port": { "targetPort": "web" }}}'