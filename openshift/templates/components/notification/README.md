### Files included

notification-server-bc.json build config
notification-server-dc.json deployment config
notification-server-others-dc.json create service and route, pipeline doesn't used, it needs to be called after pipeline completes

### Before trigging pipeline

make sure password rabbitmq-tfrs exists

### After pipeline completes

create service and route by using notification-server-others-dc.json

oc process -f ./notification-server-others-dc.json \
ROUTE_NAME=dev-lowcarbonfuels-notification \
ROUTE_HOST=dev-lowcarbonfuels.pathfinder.gov.bc.ca \
| oc create -f - -n mem-tfrs-dev

oc process -f ./notification-server-others-dc.json \
ROUTE_NAME=test-lowcarbonfuels-notification \
ROUTE_HOST=test-lowcarbonfuels.pathfinder.gov.bc.ca \
| oc create -f - -n mem-tfrs-test

oc process -f ./notification-server-others-dc.json \
ROUTE_NAME=lowcarbonfuels-notification \
ROUTE_HOST=lowcarbonfuels.gov.bc.ca \
| oc create -f - -n mem-tfrs-prod
