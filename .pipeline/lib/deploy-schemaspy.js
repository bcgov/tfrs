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
