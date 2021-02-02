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

#### Minio data migration from Openshift V3 to V4

on V4, mount minio data storage to nagios /minio, then in minio pod, it has /minio/tfrs
on V4 nagios pod, oc rsync minio data from V3 to V4 /minio/tfrs
on V4, verify the files through minio web interface and make sure the files can be downloaded and opened.
on V4, remove the minio mount on nagios