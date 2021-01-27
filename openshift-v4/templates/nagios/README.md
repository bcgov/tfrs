### Files included

* nagios-base-bc.yaml nagios base image build config
* nagios-bc.yaml nagios image build config
* nagios-dc.yaml nagios deployment config
* nagios-secret.yaml create nagios-secret
* Dockerfile-base: build nagios base image to be used by Dockerfile
* Dockerfile: build final nagios image

### Build and deploy nagios

1. Build nagios base image
oc create imagestream nagios-base -n [tools namespace]
oc process -f ./nagios-base-bc.yaml | oc create -f - -n [tools namespace]

2. Create nagios secret
oc process -f ./nagios-secret.yaml | oc create -f - -n [test namespace]
oc process -f ./nagios-secret.yaml | oc create -f - -n [prod namespace]

3. Build nagios image for environment
oc process -f ./nagios-bc.yaml ENV_NAME=test | oc create -f - -n [test namespace]
oc process -f ./nagios-bc.yaml ENV_NAME=prod | oc create -f - -n [prod namespace]

4. Tag nagios image for environment
oc tag [test namespace]/nagios:latest [test namespace]/nagios:test
oc tag [prod namespace]/nagios:latest [prod namespace]/nagios:prod

5. Deploy nagios for environment
oc process -f ./nagios-dc.yaml \
ENV_NAME=test \
KEYCLOAK_CLIENT_ID=tfrs \
KEYCLOAK_SA_REALM=tfrs \
KEYCLOAK_SA_CLIENT_ID=tfrs-django-sa \
KEYCLOAK_SA_BASEURL=https://test.oidc.gov.bc.ca \
KEYCLOAK_REALM=https://test.oidc.gov.bc.ca/auth/realms/tfrs \
SMTP_SERVER_HOST=apps.smtp.gov.bc.ca \
DATABASE_SERVICE_NAME=patroni-master-test \
| oc create -f - -n 0ab226-test

oc process -f ./nagios-dc.yaml \
ENV_NAME=prod \
KEYCLOAK_CLIENT_ID=tfrs \
KEYCLOAK_SA_REALM=tfrs \
KEYCLOAK_SA_CLIENT_ID=tfrs-django-sa \
KEYCLOAK_SA_BASEURL=https://oidc.gov.bc.ca \
KEYCLOAK_REALM=https://oidc.gov.bc.ca/auth/realms/tfrs \
SMTP_SERVER_HOST=apps.smtp.gov.bc.ca \
DATABASE_SERVICE_NAME=patroni-master-prod \
| oc create -f - -n 0ab226-prod
