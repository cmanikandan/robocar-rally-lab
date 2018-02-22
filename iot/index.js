'use strict';

const jobsModule = require('aws-iot-device-sdk').jobs;

const RebootHandler = require('./handlers/reboot-handler');

const configPath = process.env.IOT_CONFIG_PATH || '/home/pi/certs/config.json'
const { Host, Port, Region, ThingName, ThingTypeName, CaCert, ClientCert, PrivateKey } = require(configPath);

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
    console.log(`${ThingName} connected to https://${Host}:${Port}`);
    
    shadow.publish(HelloTopic, JSON.stringify({ Name: ThingName }));
    console.log(`${ThingName} published its name to '${HelloTopic}'`);
  });

  jobs.on('close', () => {
    console.log('close');
  });

  jobs.on('reconnect', () => {
    console.log('reconnect');
  });

  jobs.on('offline', () => {
    console.log('offline');
  });

  jobs.on('error', (error) => {
    console.log('error', error);
  });

  jobs.on('message', (topic, payload) => {
    console.log(`message ${JSON.stringify(payload)} received on ${topic}`);
  });

  jobs.subscribeToJobs(ThingName, 'reboot', RebootHandler.handle);
}

if (require.main === module) {
  run();
}