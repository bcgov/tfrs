'use strict';
const isFunction = require('lodash.isfunction');

module.exports = class Stage {
  /**
   * {name, description, callback, stages, options}
   * @param {*} name 
   * @param {*} options 
   * @param {*} callback 
   */
  constructor(name, options=undefined, callback=undefined){
    if (isFunction(options) || options instanceof Array) {
      callback=options
      options=undefined
    }
  
    if (name == null) throw Error("name cannot be null or undefined")
    if (name.indexOf('.')>=0) throw Error("name cannot contain dot(.)")
    this.name=name;
    this.steps=callback;
    this.options=options || {}
    this._path = name
    this.skip=false

    //console.log(`creating '${name}'`)
    if (this.steps instanceof Array){
      for (var i=0; i < this.steps.length; i++){
        var step= this.steps[i]
        step._parent=this
      }
    }
  }
  static create(){
    var args = Array.prototype.slice.call(arguments, 0)
    args.unshift(null)
    var clazz = Stage;
    var object = new (Function.prototype.bind.apply(clazz, args))
  
    //constructor.apply(object, args);
    object._root=object
    
    return object; 
  }
  then (){
    var args = Array.prototype.slice.call(arguments, 0)
    args.unshift(null)
    var clazz = Stage;
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
    return false;
  }
} // end stage