'use strict';

const Stage = require('./PipelineStage');

module.exports = class Gate extends Stage {
  constructor(name, options=undefined, callback=undefined){
    super(name, options, callback)
  }

  static create(){
    var args = Array.prototype.slice.call(arguments, 0)
    args.unshift(null)
    var clazz = Gate;
    var object = new (Function.prototype.bind.apply(clazz, args))
  
    //constructor.apply(object, args);
    if(this !== global && this != null){
      object._root=this._root
      object._previous = this
      this._next = object
    }else{
      object._root=object
    }
    return object;
  }
  isGate(){
    return true;
  }
} //end Gate
