oc export secret -o json --as-template=tools-route > tools-secret.json
oc export configmap -o json --as-template=tools-route > tools-configmap.json
oc export rolebinding -o json --as-template=tools-route > tools-rolebinding.json
oc export pvc -o json --as-template=tools-storage > tools-tools-storage.json
oc export bc -o json --as-template=tools-build-config > tools-build-config.json
oc export dc -o json --as-template=tools-deployment-config > tools-deployment-config.json
oc export service -o json --as-template=tools-service > tools-service.json
oc export route -o json --as-template=tools-route > tools-route.json
