$ oc process -f .jenkins/openshift/build.yaml -l app=jenkins-basic-bc NAME=jenkins-basic SOURCE_REPOSITORY_URL=https://github.com/bcgov/tfrs.git SOURCE_REPOSITORY_REF=master | oc create -f -

$ oc process -f .jenkins/openshift/secrets.yaml -l app=jenkins-basic-secret NAME=jenkins-basic GITHUB_USERNAME=**** GITHUB_PASSWORD=**** | oc create -f -
secret/jenkins-basic-slave-user created
secret/jenkins-basic-github created


$ oc process -f .jenkins/openshift/deploy.yaml -l app=jenkins-basic-dc NAME=jenkins-basic ROUTE_HOST=jenkins-basic-mem-tfrs-tools-tools.pathfinder.gov.bc.ca | oc create -f -
jenkins-basic ROUTE_HOST=jenkins-basica-mem-tfrs-tools.pathfinder.gov.bc.ca | oc create -f -
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
$ oc delete all -l app=jenkins-basic-secret.  //doesn't work for secret
$ oc delete all -l app=jenkins-basic-dc