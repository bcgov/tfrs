### Files included

frontend-angular-app-bc.yaml base image build
frontend-bc.yaml base image
frontend-dc.yaml deployment config
frontend-dc-others.yaml create client service, route and configmap(to be mounted to frontend pods)

### Before triggering pipeline

oc -n 0ab226-tools create secret docker-registry tfrs-image-pull-secret \
    --docker-server=registry.redhat.io \
    --docker-username=<RedHat Registry Service Account user>\
    --docker-password=<password> \
    --docker-email=<email>

oc tag e52f12-tools/nodejs:12-1-45 0ab226-tools/nodejs:12-1-45
Make sure nginx-runtime image has been built


