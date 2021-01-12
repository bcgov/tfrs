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

      if(k === 'dev') {
        const kc = new KeyCloakClient(settings, oc);
        kc.removeUris();
      }

      let buildConfigs = oc.get("bc", {
        selector: `app=${phase.instance},env-id=${phase.changeId},!shared,github-repo=${oc.git.repository},github-owner=${oc.git.owner}`,
        namespace: phase.namespace,
      });
      buildConfigs.forEach(bc => {
        if (bc.spec.output.to.kind == "ImageStreamTag") {
          oc.delete([`ImageStreamTag/${bc.spec.output.to.name}`], {
            "ignore-not-found": "true",
            wait: "true",
            namespace: phase.namespace,
          });
        }
      });

      let deploymentConfigs = oc.get("dc", {
        selector: `app=${phase.instance},env-id=${phase.changeId},env-name=${k},!shared,github-repo=${oc.git.repository},github-owner=${oc.git.owner}`,
        namespace: phase.namespace,
      });
      deploymentConfigs.forEach(dc => {
        dc.spec.triggers.forEach(trigger => {
          if (
              trigger.type == "ImageChange" &&
              trigger.imageChangeParams.from.kind == "ImageStreamTag"
          ) {
            oc.delete([`ImageStreamTag/${trigger.imageChangeParams.from.name}`], {
              "ignore-not-found": "true",
              wait: "true",
              namespace: phase.namespace,
            });
          }
        });
      });

      //get all statefulsets before they are deleted
      const statefulsets = oc.get("statefulset", {
        selector: `app=${phase.instance},env-id=${phase.changeId},!shared,github-repo=${oc.git.repository},github-owner=${oc.git.owner}`,
        namespace: phase.namespace,
      });   

      oc.raw("delete", ["all"], {
        selector: `app=${phase.instance},env-id=${phase.changeId},!shared,github-repo=${oc.git.repository},github-owner=${oc.git.owner}`,
        wait: "true",
        namespace: phase.namespace,
      });
      oc.raw(
          "delete",
          ["pvc,Secret,configmap,endpoints,RoleBinding,role,ServiceAccount,Endpoints"],
          {
            selector: `app=${phase.instance},env-id=${phase.changeId},!shared,github-repo=${oc.git.repository},github-owner=${oc.git.owner}`,
            wait: "true",
            namespace: phase.namespace,
          },
      );

      //remove all the PVCs associated with each statefulset, after they get deleted by above delete all operation
      statefulsets.forEach(statefulset => {
        //delete PVCs mounted for statfulset
        oc.raw("delete", ["pvc"], {
          selector: `statefulset=${statefulset.metadata.name}`,
          "ignore-not-found": "true",
          wait: "true",
          namespace: phase.namespace,
        });
        /***
        //delete PVCs mounted in statfulset
        let statefulsetPVCs = oc.get("pvc", {
          selector: `statefulset=${statefulset.metadata.name}`,
          namespace: phase.namespace,
        });
        statefulsetPVCs.forEach(statefulsetPVC => {
          oc.delete([`pvc/${statefulsetPVC.metadata.name}`], {
            "ignore-not-found": "true",
            wait: "true",
            namespace: phase.namespace,
          });
        })
        ****/
        //delete configmaps create by patroni
        let patroniConfigmaps = oc.get("configmap", {
          selector: `app.kubernetes.io/name=patroni,cluster-name=${statefulset.metadata.name}`,
          namespace: phase.namespace,
        });
        if(Object.entries(patroniConfigmaps).length > 0) {
          oc.raw(
            "delete",
            ["configmap"],
            {
              selector: `app.kubernetes.io/name=patroni,cluster-name=${statefulset.metadata.name}`,
              wait: "true",
              "ignore-not-found": "true",
              namespace: phase.namespace,
            },
          );        
        }
      });

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
