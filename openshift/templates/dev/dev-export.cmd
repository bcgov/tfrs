oc export secret -o json --as-template=dev-route > dev-secret.json
oc export configmap -o json --as-template=dev-route > dev-configmap.json
oc export rolebinding -o json --as-template=dev-route > dev-rolebinding.json
oc export pvc -o json --as-template=dev-storage > dev-storage.json
oc export bc -o json --as-template=dev-build-config > dev-build-config.json
oc export dc -o json --as-template=dev-deployment-config > dev-deployment-config.json
oc export service -o json --as-template=dev-service > dev-service.json
oc export route -o json --as-template=dev-route > dev-route.json
