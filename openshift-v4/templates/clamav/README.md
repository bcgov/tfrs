### Files included

clamav-bc.yaml build config
clamav-dc.yaml deployment config

### Build and deploy clamav  

oc process -f ./clamav-bc.yaml | oc create -f - -n 0ab226-tools
oc tag clamav:latest clamav:dev -n 0ab226-tools
oc tag clamav:latest clamav:test -n 0ab226-tools
oc tag clamav:latest clamav:prod -n 0ab226-tools

oc process -f ./clamav-dc.yaml ENV_NAME=[dev, test or prod] | oc create -f - -n [dev, test or prod namespace]
Note: a new release add-ca-cert is being used otherwise the virus database download will fail

