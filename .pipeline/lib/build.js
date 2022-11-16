"use strict";
const { OpenShiftClientX } = require("@bcgov/pipeline-cli");
const path = require("path");

module.exports = settings => {
  const phases = settings.phases;
  const options = settings.options;
  const oc = new OpenShiftClientX(Object.assign({ namespace: phases.build.namespace }, options));
  const phase = "build";
  let objects = [];
  const templatesLocalBaseUrl = oc.toFileUrl(path.resolve(__dirname, "../../openshift-v4"));

  // The building of your cool app goes here ▼▼▼
  // build frontend
  console.log( oc.git.http_url);
  console.log( oc.git.ref);

/*
  //build backend
  objects = objects.concat(oc.processDeploymentTemplate(`${templatesLocalBaseUrl}/templates/backend/backend-bc.yaml`, {
    'param':{
      'NAME': 'tfrs',
      'SUFFIX': phases[phase].suffix,
      'VERSION': phases[phase].tag,
      'GIT_URL': oc.git.http_url,
      'GIT_REF': oc.git.ref
    }
  }))
*/
/*
  //build frontend
  objects = objects.concat(oc.processDeploymentTemplate(`${templatesLocalBaseUrl}/templates/frontend/frontend-angular-app-bc.yaml`, {
    'param':{
      'NAME': phases[phase].name,
      'SUFFIX': phases[phase].suffix,
      'VERSION': phases[phase].tag,
      'GIT_URL': oc.git.http_url,
      'GIT_REF': oc.git.ref
    }
  }))

  objects = objects.concat(oc.processDeploymentTemplate(`${templatesLocalBaseUrl}/templates/frontend/frontend-bc-docker.yaml`, {
    'param':{
      'NAME': phases[phase].name,
      'SUFFIX': phases[phase].suffix,
      'VERSION': phases[phase].tag,
      'GIT_URL': oc.git.http_url,
      'GIT_REF': oc.git.ref
    }
  }))

*/

 //build celery
 objects = objects.concat(oc.processDeploymentTemplate(`${templatesLocalBaseUrl}/templates/celery/celery-bc.yaml`, {
  'param':{
    'NAME': phases[phase].name,
    'SUFFIX': phases[phase].suffix,
    'VERSION': phases[phase].tag,
    'GIT_URL': oc.git.http_url,
    'RELEASE_BRANCH': phases[phase].releaseBranch
  }
}))

/*
//build notification server
 objects = objects.concat(oc.processDeploymentTemplate(`${templatesLocalBaseUrl}/templates/notification/notification-server-bc.yaml`, {
  'param':{
    'NAME': phases[phase].name,
    'SUFFIX': phases[phase].suffix,
    'VERSION': phases[phase].tag,
    'GIT_URL': oc.git.http_url,
    'GIT_REF': oc.git.ref
  }
}))
*/
/*
//build scan coordinator server
 objects = objects.concat(oc.processDeploymentTemplate(`${templatesLocalBaseUrl}/templates/scan-coordinator/scan-coordinator-bc.yaml`, {
  'param':{
    'NAME': phases[phase].name,
    'SUFFIX': phases[phase].suffix,
    'VERSION': phases[phase].tag,
    'GIT_URL': oc.git.http_url,
    'GIT_REF': oc.git.ref
  }
}))

//build scan handler server
objects = objects.concat(oc.processDeploymentTemplate(`${templatesLocalBaseUrl}/templates/scan-handler/scan-handler-bc.yaml`, {
  'param':{
    'NAME': phases[phase].name,
    'SUFFIX': phases[phase].suffix,
    'VERSION': phases[phase].tag,
    'RELEASE_BRANCH': phases[phase].releaseBranch
  }
}))
*/
  oc.applyRecommendedLabels(
    objects,
    phases[phase].name,
    phase,
    phases[phase].changeId,
    phases[phase].instance,
  );
  oc.applyAndBuild(objects);
};
