'use strict';

module.exports = Object.freeze({
  KINDS: {
    LIST: 'List',
    BUILD: 'Build',
    BUILD_CONFIG: 'BuildConfig',
    IMAGE_STREAM: 'ImageStream',
    IMAGE_STREAM_TAG: 'ImageStreamTag',
    IMAGE_STREAM_IMAGE: 'ImageStreamImage',
    DEPLOYMENT_CONFIG:'DeploymentConfig'
  },
  ENV:{
    BUILD_HASH: '_BUILD_HASH'
  },
  LABELS:{
    TEMPLATE_HASH: 'template-hash',
    SOURCE_HASH: 'source-hash'
  },
  ANNOTATIONS: {
    TEMPLATE_HASH: 'template-hash',
    SOURCE_HASH: 'source-hash'
  },
  POD_PHASES: {
    PENDING: 'Pending',
    RUNNING: 'Running',
    SUCCEEDED :'Succeeded',
    FAILED: 'Failed',
    UNKNOWN: 'Unknown'
  }
});