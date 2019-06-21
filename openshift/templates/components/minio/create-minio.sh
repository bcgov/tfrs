## Minio repo
https://github.com/BCDevOps/minio-openshift

## create image stream and tag
image stream,  mem-tfrs-tools:minio
oc tag --alias openshift/minio:stable minio:stable # cross-project aliases like this don't seem to work ATM, but maybe one day...in the meantime, you'll need to update/re-tag periodically   
oc tag --alias minio:stable minio:dev # use of --alias here is so dev will always be updated when stable is updated; omit --alias or use --reference if you prefer not to have this 
oc tag --reference minio:stable minio:test  # use of reference here is so you *have* to explicitly tag in order to affect test
oc tag --reference minio:stable minio:prod # use of reference here is so you *have* to explicitly tag in order to affect prod

## Deploy on Dev
oc process -f https://raw.githubusercontent.com/BCDevOps/minio-openshift/master/openshift/minio-deployment.json \
IMAGESTREAM_NAMESPACE=mem-tfrs-tools \
IMAGESTREAM_TAG=dev \
MINIO_ACCESS_KEY=tfrsinternal \
MINIO_SECRET_KEY=2xBJwV1d88bknUIn \
VOLUME_CAPACITY=5Gi \
| oc create -n mem-tfrs-dev -f - --dry-run=true

## Deploy on Test
oc process -f https://raw.githubusercontent.com/BCDevOps/minio-openshift/master/openshift/minio-deployment.json \
IMAGESTREAM_NAMESPACE=mem-tfrs-tools \
IMAGESTREAM_TAG=test \
MINIO_ACCESS_KEY=*** \
MINIO_SECRET_KEY=*** \
VOLUME_CAPACITY=5Gi \
| oc create -n mem-tfrs-test -f - --dry-run=true

## Deploy on Prod
oc process -f https://raw.githubusercontent.com/BCDevOps/minio-openshift/master/openshift/minio-deployment.json \
IMAGESTREAM_NAMESPACE=mem-tfrs-tools \
IMAGESTREAM_TAG=prod \
MINIO_ACCESS_KEY=*** \
MINIO_SECRET_KEY=*** \
VOLUME_CAPACITY=5Gi \
| oc create -n mem-tfrs-prod -f - --dry-run=true