'use strict';
const options= require('@bcgov/pipeline-cli').Util.parseArguments()
const changeId = options.pr //aka pull-request
const version = '2.0.0'
const name = 'tfrs'
const ocpName = 'apps.silver.devops'

options.git.owner='bcgov'
//Have to set options.git.repository to be zeva otherwise an error will be thrown as the label github-repo 
//will contain https://github.com/bcgov/zeva which is not allowed as a valid label
options.git.repository='tfrs'

const phases = {
  build: {  namespace:'0ab226-tools'    , name: `${name}`, phase: 'build'  , changeId:changeId, suffix: `-build-${changeId}`  , 
            instance: `${name}-build-${changeId}`  , version:`${version}-${changeId}`, tag:`build-${version}-${changeId}`,
            releaseBranch: 'release-2.0.0'
          },
  dev: {namespace:'0ab226-dev'    , name: `${name}`, phase: 'dev'  , changeId:changeId, suffix: `-dev`  , 
        instance: `${name}-dev`  , version:`${version}`, tag:`dev-${version}`, dbServiceName: 'tfrs-spilo',
        frontendCpuRequest: '100m', frontendCpuLimit: '200m', frontendMemoryRequest: '300Mi', frontendMemoryLimit: '600Mi', frontendReplicas: 2,
            frontendKeycloakAuthority: 'https://dev.loginproxy.gov.bc.ca/auth', frontendKeycloakClientId: 'tfrs-on-gold-4308', frontendKeycloakCallbackUrl: `https://tfrs-dev.${ocpName}.gov.bc.ca`,
            frontendKeycloakLogoutUrl: `https://tfrs-dev.${ocpName}.gov.bc.ca`, 
            frontendHost: `tfrs-dev.${ocpName}.gov.bc.ca`, frontendSiteminderLogoutUrl: 'https://logontest7.gov.bc.ca/clp-cgi/logoff.cgi?retnow=1&returl=',
            backendCpuRequest: '300m', backendCpuLimit: '600m', backendMemoryRequest: '1Gi', backendMemoryLimit: '2Gi', backendHealthCheckDelay: 30, 
            backendHost: `tfrs-backend-dev.${ocpName}.gov.bc.ca`, backendReplicas: 2,
            backendKeycloakSaBaseurl: 'https://dev.loginproxy.gov.bc.ca',
            backendKeycloakSaClientId: 'tfrs-on-gold-4308',
            backendKeycloakSaRealm: 'standard',
            backendKeycloakAudience: 'tfrs-on-gold-4308',
            backendKeycloakCertsUrl: 'https://dev.loginproxy.gov.bc.ca/auth/realms/standard/protocol/openid-connect/certs',
            backendKeycloakClientId: 'tfrs-on-gold-4308',
            backendKeycloakIssuer: 'https://dev.loginproxy.gov.bc.ca/auth/realms/standard',
            backendKeycloakRealm: 'standard',
            backendWellKnownEndpoint: 'https://dev.loginproxy.gov.bc.ca/auth/realms/standard/.well-known/openid-configuration',
            celeryCpuRequest: '100m', celeryCpuLimit: '250m', celeryMemoryRequest: '1600Mi', celeryMemoryLimit: '3Gi',
        scanHandlerCpuRequest: '25m', scanHandlerCpuLimit: '50m', scanHandlerMemoryRequest: '50Mi', scanHandlerMemoryLimit: '100Mi',
        scanCoordinatorCpuRequest: '100m', scanCoordinatorCpuLimit: '250m', scanCoordinatorMemoryRequest: '255Mi', scanCoordinatorMemoryLimit: '512Mi',
        notificationServerCpuRequest: '100m', notificationServerCpuLimit: '400m', notificationServerMemoryRequest: '256Mi', notificationServerMemoryLimit: '512Mi',
        patroniCpuRequest: '500m', patroniCpuLimit: '1000m', patroniMemoryRequest: '250Mi', patroniMemoryLimit: '1Gi', patroniPvcSize: '2Gi', 
            patroniReplica: 1, storageClass: 'netapp-block-standard', ocpName: `${ocpName}`,
        rabbitmqCpuRequest: '250m', rabbitmqCpuLimit: '700m', rabbitmqMemoryRequest: '500Mi', rabbitmqMemoryLimit: '1Gi', rabbitmqPvcSize: '1Gi', 
        rabbitmqReplica: 1, rabbitmqPostStartSleep: 120, storageClass: 'netapp-block-standard', 
        schemaSpyPublicCpuRequest: '50m', schemaSpyPublicCpuLimit: '500m', schemaSpyPublicMemoryRequest: '512Mi', schemaSpyPublicMemoryLimit: '2Gi', 
        schemaSpyAuditCpuRequest: '50m', schemaSpyAuditCpuLimit: '300m', schemaSpyAuditMemoryRequest: '256Mi', schemaSpyAuditMemoryLimit: '512Mi'
        },
  test: {namespace:'0ab226-test'    , name: `${name}`, phase: 'test'  , changeId:changeId, suffix: `-test`  , 
        instance: `${name}-test`  , version:`${version}`, tag:`test-${version}`, dbServiceName: 'patroni-master-test',
        frontendCpuRequest: '20m', frontendCpuLimit: '40m', frontendMemoryRequest: '30Mi', frontendMemoryLimit: '60Mi', frontendReplicas: 2,
            frontendKeycloakAuthority: 'https://test.loginproxy.gov.bc.ca/auth', frontendKeycloakClientId: 'tfrs-on-gold-4308', frontendKeycloakCallbackUrl: `https://tfrs-test.${ocpName}.gov.bc.ca`,
            frontendKeycloakLogoutUrl: `https://tfrs-test.${ocpName}.gov.bc.ca`, 
            frontendHost: `tfrs-test.${ocpName}.gov.bc.ca`, frontendSiteminderLogoutUrl: 'https://logontest7.gov.bc.ca/clp-cgi/logoff.cgi?retnow=1&returl=',
        backendCpuRequest: '100m', backendCpuLimit: '200m', backendMemoryRequest: '300Mi', backendMemoryLimit: '600Mi', backendHealthCheckDelay: 30, 
            backendHost: `tfrs-backend-test.${ocpName}.gov.bc.ca`, backendReplicas: 2,
            backendKeycloakSaBaseurl: 'https://test.loginproxy.gov.bc.ca',
            backendKeycloakSaClientId: 'tfrs-on-gold-4308',
            backendKeycloakSaRealm: 'standard',
            backendKeycloakAudience: 'tfrs-on-gold-4308',
            backendKeycloakCertsUrl: 'https://test.loginproxy.gov.bc.ca/auth/realms/standard/protocol/openid-connect/certs',
            backendKeycloakClientId: 'tfrs-on-gold-4308',
            backendKeycloakIssuer: 'https://test.loginproxy.gov.bc.ca/auth/realms/standard',
            backendKeycloakRealm: 'standard',
            backendWellKnownEndpoint: 'https://test.loginproxy.gov.bc.ca/auth/realms/standard/.well-known/openid-configuration',
        celeryCpuRequest: '100m', celeryCpuLimit: '250m', celeryMemoryRequest: '1600Mi', celeryMemoryLimit: '3Gi',
        scanHandlerCpuRequest: '100m', scanHandlerCpuLimit: '250m', scanHandlerMemoryRequest: '255Mi', scanHandlerMemoryLimit: '512Mi',
        scanCoordinatorCpuRequest: '100m', scanCoordinatorCpuLimit: '250m', scanCoordinatorMemoryRequest: '255Mi', scanCoordinatorMemoryLimit: '512Mi',
        notificationServerCpuRequest: '100m', notificationServerCpuLimit: '400m', notificationServerMemoryRequest: '256Mi', notificationServerMemoryLimit: '512Mi',
        patroniCpuRequest: '300m', patroniCpuLimit: '700m', patroniMemoryRequest: '250Mi', patroniMemoryLimit: '1Gi', patroniPvcSize: '3Gi', 
            patroniReplica: 2, storageClass: 'netapp-block-standard', ocpName: `${ocpName}`,
        rabbitmqCpuRequest: '250m', rabbitmqCpuLimit: '400m', rabbitmqMemoryRequest: '500Mi', rabbitmqMemoryLimit: '1Gi', rabbitmqPvcSize: '1Gi', 
            rabbitmqReplica: 2, rabbitmqPostStartSleep: 120, storageClass: 'netapp-block-standard',
        schemaSpyPublicCpuRequest: '50m', schemaSpyPublicCpuLimit: '500m', schemaSpyPublicMemoryRequest: '512Mi', schemaSpyPublicMemoryLimit: '2Gi', 
        schemaSpyAuditCpuRequest: '50m', schemaSpyAuditCpuLimit: '300m', schemaSpyAuditMemoryRequest: '256Mi', schemaSpyAuditMemoryLimit: '512Mi'
      },
  prod: {namespace:'0ab226-prod'    , name: `${name}`, phase: 'prod'  , changeId:changeId, suffix: `-prod`  , 
        instance: `${name}-prod`  , version:`${version}`, tag:`prod-${version}`, dbServiceName: 'patroni-master-prod',
        frontendCpuRequest: '20m', frontendCpuLimit: '40m', frontendMemoryRequest: '30Mi', frontendMemoryLimit: '60Mi', frontendReplicas: 3,
            frontendKeycloakAuthority: 'https://loginproxy.gov.bc.ca/auth', frontendKeycloakClientId: 'tfrs-on-gold-4308', frontendKeycloakCallbackUrl: 'https://lowcarbonfuels.gov.bc.ca',
            frontendKeycloakLogoutUrl: 'https://lowcarbonfuels.gov.bc.ca&retnow=1', 
            frontendHost: 'lowcarbonfuels.gov.bc.ca', frontendSiteminderLogoutUrl: 'https://logon7.gov.bc.ca/clp-cgi/logoff.cgi?retnow=1&returl=',
        backendCpuRequest: '300m', backendCpuLimit: '600m', backendMemoryRequest: '1Gi', backendMemoryLimit: '2Gi', backendHealthCheckDelay: 30, 
            backendHost: `tfrs-backend-prod.${ocpName}.gov.bc.ca`, backendReplicas: 2,
            backendKeycloakSaBaseurl: 'https://oidc.gov.bc.ca',
            backendKeycloakSaClientId: 'tfrs-django-sa',
            backendKeycloakSaRealm: 'tfrs',
            backendKeycloakAudience: 'tfrs',
            backendKeycloakCertsUrl: 'https://oidc.gov.bc.ca/auth/realms/tfrs/protocol/openid-connect/certs',
            backendKeycloakClientId: 'tfrs',
            backendKeycloakIssuer: 'https://oidc.gov.bc.ca/auth/realms/tfrs',
            backendKeycloakRealm: 'https://oidc.gov.bc.ca/auth/realms/tfrs',
            backendWellKnownEndpoint: 'https://loginproxy.gov.bc.ca/auth/realms/standard/.well-known/openid-configuration',
        celeryCpuRequest: '200m', celeryCpuLimit: '300mm', celeryMemoryRequest: '1600Mi', celeryMemoryLimit: '3Gi',
        scanHandlerCpuRequest: '200m', scanHandlerCpuLimit: '300m', scanHandlerMemoryRequest: '255Mi', scanHandlerMemoryLimit: '512Mi',
        scanCoordinatorCpuRequest: '200m', scanCoordinatorCpuLimit: '300m', scanCoordinatorMemoryRequest: '255Mi', scanCoordinatorMemoryLimit: '512Mi',
        notificationServerCpuRequest: '200m', notificationServerCpuLimit: '400m', notificationServerMemoryRequest: '256Mi', notificationServerMemoryLimit: '512Mi',
        patroniCpuRequest: '300m', patroniCpuLimit: '600m', patroniMemoryRequest: '500Mi', patroniMemoryLimit: '2Gi', patroniPvcSize: '10Gi', 
            patroniReplica: 3, storageClass: 'netapp-block-standard', ocpName: `${ocpName}`,
        rabbitmqCpuRequest: '200m', rabbitmqCpuLimit: '400m', rabbitmqMemoryRequest: '500Mi', rabbitmqMemoryLimit: '2Gi', rabbitmqPvcSize: '1Gi', 
            rabbitmqReplica: 2, rabbitmqPostStartSleep: 120, storageClass: 'netapp-block-standard' ,
        schemaSpyPublicCpuRequest: '50m', schemaSpyPublicCpuLimit: '500m', schemaSpyPublicMemoryRequest: '512Mi', schemaSpyPublicMemoryLimit: '2Gi', 
        schemaSpyAuditCpuRequest: '50m', schemaSpyAuditCpuLimit: '300m', schemaSpyAuditMemoryRequest: '256Mi', schemaSpyAuditMemoryLimit: '512Mi'
      },
};

// This callback forces the node process to exit as failure.
process.on('unhandledRejection', (reason) => {
  console.log(reason);
  process.exit(1);
});

module.exports = exports = {phases, options};
