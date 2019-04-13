'use strict';

const path = require('path');
const OpenShiftResourceSelector = require('./OpenShiftResourceSelector')
const OpenShiftStaticSelector = require('./OpenShiftStaticSelector')
const isPlainObject = require('lodash.isplainobject');
const isString = require('lodash.isstring');
const isArray = Array.isArray;
const {spawn, spawnSync} = require('child_process');
const util = require('./util')
const debug = require('debug')
//Array.isArray

const isOpenShiftList = require('./isOpenShiftList')

const logger = {
  info: debug('info:OpenShiftClient'),
  trace: debug('trace:OpenShiftClient')
}

function appendCommandArg(prefix, item, result){
  if (item instanceof Array){
    item.forEach((subitem)=>{
      appendCommandArg(prefix, subitem, result)
    })
  }else if (!((item instanceof String) || (typeof item === "string")) && item instanceof Object){
    for (var prop in item) {
      if(!item.hasOwnProperty(prop)) continue;
      appendCommandArg(`${prefix}=${prop}`, item[prop], result)
    }
  }else{
    result.push(`${prefix}=${item}`)
  }
}

/**
 * 
 * 
 * https://github.com/openshift/jenkins-client-plugin/blob/master/src/main/resources/com/openshift/jenkins/plugins/OpenShiftDSL.groovy
 */

module.exports = class OpenShiftClient {
  constructor(options){
    const self=this
    this.globalArgs = {}
    this.options = {}

    if (options){
      this.options = Object.assign(this.options, options)
      if (options.namespace) this.globalArgs.namespace=options.namespace
      if (options.cwd) this._cwd=options.cwd
      //TODO:read/override from process.arguments
    }

    var argv=process.argv.slice(2)
    argv.forEach(function(value){
      if (value.startsWith('--')){
        value=value.substr(2)
        const sep= value.indexOf('=')
        const argName=value.substring(0, sep)
        const argValue=value.substring(sep+1)
        self.options[argName]=argValue
      }
    })

    if (this._cwd == null){
      this._cwd = spawnSync('git', ['rev-parse', '--show-toplevel'], {encoding:'utf-8'}).stdout.trim()
    }
    var gitBranchName = spawnSync('git', ['name-rev','--name-only','HEAD'], {encoding:'utf-8'}).stdout.trim()
    var gitBranchRef = spawnSync('git', ['config', `branch.${gitBranchName}.merge`], {encoding:'utf-8'}).stdout.trim()
    var gitRemoteName = 'origin'
    var gitRemoteUri = spawnSync('git', ['config','--get',`remote.${gitRemoteName}.url`], {encoding:'utf-8'}).stdout.trim()

    this.git = this.git || {}

    Object.assign(this.git, {
      branch:gitBranchName,
      ref: gitBranchRef,
      uri: gitRemoteUri,
      http_url: gitRemoteUri.replace(/((https:\/\/github\.com\/)|(git@github.com:))([^/]+)\/(.*)/, 'https://github.com/$4/$5'),
      owner: gitRemoteUri.replace(/((https:\/\/github\.com\/)|(git@github.com:))([^/]+)\/(.*)/, '$4'),
      repository: gitRemoteUri.replace(/((https:\/\/github\.com\/)|(git@github.com:))([^/]+)\/([^\.]+)\.git/, '$5')
    })

    if (this.options.pr){
      this.git['pull_request'] = this.options.pr
      this.git['ref'] = `refs/pull/${this.git['pull_request']}/head`
    }
    this.git['branch_ref'] = this.git['ref']
  }

  namespace(ns){
    if (typeof ns != 'undefined' && ns !=null){
      this.globalArgs.namespace=ns;
    }
    return this.globalArgs.namespace
  }

  cwd(){
    return this._cwd
  }

  /**
   * 
   * @param {string} verb 
   * @param {string|Object} verbArgs 
   * @param {Object} userArgs 
   * @param {Object} overrideArgs 
   */
  buildCommonArgs(verb, verbArgs, userArgs, overrideArgs){
    if (userArgs!=null && !isPlainObject(userArgs)) throw new Error("Expected 'userArgs' to be plain object")
    if (overrideArgs!=null && !isPlainObject(overrideArgs)) throw new Error("Expected 'userArgs' to be plain object")

    var _args ={}
    Object.assign(_args, this.globalArgs)
    if (userArgs!=null){
      Object.assign(_args, userArgs)
    }
    if (isPlainObject(verbArgs) && verbArgs.namespace){
      _args.namespace=verbArgs.namespace
      delete verbArgs.namespace
    }

    if (overrideArgs!=null){
      Object.assign(_args, overrideArgs)
    }
    
    var args = []
    if (_args.namespace){
      args.push(`--namespace=${_args.namespace}`)
      delete _args.namespace
    }
    args.push(verb)
    if (isArray(verbArgs)){
      args.push( ... verbArgs)
    }else if (isPlainObject(verbArgs)){
      args.push( ... this.toCommandArgsArray(verbArgs))
    }else if (isString(verbArgs)){
      args.push(verbArgs)
    }

    args.push(... this.toCommandArgsArray(_args))
    return args
  }

  _actionAsync(args, input){
    const self = this;
    //console.log(`> ${JSON.stringify(args)}`)
    logger.trace('>',  ['oc'].concat(args).join(' '))
    //logger.trace('ocSpawn', ['oc'].concat(cmdArgs).join(' '))
    const _options = {encoding:'utf-8'};
    if (self.cwd()){
      _options.cwd=self.cwd()
    }
    const startTime = process.hrtime();
    if (input!=null){
      _options.input=input
    }
    const proc = spawn('oc', args, _options)

    return proc
  }

  _action(args, input){
    const proc = this._rawAction(args, input)
    if (proc.status != 0){
      throw new Error(`command: ${['oc'].concat(args).join(' ')}\nstderr:${proc.stderr}`)
    }
    return proc
  }

  _rawAction(args, input){
    const self = this;
    //console.log(`> ${JSON.stringify(args)}`)
    logger.trace('>',  ['oc'].concat(args).join(' '))
    //logger.trace('ocSpawn', ['oc'].concat(cmdArgs).join(' '))
    const _options = {encoding:'utf-8'};
    if (self.cwd()){
      _options.cwd=self.cwd()
    }
    const startTime = process.hrtime();
    if (input!=null){
      _options.input=input
    }
    const proc = spawnSync('oc', args, _options)
    const duration = process.hrtime(startTime);
    logger.info(['oc'].concat(args).join(' '),` # (${proc.status}) [${duration[0]}s]`)

    return proc
  }

  splitNamesUsingArgs(string, args){
    const namespace = args.find(item => { return item.startsWith('--namespace=')}).substr('--namespace='.length)
    return this.splitNames(string, namespace)
  }
  splitNames(string, namespace){
    let trimmed=string.trim()
    if (trimmed.length > 0){
      const names=trimmed.split(/\n/);
      if (names.length > 0 && namespace != null){
        //const namespace = args.find(item => { return item.startsWith('--namespace=')}).substr('--namespace='.length)
        for (var i =0; i< names.length; i++){
          names[i] = namespace+'/'+names[i]
        }
      }
      return names
    }
    return []
  }

  _actionReturningName(args){
    const proc = this._action(args)
    const names=this.splitNamesUsingArgs(proc.stdout, args)
    return new OpenShiftStaticSelector(this, names)
  }

  _actionReturningName2(args){
    const proc = this._rawAction(args)
    const names=this.splitNamesUsingArgs(proc.stdout, args)
    return new OpenShiftStaticSelector(this, names)
  }
  
  get(object, args){
    return this.objectDefAction('get', object, Object.assign({output:'json'}, args || {}))
  }
  
  /**
   * 
   * @param {string[]} args 
   */
  raw(verb, verbArgs, userArgs){
    var args = this.buildCommonArgs(verb, verbArgs, userArgs)
    return this._action(args)
  }
  
  rawAsync(verb, verbArgs, userArgs){
    var args = this.buildCommonArgs(verb, verbArgs, userArgs)
    return this._actionAsync(args)
  }
  /**
   * Given a list of objects, return their names (namespace/name)
   * @param {} objects 
   */
  //TODO: names(objects){ }
  object(name, args){
    return this.objects([name], args)[0]
  }
  objects(names, args){
    var result = []
    var namespaces = {}
    names.forEach((name)=>{
      var _parsed = util.parseName(name)
      var namespace = _parsed.namespace || this.namespace()
      namespaces[namespace] = namespaces[namespace] || []
      namespaces[namespace].push(util.name(_parsed))
    })

    for (var namespace in namespaces) {
      var _names=namespaces[namespace]
      var items = this.objectDefAction('get', _names, Object.assign({output:'json', namespace:namespace}, args || {}))
      result.push(... items)
    }

    return result
  }

  /**
   * returns (array)
   */
  unwrapOpenShiftList(object){
    const result = []
    if (isPlainObject(object)){
      if (object.kind !== 'List'){
        result.push(object)
      }else if (object.items){
        result.push(...object.items)
      }
    }else{
      throw new Error("Not Implemented")
    }
    return result;
  }
  wrapOpenShiftList(object){
    var list = this._emptyListModel()
    if (isArray(object)){
      list.items.push(...object)
    }else{
      list.items.push(object)
    }
    return list
  }
  serializableMap(jsonString){
    return JSON.parse(jsonString)
  }

  toNamesList(object_or_list){
    if (isArray(object_or_list)){
      var names= []
      for (var i=0; i< object_or_list.length; i++){
        var item=object_or_list[i]
        names.push(`${item.kind}/${item.metadata.name}`)
      }
      return names
    }else if (isPlainObject(object_or_list)){
      if (object_or_list.kind === 'List'){
        if (object_or_list.items != null){
          return this.toNamesList(object_or_list.items)
        }else{
          return []
        }
      }else{
        return [`${object_or_list.kind}/${object_or_list.metadata.name}`]
      }
    }
    throw new Error("Not Implemented")
  }
  //TODO: toSingleObject(){}

  /**
   * @returns {OpenShiftResourceSelector}
   * @param {String|String[]} kind
   * @param {String|Object} qualifier
   */
  selector(kind, qualifier){
    return new OpenShiftResourceSelector(this, 'selector', kind, qualifier)
  }

  /**
   * 
   * @param {string} template URL (http, https, or file), or template name
   * @param {Object} args
   * @returns {OpenShiftResourceSelector}
   * 
   */
  process(template, args){
    if ( typeof(template) !== 'string') throw new Error("Expected string")
    if (util.isUrl(template)){
      var proc = this._action(this.buildCommonArgs('process', ['-f', this.toFilePath(template)], args, {'output':'json'}))
      return this.unwrapOpenShiftList(this.serializableMap(proc.stdout))
      //this.buildCommonArgs('process', ['-f', this.toFilePath(template)], args, {output:'json'})
    }else{
      throw new Error("Not Implemented")
      //return this.objectDefAction('process', object, args)
    }
  }

  objectDefAction(verb, object, userArgs){
    if ( !isString(object) && !isPlainObject(object) && !isArray(object)){
      throw new Error("Expected string, plain object, or array")
    }
    if (verb === 'get' && userArgs!=null && userArgs.output == 'json'){
      let list=this._emptyListModel()
      list.items=object
      let args = this.buildCommonArgs(verb, object, userArgs, {})
      let proc = this._action(args)
      proc.stdout = proc.stdout.trim()
      if (proc.stdout == null || proc.stdout.length ==0){
        return this.unwrapOpenShiftList(this._emptyListModel())
      }else{
        return this.unwrapOpenShiftList(JSON.parse(proc.stdout))
      }
      
    }else if (verb === 'get' && userArgs!=null && userArgs.output!= null &&  userArgs.output.startsWith('jsonpath')){
      var args = this.buildCommonArgs(verb, object, userArgs, {})
      var proc = this._action(args)
      return proc.stdout.trim().split('\n')
    }else if (verb === 'start-build'){
      var args = this.buildCommonArgs(verb, object, userArgs, {'output':'name'})
      logger.info(`Starting new build: ${args.join(' ')}`)
      return this._actionReturningName(args)
    }else if (verb === 'get' || verb === 'delete' || verb === 'start-build' || verb === 'process'){
      return this._actionReturningName(this.buildCommonArgs(verb, object, userArgs, {'output':'name'}))
    }else if ((verb === 'apply' || verb === 'create') && isArray(object)){

      var list=this._emptyListModel()
      list.items=object
      var ignoreExitStatus=false
      if (userArgs && userArgs['ignore-exit-status'] !=null){
        ignoreExitStatus=userArgs['ignore-exit-status']
        delete userArgs['ignore-exit-status']
      }
      var args = this.buildCommonArgs(verb, ['-f', '-'], userArgs, {'output':'name'})
      var proc = null;
      if (ignoreExitStatus){
        proc=this._rawAction(args, JSON.stringify(list))
      }else{
        proc=this._action(args, JSON.stringify(list))
      }
      
      const names=this.splitNamesUsingArgs(proc.stdout, args)
      return new OpenShiftStaticSelector(this, names)
    }else if (verb === 'tag' && isArray(object)){
      //[0] is the source
      //[1+] is the targets
      var args = this.buildCommonArgs(verb, object, userArgs, {})
      var proc = this._action(args)
    }else if ((verb === 'create' || verb === 'replace') && isString(object) && util.isUrl(object)){
      if (userArgs['ignore-exit-status'] === true){
        delete userArgs['ignore-exit-status']
        return this._actionReturningName2(this.buildCommonArgs(verb, {filename:this.toFilePath(object)}, userArgs, {'output':'name'}))
      }
      return this._actionReturningName(this.buildCommonArgs(verb, {filename:this.toFilePath(object)}, userArgs, {'output':'name'}))
    }else if (verb === 'cancel-build'){
      return this._actionReturningName(this.buildCommonArgs(verb, object, userArgs))
    }else{
      throw new Error("Not Implemented")
    }
  }

  async startBuild(object, args){
    if (isArray(object)){
      var promises = []
      for (var i =0; i< object.length; i++){
        var item = object[i]
        promises.push(Promise.resolve(item).then(result => {
          return this.startBuild(result, args)
        }))
      }
      var results = await Promise.all(promises)

      return results
    }else if (isPlainObject(object)){
      var _args = Object.assign({namespace:object.metadata.namespace}, args)
      return this.objectDefAction('start-build', util.name(object), _args)
    }else if (isString(object)){
      var _parsed = util.parseName(object)
      return this.objectDefAction('start-build', util.name(_parsed), Object.assign({namespace:_parsed.namespace || this.namespace()}, args))
    }
  }

  cancelBuild(object, args){
    return this.objectDefAction('cancel-build', object, args)
  }
  
  //TODO: watch(){}
  create(object, args){
    return this.objectDefAction('create', object, args)
  }
  createIfMissing(object, args){
    return this.objectDefAction('create', object, Object.assign({'ignore-exit-status':true}, args))
  }
  waitForImageStreamTag(tag){
    let istag = {}
    let start = process.hrtime()

    while(((istag.image || {}).metadata || {}).name == null){
      let istags = this.objects([`ImageStreamTag/${tag}`], {'ignore-not-found':'true'})
      if (istags.length > 0){
        istag=istags[0]
      }
      if (process.hrtime(start)[0] > 60){
        throw new Error(`Timeout waiting for ImageStreamTag/${tag} to become available`)
      }
    }
  }
  apply(object, args){
    const result = this.objectDefAction('apply', object, args)
    let imageStreamTags = new Map()
    object.forEach((item)=>{
      if (item.kind === 'ImageStream'){
        (item.spec.tags || []).forEach((tag)=>{
          this.waitForImageStreamTag(`${item.metadata.name}:${tag.name}`)
        })
        
      }
    })
    return result;
  }
  replace(object, args){
    return this.objectDefAction('replace', object, args)
  }
  delete(object, args){
    return this.objectDefAction('delete', object, args)
  }
  //patch(){}

  //Pass-through
  simplePassthrough(verb, args){
    throw new Error('Not Implemented')
  }

  /**
   * Create and run a particular image, possibly replicated.
   * @param {*} args 
   */
  run(args){ return this.simplePassthrough('run', args)}

  /**
   * Execute a command in a container.
   * @param {*} args 
   */
  exec(args){ return this.simplePassthrough('exec', args)}

  rsh(args){ return this.simplePassthrough('rsh', args)}
  rsync(args){ return this.simplePassthrough('rsync', args)}
  /**
   * 
   * @param {*} objects  An array where the first one ([0]) is the source tag.
   * @param {*} args 
   */
  tag(objects, args){
    return this.objectDefAction('tag', objects, args);
  }

  //Utilities
  toFileUrl(str){
    if (typeof str !== 'string') {
      throw new Error('Expected a string');
    }

    var pathName = path.resolve(str).replace(/\\/g, '/');

    // Windows drive letter must be prefixed with a slash
    if (pathName[0] !== '/') {
      pathName = '/' + pathName;
    }

    return encodeURI('file://' + pathName);
  }

  toFilePath(string){
    if (string.startsWith('file://')){
      return string.substr('file://'.length)
    }
    return string
  }

  toCommandArgsArray(args){
    if (isArray(args)) return args;
    const result=[]
    for (var prop in args) {
      // skip  loop if the property is from prototype
      if(!args.hasOwnProperty(prop)) continue;
      var value=args[prop]
      if (value !== undefined){
        appendCommandArg(`--${prop}`, value, result)
      }
    }
    return result
  }

  _emptyListModel(){
    return {apiVersion:'v1', kind:'List', metadata:{}, items:[]}
  }
}
