'use strict';

const jobsModule = require('aws-iot-device-sdk').jobs;
const logger = require('bunyan');

const RebootHandler = require('./handlers/reboot-handler');

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
    logger.info({
      message: 'Connected IoT service',
      host: Host,
      port: Port,
      thing: ThingName
    });

    jobs.publish(HelloTopic, JSON.stringify({ Name: ThingName }));
    logger.debug({ message: 'Published message', thing: ThingName, topic: HelloTopic });
  });

  jobs.on('close', () => {
    logger.info({ message: 'Connection closed', thing: ThingName });
  });

  jobs.on('reconnect', () => {
    logger.debug({ message: 'Reconnecting to IoT service', thing: ThingName });
  });

  jobs.on('offline', () => {
    logger.debug({ message: 'Offline', thing: ThingName });
  });

  jobs.on('error', (error) => {
    logger.error({ message: 'Connection error', error, thing: ThingName });
  });

  jobs.on('message', (topic, payload) => {
    logger.debug({ message: 'Received new message', topic, payload });
  });

  jobs.subscribeToJobs(ThingName, RebootHandler.Operation, RebootHandler.handle);
}

if (require.main === module) {
  run();
}
