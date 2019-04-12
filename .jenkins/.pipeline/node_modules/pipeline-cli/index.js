const Util = require('./lib/util')
const Pipeline = require('./lib/Pipeline')
const PipelineStage = require('./lib/PipelineStage')
const PipelineGate = require('./lib/PipelineGate')

const OpenShiftClient = require('./lib/OpenShiftClient')
const OpenShiftClientX = require('./lib/OpenShiftClientX')

PipelineStage.prototype.gate = PipelineGate.create

module.exports = {
  Util: Util,
  Pipeline : Pipeline,
  PipelineStage : PipelineStage,
  PipelineGate : PipelineGate,
  OpenShiftClient : OpenShiftClient,
  OpenShiftClientX : OpenShiftClientX
}
