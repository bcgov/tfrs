'use strict';

const debug = require('debug')

module.exports = function(name){
  return  {
    warn: debug(`info:${name}`),
    info: debug(`info:${name}`),
    trace: debug(`trace:${name}`)
  }
}