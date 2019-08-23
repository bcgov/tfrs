oc process -f ./nagios-base-bc.json | oc create -f -
oc process -f ./nagios-bc.json ENV_NAME=dev | oc create -f -
oc process -f ./nagios-bc.json ENV_NAME=test | oc create -f -
oc process -f ./nagios-bc.json ENV_NAME=prod | oc create -f -
oc process -f ./nagios-dc.json ENV_NAME=prod | oc create -f -

## grant buikd to pull image from tools project, as nagios uses nagios-base image which is in tools project
oc policy add-role-to-user system:image-puller system:serviceaccount:mem-tfrs-dev:builder --namespace=mem-tfrs-tools
oc policy add-role-to-user system:image-puller system:serviceaccount:mem-tfrs-test:builder --namespace=mem-tfrs-tools
oc policy add-role-to-user system:image-puller system:serviceaccount:mem-tfrs-prod:builder --namespace=mem-tfrs-tools

## grant service account nagios edit role otherwise check replica will fail
oc policy add-role-to-user edit system:serviceaccount:mem-tfrs-dev:nagios -n mem-tfrs-dev
oc policy add-role-to-user edit system:serviceaccount:mem-tfrs-test:nagios -n mem-tfrs-test
oc policy add-role-to-user edit system:serviceaccount:mem-tfrs-prod:nagios -n mem-tfrs-prod

