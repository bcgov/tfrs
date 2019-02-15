## tools
oc process -f ./backup-build.json \
GIT_REPO_URL=https://github.com/bcgov/tfrs.git \
GIT_REF=master \
SOURCE_CONTEXT_DIR=/backup-container/docker | oc create -f -

## dev
oc process -f ./backup-deploy.json \
IMAGE_NAMESPACE=mem-tfrs-tools \
BACKUP_STRATEGY=daily \
NUM_BACKUPS=31 \
DAILY_BACKUPS=6 \
WEEKLY_BACKUPS=4 \
MONTHLY_BACKUPS=1 \
BACKUP_PERIOD=1d \
DATABASE_SERVICE_NAME=postgresql \
DATABASE_NAME=tfrs \
DATABASE_DEPLOYMENT_NAME=tfrs-postgresql \
DATABASE_USER_KEY_NAME=DATABASE_USER \
DATABASE_PASSWORD_KEY_NAME=DATABASE_PASSWORD \
ENVIRONMENT_FRIENDLY_NAME=dev \
ENVIRONMENT_NAME=dev  | oc create -f -

under backup-containers/openshift
run command: oc create -f backup-conf-configmap_DeploymentConfig.json -n mem-tfrs-dev

## test
oc process -f ./backup-deploy.json \
IMAGE_NAMESPACE=mem-tfrs-tools \
BACKUP_STRATEGY=daily \
NUM_BACKUPS=31 \
DAILY_BACKUPS=6 \
WEEKLY_BACKUPS=4 \
MONTHLY_BACKUPS=1 \
BACKUP_PERIOD=1d \
DATABASE_SERVICE_NAME=postgresql \
DATABASE_NAME=tfrs \
DATABASE_DEPLOYMENT_NAME=tfrs-postgresql \
DATABASE_USER_KEY_NAME=DATABASE_USER \
DATABASE_PASSWORD_KEY_NAME=DATABASE_PASSWORD \
ENVIRONMENT_FRIENDLY_NAME=test \
ENVIRONMENT_NAME=test  | oc create -f -

under backup-containers/openshift
run command: oc create -f backup-conf-configmap_DeploymentConfig.json -n mem-tfrs-test

## prod
oc process -f ./backup-deploy.json \
IMAGE_NAMESPACE=mem-tfrs-tools \
BACKUP_STRATEGY=daily \
NUM_BACKUPS=31 \
DAILY_BACKUPS=6 \
WEEKLY_BACKUPS=4 \
MONTHLY_BACKUPS=1 \
BACKUP_PERIOD=1d \
DATABASE_SERVICE_NAME=postgresql \
DATABASE_NAME=tfrs \
DATABASE_DEPLOYMENT_NAME=tfrs-postgresql \
DATABASE_USER_KEY_NAME=DATABASE_USER \
DATABASE_PASSWORD_KEY_NAME=DATABASE_PASSWORD \
ENVIRONMENT_FRIENDLY_NAME=prod \
ENVIRONMENT_NAME=prod  | oc create -f -

under backup-containers/openshift
run command: oc create -f backup-conf-configmap_DeploymentConfig.json -n mem-tfrs-prod
