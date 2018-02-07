'use strict';

// https://github.com/aws/aws-iot-device-sdk-js
const thingShadow = require('aws-iot-device-sdk').thingShadow;
const os = require('os-utils');

const { Host, Port, Region, ClientId, ThingName, ThingTypeName, CaCert, ClientCert, PrivateKey } = require('/home/pi/certs/config.json');

const HelloTopic = `${ThingTypeName}/hello`;
const ReportTopic = `${ThingTypeName}/${ThingName}`

let interval = 0;

function top() {
  console.log(`Reporting stats to ${ReportTopic}`);
  const memPercentage = os.freememPercentage() * 100;
  os.cpuUsage((cpuPercentage) => {
    const data = {
      cpu: cpuPercentage * 100,
      mem: memPercentage * 100
    };
    shadow.publish(ReportTopic, JSON.stringify(data));
    console.log(`${ThingName} published ${data} to '${HelloTopic}'`);
  });
}

function run() {
  const shadow = thingShadow({
    keyPath: PrivateKey,
    certPath: ClientCert,
    caPath: CaCert,
    clientId: ClientId,
    region: Region,
    host: Host,
    port: Port,
    debug: true
  });

  shadow.on('connect', () => {
    console.log(`${ThingName} connected to https://${Host}:${Port}`);
    
    shadow.publish(HelloTopic, JSON.stringify({ Name: ThingName }));
    console.log(`${ThingName} published its name to '${HelloTopic}'`);

    console.log('Starting metric loop');
    interval = setInterval(top, 1000);
  });

  shadow.on('close', () => {
    console.log('Stopping metric loop');
    clearInterval(interval);
    interval = 0;
  });

  shadow.on('error', (error) => {
    console.log('error', error);
  });

  shadow.on('delta', (thingName, stateObject) => {
    console.log(`received delta on ${thingName}:${JSON.stringify(stateObject)}`);
  });
 
  shadow.on('timeout', (thingName, clientToken) => {
    console.warn('timeout: ' + thingName + ', clientToken=' + clientToken);
  });
}

if (require.main === module) {
  run();
}