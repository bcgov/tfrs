### Files included

backend-bc.yaml build config
backend-dc.yaml deployment config
backend-dc-others.yaml create service and route
backend-secretes.yaml create keycloak-sa-client-secret and django-secret-key

#### Before triggering pipeline

* create keycloak-sa-client-secret and django-secret-key
oc process -f ./backend-secrets.yaml KEYCLOAK_SA_CLIENT_SECRET= | oc create -f - -n [env namespace]

#### After pipeline completes

After pipeline completes, create autoscaler for backend and check DJANGO_DEBUG is set to false on prod
