'use strict';

// https://github.com/aws/aws-iot-device-sdk-js
const thingShadow = require('aws-iot-device-sdk').thingShadow;
const { Host, Port, Region, ClientId, ThingName, ThingTypeName, CaCert, ClientCert, PrivateKey } = require('/home/pi/certs/config.json');

function run() {
  const shadow = thingShadow({
    keyPath: PrivateKey,
    certPath: ClientCert,
    caPath: CaCert,
    clientId: ClientId,
    region: Region,
    host: Host,
    port: Port
  });

  shadow.on('connect', function() {
    console.log(`${ThingName} connected to https://${Host}:${Port}`);

    shadow.register(ThingName);
    console.log(`${ThingName} registered in Thing Registry`);
    
    const helloTopic = `${ThingTypeName}/hello`;
    shadow.publish(helloTopic, JSON.stringify({ Name: ThingName }));
    console.log(`${ThingName} published its name to '${helloTopic}'`);
  });

  shadow.on('error', function(error) {
    console.log('error', error);
  });

  shadow.on('delta', function(thingName, stateObject) {
    console.log(`received delta on ${thingName}:${JSON.stringify(stateObject)}`);
  });
 
  shadow.on('timeout', function(thingName, clientToken) {
    console.warn('timeout: ' + thingName + ', clientToken=' + clientToken);
  });
}

if (require.main === module) {
  run();
}