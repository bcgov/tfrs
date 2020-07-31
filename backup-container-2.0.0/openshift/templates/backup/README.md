### Files included

backup-build.json build config
backup-cronjob.json not being used
backup-deploy.json deplyment config

### After pipeline completes

oc process -f ./backup-deploy.json
NAME=patroni \
SOURCE_IMAGE_NAME=patroni-backup \
IMAGE_NAMESPACE=mem-tfrs-prod \
TAG_NAME=2.0.0 \
DATABASE_SERVICE_NAME=patroni-prod \
DATABASE_NAME=tfrs \
DATABASE_DEPLOYMENT_NAME=patroni-prod \
DATABASE_USER_KEY_NAME=app-db-username \
DATABASE_PASSWORD_KEY_NAME=app-db-password \
TABLE_SCHEMA=public \
BACKUP_STRATEGY=rolling \
FTP_SECRET_KEY=ftp-secret \
ENVIRONMENT_FRIENDLY_NAME=tfrs-prod \
oc create -f - -n mem-tfrs-prod


