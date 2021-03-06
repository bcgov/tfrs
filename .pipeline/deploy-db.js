'use strict';
const settings = require('./lib/config.js')
const task = require('./lib/deploy-db.js')

task(Object.assign(settings, { phase: settings.options.env}));
