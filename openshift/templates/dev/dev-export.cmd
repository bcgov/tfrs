oc export secret -o json --as-template=dev-route -n mem-tfrs-dev > dev-secret.json
oc export configmap -o json --as-template=dev-route -n mem-tfrs-dev > dev-configmap.json
oc export rolebinding -o json --as-template=dev-route -n mem-tfrs-dev > dev-rolebinding.json
oc export pvc -o json --as-template=dev-storage -n mem-tfrs-dev > dev-storage.json
oc export bc -o json --as-template=dev-build-config -n mem-tfrs-dev > dev-build-config.json
oc export dc -o json --as-template=dev-deployment-config -n mem-tfrs-dev > dev-deployment-config.json
oc export service -o json --as-template=dev-service -n mem-tfrs-dev > dev-service.json
oc export route -o json --as-template=dev-route -n mem-tfrs-dev > dev-route.json
