oc export dc/backup --as-template='prod-backup' --output=json -n mem-tfrs-prod > prod-backup.json
oc export dc/celery --as-template='prod-celery' --output=json -n mem-tfrs-prod > prod-celery.json
oc export dc/clamav service/clamav --as-template='prod-clamav' --output=json -n mem-tfrs-prod > prod-clamav.json
oc export dc/client service/client route/lowcarbonfuels-frontend --as-template='prod-client' --output=json -n mem-tfrs-prod > prod-client.json
oc export dc/maintenance-page service/maintenance-page route/maintenance-page --as-template='prod-maintenance-page' --output=json -n mem-tfrs-prod > prod-maintenance-page.json
oc export dc/minio service/minio route/docs --as-template='prod-minio' --output=json -n mem-tfrs-prod > prod-minio.json
oc export dc/nagios service/nagios route/monitoring --as-template='prod-nagios' -output=json -n mem-tfrs-prod > prod-nagios.json
oc export dc/notification-server service/notification-server route/lowcarbonfuels-notification --as-template='prod-notification-server' --output=json -n mem-tfrs-prod > prod-notification-server.json
oc export dc/postgresql96 service/postgresql --as-template='prod-postgresql96' --output=json -n mem-tfrs-prod > prod-postgresql96.json
oc export dc/scan-coordinator --as-template='prod-scan-coordinator' --output=json -n mem-tfrs-prod > prod-scan-coordinator.json
oc export dc/scan-handler --as-template='prod-scan-handler' --output=json -n mem-tfrs-prod > prod-scan-handler.json
oc export dc/schema-spy-public service/schema-spy-public route/schema-spy-public --as-template='prod-schemaspy-public'--output=json -n mem-tfrs-prod > prod-schemaspy-public.json
oc export dc/schema-spy-audit service/schema-spy-audit route/schema-spy-audit --as-template='prod-schemaspy-audit'--output=json -n mem-tfrs-prod > prod-schemaspy-audit.json
oc export dc/tfrs service/backend route/lowcarbonfuels-backend  --as-template='prod-tfrs' --output=json -n mem-tfrs-prod > prod-tfrs.json
oc export statefulset/rabbitmq service/rabbit route/rabbit --as-template='prod-rabbitmq' --output=json -n mem-tfrs-prod > prod-rabbitmq.json
oc export configmap/keycloak-config --as-template='prod-keycloak' --output=json -n mem-tfrs-prod > prod-keycloak.json
oc export configmap/backup-conf --as-template='prod-backup-conf' --output=json -n mem-tfrs-prod > prod-backup-conf.json