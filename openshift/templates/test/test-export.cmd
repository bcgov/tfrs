oc export secret -o json --as-template=test-route > test-secret.json
oc export configmap -o json --as-template=test-route > test-configmap.json
oc export rolebinding -o json --as-template=test-route > test-rolebinding.json
oc export pvc -o json --as-template=test-storage > test-storage.json
oc export bc -o json --as-template=test-build-config > test-build-config.json
oc export dc -o json --as-template=test-deployment-config > test-deployment-config.json
oc export service -o json --as-template=test-service > test-service.json
oc export route -o json --as-template=test-route > test-route.json
