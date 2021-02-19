'use strict';
const {OpenShiftClientX} = require('pipeline-cli')


module.exports = (settings)=>{
  const phases=settings.phases
  const phase=settings.options.env
  const oc=new OpenShiftClientX({'namespace':phases[phase].namespace});
  
  oc.tag([`${phases.build.namespace}/${phases.build.name}:${phases.build.tag}`, `${phases[phase].namespace}/${phases[phase].name}:${phases[phase].tag}`])

}