oc export secret -o json --as-template=tools-route -n mem-tfrs-tools > tools-secret.json
oc export configmap -o json --as-template=tools-route -n mem-tfrs-tools > tools-configmap.json
oc export rolebinding -o json --as-template=tools-route -n mem-tfrs-tools > tools-rolebinding.json
oc export pvc -o json --as-template=tools-storage -n mem-tfrs-tools > tools-storage.json
oc export bc -o json --as-template=tools-build-config -n mem-tfrs-tools > tools-build-config.json
oc export dc -o json --as-template=tools-deployment-config -n mem-tfrs-tools > tools-deployment-config.json
oc export service -o json --as-template=tools-service -n mem-tfrs-tools > tools-service.json
oc export route -o json --as-template=tools-route -n mem-tfrs-tools > tools-route.json
