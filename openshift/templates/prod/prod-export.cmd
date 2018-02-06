oc export secret -o json --as-template=prod-route > prod-secret.json
oc export configmap -o json --as-template=prod-route > prod-configmap.json
oc export rolebinding -o json --as-template=prod-route > prod-rolebinding.json
oc export pvc -o json --as-template=prod-storage > prod-storage.json
oc export bc -o json --as-template=prod-build-config > prod-build-config.json
oc export dc -o json --as-template=prod-deployment-config > prod-deployment-config.json
oc export service -o json --as-template=prod-service > prod-service.json
oc export route -o json --as-template=prod-route > prod-route.json
