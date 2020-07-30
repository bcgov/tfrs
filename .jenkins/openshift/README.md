
### Create image stream bcgov-jenkins-basic and build bcgov-jenkins-basic image as base image fpr jenkins
oc process -f ./bcgov-jenkins-basic.yaml | oc create -f -

### Create secrets used by Jenkins
1. Create below secrets from yaml file
jenkins-basic-slave-user
jenkins-basic-github
jenkins-basic-browserstack
jenkins-basic-functional-test-users

$ oc process -f secrets.yaml \
-l app=jenkins-basic-secret \
NAME=jenkins-basic \
GITHUB_USERNAME=***** \
GITHUB_PASSWORD=***** \
BROWSERSTACK_USERNAME=**** \
BROWSERSTACK_ACCESSKEY=**** 
| oc create -f -


2. Create jenkins-basic-functional-test-users, need to have functional_test_users.txt ready
$ oc create secret generic jenkins-basic-functional-test-users --from-file=functional_test_users_v2=./functional_test_users.txt

### Build and deploy jenkins-basic

1. Build jenkins-basic image
$ oc process -f .jenkins/openshift/build.yaml -l app=jenkins-basic-bc | oc create -f -

2. deoloy jenkins-basic
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

