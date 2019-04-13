'use strict';
const OpenShiftResourceSelector = require('./OpenShiftResourceSelector')

module.exports = class OpenShiftStaticSelector extends OpenShiftResourceSelector {
  constructor(client, names){
    super(client, 'static', names)
  }
}