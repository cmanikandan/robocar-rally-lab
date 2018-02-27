'use strict';

const jobsModule = require('aws-iot-device-sdk').jobs;

const EchoHandlerModule = require('./handlers/echo-handler');
const RebootHandlerModule = require('./handlers/reboot-handler');

const configPath = process.env.IOT_CONFIG_PATH || '/home/pi/certs/config.json';
const {
  Host, Port, Region, ClientId, ThingName, ThingTypeName, CaCert, ClientCert, PrivateKey
/* eslint-disable-next-line */
} = require(configPath);

const logger = require('./common/logger');

const HelloTopic = `${ThingTypeName}/hello`;

function run() {
  const jobs = jobsModule({
    keyPath: PrivateKey,
    certPath: ClientCert,
    caPath: CaCert,
    clientId: ClientId,
    region: Region,
    host: Host,
    port: Port,
    debug: true
  });

  const EchoHandler = EchoHandlerModule({ jobs, ThingTypeName, ThingName });
  const RebootHandler = RebootHandlerModule();

  jobs.on('connect', () => {
    logger.info({ host: Host, port: Port, thing: ThingName }, 'Connected to IoT service');

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

  jobs.subscribeToJobs(ThingName, EchoHandler.Operation, EchoHandler.handle);
  jobs.subscribeToJobs(ThingName, RebootHandler.Operation, RebootHandler.handle);
}

if (require.main === module) {
  run();
}
