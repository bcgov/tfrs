### Files included

backup-build.json build config
backup-cronjob.json not being used
backup-deploy.json deplyment config

## Setup Backup container
Use backup container release 2.0.0 to run the backup, current folder is backup-container-2.0.0
1. Request NFS storage as backup space
follow https://github.com/BCDevOps/provision-nfs-apb/blob/master/docs/usage-gui.md to request nfs-backup storage
2. Build patroni-backup image
oc -n mem-tfrs-tools process -f ./openshift/templates/backup/backup-build.json \
-p NAME=patroni-backup OUTPUT_IMAGE_TAG=2.0.0 GIT_REF=2.0.0 \
| oc -n mem-tfrs-tools create -f -
3. add to ./config/backup.conf, 9pm run backup, 10pm run verification
patroni-master-prod:5432/tfrs
0 21 * * * default ./backup.sh -s
0 22 * * * default ./backup.sh -s -v all
45 20 * * * default /bin/cp -rn /minio-data/* /backups-minio
4. create backup-conf configmap
oc -n mem-tfrs-dev create configmap backup-conf --from-file=./config/backup.conf
5. mount the NFS storage to httpd pod and create /bk-nfs/postgresql-backup, /bk-nfs/minio-backup and /bk-nfs/rabbitmq-backup
oc process -f ./openshift/templates/backup/httpd.yaml NFS_NAME=bk-mem-tfrs-dev-51gffzadghxs | oc create -f - -n mem-tfrs-dev
chmod 770 /bk-nfs/*
6. create deployment config for backup container
6.1 for dev
BACKUP_VOLUME_NAME is nfs storage name, for example bk-mem-tfrs-dev-51gffzadghxs
oc -n mem-tfrs-prod process -f ./backup-deploy.json \
  -p NAME=patroni-backup \
  -p SOURCE_IMAGE_NAME=patroni-backup \
  -p IMAGE_NAMESPACE=mem-tfrs-tools \
  -p TAG_NAME=2.0.0 \
  -p DATABASE_SERVICE_NAME=patroni-master-dev \
  -p DATABASE_NAME=tfrs \
  -p DATABASE_DEPLOYMENT_NAME=patroni-dev \
  -p DATABASE_USER_KEY_NAME=app-db-username \
  -p DATABASE_PASSWORD_KEY_NAME=app-db-password \
  -p TABLE_SCHEMA=public \
  -p BACKUP_STRATEGY=rolling \
  -p DAILY_BACKUPS=31 \
  -p WEEKLY_BACKUPS=12 \
  -p MONTHLY_BACKUPS=3 \
  -p BACKUP_PERIOD=1d \
  -p BACKUP_VOLUME_NAME=bk-mem-tfrs-dev-51gffzadghxs \
  -p VERIFICATION_VOLUME_NAME=backup-verification \
  -p VERIFICATION_VOLUME_SIZE=2G \
  -p VERIFICATION_VOLUME_CLASS=netapp-file-standard \
  -p ENVIRONMENT_FRIENDLY_NAME='tfrs dev' \
  -p ENVIRONMENT_NAME=tfrs-dev \
  -p MINIO_DATA_VOLUME_NAME=minio-data | \
  oc create -f - -n mem-tfrs-dev
6.2 for production
BACKUP_VOLUME_NAME is the nfs storage name, for example bk-mem-tfrs-prod-s9fvzvwddd
oc -n mem-tfrs-prod process -f ./templates/backup/backup-deploy.json \
  -p NAME=patroni-backup \
  -p SOURCE_IMAGE_NAME=patroni-backup \
  -p IMAGE_NAMESPACE=mem-tfrs-tools \
  -p TAG_NAME=2.0.0 \
  -p DATABASE_SERVICE_NAME=patroni-master-prod \
  -p DATABASE_NAME=zeva \
  -p DATABASE_DEPLOYMENT_NAME=patroni-prod \
  -p DATABASE_USER_KEY_NAME=app-db-username \
  -p DATABASE_PASSWORD_KEY_NAME=app-db-password \
  -p TABLE_SCHEMA=public \
  -p BACKUP_STRATEGY=rolling \
  -p DAILY_BACKUPS=31 \
  -p WEEKLY_BACKUPS=12 \
  -p MONTHLY_BACKUPS=3 \
  -p BACKUP_PERIOD=1d \
  -p BACKUP_VOLUME_NAME=**** \
  -p VERIFICATION_VOLUME_NAME=backup-verification \
  -p VERIFICATION_VOLUME_SIZE=2G \
  -p VERIFICATION_VOLUME_CLASS=netapp-file-standard \
  -p ENVIRONMENT_FRIENDLY_NAME='ZEVA Database Backup' \
  -p ENVIRONMENT_NAME=zeva-prod \
  -p MINIO_DATA_VOLUME_NAME=zeva-minio-prod | \
  oc create -f - -n mem-tfrs-prod
7. If need to remove, only keeps configmap/backup-conf and the the nfs storage
oc -n mem-tfrs-prod delete secret/patroni-backup secret/ftp-secret dc/patroni-backup pvc/backup-verification 

## Backup Minio data to NFS storage

1. Update minio storage from RWO (Read-Write-Once) to RWX (Read-Write-Many)
Create a new RWM storage same as current minio storage. The old one is called minio-pv-claim, the new one will be called minio-data.

2. scale up maintenance page 

3. Scale down minio instance

4. Scale up  httpd instance and mount
    minio-pv-claim -> /minio-pv-claim     Read-Write-Once
    minio-data -> /minio-data             Read-Write-Many

5. copy everything on /minio-pv-claim to /minio-data

6. Update minio dc to mount minio-data (replace minio-pv-claim)

7. Scale up minio and verify it through login to docs link

8. update httpd to mount nfs to /backups
verify and create if needed
drwxrwx---. 3 65534 65534 22 Sep  2 11:10 minio-backup
drwxrwx---. 5 65534 65534 48 Jun  7 21:00 patroni-backup
drwxrwx---. 2 65534 65534  6 Aug 18 11:31 postgresql-backup
drwxrwx---. 2 65534 65534  6 Aug 18 11:31 rabbitmq-backup 

8. Run Setup Backup container 6.1 on dev

9. update backup.conf



