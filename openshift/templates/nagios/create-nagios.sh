oc process -f ./nagios-base-bc.json | oc create -f -
oc process -f ./nagios-bc.json | oc create -f -
oc process -f ./nagios-dc.json ENV_NAME=dev IS_NAME=nagios | oc create -f -

# last step to grant image-pull role to service account nagios
oc policy add-role-to-user system:image-puller system:serviceaccount:mem-tfrs-prod:nagios --namespace=mem-tfrs-tools