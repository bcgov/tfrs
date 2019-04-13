'use strict';
const isPlainObject = require('lodash.isplainobject');

module.exports = (object)=>{
  return (object !=null && isPlainObject(object) && object.kind === 'List')
}
