oc export bc -o json > dev-bc.json
oc export dc -o json > dev-dc.json
oc export service -o json > dev-service.json
oc export route -o json > dev-route.json
oc export pvc -o json > dev-pvc.json