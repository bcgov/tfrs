'use strict';

const crypto = require('crypto')
const isString = require('lodash.isstring');
const fs = require('fs');
const path = require('path');
const name_regex_pattern = '^(?:([^/]+?)\/)?(([^/]+?)\/(.*?))$'
const {spawnSync} = require('child_process');

const logger = {
  info: require('debug')('info:OpenShiftClient'),
  trace: require('debug')('trace:OpenShiftClient')
}

function hashString (itemAsString){
  var shasum = crypto.createHash('sha1');
  //var itemAsString = JSON.stringify(resource)
  shasum.update(`blob ${itemAsString.length + 1}\0${itemAsString}\n`);
  return shasum.digest('hex');
}

function hashObject (resource){
  //var shasum = crypto.createHash('sha1');
  var itemAsString = JSON.stringify(resource)
  //shasum.update(`blob ${itemAsString.length + 1}\0${itemAsString}\n`);
  return hashString(itemAsString)
}

const isUrl = (string)=>{
  const protocolAndDomainRE = /^(?:\w+)+:\/\/(\S+)$/;
  if (!isString(string)) return false
  var match = string.match(protocolAndDomainRE);
  if (!match) {
    return false;
  }
  return true;
}

function fullName (resource) {
  return resource.kind + '/' + resource.metadata.name
}

function getBuildConfigInputImages (bc) {
  var result = []
  var buildStrategy = bc.spec.strategy.sourceStrategy || bc.spec.strategy.dockerStrategy

  if (buildStrategy.from){
    result.push(buildStrategy.from)
  }

  if ((bc.spec.source || {}).images){
    var sourceImages= bc.spec.source.images
    sourceImages.forEach( sourceImage  => {
        result.push(sourceImage)
    })
  }

  return result
}

function normalizeKind (kind){
  if (kind === 'ImageStream'){
    return 'imagestream.image.openshift.io'
  }else if (kind === 'BuildConfig'){
    return 'buildconfig.build.openshift.io'
  }
  return kind
}

function _hashDirectory (dir) {
  var result= []
  var items=fs.readdirSync(dir).sort()

  items.forEach( item => {
    var fullpath=path.join(dir, item)
    var stat=fs.statSync(fullpath)
    if (stat.isDirectory()){
      result.push(..._hashDirectory(fullpath))
    }else{
      result.push(hashString(fs.readFileSync(fullpath)))
    }
  })
  return result
}

function hashDirectory (dir) {
  var items=_hashDirectory(dir);
  return hashObject(items)
}

function getBuildConfigStrategy(bc) {
  return bc.spec.strategy.sourceStrategy || bc.spec.strategy.dockerStrategy
}

function unsafeExecSync () {
  const ret=spawnSync.apply(null, arguments)
  logger.trace([arguments[0]].concat(arguments[1]).join(' '), ' - ', arguments[2], ' > ',ret.status)
  return ret
}

module.exports = {
  hashString:hashString,
  hashObject:hashObject,
  isUrl:isUrl,
  isString: isString,
  //TODO: shortName: (resource) => { return resource.metadata.name },
  parseName: (name, defaultNamespace) => {
    var result = new RegExp(name_regex_pattern, 'g').exec(name)
    return {
      namespace:result[1] || defaultNamespace,
      kind:result[3],
      name:result[4]
    }
  },
  name: (resource) => {
    if (resource.kind && resource.name) return normalizeKind(resource.kind) + '/' + resource.name
    return normalizeKind(resource.kind) + '/' + resource.metadata.name
  },
  fullName: (resource) => {
    if (resource.namespace && resource.kind && resource.name) return resource.namespace + '/' + normalizeKind(resource.kind) + '/' + resource.name
    return resource.metadata.namespace + '/' + normalizeKind(resource.kind) + '/' + resource.metadata.name
  },
  normalizeKind: normalizeKind,
  normalizeName: (name)=>{
    if (name.startsWith('ImageStream/')){
      return 'imagestream.image.openshift.io/'+name.substr('ImageStream/'.length)
    }else if (name.startsWith('BuildConfig/')){
      return 'buildconfig.build.openshift.io/'+name.substr('BuildConfig/'.length)
    }
    return name
  },
  getBuildConfigInputImages: getBuildConfigInputImages,
  getBuildConfigStrategy: getBuildConfigStrategy,
  hashDirectory:hashDirectory,
  getBuildConfigInputImages: (bc) => {
    var result = []
    var buildStrategy = getBuildConfigStrategy(bc)
  
    if (buildStrategy.from){
      result.push(buildStrategy.from)
    }
  
    if ((bc.spec.source || {}).images){
      var sourceImages= bc.spec.source.images
      sourceImages.forEach( sourceImage  => {
          result.push(sourceImage.from)
      })
    }

    return result
  },
  parseArguments: () => {
    var options = {}
    var argv=process.argv.slice(2)
    argv.forEach(function(value){
      if (value.startsWith('--')){
        value=value.substr(2)
        const sep= value.indexOf('=')
        const argName=value.substring(0, sep)
        const argValue=value.substring(sep+1)
        options[argName]=argValue
      }
    })
    return options
  },
  execSync:function() {
    const ret = unsafeExecSync.apply(null, arguments)
    if (ret.status !== 0){
      throw new Error(`Failed running '${arguments[0]} ${arguments[1].join(" ")}' as it returned ${ret.status}`)
    }
    return ret
  },
  unsafeExecSync: unsafeExecSync
}