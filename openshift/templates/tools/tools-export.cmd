oc export bc -o json > tools-bc.json
oc export dc -o json > tools-dc.json
oc export service -o json > tools-service.json
oc export route -o json > tools-route.json
oc export pvc -o json > tools-pvc.json