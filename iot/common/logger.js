'use strict';

const bunyan = require('bunyan');
const uuidv4 = require('uuid/v4');

module.exports = {
  createLogger: ({ level } = { level: 'info' }) => {
    const uuid = uuidv4();
    const logger = bunyan.createLogger({
      name: 'iot',
      correlationId: uuid,
      streams: [{
        stream: process.stdout,
        level
      }]
    });
    return logger;
  }
};
