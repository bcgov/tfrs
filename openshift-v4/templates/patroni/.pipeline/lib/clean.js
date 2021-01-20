'use strict';
const {OpenShiftClientX} = require('pipeline-cli')
const phases = require('./config')
const options= require('pipeline-cli').Util.parseArguments()

module.exports = (settings)=>{
  const oc=new OpenShiftClientX({'namespace':phases.build.namespace});
  const target_phase=options.env

  //console.log(`target_phase=${target_phase}`)

  for (var k in phases){
    if (phases.hasOwnProperty(k) && k != 'prod') {
      const phase=phases[k]
      if (k == target_phase){
        //console.log(`phase=${phase}`)
        oc.raw('delete', ['all'], {selector:`app-name=${phase.name},env-id=${phase.changeId},env-name!=prod,!shared,github-repo=${oc.git.repository},github-owner=${oc.git.owner}`, namespace:phase.namespace})
        oc.raw('delete', ['pvc,Secret,configmap,endpoints,RoleBinding,role,ServiceAccount,Endpoints'], {selector:`app-name=${phase.name},env-id=${phase.changeId},env-name!=prod,!shared,github-repo=${oc.git.repository},github-owner=${oc.git.owner}`, namespace:phase.namespace})
      }
    }
  }
}