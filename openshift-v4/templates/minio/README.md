### Files included

* minio-bc.yaml minio build config
* minio-dc.yaml minio deployment config
* minio-secret.yaml create template.minio-secret, it is NOT being used as minio creation is not part of pipeline anymore

### build minio

oc tag registry.access.redhat.com/rhel:7.7-481 0ab226-tools/rhel7:7.7-481
oc tag minio:latest minio:20210111
oc process -f ./minio-bc.yaml | oc create -f - -n 0ab226-tools


### One minio instance serve all PRs on Dev

oc process -f ./minio-dc.yaml \
NAME=tfrs ENV_NAME=dev SUFFIX=-dev OCP_NAME=apps.silver.devops PVC_SIZE=2Gi \
| oc create -f - -n 0ab226-dev

#### Test and Prod Minio setup

oc process -f ./minio-dc.yaml \
NAME=tfrs ENV_NAME=test SUFFIX=-test OCP_NAME=apps.silver.devops PVC_SIZE=2Gi \
| oc create -f - -n 0ab226-test


oc process -f ./minio-dc.yaml \
NAME=tfrs ENV_NAME=prod SUFFIX=-prod OCP_NAME=apps.silver.devops PVC_SIZE=3Gi \
| oc create -f - -n 0ab226-prod