oc export secret -o json -n mem-tfrs-prod > prod-secret.json
oc export configmap -o json -n mem-tfrs-prod > prod-configmap.json
oc export pvc -o json -n mem-tfrs-prod > prod-storage.json
oc export bc -o json -n mem-tfrs-prod > prod-build-config.json
oc export dc -o json -n mem-tfrs-prod > prod-deployment-config.json
oc export service -o json -n mem-tfrs-prod > prod-service.json
oc export route -o json -n mem-tfrs-prod > prod-route.json
