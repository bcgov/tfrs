## create base image in mem-tfrs-tools project
oc process -f ./nagios-base-bc.json | oc create -f -

## create nagios image in three environment
oc process -f ./nagios-sa.json | oc create -f -
oc process -f ./nagios-sa.json | oc create -f -
oc process -f ./nagios-sa.json | oc create -f -

## grant build to pull image from tools project, as nagios uses nagios-base image which is in tools project
oc policy add-role-to-user system:image-puller system:serviceaccount:mem-tfrs-dev:builder --namespace=mem-tfrs-tools
oc policy add-role-to-user system:image-puller system:serviceaccount:mem-tfrs-test:builder --namespace=mem-tfrs-tools
oc policy add-role-to-user system:image-puller system:serviceaccount:mem-tfrs-prod:builder --namespace=mem-tfrs-tools

## create nagios image in three environment
oc process -f ./nagios-bc.json ENV_NAME=dev | oc create -f -
oc process -f ./nagios-bc.json ENV_NAME=test | oc create -f -
oc process -f ./nagios-bc.json ENV_NAME=prod | oc create -f -

## grant service account nagios edit role otherwise check replica will fail
oc policy add-role-to-user edit system:serviceaccount:mem-tfrs-dev:nagios -n mem-tfrs-dev
oc policy add-role-to-user edit system:serviceaccount:mem-tfrs-test:nagios -n mem-tfrs-test
oc policy add-role-to-user edit system:serviceaccount:mem-tfrs-prod:nagios -n mem-tfrs-prod

## tag image
oc tag nagios:latest nagios:dev -n mem-tfrs-dev
oc tag nagios:latest nagios:test -n mem-tfrs-test
oc tag nagios:latest nagios:prod -n mem-tfrs-prod

## create nagios dc in three environment
oc process -f ./nagios-dc.json ENV_NAME=dev KEYCLOAK_CLIENT_ID=tfrs-dev KEYCLOAK_SA_REALM=tfrs-dev KEYCLOAK_SA_CLIENT_ID=tfrs-dev-django-sa \
KEYCLOAK_SA_BASEURL=https://sso-dev.pathfinder.gov.bc.ca KEYCLOAK_REALM=https://sso-dev.pathfinder.gov.bc.ca/auth/realms/tfrs-dev \
SMTP_SERVER_HOST=apps.smtp.gov.bc.ca| oc create -f - -n mem-tfrs-dev
oc process -f ./nagios-dc.json ENV_NAME=test KEYCLOAK_CLIENT_ID=tfrs KEYCLOAK_SA_REALM=tfrs KEYCLOAK_SA_CLIENT_ID=tfrs-django-sa \
KEYCLOAK_SA_BASEURL=https://sso-test.pathfinder.gov.bc.ca KEYCLOAK_REALM=https://sso-test.pathfinder.gov.bc.ca/auth/realms/tfrs \
SMTP_SERVER_HOST=apps.smtp.gov.bc.ca| oc create -f - -n mem-tfrs-test
oc process -f ./nagios-dc.json ENV_NAME=prod KEYCLOAK_CLIENT_ID=tfrs KEYCLOAK_SA_REALM=tfrs KEYCLOAK_SA_CLIENT_ID=tfrs-django-sa \
KEYCLOAK_SA_BASEURL=https://sso.pathfinder.gov.bc.ca KEYCLOAK_REALM=https://sso.pathfinder.gov.bc.ca/auth/realms/tfrs \
SMTP_SERVER_HOST=apps.smtp.gov.bc.ca| oc create -f - -n mem-tfrs-prod



