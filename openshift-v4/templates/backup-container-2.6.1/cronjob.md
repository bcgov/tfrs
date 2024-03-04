# Cronjob prerequisites
Backup PVC: backup
KNP: allow CronJob to connect to Spilo

# Create database backup cronjob
oc process -f ./db-backup-cronjob-2.6.1.yaml \
JOB_NAME=tfrs-db-backup \
JOB_PERSISTENT_STORAGE_NAME=backup \
SCHEDULE="00 07 * * *" \
TAG_NAME=2.6.1 \
DATABASE_SERVICE_NAME=tfrs-spilo-readonly \
DATABASE_DEFAULT_PORT=5432 \
DATABASE_NAME=tfrs \
DATABASE_DEPLOYMENT_NAME=tfrs-patroni-app \
DATABASE_USER_KEY_NAME=app-db-username \
DATABASE_PASSWORD_KEY_NAME=app-db-password \
BACKUP_STRATEGY=rolling \
BACKUP_DIR=/backups \
DAILY_BACKUPS=30 \
WEEKLY_BACKUPS=8 \
MONTHLY_BACKUPS=2 | oc apply -f - -n 0ab226-test

# Create minio backup cronjob
oc process -f ./minio-backup-cronjob-2.6.1.yaml \
JOB_NAME=tfrs-minio-backup \
JOB_PERSISTENT_STORAGE_NAME=backup \
SCHEDULE="0 12 * * *" \
MINIO_CLAIM_NAME=tfrs-minio-test \
TAG_NAME=2.6.1 | oc apply -f - -n 0ab226-test
