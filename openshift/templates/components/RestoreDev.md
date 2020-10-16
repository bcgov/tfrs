## 1. Postgresql Restore, working folder is openshift/templates/components/postgresql
* Create nfs-backup PVC bk-mem-tfrs-dev-51gffzadghxs by following: https://github.com/BCDevOps/provision-nfs-apb 
* oc process -f ./postgresql.dc.json BACKUP_PVC_NAME=[the pvc name generate by above step]| oc create -f - -n mem-tfrs-dev --dry-run=true 
* Create extension in postgresql prompt
    * tfrs=# create extension hstore;
    * tfrs=# create extension pg_trgm;
* Create the following directories in postgresql pod
    * mkdir /postgresql-backup/SQLDump 
    * mkdir /postgresql-backup/SQLDump/dev
    * mkdir /postgresql-backup/basebackup
    * mkdir /postgresql-backup/basebackup/dev
    * mkdir /postgresql-backup/walbackup
    * mkdir /postgresql-backup/walbackup/dev
* Copy tfrs-backup.sh to /postgresql-backup
* Enable WAL backup
    * ALTER SYSTEM SET wal_level=replica
    * ALTER SYSTEM SET archive_mode=on
    * ALTER SYSTEM SET max_wal_senders=3
    * ALTER SYSTEM SET archive_command='test ! -f /postgresql-backup/walbackup/[env]/%f && cp %p /postgresql-backup/walbackup/[env]/%f'
* notes: 
    * If need to restore the data fro other environment, need to use same database secrete forn that env

## 2. Rabbitmq restore
* create secret rabbitmq-tfrs, refer to the same one in mem-tfrs-tools project
* oc process -f ./rabbitmq-dc.json ENV_NAME=dev | oc create -f - -n mem-tfrs-dev --dry-run=true
* Run the following commands in rabbitmq pod
    * rabbitmqctl add_user admin [password]    ## refer to secret
    * rabbitmqctl set_user_tags admin administrator
    * rabbitmqctl add_user tfrs [password]    ## refer to secret
    * rabbitmqctl add_vhost /tfrs     ## yes, it is /tfrs
* login https://rabbit-mem-tfrs-dev.pathfinder.gov.bc.ca and go to admin tab and set as below:
    * Name | Tags | Can access virtual hosts | Has password
    * admin | administrator | /tfrs | ●
    * tfrs | | /tfrs | ●

## 3. Minio restore
* oc process -f ./minio-dc.json ENV_NAME=dev | oc create -f - --dry-run=true
* Go to https://docs-mem-tfrs-dev.pathfinder.gov.bc.ca to create bucket tfrs by clicking the plus button

## 4. Backend restore
* create keycloak secret keycloak-sa-client-secret, the value can be found keycload console -> clients -> credentials
* oc process -f ./tfrs-dc.json \
ENV_NAME=dev \
SOURCE_IS_NAME=tfrs-develop \
ROUTE_HOST_NAME=dev-lowcarbonfuels.pathfinder.gov.bc.ca \
ROUTE_NAME=dev-lowcarbonfuels-backend \
KEYCLOAK_SA_BASEURL=https://dec.oidc.gov.bc.ca \
KEYCLOAK_SA_CLIENT_ID=tfrs-dev-django-sa \
KEYCLOAK_SA_REALM=tfrs-dev \
KEYCLOAK_AUDIENCE=tfrs-dev \
KEYCLOAK_CERTS_URL=https://dev.oidc.gov.bc.ca/auth/realms/tfrs-dev/protocol/openid-connect/certs \
KEYCLOAK_CLIENT_ID=tfrs-dev \
KEYCLOAK_ISSUER=https://dev.oidc.gov.bc.ca/auth/realms/tfrs-dev \
KEYCLOAK_REALM=https://dev.oidc.gov.bc.ca/auth/realms/tfrs-dev \
| oc create -f - -n mem-tfrs-dev --dry-run=true

## 5. Clamav restore
* oc process -f ./clamav-dc.json ENV_NAME=dev -n mem-tfrs-dev | oc create -f - --dry-run=true

## 6. Scan-coordinator restore
* oc process -f ./scan-coordinator-dc.json ENV_NAME=dev SOURCE_IS_NAME=scan-coordinator-develop | oc create -f - --dry-run=true

## 7. Scan-handler restore
* oc process -f ./scan-handler-dc.json ENV_NAME=dev SOURCE_IS_NAME=scan-handler-develop -n mem-tfrs-dev | oc create -f - --dry-run=true

## 8. Celery restore
* oc process -f ./celery-dc.json ENV_NAME=dev SOURCE_IS_NAME=celery-develop -n mem-tfrs-dev | oc create -f - --dry-run=true

## 9. Frontend restore
* oc process -f ./client-dc.json \
ENV_NAME=dev \
SOURCE_IS_NAME=client-develop \
KEYCLOAK_AUTHORITY=https://dev.oidc.gov.bc.ca/auth/realms/tfrs-dev \
KEYCLOAK_CLIENT_ID=tfrs-dev \
KEYCLOAK_CALLBACK_URL=https://dev-lowcarbonfuels.pathfinder.gov.bc.ca/authCallback \
KEYCLOAK_LOGOUT_URL=https://logontest.gov.bc.ca/clp-cgi/logoff.cgi?returl=https%3A%2F%2Fdev-lowcarbonfuels.pathfinder.gov.bc.ca%2F ROUTE_HOST_NAME=dev-lowcarbonfuels.pathfinder.gov.bc.ca ROUTE_NAME=dev-lowcarbonfuels-frontend -n mem-tfrs-dev | oc create -f - --dry-run=true

## 10. Notification server restore
* oc process -f ./notification-server-dc.json \
ENV_NAME=dev \
SOURCE_IS_NAME=notification-server-develop \
DASH_ENV_NAME=-dev \
ROUTE_NAME=dev-lowcarbonfuels-notification \
ROUTE_HOST=dev-lowcarbonfuels.pathfinder.gov.bc.ca -n mem-tfrs-dev | oc create -f - --dry-run=true

## 11. Maintenance page retore
* oc process -f ./maintenance-page.dc.json ENV_NAME=dev -n mem-tfrs-dev | oc create -f - --dry-run=true

## 12. Permission
* oc policy add-role-to-user edit system:serviceaccount:mem-tfrs-tools:jenkins-basic -n mem-tfrs-dev --dry-run=true
