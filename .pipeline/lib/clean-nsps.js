"use strict";
const { OpenShiftClientX } = require("@bcgov/pipeline-cli");
const KeyCloakClient = require('./keycloak');

const getTargetPhases = (env, phases) => {
  let target_phase = [];
  for (const phase in phases) {
    if (env.match(/^(all|transient)$/) && phases[phase].transient) {
      target_phase.push(phase);
    } else if (env === phase) {
      target_phase.push(phase);
      break;
    }
  }

  return target_phase;
};

module.exports = settings => {
  const phases = settings.phases;
  const options = settings.options;
  const oc = new OpenShiftClientX(Object.assign({ namespace: phases.build.namespace }, options));
  const target_phases = getTargetPhases(options.env, phases);

  target_phases.forEach(k => {
    if (phases.hasOwnProperty(k)) {

      const phase = phases[k];
      oc.namespace(phase.namespace);
      
      //remove all custom security policies create for specific pull request
      const nsps = oc.get("networksecuritypolicies", {
        selector: `app=${phase.name}${phase.suffix}`,
        namespace: phase.namespace,
      });   
      nsps.forEach(nsp => {
        oc.delete([`networksecuritypolicy/${nsp.metadata.name}`], {
            "ignore-not-found": "true",
            wait: "true",
            namespace: phase.namespace,
          });       
      });

    }
  });
};
