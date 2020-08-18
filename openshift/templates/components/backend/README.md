### Files included

tfrs-bc.json build config
tfrs-bc-pr.json not being used
tfrs-dc.json deployment config
tfrs-dc-others create service, route and django-secret-key
tfrs-dc-pr.json not being used

#### Before triggering pipeline

Make sure the following secrets created:
* keycloak-sa-client-secret
* patroni-dev: created when setup patroni
* rabbitmq-tfrs: created when setup rabbitmq
* minio: created when detup minio
* django-secret-key: create by tfrs-dc-others.json

#### After pipeline completes

After pipeline completes, create autoscaler for backend