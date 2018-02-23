'use strict';

const bunyan = require('bunyan');

const logger = bunyan.createLogger({ name: 'iot' });

module.exports = logger;
