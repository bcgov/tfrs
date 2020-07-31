### Files included
* nsp-tools.yaml pods-to-external-network, apply it to tools name space only
* quickstart-nsp.yaml apply this to all namespaces

### Apply to name spaces before anything else

* oc process -f ./nsp-tools.yaml | oc create -f - -n mem-tfrs-tools
* oc process -f ./quickstart-nsp.yaml | oc create -f - -n mem-tfrs-tools
* oc process -f ./quickstart-nsp.yaml | oc create -f - -n mem-tfrs-dev
* oc process -f ./quickstart-nsp.yaml | oc create -f - -n mem-tfrs-test
* oc process -f ./quickstart-nsp.yaml | oc create -f - -n mem-tfrs-prod

### Add role to users, check if the settings already exist before running the grant

* tools project

oc policy add-role-to-user admin system:serviceaccount:mem-tfrs-tools:jenkins-basic --namespace=mem-tfrs-tools
oc policy add-role-to-user system:image-puller system:serviceaccount:mem-tfrs-dev:default --namespace=mem-tfrs-tools
oc policy add-role-to-user system:image-puller system:serviceaccount:mem-tfrs-dev:builder --namespace=mem-tfrs-tools
oc policy add-role-to-user system:image-puller system:serviceaccount:mem-tfrs-test:default --namespace=mem-tfrs-tools
oc policy add-role-to-user system:image-puller system:serviceaccount:mem-tfrs-test:builder --namespace=mem-tfrs-tools
oc policy add-role-to-user system:image-puller system:serviceaccount:mem-tfrs-prod:default --namespace=mem-tfrs-tools
oc policy add-role-to-user system:image-puller system:serviceaccount:mem-tfrs-prod:builder --namespace=mem-tfrs-tools

* dev environment

oc policy add-role-to-user edit system:serviceaccount:mem-tfrs-tools:jenkins-basic --namespace=mem-tfrs-dev
oc policy add-role-to-user edit system:serviceaccount:mem-tfrs-dev:nagios --namespace=mem-tfrs-dev
oc policy add-role-to-user system:deployer system:serviceaccount:mem-tfrs-dev:deployer --namespace=mem-tfrs-dev
oc policy add-role-to-user system:image-builder system:serviceaccount:mem-tfrs-dev:builder --namespace=mem-tfrs-dev

* test environment

oc policy add-role-to-user admin system:serviceaccount:mem-tfrs-tools:jenkins-basic --namespace=mem-tfrs-test
oc policy add-role-to-user edit system:serviceaccount:mem-tfrs-test:nagios --namespace=mem-tfrs-test
oc policy add-role-to-user system:deployer system:serviceaccount:mem-tfrs-test:deployer --namespace=mem-tfrs-test
oc policy add-role-to-user system:image-builder system:serviceaccount:mem-tfrs-test:builder --namespace=mem-tfrs-test

* prod environment

oc policy add-role-to-user admin system:serviceaccount:mem-tfrs-tools:jenkins-basic --namespace=mem-tfrs-prod
oc policy add-role-to-user edit system:serviceaccount:mem-tfrs-prod:nagios --namespace=mem-tfrs-prod
oc policy add-role-to-user system:deployer system:serviceaccount:mem-tfrs-prod:deployer --namespace=mem-tfrs-prod
oc policy add-role-to-user system:image-builder system:serviceaccount:mem-tfrs-prod:builder --namespace=mem-tfrs-prod

## 2. Jenkins setup on tools project

* .jenkins/create-jenkins-basic.sh

## 3. Pipeline to deploy on dev, test and prod

### 3.1 Preparation for pipeline