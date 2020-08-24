### Files included

clamav-bc.yaml build config
clamav-dc.yaml deployment config

### Build and deploy clamav  

oc process -f ./clamav-bc.json | oc create -f - -n mem-tfrs-tools
oc tag tfrs-clamav:latest tfrs-clamav:dev
oc tag tfrs-clamav:latest tfrs-clamav:test
oc tag tfrs-clamav:latest tfrs-clamav:prod

oc process -f ./clamav-dc.json ENV_NAME=dev | oc create -f - -n mem-tfrs-dev
note: if virus database download failed, run build on tools project and tag it to dev

