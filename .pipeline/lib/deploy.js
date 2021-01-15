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

  console.log(phases[phase].frontendHostName)
  // The deployment of your cool app goes here ▼▼▼

  /*
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
  */

/*
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
*/

/*
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
      'MEMORY_LIMIT':phases[phase].backendMemoryLimit
    }
  }))
*/



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
