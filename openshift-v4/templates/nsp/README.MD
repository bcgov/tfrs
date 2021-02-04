### Files included

* quickstart-nsp.yaml apply this to all namespaces

### Apply to name spaces before anything else

API_VERSION=security.devops.gov.bc.ca/v1alpha1  
NAMESPACE_PREFIX=0ab226  

oc process -f ./quickstart-nsp.yaml API_VERSION=security.devops.gov.bc.ca/v1alpha1 NAMESPACE_PREFIX=0ab226 ENV_NAME=tools | oc create -f - -n 0ab226-tools  
oc process -f ./quickstart-nsp.yaml API_VERSION=security.devops.gov.bc.ca/v1alpha1 NAMESPACE_PREFIX=0ab226 ENV_NAME=dev | oc create -f - -n 0ab226-dev  
oc process -f ./quickstart-nsp.yaml API_VERSION=security.devops.gov.bc.ca/v1alpha1 NAMESPACE_PREFIX=0ab226 ENV_NAME=test | oc create -f - -n 0ab226-test  
oc process -f ./quickstart-nsp.yaml API_VERSION=security.devops.gov.bc.ca/v1alpha1 NAMESPACE_PREFIX=0ab226 ENV_NAME=prod | oc create -f - -n 0ab226-prod  

### Apply specific nsps

only keep int-cluster-k8s-api-comms
./pipeline/npm run deploy-nsps -- --pr=1696 --env=prod

### Add role to users, check if the settings already exist before run the grant

* tools project

oc policy add-role-to-user admin system:serviceaccount:0ab226-tools:jenkins-prod --namespace=0ab226-tools  
oc policy add-role-to-user system:image-puller system:serviceaccount:0ab226-dev:default --namespace=0ab226-tools  
oc policy add-role-to-user system:image-puller system:serviceaccount:0ab226-dev:builder --namespace=0ab226-tools  
oc policy add-role-to-user system:image-puller system:serviceaccount:0ab226-test:default --namespace=0ab226-tools  
oc policy add-role-to-user system:image-puller system:serviceaccount:0ab226-test:builder --namespace=0ab226-tools  
oc policy add-role-to-user system:image-puller system:serviceaccount:0ab226-prod:default --namespace=0ab226-tools  
oc policy add-role-to-user system:image-puller system:serviceaccount:0ab226-prod:builder --namespace=0ab226-tools  
 

* dev enviornment

oc policy add-role-to-user admin system:serviceaccount:0ab226-tools:jenkins-prod --namespace=0ab226-dev  
oc policy add-role-to-user edit system:serviceaccount:0ab226-dev:nagios --namespace=0ab226-dev  
oc policy add-role-to-user system:deployer system:serviceaccount:0ab226-dev:deployer --namespace=0ab226-dev  
oc policy add-role-to-user system:image-builder system:serviceaccount:0ab226-dev:builder --namespace=0ab226-dev  

* test enviornment

oc policy add-role-to-user admin system:serviceaccount:0ab226-tools:jenkins-prod --namespace=0ab226-test  
oc policy add-role-to-user edit system:serviceaccount:0ab226-test:nagios --namespace=0ab226-test  
oc policy add-role-to-user system:deployer system:serviceaccount:0ab226-test:deployer --namespace=0ab226-test  
oc policy add-role-to-user system:image-builder system:serviceaccount:0ab226-test:builder --namespace=0ab226-test  

* prod enviornment

oc policy add-role-to-user admin system:serviceaccount:0ab226-tools:jenkins-prod --namespace=0ab226-prod  
oc policy add-role-to-user edit system:serviceaccount:0ab226-prod:nagios --namespace=0ab226-prod  
oc policy add-role-to-user system:deployer system:serviceaccount:0ab226-prod:deployer --namespace=0ab226-prod  
oc policy add-role-to-user system:image-builder system:serviceaccount:0ab226-prod:builder --namespace=0ab226-prod  


