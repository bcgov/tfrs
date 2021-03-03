
## For Aporeto network security policies  

### remove all Aporeto network security policies  
oc get nsp -n <namespace>
oc delete nsp,en --all -n <namespace>

### Apply generic Aporeto network security policies
oc process -f nsp-generic.yaml NAMESPACE_PREFIX=<LICENS_PLATE_HERE> ENVIRONMENT=<ENVIRONMENT_NAME_HERE> | oc apply -f - -n <namespace>
Note: once it is applied, the application will NOT be blocked by Aporeto. Aporeto should become transparent.

## For the new network policies

### For tools project, apply quick start  
oc process -f knp-quick-start.yaml NAMESPACE_PREFIX=<LICENS_PLATE_HERE> ENVIRONMENT=<ENVIRONMENT_NAME_HERE> | oc apply -f - -n <namespace>
Note : the quick start include three knps: deny-by-default, allow-from-openshift-ingress and allow-all-internal. Once the quick start is applied, the application will NOT be blocked by Openshift network policies.

### For environment projects
oc process -f knp-env-base.yaml | oc create -f - -n <Namespace>
oc process -f knp-env-non-pr.yaml ENVIRONMENT=<ENVIRONMENT_NAME_HERE> | oc create -f - -n <Namespace>
#### For Dev
Apply knp-env-pr.yaml through pipeline
#### For Test and Prod
oc process -f knp-env-pr.yaml SUFFIX=-test ENVIRONMENT=test | oc create -f - -n <Namespace>
oc process -f knp-env-pr.yaml SUFFIX=-prod ENVIRONMENT=prod | oc create -f - -n <Namespace>

## Setup the new network policies on Test
oc get nsp -n 0ab226-test
oc delete nsp,en --all -n 0ab226-test
oc process -f nsp-generic.yaml NAMESPACE_PREFIX=0ab226 ENVIRONMENT=test | oc apply -f - -n 0ab226-test
oc process -f knp-env-base.yaml ENVIRONMENT=test | oc create -f - -n 0ab226-test 
oc process -f knp-env-non-pr.yaml ENVIRONMENT=test | oc create -f - -n 0ab226-test
oc process -f knp-env-pr.yaml SUFFIX=-test ENVIRONMENT=test | oc create -f - -n 0ab226-test


    