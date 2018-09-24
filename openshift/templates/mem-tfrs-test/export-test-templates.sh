oc export service/schema-spy-public service/schema-spy-audit route/schema-spy-public route/schema-spy-audit dc/schema-spy-audit dc/schema-spy-public --as-template='test-schemaspy' --output=json > test-schemaspy.json
oc export dc/postgresql service/postgresql --as-template='test-postgresql' --output=json > test-postgresql.json
oc export dc/client service/client route/main  --as-template='test-client' --output=json > test-client.json
oc export dc/tfrs service/backend route/api --as-template='test-tfrs' --output=json > test-tfrs.json
oc export service/request-logger route/sminfo  --as-template='test-request-logger' --output=json > test-request-logger.json
oc export statefulset/rabbitmq dc/notification-server service/rabbit service/notification-server route/notification-server --as-template='test-notification' --output=json > test-notification.json