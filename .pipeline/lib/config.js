'use strict';
const options= require('@bcgov/pipeline-cli').Util.parseArguments()
const changeId = options.pr //aka pull-request
const version = '1.0.0'
const name = 'tfrs'
const ocpName = 'apps.silver.devops'
const phases = {
  build: {  namespace:'0ab226-tools'    , name: `${name}`, phase: 'build'  , changeId:changeId, suffix: `-build-${changeId}`  , 
            instance: `${name}-build-${changeId}`  , version:`${version}-${changeId}`, tag:`build-${version}-${changeId}`
          },
  dev: {namespace:'0ab226-dev'    , name: `${name}`, phase: 'dev'  , changeId:changeId, suffix: `-dev-${changeId}`  , 
        instance: `${name}-dev-${changeId}`  , version:`${version}-${changeId}`, tag:`dev-${version}-${changeId}`,
        frontendHost: `tfrs-frontend-dev-${changeId}.${ocpName}.gov.bc.ca`,
        frontendCpuRequest: '100m', frontendCpuLimit: '700m', frontendMemoryRequest: '300M', frontendMemoryLimit: '4G', frontendReplicas: 1,
            frontendKeycloakAuthority: 'https://dev.oidc.gov.bc.ca/auth/realms/tfrs-dev', frontendKeycloakClientId: 'tfrs-dev', frontendKeycloakCallbackUrl: `https://tfrs-frontend-dev-${changeId}.${ocpName}.gov.bc.ca/authCallback`,
            frontendKeycloakLogoutUrl: `https://logontest.gov.bc.ca/clp-cgi/logoff.cgi?returl=https://tfrs-frontend-dev-${changeId}.${ocpName}.gov.bc.ca`, 
            frontendHostName: `tfrs-frontend-dev-${changeId}.${ocpName}.gov.bc.ca`,
            frontendCpuRequest: '200m', frontendCpuLimit: '500m', frontendMemoryRequest: '250Mi', frontendMemoryLimit: '500Mi',
        backendCpuRequest: '300m', backendCpuLimit: '600m', backendMemoryRequest: '1Gi', backendMemoryLimit: '2Gi', backendHealthCheckDelay: 30, 
            backendHostName: `tfrs-backend-dev-${changeId}.${ocpName}.gov.bc.ca`, backendReplicas: 1,
            backendKeycloakSaBaseurl: 'https://dev.oidc.gov.bc.ca',
            backendKeycloakSaClientId: 'tfrs-dev-django-sa',
            backendKeycloakSaRealm: 'tfrs-dev',
            backendKeycloakAudience: 'tfrs-dev',
            backendKeycloakCertsUrl: 'https://dev.oidc.gov.bc.ca/auth/realms/tfrs-dev/protocol/openid-connect/certs',
            backendKeycloakClientId: 'tfrs-dev',
            backendKeycloakIssuer: 'https://dev.oidc.gov.bc.ca/auth/realms/tfrs-dev',
            backendKeycloakRealm: 'https://dev.oidc.gov.bc.ca/auth/realms/tfrs-dev',
        patroniCpuRequest: '500m', patroniCpuLimit: '1000m', patroniMemoryRequest: '250Mi', patroniMemoryLimit: '1Gi', patroniPvcSize: '2Gi', 
            patroniReplica: 1, storageClass: 'netapp-block-standard', ocpName: `${ocpName}`,
        rabbitmqCpuRequest: '250m', rabbitmqCpuLimit: '700m', rabbitmqMemoryRequest: '500Mi', rabbitmqMemoryLimit: '1Gi', rabbitmqPvcSize: '1Gi', 
            rabbitmqReplica: 1, rabbitmqPostStartSleep: 120, storageClass: 'netapp-block-standard'
        },
  test: {namespace:'0ab226-test'    , name: `${name}`, phase: 'test'  , changeId:changeId, suffix: `-test`  , instance: `${name}-test`  , version:`${version}`, tag:`test-${version}`},
  prod: {namespace:'0ab226-prod'    , name: `${name}`, phase: 'prod'  , changeId:changeId, suffix: `-prod`  , instance: `${name}-prod`  , version:`${version}`, tag:`prod-${version}`},
};

// This callback forces the node process to exit as failure.
process.on('unhandledRejection', (reason) => {
  console.log(reason);
  process.exit(1);
});

module.exports = exports = {phases, options};