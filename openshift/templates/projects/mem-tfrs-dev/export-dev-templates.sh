oc export dc/backup --as-template='dev-backup' --output=json -n mem-tfrs-dev > dev-backup.json
oc export dc/celery --as-template='dev-celery' --output=json -n mem-tfrs-dev > dev-celery.json
oc export dc/clamav service/clamav --as-template='dev-clamav' --output=json -n mem-tfrs-dev > dev-clamav.json
oc export dc/client service/client route/dev-lowcarbonfuels-frontend --as-template='dev-client' --output=json -n mem-tfrs-dev > dev-client.json
oc export dc/maintenance-page service/maintenance-page route/maintenance-page --as-template='dev-maintenance-page' --output=json -n mem-tfrs-dev > dev-maintenance-page.json
oc export dc/minio service/minio route/docs --as-template='dev-minio' --output=json -n mem-tfrs-dev > dev-minio.json
oc export dc/notification-server service/notification-server route/dev-lowcarbonfuels-notification --as-template='dev-notification-server' --output=json -n mem-tfrs-dev > dev-notification-server.json
oc export dc/postgresql96 service/postgresql --as-template='dev-postgresql96' --output=json -n mem-tfrs-dev > dev-postgresql96.json
oc export dc/scan-coordinator --as-template='dev-scan-coordinator' --output=json -n mem-tfrs-dev > dev-scan-coordinator.json
oc export dc/scan-handler --as-template='dev-scan-handler' --output=json -n mem-tfrs-dev > dev-scan-handler.json
oc export dc/schema-spy-public service/schema-spy-public route/schema-spy-public --as-template='dev-schemaspy-public'--output=json -n mem-tfrs-dev > dev-schemaspy-public.json
oc export dc/schema-spy-audit service/schema-spy-audit route/schema-spy-audit --as-template='dev-schemaspy-audit'--output=json -n mem-tfrs-dev > dev-schemaspy-audit.json
oc export dc/tfrs service/backend route/dev-lowcarbonfuels-backend  --as-template='dev-tfrs' --output=json -n mem-tfrs-dev > dev-tfrs.json
oc export statefulset/rabbitmq service/rabbit route/rabbit --as-template='dev-rabbitmq' --output=json -n mem-tfrs-dev > dev-rabbitmq.json
oc export configmap/keycloak-config --as-template='dev-keycloak' --output=json -n mem-tfrs-dev > dev-keycloak.json
oc export configmap/backup-conf --as-template='dev-backup-conf' --output=json -n mem-tfrs-dev > dev-backup-conf.json