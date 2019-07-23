## 1 Create Secrets A
$ oc process -f secrets.yaml \
-l app=jenkins-basic-secret \
NAME=jenkins-basic \
GITHUB_USERNAME=***** \
GITHUB_PASSWORD=***** \
BROWSERSTACK_USERNAME=**** \
BROWSERSTACK_ACCESSKEY=**** 
| oc create -f -

## 2 Create Secrets B, need to have functional_test_users.txt ready
$ oc create secret generic jenkins-basic-functional-test-users --from-file=functional_test_users_v2=./functional_test_users.txt

## 3 Run build
$ oc process -f .jenkins/openshift/build.yaml -l app=jenkins-basic-bc NAME=jenkins-basic SOURCE_REPOSITORY_URL=https://github.com/bcgov/tfrs.git SOURCE_REPOSITORY_REF=master | oc create -f -
secret/jenkins-basic-slave-user created
secret/jenkins-basic-github created

## 4 run deploy
$ oc process -f .jenkins/openshift/deploy.yaml \
-l app=jenkins-basic-dc \
NAME=jenkins-basic \
ROUTE_HOST=jenkins-basic-mem-tfrs-tools-tools.pathfinder.gov.bc.ca \
| oc create -f -
persistentvolumeclaim/jenkins-basic created
serviceaccount/jenkins-basic created
rolebinding.authorization.openshift.io/jenkins-basic_edit created
rolebinding.authorization.openshift.io/jenkins-basic_admin created
deploymentconfig.apps.openshift.io/jenkins-basic created
deploymentconfig.apps.openshift.io/jenkins-basic-slave-build created
service/jenkins-basic created
route.route.openshift.io/jenkins-basic created
Error from server (AlreadyExists): imagestreams.image.openshift.io "jenkins-basic" already exists

$ oc delete all -l app=jenkins-basic-bc
$ oc delete all -l app=jenkins-basic-secret.  //does not work for secret
$ oc delete all -l app=jenkins-basic-dc

