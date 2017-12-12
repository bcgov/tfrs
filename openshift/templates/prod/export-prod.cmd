oc export bc -o json > prod-bc.json
oc export dc -o json > prod-dc.json
oc export service -o json > prod-service.json
oc export route -o json > prod-route.json
oc export pvc -o json > prod-pvc.json