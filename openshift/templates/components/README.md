
# TFRS Openshift Setup - migration from Openshift v3 to v4

## 1. Network Security
openshift/templates/nsp/README.md

## 2. Jenkins setup on mem-tfrs-tools

.jenkins/openshift/README.md
copy the files on jenkins-basic-builds and jenkins-basic from v3 to v4
    jenkins-basic is mounted on /var/lib/jenkins/jobs on jenkins-basic pod
    jenkins-basic-builds is mounted /var/lib/jenkins/builds on jenkins-basic pod

## 3. Backup all secrets and certs

## 4. keycloak-config on environment projects

oc process -f config/keycloak-config.yaml \
ENV_NAME=dev \
KEYCLOAK_AUTHORITY=https://dev.oidc.gov.bc.ca/auth/realms/tfrs-dev \
KEYCLOAK_CLIENT_ID=tfrs-dev \
KEYCLOAK_CALLBACK_URL=https://dev-lowcarbonfuels.pathfinder.gov.bc.ca/authCallback \
KEYCLOAK_POST_LOGOUT_URL=https%3A%2F%2Flogontest7.gov.bc.ca%2Fclp-cgi%2Flogoff.cgi%3Freturl%3Dhttps%3A%2F%2Fdev-lowcarbonfuels.pathfinder.gov.bc.ca%26retnow%3D1 \
| oc create -f - -n mem-tfrs-dev

oc process -f config/keycloak-config.yaml \
ENV_NAME=test \
KEYCLOAK_AUTHORITY=https://test.oidc.gov.bc.ca/auth/realms/tfrs-dev \
KEYCLOAK_CLIENT_ID=tfrs \
KEYCLOAK_CALLBACK_URL=https://test-lowcarbonfuels.pathfinder.gov.bc.ca/authCallback \
KEYCLOAK_POST_LOGOUT_URL=https%3A%2F%2Flogontest7.gov.bc.ca%2Fclp-cgi%2Flogoff.cgi%3Freturl%3Dhttps%3A%2F%2Ftest-lowcarbonfuels.pathfinder.gov.bc.ca%26retnow%3D1 \
-n mem-tfrs-test

oc process -f config/keycloak-config.yaml \
ENV_NAME=prod \
KEYCLOAK_AUTHORITY=https://oidc.gov.bc.ca/auth/realms/tfrs-dev \
KEYCLOAK_CLIENT_ID=tfrs \
KEYCLOAK_CALLBACK_URL=https://lowcarbonfuels.gov.bc.ca/authCallback \
KEYCLOAK_POST_LOGOUT_URL=https%3A%2F%2Flogon7.gov.bc.ca%2Fclp-cgi%2Flogoff.cgi%3Freturl%3Dhttps%3A%2F%2Flowcarbonfuels.gov.bc.ca%26retnow%3D1 \
-n mem-tfrs-prod

## 5. Create postgresql for unit test

openshift/templates/unittest/README.md

## 6. Patroni setup

openshift/templates/patroni/README.md
secret patroni-[dev, test or prod] is created

## 7. Minio setup

openshift/templates/minio/README.md
secret minio is created


## 8. Backup Container

/backup-container-2.0.0/openshift/templates/backup/README.md
secret patroni-backup and ftp-secret are created

### 8.1 Restore database on v3 to v4
for example, the database on v3: user "userMMM" with password 'qseuhweh'
login to v4 paroni master pod and run psql tfrs:
	create user "userMMM" with password 'qseuhweh'; //password is same with secret
	ALTER DATABASE tfrs OWNER TO "userSRU";
	DROP USER userxxx;   //userxxx is the one created by patroni during the setup

recover the newly backuped database to patroni, below is a sample command on patroni-backup pod
./backup.sh -r patroni-master-prod/tfrs -f /backups/2020-05-**/p****.gz 


## 9. Rabbitmq setup

* openshift/templates/rabbitmq-cluster/README.md

create secret rabbitmq-tfrs with TFRS_PASSWORD inside only from tfrs-dev-rabbitmq-cluster-secret, make sure TFRS_PASSWORD has same value as tfrs-dev-rabbitmq-cluster-secret.password
the reason for creating secret rabbitmq-tfrs is because it is referenced by many deployment configs

## 10. Clamav setup

openshift/templates/document-security-scan/README.md

## 11. Before pipeline

open the commented builds and deployment in openshift/pipeline/Jenkinsfile-develop

openshift/templates/components/backend/README.md 
openshift/templates/components/frontend/README.md 
openshift/templates/components/celery/README.md
openshift/templates/components/scan-coordinator/README.md
openshift/templates/components/scan-handler/README.md
openshift/templates/components/notification/README.md

## 12. Pipeline

Run pipelin to build and deploy apps.

## 13. After pipeline 

openshift/templates/components/backend/README.md 
openshift/templates/components/frontend/README.md 
openshift/templates/components/celery/README.md
openshift/templates/components/scan-coordinator/README.md
openshift/templates/components/scan-handler/README.md
openshift/templates/components/notification/README.md

## 14. Nagios

openshift/templates/components/nagios/README.md


## 15. Maintenance page

openshift/templates/components/maintenance-page/README.md

