oc export secret -o json --as-template=test-route -n mem-tfrs-test > test-secret.json
oc export configmap -o json --as-template=test-route -n mem-tfrs-test > test-configmap.json
oc export rolebinding -o json --as-template=test-route -n mem-tfrs-test > test-rolebinding.json
oc export pvc -o json --as-template=test-storage -n mem-tfrs-test > test-storage.json
oc export bc -o json --as-template=test-build-config -n mem-tfrs-test > test-build-config.json
oc export dc -o json --as-template=test-deployment-config -n mem-tfrs-test > test-deployment-config.json
oc export service -o json --as-template=test-service -n mem-tfrs-test > test-service.json
oc export route -o json --as-template=test-route -n mem-tfrs-test > test-route.json
