var assert = require('assert');
const {OpenShiftClientX} = require('pipeline-cli')
const {spawnSync} = require('child_process');
const path = require('path');

function randomstring(L) {
  var s = '';
  var randomchar = function() {
    var n = Math.floor(Math.random() * 62);
    if (n < 10) return n; //1-10
    if (n < 36) return String.fromCharCode(n + 55); //A-Z
    return String.fromCharCode(n + 61); //a-z
  }
  while (s.length < L) s += randomchar();
  return s;
}

describe('e2e2', function() {
  const namespace='a1b2c3d';//randomstring(6).toLowerCase()
  const buildNamespace = `${namespace}-tools`;
  const deployNamespace = `${namespace}-tools`;
  const oc=new OpenShiftClientX();
  let currentNamespace=""

  before(function() {
    currentNamespace=oc.raw('project', ['-q']).stdout
    console.log(`currentNamespace=${currentNamespace}`)
  });

  it(`delete project`, function(done) {
    this.timeout(20000)
    spawnSync('oc', ['delete', `project/${buildNamespace}`], {encoding:'utf8'})
    //oc.raw('delete', [`namespace/${buildNamespace}`])
    //assert.equal([1,2,3].indexOf(4), -1);
    setTimeout(function(){done()}, 5000)
  });

  it('create project', function() {
    currentNamespace=oc.raw('project', ['-q']).stdout
    console.log(`currentNamespace=${currentNamespace}`)
    oc.raw('create', ['namespace',buildNamespace])
    oc.raw('label', [`namespace/${buildNamespace}`, 'mocha=e2e', 'name=patroni'])
  });

  it('build', function() {
    this.timeout(60000)
    const build = require('../lib/build.js');
    const changeId=0;
    const _phase={name:'patroni', changeId:0}
    const settings={
      phases:{
        build:{
          namespace: buildNamespace,
          name:`${_phase.name}`,
          suffix:'-build',
          tag:`v10-${_phase.changeId}`,
          instance: `${_phase.name}-build-${_phase.changeId}`
        }
      }
    }
    build(settings)
    assert.equal([1,2,3].indexOf(4), -1);
  });

  it('deploy', function() {
    this.timeout(60000)
    const _phase={name:'patroni', changeId:0}
    const settings={
      phases:{
        build:{
          namespace: buildNamespace,
          name:`${_phase.name}`,
          suffix:'-build',
          tag:`v10-${_phase.changeId}`,
          instance: `${_phase.name}-build-${_phase.changeId}`,
          changeId: _phase.changeId
        },
        e2e:{
          namespace: deployNamespace,
          name:`${_phase.name}`,
          suffix:'-e2e',
          tag:`v10-${_phase.changeId}`,
          instance: `${_phase.name}-e2e-${_phase.changeId}`,
          changeId: _phase.changeId
        }
      }
    }
    const phases = settings.phases
    const phase = 'e2e'
    let objects =[]

    //Switch to Build Namespace
    oc.namespace(deployNamespace);

    objects = objects.concat(oc.processDeploymentTemplate(oc.toFileUrl(path.resolve(__dirname, '../../openshift/deployment-prereq.yaml')), {
      'param':{
        'NAME': `${phases[phase].name}-pgsql`,
        'SUFFIX': phases[phase].suffix,
        'APP_DB_USERNAME': 'rhsso',
        'APP_DB_NAME': 'rhsso'
      }
    }))

    objects = objects.concat(oc.processDeploymentTemplate(oc.toFileUrl(path.resolve(__dirname, '../../openshift/deployment.yaml')), {
      'param':{
        'NAME': `${phases[phase].name}-pgsql`,
        'SUFFIX': phases[phase].suffix,
        'INSTANCE': `${phases[phase].name}-pgsql${phases[phase].suffix}`,
        'IMAGE_STREAM_NAMESPACE': phases[phase].namespace,
        'OPENSHIFT_IMAGE_REGISTRY': '172.30.1.1:5000',
        'IMAGE_STREAM_TAG': `patroni:v10-${phases[phase].changeId}`
      }
    }))

    oc.applyRecommendedLabels(objects, phases[phase].name, phase, `${phases[phase].changeId}`, phases[phase].instance)

    objects.forEach((item)=>{
      if (item.kind == 'StatefulSet' && item.metadata.labels["app.kubernetes.io/name"] === "patroni"){
        oc.copyRecommendedLabels(item.metadata.labels, item.spec.selector.matchLabels)
        oc.copyRecommendedLabels(item.metadata.labels, item.spec.template.metadata.labels)
  
        item.spec.template.spec.containers.forEach((container)=>{
          container.env.forEach((env)=>{
            if (env.name === "PATRONI_KUBERNETES_LABELS"){
              var labels = JSON.parse(env.value)
              oc.copyRecommendedLabels(item.metadata.labels, labels)
              env.value = JSON.stringify(labels)
            }
          })
        })
      }
    })
    
    oc.importImageStreams(objects, phases[phase].tag, phases.build.namespace, phases.build.tag)
    oc.applyAndDeploy(objects, phases[phase].instance)

  });


  after(function() {
    //this.timeout(10000)
    //let p1=spawnSync('bash', ['-c', `oc delete "project/${buildNamespace}"`], {encoding:'utf8'})
    //console.dir(p1.output)
    /*
    return new Promise( (resolve) => {
      resolve(true)
    }).then((result)=>{
      return new Promise((resolve)=>{
        setTimeout(function(){
          resolve(true)
        }, 5000)
      })
    }).then((result)=>{
      let p2=spawnSync('oc', ['delete', `namespace/${buildNamespace}`], {encoding:'utf8'})
      console.dir(p2.output)
      done()
    });
    */
    //.finally(done)
    //setTimeout(function(){
      /*
      let p1=spawnSync('oc', ['delete', `namespace/${buildNamespace}`], {encoding:'utf8'})
      console.dir(p1.output)

      console.log(`previousNamespace=${currentNamespace}`)
      let p2=spawnSync('oc', ['project', currentNamespace], {encoding:'utf8'})
      console.dir(p2.output)
      oc.raw('delete', [`namespace/${buildNamespace}`])
      done()
      */
    //}, 5)
  })
});