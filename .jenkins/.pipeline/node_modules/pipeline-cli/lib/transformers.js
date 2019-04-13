'use strict';
/**
 * A module that offers a thin wrapper over `oc` command
 * @module oc-helper
 */
const path = require('path');
const fs = require('fs');
const CONSTANTS = require('./constants')
const {spawnSync} = require('child_process');
const logger = require('./logger')('transformers')
const util = require('./util.js')

function transformers (client) {
  return {
    ENSURE_METADATA: (resource)=>{
      resource.metadata = resource.metadata || {}
      resource.metadata.labels = resource.metadata.labels || {}
      resource.metadata.annotations = resource.metadata.annotations || {}

      if (resource.kind === CONSTANTS.KINDS.BUILD_CONFIG) {
        resource.status = resource.status || {}
        resource.status.lastVersion = resource.status.lastVersion || 0
      }
    },
    ENSURE_METADATA_NAMESPACE: (resource, container)=>{
      resource.metadata.namespace = resource.metadata.namespace || container.namespace || client.namespace()
    },
    ADD_CHECKSUM_LABEL: (resource)=>{
      resource.metadata.labels[CONSTANTS.LABELS.TEMPLATE_HASH] = util.hashObject(resource)
    },
    REMOVE_BUILD_CONFIG_TRIGGERS: (resource)=>{
      if (resource.kind === CONSTANTS.KINDS.BUILD_CONFIG) {
        if (resource.spec.triggers && resource.spec.triggers.length > 0){
          logger.warn(`'${resource.kind}/${resource.metadata.name}' .spec.triggers are being removed and will be managed by this build script`)
        }
        resource.spec.triggers = []
      }
    },
    ADD_SOURCE_HASH: (resource)=>{
      //logger.trace(`cwd:${client.cwd()}`)
      if (resource.kind === CONSTANTS.KINDS.BUILD_CONFIG) {
        //ugly way of guarantee safe navigation (nullable object within a path. e.g.: `resource.spec.source`)
        var contextDir=(((resource || {}).spec || {}).source || {}).contextDir || ''
        var sourceHash = null;
        if (resource.spec.source.type === 'Git'){
          let branchName = 'HEAD'
          let revParseRef = `${branchName}:${contextDir}`
          let repositoryDir = client.cwd()
          
          //if it is referencing a repository that is not the current one, clone it to temporary location
          logger.info(`source.git.uri = '${resource.spec.source.git.uri}' git.uri = '${client.git.uri}'`)
          if (resource.spec.source.git.uri !== client.git.http_url){
            branchName= resource.spec.source.git.ref || 'master'
            repositoryDir = `/tmp/${util.hashString(resource.spec.source.git.uri)}`
            revParseRef = `${branchName}:${contextDir}`

            if (!fs.existsSync(repositoryDir)) {
              util.execSync('git', ['init',  '-q', `${repositoryDir}`], {cwd:'/tmp', encoding:'utf-8'})
              util.execSync('git', ['remote','add','origin',resource.spec.source.git.http_url], {cwd:repositoryDir, encoding:'utf-8'})
              util.execSync('git', ['fetch','--depth','1','--no-tags','--update-shallow','origin',`${branchName}:${branchName}`], {cwd:repositoryDir, encoding:'utf-8'})
              util.execSync('git', ['checkout', `${branchName}`], {cwd:repositoryDir})
            }else{
              util.execSync('git', ['clean',  '-fd'], {cwd:repositoryDir})
              util.execSync('git', ['fetch', '--depth', '1', '--no-tags', '--update-shallow', 'origin', `${branchName}`], {cwd:repositoryDir})
              util.execSync('git', ['checkout', `${branchName}`], {cwd:repositoryDir})
            }
          }
          //git tree-hash is more stable than commit-hash
          const gitRevParseResult = util.execSync('git', ['rev-parse', revParseRef], {cwd:repositoryDir, encoding:'utf-8'})
          sourceHash = gitRevParseResult.stdout.toString().trim()
        }else if (resource.spec.source.type === 'Binary'){
          var rootWorkDir = util.execSync('git', ['rev-parse', '--show-toplevel'], {'cwd':client.cwd()}).stdout.toString().trim()
          var absoluteContextDir=path.join(rootWorkDir, contextDir)
          logger.trace(`contextDir:${contextDir} \t absoluteContextDir:${absoluteContextDir}`)
          var hashes=[]

          //find . -type f -exec git hash-object -t blob --no-filters '{}' \;
          var walk=(start, basedir)=>{
            var stat = fs.statSync(start);
            if (stat.isDirectory()) {
              var files=fs.readdirSync(start)
              files.forEach((name)=>{
                walk(path.join(start, name), basedir)
              })
            }else{
              var hash = util.execSync('git', ['hash-object', '-t', 'blob', '--no-filters', start], {'cwd':client.cwd()}).stdout.toString().trim()
              hashes.push({'name':start.substr(basedir.length + 1), 'hash':hash})
            }
          }

          //collect hash of all files
          walk(absoluteContextDir, absoluteContextDir)
          //sort array to remove any OS/FS specific ordering
          hashes.sort((a,b) =>{
            if (a.name < b.name)
              return -1;
            if (a.name > b.name)
              return 1;
            return 0;
          });
          //console.dir(hashes)
          sourceHash = util.hashObject(hashes)
        }else if (resource.spec.source.type === 'Dockerfile' && resource.spec.strategy.type === 'Docker'){
          sourceHash = util.hashObject(resource.spec.source)
        }else{
          throw new Error("Not Implemented")
        }

        //logger.trace(`sourceHash:${sourceHash} (${contextDir})`)
        resource.metadata.labels[CONSTANTS.LABELS.SOURCE_HASH] = sourceHash;
      }
    }
  }
}

module.exports = exports = transformers
