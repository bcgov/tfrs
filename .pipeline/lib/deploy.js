"use strict";
const { OpenShiftClientX } = require("@bcgov/pipeline-cli");
const path = require("path");
const KeyCloakClient = require("./keycloak");

module.exports = (settings) => {
  const phases = settings.phases;
  const options = settings.options;
  const phase = options.env;
  const changeId = phases[phase].changeId;
  const oc = new OpenShiftClientX(
    Object.assign({ namespace: phases[phase].namespace }, options)
  );

  const templatesLocalBaseUrl = oc.toFileUrl(
    path.resolve(__dirname, "../../openshift-v4")
  );
  var objects = [];

  //The deployment of your cool app goes here ▼▼▼

  //deploy backend
  objects = objects.concat(
    oc.processDeploymentTemplate(
      `${templatesLocalBaseUrl}/templates/backend/backend-dc.yaml`,
      {
        param: {
          NAME: phases[phase].name,
          SUFFIX: phases[phase].suffix,
          ENV_NAME: phases[phase].phase,
          NAMESPACE: phases[phase].namespace,
          VERSION: phases[phase].tag,
          KEYCLOAK_AUDIENCE: phases[phase].backendKeycloakAudience,
          CPU_REQUEST: phases[phase].backendCpuRequest,
          CPU_LIMIT: phases[phase].backendCpuLimit,
          MEMORY_REQUEST: phases[phase].backendMemoryRequest,
          MEMORY_LIMIT: phases[phase].backendMemoryLimit,
          REPLICAS: phases[phase].backendReplicas,
          DB_SERVICE_NAME: phases[phase].dbServiceName,
          WELL_KNOWN_ENDPOINT: phases[phase].backendWellKnownEndpoint,
          REDIS_HOST: phases[phase].redisHost,
          REDIS_PORT: phases[phase].redisPort,
        },
      }
    )
  );

  objects = objects.concat(
    oc.processDeploymentTemplate(
      `${templatesLocalBaseUrl}/templates/backend/backend-dc-others.yaml`,
      {
        param: {
          NAME: phases[phase].name,
          SUFFIX: phases[phase].suffix,
          BACKEND_HOST: phases[phase].backendHost,
        },
      }
    )
  );

  //deploy frontend
  objects = objects.concat(
    oc.processDeploymentTemplate(
      `${templatesLocalBaseUrl}/templates/frontend/frontend-dc-docker.yaml`,
      {
        param: {
          NAME: phases[phase].name,
          SUFFIX: phases[phase].suffix,
          VERSION: phases[phase].tag,
          NAMESPACE: phases[phase].namespace,
          CPU_REQUEST: phases[phase].frontendCpuRequest,
          CPU_LIMIT: phases[phase].frontendCpuLimit,
          MEMORY_REQUEST: phases[phase].frontendMemoryRequest,
          MEMORY_LIMIT: phases[phase].frontendMemoryLimit,
          REPLICAS: phases[phase].frontendReplicas,
          KEYCLOAK_AUTHORITY: phases[phase].frontendKeycloakAuthority,
          KEYCLOAK_CLIENT_ID: phases[phase].frontendKeycloakClientId,
          KEYCLOAK_CALLBACK_URL: phases[phase].frontendKeycloakCallbackUrl,
          KEYCLOAK_LOGOUT_URL: phases[phase].frontendKeycloakLogoutUrl,
          SITEMINDER_LOGOUT_URL: phases[phase].frontendSiteminderLogoutUrl,
          BACKEND_HOST: phases[phase].backendHost,
          DEBUG_ENABLED: phases[phase].frontendDebugEnabled,
        },
      }
    )
  );
  /*
  //deploy frontend
  objects = objects.concat(oc.processDeploymentTemplate(`${templatesLocalBaseUrl}/templates/frontend/frontend-dc-docker-others.yaml`, {
    'param': {
      'NAME': phases[phase].name,
      'SUFFIX': phases[phase].suffix,
      'VERSION': phases[phase].tag,
      'FRONTEND_HOST': phases[phase].frontendHost,
    }
  }))
*/
  //deploy celery
  objects = objects.concat(
    oc.processDeploymentTemplate(
      `${templatesLocalBaseUrl}/templates/celery/celery-dc.yaml`,
      {
        param: {
          NAME: phases[phase].name,
          SUFFIX: phases[phase].suffix,
          VERSION: phases[phase].tag,
          ENV_NAME: phases[phase].phase,
          NAMESPACE: phases[phase].namespace,
          CPU_REQUEST: phases[phase].celeryCpuRequest,
          CPU_LIMIT: phases[phase].celeryCpuLimit,
          MEMORY_REQUEST: phases[phase].celeryMemoryRequest,
          MEMORY_LIMIT: phases[phase].celeryMemoryLimit,
          DB_SERVICE_NAME: phases[phase].dbServiceName,
        },
      }
    )
  );

  //deploy notification server
  objects = objects.concat(
    oc.processDeploymentTemplate(
      `${templatesLocalBaseUrl}/templates/notification/notification-server-dc.yaml`,
      {
        param: {
          NAME: phases[phase].name,
          SUFFIX: phases[phase].suffix,
          NAMESPACE: phases[phase].namespace,
          VERSION: phases[phase].tag,
          KEYCLOAK_CERTS_URL: phases[phase].backendKeycloakCertsUrl,
          CPU_REQUEST: phases[phase].notificationServerCpuRequest,
          CPU_LIMIT: phases[phase].notificationServerCpuLimit,
          MEMORY_REQUEST: phases[phase].notificationServerMemoryRequest,
          MEMORY_LIMIT: phases[phase].notificationServerMemoryLimit,
        },
      }
    )
  );

  objects = objects.concat(
    oc.processDeploymentTemplate(
      `${templatesLocalBaseUrl}/templates/notification/notification-server-others-dc.yaml`,
      {
        param: {
          NAME: phases[phase].name,
          SUFFIX: phases[phase].suffix,
          FRONTEND_HOST: phases[phase].frontendHost,
        },
      }
    )
  );

  //deploy scan coordinator
  objects = objects.concat(
    oc.processDeploymentTemplate(
      `${templatesLocalBaseUrl}/templates/scan-coordinator/scan-coordinator-dc.yaml`,
      {
        param: {
          NAME: phases[phase].name,
          SUFFIX: phases[phase].suffix,
          NAMESPACE: phases[phase].namespace,
          VERSION: phases[phase].tag,
          ENV_NAME: phases[phase].phase,
          CPU_REQUEST: phases[phase].scanCoordinatorCpuRequest,
          CPU_LIMIT: phases[phase].scanCoordinatorCpuLimit,
          MEMORY_REQUEST: phases[phase].scanCoordinatorMemoryRequest,
          MEMORY_LIMIT: phases[phase].scanCoordinatorMemoryLimit,
        },
      }
    )
  );

  //deploy scan handler
  objects = objects.concat(
    oc.processDeploymentTemplate(
      `${templatesLocalBaseUrl}/templates/scan-handler/scan-handler-dc.yaml`,
      {
        param: {
          NAME: phases[phase].name,
          SUFFIX: phases[phase].suffix,
          NAMESPACE: phases[phase].namespace,
          VERSION: phases[phase].tag,
          CPU_REQUEST: phases[phase].scanHandlerCpuRequest,
          CPU_LIMIT: phases[phase].scanHandlerCpuLimit,
          MEMORY_REQUEST: phases[phase].scanHandlerMemoryRequest,
          MEMORY_LIMIT: phases[phase].scanHandlerMemoryLimit,
          DB_SERVICE_NAME: phases[phase].dbServiceName,
        },
      }
    )
  );

  /*
  //only deploy on dev for Tracking PR
  if(phases[phase].phase === 'dev') {

    objects = objects.concat(oc.processDeploymentTemplate(`${templatesLocalBaseUrl}/templates/frontend/frontend-dc-others.yaml`, {
      'param': {
        'NAME': phases[phase].name,
        'SUFFIX': phases[phase].suffix,
        'VERSION': phases[phase].tag,
        'KEYCLOAK_AUTHORITY': phases[phase].frontendKeycloakAuthority,
        'KEYCLOAK_CLIENT_ID': phases[phase].frontendKeycloakClientId,
        'KEYCLOAK_CALLBACK_URL': phases[phase].frontendKeycloakCallbackUrl,
        'KEYCLOAK_LOGOUT_URL': phases[phase].frontendKeycloakLogoutUrl,
        'FRONTEND_HOST': phases[phase].frontendHost,
        'BACKEND_HOST': phases[phase].backendHost
      }
    }))

    objects = objects.concat(oc.processDeploymentTemplate(`${templatesLocalBaseUrl}/templates/notification/notification-server-others-dc.yaml`, {
      'param': {
        'NAME': phases[phase].name,
        'SUFFIX': phases[phase].suffix,
        'FRONTEND_HOST': phases[phase].frontendHost
      }
    }))  

  }

  //only deploy schemaspy for test and prod
  if(phases[phase].phase === 'test' || phases[phase].phase === 'prod') {
    objects = objects.concat(oc.processDeploymentTemplate(`${templatesLocalBaseUrl}/templates/schema-spy/schemaspy-dc.yaml`, {
      'param': {
        'NAME': phases[phase].name,
        'SUFFIX': phases[phase].suffix,
        'ENV_NAME': phases[phase].phase,
        'CPU_REQUEST_PUBLIC': phases[phase].schemaSpyPublicCpuRequest,
        'CPU_LIMIT_PUBLIC': phases[phase].schemaSpyPublicCpuLimit,
        'MEMORY_REQUEST_PUBLIC': phases[phase].schemaSpyPublicMemoryRequest,
        'MEMORY_LIMIT_PUBLIC': phases[phase].schemaSpyPublicMemoryLimit,
        'CPU_REQUEST_AUDIT': phases[phase].schemaSpyAuditCpuRequest,
        'CPU_LIMIT_AUDIT': phases[phase].schemaSpyAuditCpuLimit,
        'MEMORY_REQUEST_AUDIT': phases[phase].schemaSpyAuditMemoryRequest,
        'MEMORY_LIMIT_AUDIT': phases[phase].schemaSpyAuditMemoryLimit
      }
    }))
  }
*/
  oc.applyRecommendedLabels(
    objects,
    phases[phase].name,
    phase,
    `${changeId}`,
    phases[phase].instance
  );
  oc.importImageStreams(
    objects,
    phases[phase].tag,
    phases.build.namespace,
    phases.build.tag
  );
  oc.applyAndDeploy(objects, phases[phase].instance);
};
