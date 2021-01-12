'use strict';
const {OpenShiftClientX} = require('pipeline-cli')
const path = require('path');

module.exports = (settings)=>{
  const phases=settings.phases
  const oc=new OpenShiftClientX({'namespace':phases.build.namespace});
  const phase='build'
  var objects = []
  var git_http_url = oc.git.http_url
  //git_http_url = 'https://github.com/BCDevOps/platform-services.git'

  objects = objects.concat(oc.processDeploymentTemplate(oc.toFileUrl(path.resolve(__dirname, '../../openshift/build.yaml')), {
    'param':{
      'NAME': phases[phase].name,
      'SUFFIX': phases[phase].suffix,
      'VERSION': phases[phase].tag,
      'GIT_URI': git_http_url,
      'GIT_REF': oc.git.ref
    }
  }))

  oc.applyRecommendedLabels(objects, phases[phase].name, phase, phases[phase].changeId, phases[phase].instance)
  oc.applyAndBuild(objects)
}