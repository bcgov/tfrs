'use strict';
const options= require('pipeline-cli').Util.parseArguments()
const changeId = options.pr //aka pull-request
const version = '10'
const name = 'patroni'

const phases = {
  build: {namespace:'bcgov-tools' , name: `${name}`, phase: 'build', changeId:changeId, suffix: `-build-${changeId}`, instance: `${name}-build-${changeId}`, tag:`v${version}-${changeId}`},
   test: {namespace:`bcgov`,        name: `${name}`, phase: 'test' , changeId:changeId, suffix: '-test'             , instance: `${name}-test`             , tag:`v${version}-latest`},
   prod: {namespace:`bcgov`,        name: `${name}`, phase: 'prod' , changeId:changeId, suffix: ''                  , instance: `${name}-prod`             , tag:`v${version}-stable`}
}

module.exports = exports = phases
