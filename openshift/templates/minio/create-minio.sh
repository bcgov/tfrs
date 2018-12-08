# oc project mem-tfrs-tools
oc process -f ./tfrs-minio-bc.json ENV_NAME=dev | oc create -f -
# remove created minio ressources
# oc delete ImageStream/tfrs-minio bc/tfrs-minio

# oc project mem-tfrs-dev
oc process -f ./tfrs-minio-dc.json ENV_NAME=dev | oc create -f -
# oc project mem-tfrs-test
oc process -f ./tfrs-minio-dc.json ENV_NAME=test | oc create -f -
# oc project mem-tfrs-prod
oc process -f ./tfrs-minio-dc.json ENV_NAME=prod | oc create -f -
# remove create minio ressource
# oc delete route/docs service/tfrs-minio secret/tfrs-minio-secret dc/tfrs-minio pvc/minio-data-vol pvc/minio-config-vol
