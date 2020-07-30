### Files included

schemaspy-bc.yaml build config
schemaspy-dc.json 

### Before triggering pipeline

pipeline only refrest tags, so need to manually build and deploy schemaspy first

oc process -f ./schemaspy-bc.yaml

make sure secret patroni-[ENV_NAME] exist
make sure 

oc process -f ./schemaspy-dc.json \
DATABASE_SERVICE_NAME=patroni-master-dev \
ENV_NAME=dev \
oc create -f - -n mem-tfrs-dev

oc process -f ./schemaspy-dc.json \
DATABASE_SERVICE_NAME=patroni-master-test \
ENV_NAME=test \
oc create -f - -n mem-tfrs-test

oc process -f ./schemaspy-dc.json \
DATABASE_SERVICE_NAME=patroni-master-prod \
ENV_NAME=prod \
oc create -f - -n mem-tfrs-prod

### After pipeline completes

N/A