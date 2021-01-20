'use strict';
const phases = require('./lib/config.js')
const deploy = require('./lib/deploy.js')
const options= require('pipeline-cli').Util.parseArguments()

deploy({phases:phases, options:options})
