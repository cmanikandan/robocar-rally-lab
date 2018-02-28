'use strict';

const aws = require('aws-iot-device-sdk');

const echo = require('./handlers/echo-handler');
const reboot = require('./handlers/reboot-handler');

const jobsServiceCreator = require('./services/jobsservice');
const iotServiceCreator = require('./services/iotservice');

const log = require('./common/log');

const configPath = process.env.IOT_CONFIG_PATH || '/home/pi/certs/config.json';
const {
  Host, Port, Region, ClientId, ThingName, ThingTypeName, CaCert, ClientCert, PrivateKey
/* eslint-disable-next-line */
} = require(configPath);

function main() {
  const logger = log.createLogger({ level: 'debug' });

  const client = aws.jobs({
    keyPath: PrivateKey,
    certPath: ClientCert,
    caPath: CaCert,
    clientId: ClientId,
    region: Region,
    host: Host,
    port: Port,
    debug: true
  });

  const JobsService = jobsServiceCreator(client, ThingName, logger);
  const IotService = iotServiceCreator(client, Host, Port, ThingName, ThingTypeName, logger);

  const EchoHandler = new echo.EchoHandler({
    thingName: ThingName,
    thingTypeName: ThingTypeName,
    iotService: IotService,
    jobsService: JobsService,
    logger
  });

  const RebootHandler = new reboot.RebootHandler({
    jobsService: JobsService,
    logger
  });

  JobsService.registerHandler(EchoHandler);
  JobsService.registerHandler(RebootHandler);
  JobsService.start();
}

if (require.main === module) {
  main();
}
