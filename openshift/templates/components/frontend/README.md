### Files included

client-angular-app-bc.json base image build
cliane-angular-app-dc.json not being used
client-bc.json base image
client-dc.json deployment config
client-dc-others.json create client service and route, pipeline doesn't call it

### Before triggering pipeline

Make sure nginx-runtime image has been built

### After pipeline completes

Create client service and routeby using client-dc-others.json

oc process -f ./client-dc-others.json \
ROUTE_NAME=dev-lowcarbonfuels-frontend \
ROUTE_HOST_NAME=dev-lowcarbonfuels.pathfinder.gov.bc.ca \
| oc create -f - -n mem-tfrs-dev

oc process -f ./client-dc-others.json \
ROUTE_NAME=test-lowcarbonfuels-frontend \
ROUTE_HOST_NAME=test-lowcarbonfuels.pathfinder.gov.bc.ca \
| oc create -f - -n mem-tfrs-test

oc process -f ./client-dc-others.json \
ROUTE_NAME=lowcarbonfuels-frontend \
ROUTE_HOST_NAME=lowcarbonfuels.gov.bc.ca \
| oc create -f - -n mem-tfrs-prod
