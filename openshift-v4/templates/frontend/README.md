### Files included

client-angular-app-bc.yaml base image build
client-bc.json build frontend image
client-dc.json deployment frontend image
client-dc-others.json create client service and route

### Before triggering pipeline

Make sure nginx-runtime image has been built

### After pipeline completes

Apply certificate for prod