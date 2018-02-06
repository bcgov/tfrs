oc export configmap -o json -n mem-tfrs-tools > tools-configmap.json
oc export rolebinding -o json -n mem-tfrs-tools > tools-rolebinding.json
oc export pvc -o json -n mem-tfrs-tools > tools-storage.json
oc export bc -o json -n mem-tfrs-tools > tools-build-config.json
oc export dc -o json -n mem-tfrs-tools > tools-deployment-config.json
oc export service -o json -n mem-tfrs-tools > tools-service.json
oc export route -o json -n mem-tfrs-tools > tools-route.json
oc export configmap,rolebinding,pvc,bc,dc,service,route -o json --as-template=tfrs-tools -n mem-tfrs-tools > tfrs-tools-template.json
