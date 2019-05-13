## create clamav image stream and build the image
oc project mem-tfrs-tools
oc process -f ./clamav-bc.json | oc create -f -
oc tag tfrs-clamav:latest tfrs-clamav:dev
oc tag tfrs-clamav:latest tfrs-clamav:test
oc tag tfrs-clamav:latest tfrs-clamav:prod

oc project mem-tfrs-dev
oc process -f ./clamav-dc.json ENV_NAME=dev | oc create -f -

oc project mem-tfrs-test
oc process -f ./clamav-dc.json ENV_NAME=test | oc create -f -


oc project mem-tfrs-prod
oc process -f ./clamav-dc.json ENV_NAME=prod | oc create -f -