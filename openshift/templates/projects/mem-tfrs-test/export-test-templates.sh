oc export dc/backup --as-template='test-backup' --output=json -n mem-tfrs-test > test-backup.json
oc export dc/celery --as-template='test-celery' --output=json -n mem-tfrs-test > test-celery.json
oc export dc/clamav service/clamav --as-template='test-clamav' --output=json -n mem-tfrs-test > test-clamav.json
oc export dc/client service/client route/test-lowcarbonfuels-frontend --as-template='test-client' --output=json -n mem-tfrs-test > test-client.json
oc export dc/maintenance-page service/maintenance-page route/maintenance-page --as-template='test-maintenance-page' --output=json -n mem-tfrs-test > test-maintenance-page.json
oc export dc/minio service/minio route/docs --as-template='test-minio' --output=json -n mem-tfrs-test > test-minio.json
oc export dc/notification-server service/notification-server route/test-lowcarbonfuels-notification --as-template='test-notification-server' --output=json -n mem-tfrs-test > test-notification-server.json
oc export dc/postgresql96 service/postgresql --as-template='test-postgresql96' --output=json -n mem-tfrs-test > test-postgresql96.json
oc export dc/scan-coordinator --as-template='test-scan-coordinator' --output=json -n mem-tfrs-test > test-scan-coordinator.json
oc export dc/scan-handler --as-template='test-scan-handler' --output=json -n mem-tfrs-test > test-scan-handler.json
oc export dc/schema-spy-public service/schema-spy-public route/schema-spy-public --as-template='test-schemaspy-public'--output=json -n mem-tfrs-test > test-schemaspy-public.json
oc export dc/schema-spy-audit service/schema-spy-audit route/schema-spy-audit --as-template='test-schemaspy-audit'--output=json -n mem-tfrs-test > test-schemaspy-audit.json
oc export dc/tfrs service/backend route/test-lowcarbonfuels-backend  --as-template='test-tfrs' --output=json -n mem-tfrs-test > test-tfrs.json
oc export statefulset/rabbitmq service/rabbit route/rabbit --as-template='test-rabbitmq' --output=json -n mem-tfrs-test > test-rabbitmq.json
oc export configmap/keycloak-config --as-template='test-keycloak' --output=json -n mem-tfrs-test > test-keycloak.json
oc export configmap/backup-conf --as-template='test-backup-conf' --output=json -n mem-tfrs-test > test-backup-conf.json