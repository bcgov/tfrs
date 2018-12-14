# oc project mem-tfrs-tools
oc process -f ./minio-bc.json ENV_NAME=dev | oc create -f -
# after the image created, there is only latest tag, need to manually create dev, test and prod tags
# remove created minio ressources
# oc delete ImageStream/tfrs-minio bc/tfrs-minio

# oc project mem-tfrs-dev
oc process -f ./minio-dc.json ENV_NAME=dev | oc create -f -
# oc project mem-tfrs-test
oc process -f ./minio-dc.json ENV_NAME=test | oc create -f -
# oc project mem-tfrs-prod
# the default minio-config size is 1G, minio-data is 2G, it cna be changed by pass parameters
oc process -f ./minio-dc.json ENV_NAME=prod | oc create -f -
oc process -f ./minio-dc.json ENV_NAME=prod MINIO_CONFIG_VOLUME_SIZE=1Gi MINIO_DATA_VOLUME_SIZE=10Gi | oc create -f -
# remove create minio ressource
# oc delete route/docs service/tfrs-minio secret/tfrs-minio-secret dc/tfrs-minio pvc/minio-data-vol pvc/minio-config-vol
