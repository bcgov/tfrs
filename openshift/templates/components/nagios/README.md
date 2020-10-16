### File completed

nagios-base-bc.json build base image
nagios-bc.json build config
nagios-dc.json deployment config
nagios-sa.json not being used

### After pipeline completes

oc process -f ./nagios-bc.json ENV_NAME=prod |
oc create -f - -n mem-tfrs-prod

oc process -f ./nagios-dc.json ENV_NAME=prod \
KEYCLOAK_CLIENT_ID=tfrs \
KEYCLOAK_SA_REALM=tfrs \
KEYCLOAK_SA_CLIENT_ID=tfrs-django-sa \
KEYCLOAK_SA_BASEURL=https://oidc.gov.bc.ca \
KEYCLOAK_REALM=https://oidc.gov.bc.ca/auth/realms/tfrs \
SMTP_SERVER_HOST=apps.smtp.gov.bc.ca
DATABASE_SERVICE_NAME=patroni-mater-prod \
| oc create -f - -n mem-tfrs-prod

