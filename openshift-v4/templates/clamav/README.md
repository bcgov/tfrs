### Files included

clamav-bc.yaml build config
clamav-dc.yaml deployment config

### Build Clamav

oc process -f ./clamav-bc.yaml | oc create -f - -n 0ab226-tools

### Deploy Clamav

#### Create PVC for database files

oc process -f ./clamav-dc-pvc.yaml | oc create -f - -n 0ab226-[ENV_NAME]

Mount the pvc to a pod and add the Clamav database files to the PVC just created
This PVC will be mounted to /var/lib/clamav in clamav-dc.yaml

#### Deploy Clamav

oc tag clamav:latest clamav:dev -n 0ab226-tools
oc tag clamav:latest clamav:test -n 0ab226-tools
oc tag clamav:latest clamav:prod -n 0ab226-tools

oc process -f ./clamav-dc.yaml ENV_NAME=[dev, test or prod] | oc create -f - -n [dev, test or prod namespace]
Note: a new release add-ca-cert is being used otherwise the virus database download will fail
