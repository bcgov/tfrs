oc export dc/postgresql service/postgresql --as-template='prod-postgresql' --output=json > prod-postgresql.json
oc export service/schema-spy-public service/schema-spy-audit route/schema-spy-public route/schema-spy-audit dc/schema-spy-audit dc/schema-spy-public --as-template='prod-schemaspy' --output=json > prod-schemaspy.json
oc export dc/client service/client route/main --as-template='prod-client' --output=json > prod-client.json
oc export dc/tfrs service/backend route/api --as-template='prod-api' --output=json > prod-api.json
oc export service/request-logger route/sminfo --as-template='prod-request-logger' --output=json > prod-request-logger.json