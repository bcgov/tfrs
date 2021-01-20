### Files included

frontend-angular-app-bc.yaml base image build
frontend-angular-app-dc.yaml not being used
frontend-bc.yaml base image
frontend-dc.yaml deployment config
frontend-dc-others.yaml create client service and route

### Before triggering pipeline

Make sure nginx-runtime image has been built
oc tag e52f12-tools/nodejs:12-1-45 0ab226-tools/nodejs:12-1-45

