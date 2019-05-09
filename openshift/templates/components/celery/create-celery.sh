# tools, build image
oc project mem-tfrs-tools
oc process -f ./celery-bc-develop.json  | oc create -f -
oc process -f ./celery-bc.json  | oc create -f -

# dev
oc project mem-tfrs-dev
oc process -f ./celery-dc.json ENV_NAME=dev IS_NAME=celery-develop | oc create -f -

# test
oc project mem-tfrs-test
oc process -f ./celery-dc.json ENV_NAME=test IS_NAME=celery | oc create -f -

# prod
oc project mem-tfrs-prod
oc process -f ./celery-dc.json ENV_NAME=prod IS_NAME=celery | oc create -f -