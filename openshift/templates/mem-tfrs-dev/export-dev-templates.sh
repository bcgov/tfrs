oc export dc/postgresql service/postgresql --as-template='dev-postgresql' --output=json > dev-postgresql.json
oc export dc/schema-spy-audit dc/schema-spy-public service/schema-spy-public service/schema-spy-audit route/schema-spy-public route/schema-spy-audit --as-template='dev-schemaspy'--output=json > dev-schemaspy.json
oc export bc/request-logger   dc/request-logger service/request-logger route/sminfo --as-template='dev-request-logger' --output=json > dev-request-logger.json
oc export dc/tfrs service/backend route/dev-lowcarbonfuels-backend  --as-template='dev-api' --output=json > dev-api.json
oc export dc/client service/client route/dev-lowcarbonfuels-frontend --as-template='dev-client' --output=json > dev-client.json
oc export statefulset/rabbitmq dc/notification-server service/rabbit service/notification-server route/dev-lowcarbonfuels-notification --as-template='dev-notification' --output=json > dev-notification.json
oc export configmap/keycloak-config --as-template='dev-keycloak' --output=json > dev-keycloak.json