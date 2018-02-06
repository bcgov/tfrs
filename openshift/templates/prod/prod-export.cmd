oc export secret -o json > prod-secret.json
oc export configmap -o json > prod-configmap.json
oc export rolebinding -o json > prod-rolebinding.json
oc export pvc -o json > prod-storage.json
oc export bc -o json > prod-build-config.json
oc export dc -o json > prod-deployment-config.json
oc export service -o json > prod-service.json
oc export route -o json > prod-route.json
