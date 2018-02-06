oc export secret -o json --as-template=prod-route -n mem-tfrs-prod > prod-secret.json
oc export configmap -o json --as-template=prod-route -n mem-tfrs-prod > prod-configmap.json
oc export rolebinding -o json --as-template=prod-route -n mem-tfrs-prod > prod-rolebinding.json
oc export pvc -o json --as-template=prod-storage -n mem-tfrs-prod > prod-storage.json
oc export bc -o json --as-template=prod-build-config -n mem-tfrs-prod > prod-build-config.json
oc export dc -o json --as-template=prod-deployment-config -n mem-tfrs-prod > prod-deployment-config.json
oc export service -o json --as-template=prod-service -n mem-tfrs-prod > prod-service.json
oc export route -o json --as-template=prod-route -n mem-tfrs-prod > prod-route.json
