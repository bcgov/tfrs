'use strict';

const Stage = require('./PipelineStage')
const Gate = require('./PipelineGate')

const fs = require('fs');

module.exports = class Pipeline {
  constructor(stages){
    this.stages=stages
    this.cache={}
    this.options={}

    var self = this
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
  }
  setStageState(stage, key, value){
    var _cache= this.cache[stage._path] || {}
    _cache[key]=value
    this.cache[stage._path]= _cache
  }
  getStageState(stage, key){
    var _cache= this.cache[stage._path] || {}
    this.cache[stage._path]= _cache
    if (key ==null ) return _cache
    return _cache[key]
  }
  setStageOutput(stage, output){
    this.setStageState(stage, 'output', output)
  }
  getStageOutput(stage){
    return this.getStageState(stage, 'output')
  }
  restoreState(){
    const stateFilePath = "pipeline.state.json"
    if (fs.existsSync(stateFilePath)) {
      var stateFileContent = fs.readFileSync(stateFilePath, {encoding:'utf-8'});
      Object.assign(this.cache, JSON.parse(stateFileContent))
    }
  }
  saveState(){
    const stateFilePath = "pipeline.state.json"
    var json = JSON.stringify(this.cache, null, 2);
    fs.writeFileSync(stateFilePath, json, {encoding:'utf-8'}); 
  }
  saveStages(stages){
    const stateFilePath = "pipeline.stages.json"
    var keys = stages.keys()
    let key = keys.next();
    var result = {}
    while (!key.done) {
      result[key.value]={}
      key = keys.next();
    }
    var json = JSON.stringify(result, null, 2);
    fs.writeFileSync(stateFilePath, json, {encoding:'utf-8'}); 
  }
  runStage(stage){
    const pipeline = this
    var promises =[]
    if (stage.steps !=null){
      if (!(stage.steps instanceof Array)){
        if (stage._gates !=null){
          //console.log(`Gated by ${stage._gates}`)
          for (var i = 0; i < stage._gates.length; i++) {
            var result = pipeline.getStageOutput(stage._gates[i])
            //console.log(`result:${result}`)
            if (result==null || result !== true){
              stage.skip = true
              break
            }
          }
        }

        if (stage.skip === false ){
          console.log(`Scheduling ${stage.name}`)
          var previousResult = pipeline.getStageOutput(stage)
          if (previousResult !=null){
            console.log(`Reusing previous output for ${stage.name}`)
            promises.push(Promise.resolve(previousResult))
          }else{
            if (stage.isGate()){
              //
              if (fs.existsSync('pipeline.input.json')) {
                fs.renameSync('pipeline.input.json', `pipeline.state.${stage.name}.json`)
              }
              var input = undefined

              if (fs.existsSync(`pipeline.state.${stage.name}.json`)) {
                var inputFileContent = fs.readFileSync(`pipeline.state.${stage.name}.json`, {encoding:'utf-8'});
                input = JSON.parse(inputFileContent)
              }

              promises.push(new Promise(function(resolve, reject) {
                //state.active[stage._path] = true
                const startTime = process.hrtime()
                pipeline.setStageState(stage, 'start', startTime)
                stage.steps(input, stage, resolve, reject)
                pipeline.setStageState(stage, 'duration', process.hrtime(startTime))
                //delete state.active[stage._path]
              }).then(result=>{
                pipeline.setStageOutput(stage, result);
                pipeline.saveState()
              }).catch(()=>{
                pipeline.setStageOutput(stage, undefined);
                pipeline.saveState()
              }))
            }else{
              promises.push(new Promise(function(resolve, reject) {
                //state.active[stage._path] = true
                const startTime = process.hrtime()
                pipeline.setStageState(stage, 'start', startTime)
                stage.steps(stage, resolve, reject)
                pipeline.setStageState(stage, 'duration', process.hrtime(startTime))
                //delete state.active[stage._path]
              }).then(result=>{
                pipeline.setStageOutput(stage, result);
                pipeline.saveState()
              }))
            }
          }
        }else{
          console.log(`Skipping ${stage.name}`)
          pipeline.setStageOutput(stage, undefined);
          pipeline.saveState()
        }
      }else{
        stage.steps.forEach(subStage =>{
          var head = subStage
          //rewind to first stage in the chain
          while(head._previous != null) {
            head = head._previous
          }
          if (head.skip === false){
            promises.push(this.runStage(head))
          }
        })
      }
    }
    return Promise.all(promises).then(result => {
      if (stage._next != null){
        this.runStage(stage._next)
      }
    }).catch(reason => {
      console.log(`Error: ${reason}`)
      process.exit(1)
    })
  }// end run
  async run(){
    const separator = '.'
    var _stages = new Map()
    var _last = this.stages; //tail
    var _fist = this.stages; //head

    //rewind to first stage in the chain
    while(_fist._previous != null) {
      _fist = _fist._previous
    }
    var _root = _fist

    var collect = (stage)=>{
      stage._root = _root
      if (stage._parent != null){
        stage._path = stage._parent._path + separator + stage.name
      }
      _stages.set(stage._path, stage)

      if (stage.steps instanceof Array){
        stage.steps.forEach(subStage =>{
          var head = subStage
          head._parent=stage
  
          //rewind to first stage in the chain
          while(head._previous != null) {
            head = head._previous
            head._parent=stage
          }
          collect(head)
        })
      }

      if (stage._next !=null){
        collect(stage._next)
      }

      if (stage.isGate()){
        var next = stage._next
        while(next!=null){
          next._gates = next._gates || []
          next._gates.push(stage)
          next = next._next
        }
      }

    }
  
    collect(_fist)

    this.restoreState()
    this.saveStages(_stages)
    
    if (this.options.run !== 'false'){
      await this.runStage(_fist)
    }
    
    //save state
    //this.saveState()
  }
} //end Pipeline