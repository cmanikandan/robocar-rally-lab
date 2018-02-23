'use strict';

const jobsModule = require('aws-iot-device-sdk').jobs;

const RebootHandler = require('./handlers/reboot-handler');
const logger = require('./common/logger');

const configPath = process.env.IOT_CONFIG_PATH || '/home/pi/certs/config.json';
/* eslint-disable import/no-dynamic-require */
const {
  Host, Port, Region, ThingName, ThingTypeName, CaCert, ClientCert, PrivateKey
} = require(configPath);

const HelloTopic = `${ThingTypeName}/hello`;

function run() {
  const jobs = jobsModule({
    keyPath: PrivateKey,
    certPath: ClientCert,
    caPath: CaCert,
    region: Region,
    host: Host,
    port: Port,
    debug: true
  });

  jobs.on('connect', () => {
    logger.info({ host: Host, port: Port, thing: ThingName }, 'Connected IoT service');

    jobs.publish(HelloTopic, JSON.stringify({ Name: ThingName }));
    logger.debug({ thing: ThingName, topic: HelloTopic }, 'Published message');
  });

  jobs.on('close', () => {
    logger.info({ thing: ThingName }, 'Connection closed');
  });

  jobs.on('reconnect', () => {
    logger.debug({ thing: ThingName }, 'Reconnecting to IoT service');
  });

  jobs.on('offline', () => {
    logger.debug({ thing: ThingName }, 'Offline');
  });

  jobs.on('error', (error) => {
    logger.error({ error, thing: ThingName }, 'Connection error');
  });

  jobs.on('message', (topic, payload) => {
    logger.debug({ topic, payload }, 'Received new message');
  });

  jobs.subscribeToJobs(ThingName, RebootHandler.Operation, RebootHandler.handle);
}

if (require.main === module) {
  run();
}
