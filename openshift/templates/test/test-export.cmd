oc export secret -o json -n mem-tfrs-test > test-secret.json
oc export configmap -o json -n mem-tfrs-test > test-configmap.json
oc export rolebinding -o json -n mem-tfrs-test > test-rolebinding.json
oc export pvc -o json -n mem-tfrs-test > test-storage.json
oc export bc -o json -n mem-tfrs-test > test-build-config.json
oc export dc -o json -n mem-tfrs-test > test-deployment-config.json
oc export service -o json -n mem-tfrs-test > test-service.json
oc export route -o json -n mem-tfrs-test > test-route.json
