### Files included

backend-bc.json build config
tfrs-dc.json deployment config
tfrs-dc-others create service, route and django-secret-key
tfrs-dc-pr.json not being used

#### Before triggering pipeline

* create keycloak-sa-client-secret and django-secret-key
oc process -f ./backend-secrets.yaml KEYCLOAK_SA_CLIENT_SECRET= | oc create -f - -n [env namespace]

* Make sure the following secrets created:
minio: created when detup minio

#### After pipeline completes

oc process -f ./tfrs-dc-others.json ROUTE_HOST_NAME=dev-lowcarbonfuels-backend.pathfinder.gov.bc.ca ROUTE_NAME=dev-lowcarbonfuels-backend | oc create -f - -n mem-tfrs-dev
oc process -f ./tfrs-dc-others.json ROUTE_HOST_NAME=test-lowcarbonfuels-backend.pathfinder.gov.bc.ca ROUTE_NAME=test-lowcarbonfuels-backend | oc create -f - -n mem-tfrs-test
oc process -f ./tfrs-dc-others.json ROUTE_HOST_NAME=prod-lowcarbonfuels-backend.pathfinder.gov.bc.ca ROUTE_NAME=prod-lowcarbonfuels-backend | oc create -f - -n mem-tfrs-prod
After pipeline completes, create autoscaler for backend and check DJANGO_DEBUG is set to false on prod
