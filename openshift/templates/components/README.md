
# TFRS Openshift Setup - migration from Openshift v3 to v4

## 1. Network Security
openshift/templates/nsp/README.md

## 2. Jenkins setup on mem-tfrs-tools

.jenkins/openshift/README.md
copy the files on jenkins-basic-builds and jenkins-basic from v3 to v4
    jenkins-basic is mounted on /var/lib/jenkins/jobs on jenkins-basic pod
    jenkins-basic-builds is mounted /var/lib/jenkins/builds on jenkins-basic pod

## 3. keycloak-config on environment projects

oc process -f openshift/templates/config/keycloak-config.yaml \
KEYCLOAK_AUTHORITY=https://sso-dev.pathfinder.gov.bc.ca/auth/realms/tfrs-dev \
KEYCLOAK_CLIENT_ID=tfrs-dev \
KEYCLOAK_CALLBACK_URL=https://dev-lowcarbonfuels.pathfinder.gov.bc.ca/authCallback \
KEYCLOAK_POST_LOGOUT_URL=https://logontest7.gov.bc.ca/clp-cgi/logoff.cgi?returl=https://dev-lowcarbonfuels.pathfinder.gov.bc.ca&retnow=1 \
-n mem-tfrs-dev

oc process -f openshift/templates/config/keycloak-config.yaml \
KEYCLOAK_AUTHORITY=https://sso-test.pathfinder.gov.bc.ca/auth/realms/tfrs-dev \
KEYCLOAK_CLIENT_ID=tfrs \
KEYCLOAK_CALLBACK_URL=https://test-lowcarbonfuels.pathfinder.gov.bc.ca/authCallback \
KEYCLOAK_POST_LOGOUT_URL=https://logontest7.gov.bc.ca/clp-cgi/logoff.cgi?returl=https://test-lowcarbonfuels.pathfinder.gov.bc.ca&retnow=1 \
-n mem-tfrs-test

oc process -f openshift/templates/config/keycloak-config.yaml \
KEYCLOAK_AUTHORITY=https://sso.pathfinder.gov.bc.ca/auth/realms/tfrs-dev \
KEYCLOAK_CLIENT_ID=tfrs \
KEYCLOAK_CALLBACK_URL=https://lowcarbonfuels.gov.bc.ca/authCallback \
KEYCLOAK_POST_LOGOUT_URL=https://logon7.gov.bc.ca/clp-cgi/logoff.cgi?returl=https://lowcarbonfuels.gov.bc.ca&retnow=1 \
-n mem-tfrs-prod

## 4. Create postgresql for unit test

openshift/templates/unittest/README.md

## 5. Patroni setup

openshift/templates/patroni/README.md
secret patroni-[dev, test or prod] is created

## 6. Rabbitmq setup

openshift/templates/rabbitmq/README.md
secret rabbitmq-tfrs is created

## 7. Minio setup

openshift/templates/minio/README.md
secret minio is created

## 8. Clamav setup

openshift/templates/clamav/README.md

## 9. nginx-runtim

build openshift/templates/components/nginx-runtime/nginx-runtime.yaml in mem-tfrs-tools

## 10. Before pipeline

open the commented builds and deployment in openshift/pipeline/Jenkinsfile-develop

openshift/templates/components/backend/README.md 
openshift/templates/components/frontend/README.md 
openshift/templates/components/celery/README.md
openshift/templates/components/scan-coordinator/README.md
openshift/templates/components/scan-handler/README.md
openshift/templates/components/notification/README.md

## 11. Pipeline

Run pipelin to build and deploy apps.

## 12. After pipeline 

openshift/templates/components/backend/README.md 
openshift/templates/components/frontend/README.md 
openshift/templates/components/celery/README.md
openshift/templates/components/scan-coordinator/README.md
openshift/templates/components/scan-handler/README.md
openshift/templates/components/notification/README.md

## 13. Nagios

openshift/templates/components/nagios/README.md

## 14. Backup Container

/backup-container-2.0.0/openshift/templates/backup/README.md

## 15. Maintenance page

openshift/templates/components/maintenance-page/README.md

## 16. Database migration from Openshift v3 to v4

Use backup container to backup and restore database from Openshift v3 to v4.  
