### Files included

* nagios-base-bc.yaml nagios base image build config
* nagios-bc.yaml nagios image build config
* nagios-dc.yaml nagios deployment config
* nagios-secret.yaml create nagios-secret

### Build and deploy nagios

1. Build nagios base image
oc create imagestream nagios-base -n [tools namespace]
oc process -f ./nagios-base-bc.yaml | oc create -f - -n [tools namespace]

2. Create nagios secret
oc process -f ./nagios-secret.yaml | oc create -f - -n [test namespace]
oc process -f ./nagios-secret.yaml | oc create -f - -n [prod namespace]

3. Build nagios image for environment
oc process -f ./nagios-bc.yaml ENV_NAME=test | oc create -f - -n [test namespace]
oc process -f ./nagios-bc.yaml ENV_NAME=prod | oc create -f - -n [prod namespace]

4. Tag nagios image for environment
oc tag [test namespace]/nagios:latest [test namespace]/nagios:test
oc tag [prod namespace]/nagios:latest [prod namespace]/nagios:prod

4. Deploy nagios for environment
oc process -f ./nagios-dc.yaml NAME=zeva \
ENV_NAME=prod \
NAGIOS_PVC_SIZE=2G \
OCP_NAME=apps.silver.devops \
 | oc create -f - -n [environment namespace]