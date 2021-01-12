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
        frontendCpuRequest: '100m', frontendCpuLimit: '700m', frontendMemoryRequest: '300M', frontendMemoryLimit: '4G', frontendReplicas: 1,
            keycloakAuthority: 'https://dev.oidc.gov.bc.ca/auth/realms/tfrs-dev', keycloakClientId: 'tfrs-dev', keycloakCallbackUrl: 'https://dev-lowcarbonfuels.pathfinder.gov.bc.ca/authCallback',
            keycloakLogoutUrl: 'https://logontest.gov.bc.ca/clp-cgi/logoff.cgi?returl=https%3A%2F%2Fdev-lowcarbonfuels.pathfinder.gov.bc.ca%2F', 
            frontendHostName: `tfrs-lowcarbonfuels-dev-${changeId}.${ocpName}.gov.bc.ca`,
        backendCpuRequest: '300m', backendCpuLimit: '600m', backendMemoryRequest: '1G', backendMemoryLimit: '2G', backendHealthCheckDelay: 30, 
            backendHostName: `tfrs-backend-dev-${changeId}.${ocpName}.gov.bc.ca`, backendReplicas: 1,
        patroniCpuRequest: '200m', patroniCpuLimit: '400m', patroniMemoryRequest: '250M', patroniMemoryLimit: '500M', patroniPvcSize: '2G', 
            patroniReplica: 1, storageClass: 'netapp-block-standard', ocpName: `${ocpName}`,
        rabbitmqCpuRequest: '250m', rabbitmqCpuLimit: '700m', rabbitmqMemoryRequest: '500M', rabbitmqMemoryLimit: '1G', rabbitmqPvcSize: '1G', 
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