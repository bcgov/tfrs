### Files included

minio-deployment.json deployment config

### Minio repo on devops
https://github.com/BCDevOps/minio-openshift

### create image stream and tag
use of reference here is so you *have* to explicitly tag in order to affect test
oc tag --reference minio:stable mem-tfrs-tools/minio:dev  
oc tag --reference minio:stable mem-tfrs-tools/minio:test  
oc tag --reference minio:stable mem-tfrs-tools/minio:prod

### Deploy on Dev
oc process -f ./minio-deployment.json \
IMAGESTREAM_NAMESPACE=mem-tfrs-tools \
IMAGESTREAM_TAG=dev \
VOLUME_CAPACITY=5G \
CPU_REQUEST=100m \
CPU_LIMIT=200m \
MEMORY_REQUEST=100M \
MEMORY_LIMIT=200M \
| oc create -n mem-tfrs-dev -f - --dry-run=true

### Deploy on Test
oc process -f ./minio-deployment.json \
IMAGESTREAM_NAMESPACE=mem-tfrs-tools \
IMAGESTREAM_TAG=test \
VOLUME_CAPACITY=5Gi \
CPU_REQUEST=100m \
CPU_LIMIT=200m \
MEMORY_REQUEST=100M \
MEMORY_LIMIT=200M \
| oc create -n mem-tfrs-test -f - --dry-run=true

### Deploy on Prod
oc process -f ./minio-deployment.json \
IMAGESTREAM_NAMESPACE=mem-tfrs-tools \
IMAGESTREAM_TAG=prod \
VOLUME_CAPACITY=5Gi \
CPU_REQUEST=100m \
CPU_LIMIT=200m \
MEMORY_REQUEST=100M \
MEMORY_LIMIT=200M \
| oc create -n mem-tfrs-prod -f - --dry-run=true