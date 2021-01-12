### Files included

clamav-bc.yaml build config
clamav-dc.yaml deployment config

### Build and deploy clamav  

oc process -f ./clamav-bc.yaml | oc create -f - -n 0ab226-tools
oc tag clamav:latest clamav:dev -n 0ab226-tools
oc tag clamav:latest clamav:test -n 0ab226-tools
oc tag clamav:latest clamav:prod -n 0ab226-tools

oc process -f ./clamav-dc.yaml ENV_NAME=dev | oc create -f - -n 0ab226-dev
note: if virus database download failed, run build on tools project and tag it to dev

