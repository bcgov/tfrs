"use strict";
const { OpenShiftClientX } = require("@bcgov/pipeline-cli");
const path = require("path");
const KeyCloakClient = require('./keycloak');

module.exports = settings => {
  const phases = settings.phases;
  const options = settings.options;
  const phase = options.env;
  const changeId = phases[phase].changeId;
  const oc = new OpenShiftClientX(Object.assign({ namespace: phases[phase].namespace }, options));

  const templatesLocalBaseUrl = oc.toFileUrl(path.resolve(__dirname, "../../openshift-v4"));
  var objects = [];

  //The deployment of your cool app goes here ▼▼▼

  if(phases[phase].phase === 'dev') {
  
    //deploy Patroni
    objects = objects.concat(oc.processDeploymentTemplate(`${templatesLocalBaseUrl}/templates/patroni/deployment-prereq.yaml`, {
    'param': {
      'NAME': 'patroni',
      'SUFFIX': phases[phase].suffix
    }
    }))
    objects = objects.concat(oc.processDeploymentTemplate(`${templatesLocalBaseUrl}/templates/patroni/deployment.yaml`, {
      'param': {
        'NAME': 'patroni',
        'ENV_NAME': phases[phase].phase,
        'SUFFIX': phases[phase].suffix,
        'CPU_REQUEST': phases[phase].patroniCpuRequest,
        'CPU_LIMIT': phases[phase].patroniCpuLimit,
        'MEMORY_REQUEST': phases[phase].patroniMemoryRequest,
        'MEMORY_LIMIT': phases[phase].patroniMemoryLimit,
        'IMAGE_REGISTRY': 'image-registry.openshift-image-registry.svc:5000',
        'IMAGE_STREAM_NAMESPACE': phases[phase].namespace,
        'IMAGE_STREAM_TAG': 'patroni:v10-stable',
        'REPLICA': phases[phase].patroniReplica,
        'PVC_SIZE': phases[phase].patroniPvcSize,
        'STORAGE_CLASS': phases[phase].storageClass
      }
    }))

    //deploy rabbitmq, use docker image directly
    //POST_START_SLEEP is harded coded in the rabbitmq template, replacement was not successful
    objects = objects.concat(oc.processDeploymentTemplate(`${templatesLocalBaseUrl}/templates/rabbitmq/rabbitmq-cluster-dc.yaml`, {
      'param': {
        'NAME': phases[phase].name,
        'ENV_NAME': phases[phase].phase,
        'SUFFIX': phases[phase].suffix,
        'NAMESPACE': phases[phase].namespace,
        'CLUSTER_NAME': 'rabbitmq-cluster',
        'ISTAG': 'rabbitmq:3.8.3-management',
        'SERVICE_ACCOUNT': 'rabbitmq-discovery',
        'VOLUME_SIZE': phases[phase].rabbitmqPvcSize,
        'CPU_REQUEST': phases[phase].rabbitmqCpuRequest,
        'CPU_LIMIT': phases[phase].rabbitmqCpuLimit,
        'MEMORY_REQUEST': phases[phase].rabbitmqMemoryRequest,
        'MEMORY_LIMIT': phases[phase].rabbitmqMemoryLimit,
        'REPLICA': phases[phase].rabbitmqReplica,
        'POST_START_SLEEP': phases[phase].rabbitmqPostStartSleep,
        'STORAGE_CLASS': phases[phase].storageClass
      }
    }))
  }

  //deploy backend
  objects = objects.concat(oc.processDeploymentTemplate(`${templatesLocalBaseUrl}/templates/backend/backend-dc.yaml`, {
    'param': {
      'NAME': phases[phase].name,
      'SUFFIX': phases[phase].suffix,
      'ENV_NAME': phases[phase].phase,
      'NAMESPACE': phases[phase].namespace,
      'VERSION': phases[phase].tag,
      'KEYCLOAK_SA_BASEURL': phases[phase].backendKeycloakSaBaseurl,
      'KEYCLOAK_SA_CLIENT_ID': phases[phase].backendKeycloakSaClientId,
      'KEYCLOAK_SA_REALM': phases[phase].backendKeycloakSaRealm,
      'KEYCLOAK_AUDIENCE': phases[phase].backendKeycloakAudience,
      'KEYCLOAK_CERTS_URL': phases[phase].backendKeycloakCertsUrl,
      'KEYCLOAK_CLIENT_ID': phases[phase].backendKeycloakClientId,
      'KEYCLOAK_ISSUER': phases[phase].backendKeycloakIssuer,
      'KEYCLOAK_REALM':phases[phase].backendKeycloakRealm,
      'CPU_REQUEST':phases[phase].backendCpuRequest,
      'CPU_LIMIT':phases[phase].backendCpuLimit,
      'MEMORY_REQUEST':phases[phase].backendMemoryRequest,
      'MEMORY_LIMIT':phases[phase].backendMemoryLimit,
      'REPLICAS':phases[phase].backendReplicas
    }
  }))

  //deploy backend others
  objects = objects.concat(oc.processDeploymentTemplate(`${templatesLocalBaseUrl}/templates/backend/backend-dc-others.yaml`, {
    'param': {
      'NAME': phases[phase].name,
      'SUFFIX': phases[phase].suffix,
      'BACKEND_HOST_NAME':phases[phase].backendHostName
    }
  }))

  //deploy frontend
  objects = objects.concat(oc.processDeploymentTemplate(`${templatesLocalBaseUrl}/templates/frontend/frontend-dc-others.yaml`, {
    'param': {
      'NAME': phases[phase].name,
      'SUFFIX': phases[phase].suffix,
      'VERSION': phases[phase].tag,
      'KEYCLOAK_AUTHORITY': phases[phase].frontendKeycloakAuthority,
      'KEYCLOAK_CLIENT_ID': phases[phase].frontendKeycloakClientId,
      'KEYCLOAK_CALLBACK_URL': phases[phase].frontendKeycloakCallbackUrl,
      'KEYCLOAK_LOGOUT_URL': phases[phase].frontendKeycloakLogoutUrl,
      'FRONTEND_HOST_NAME': phases[phase].frontendHostName
    }
  }))
  objects = objects.concat(oc.processDeploymentTemplate(`${templatesLocalBaseUrl}/templates/frontend/frontend-dc.yaml`, {
    'param': {
      'NAME': phases[phase].name,
      'SUFFIX': phases[phase].suffix,
      'VERSION': phases[phase].tag,
      'CPU_REQUEST': phases[phase].frontendCpuRequest,
      'CPU_LIMIT': phases[phase].frontendCpuLimit,
      'MEMORY_REQUEST': phases[phase].frontendMemoryRequest,
      'MEMORY_LIMIT': phases[phase].frontendMemoryLimit,
      'REPLICAS':phases[phase].frontendReplicas
    }
  }))

  //deploy celery
  objects = objects.concat(oc.processDeploymentTemplate(`${templatesLocalBaseUrl}/templates/celery/celery-dc.yaml`, {
    'param': {
      'NAME': phases[phase].name,
      'SUFFIX': phases[phase].suffix,
      'VERSION': phases[phase].tag,
      'ENV_NAME': phases[phase].phase,
      'NAMESPACE': phases[phase].namespace,
      'CPU_REQUEST': phases[phase].celeryCpuRequest,
      'CPU_LIMIT': phases[phase].celeryCpuLimit,
      'MEMORY_REQUEST': phases[phase].celeryMemoryRequest,
      'MEMORY_LIMIT': phases[phase].celeryMemoryLimit
    }
  })) 

  //deploy notification server
  objects = objects.concat(oc.processDeploymentTemplate(`${templatesLocalBaseUrl}/templates/notification/notification-server-others-dc.yaml`, {
    'param': {
      'NAME': phases[phase].name,
      'SUFFIX': phases[phase].suffix
    }
  }))

  //deploy notification server
  objects = objects.concat(oc.processDeploymentTemplate(`${templatesLocalBaseUrl}/templates/notification/notification-server-dc.yaml`, {
    'param': {
      'NAME': phases[phase].name,
      'SUFFIX': phases[phase].suffix,
      'NAMESPACE': phases[phase].namespace,
      'VERSION': phases[phase].tag,
      'KEYCLOAK_CERTS_URL': phases[phase].backendKeycloakCertsUrl,
      'CPU_REQUEST':phases[phase].notificationServerCpuRequest,
      'CPU_LIMIT':phases[phase].notificationServerCpuLimit,
      'MEMORY_REQUEST':phases[phase].notificationServerMemoryRequest,
      'MEMORY_LIMIT':phases[phase].notificationServerMemoryLimit
    }
  }))
 
  //deploy scan coordinator
  objects = objects.concat(oc.processDeploymentTemplate(`${templatesLocalBaseUrl}/templates/scan-coordinator/scan-coordinator-dc.yaml`, {
    'param': {
      'NAME': phases[phase].name,
      'SUFFIX': phases[phase].suffix,
      'NAMESPACE': phases[phase].namespace,
      'VERSION': phases[phase].tag,
      'ENV_NAME': phases[phase].phase,
      'CPU_REQUEST':phases[phase].scanCoordinatorCpuRequest,
      'CPU_LIMIT':phases[phase].scanCoordinatorCpuLimit,
      'MEMORY_REQUEST':phases[phase].scanCoordinatorMemoryRequest,
      'MEMORY_LIMIT':phases[phase].scanCoordinatorMemoryLimit
    }
  }))

  //deploy scan handler
  objects = objects.concat(oc.processDeploymentTemplate(`${templatesLocalBaseUrl}/templates/scan-handler/scan-handler-dc.yaml`, {
    'param': {
      'NAME': phases[phase].name,
      'SUFFIX': phases[phase].suffix,
      'NAMESPACE': phases[phase].namespace,
      'VERSION': phases[phase].tag,
      'CPU_REQUEST':phases[phase].scanHandlerCpuRequest,
      'CPU_LIMIT':phases[phase].scanHandlerServerCpuLimit,
      'MEMORY_REQUEST':phases[phase].scanHandlerServerMemoryRequest,
      'MEMORY_LIMIT':phases[phase].scanHandlerServerMemoryLimit
    }
  }))
 
  //deploy schemaspy
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

  oc.applyRecommendedLabels(
    objects,
    phases[phase].name,
    phase,
    `${changeId}`,
    phases[phase].instance,
  );
  oc.importImageStreams(objects, phases[phase].tag, phases.build.namespace, phases.build.tag);
  oc.applyAndDeploy(objects, phases[phase].instance);
};
