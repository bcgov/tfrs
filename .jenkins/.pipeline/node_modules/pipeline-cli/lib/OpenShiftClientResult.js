'use strict';
const OpenShiftClient = require('./OpenShiftClient')

module.exports = class OpenShiftClientResult {
  /**
   * 
   * @param {OpenShiftClient} client 
   */
  constructor(client){
    this.client = client
  }
}