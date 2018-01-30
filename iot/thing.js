'use strict';

const thingShadow = require('aws-iot-device-sdk').thingShadow;
const { Host, Port, ClientId, ThingName, CaCert, ClientCert, PrivateKey} = require('./args.json')

function validateArgument(objs) {
  objs.forEach((obj) => {
    const argName = Object.keys(obj)[0];
    if (typeof (obj[argName]) === 'undefined') {
      console.log(`${argName} be specified`);
      process.exit(1);
    }
  });
}

function run() {
  
    const thingShadows = thingShadow({
       keyPath: args.privateKey,
       certPath: args.clientCert,
       caPath: args.caCert,
       clientId: args.clientId,
       region: args.region,
       baseReconnectTimeMs: args.baseReconnectTimeMs,
       keepalive: args.keepAlive,
       protocol: args.Protocol,
       port: args.Port,
       host: args.Host,
       debug: args.Debug
    });
    //
    // Register a thing name and listen for deltas.  Whatever we receive on delta
    // is echoed via thing shadow updates.
    //
    thingShadows.register(args.thingName, {
       persistentSubscribe: true
    });
 
    thingShadows
       .on('error', function(error) {
          console.log('error', error);
       });
 
    thingShadows
       .on('delta', function(thingName, stateObject) {
          console.log('received delta on ' + thingName + ': ' +
             JSON.stringify(stateObject));
          thingShadows.update(thingName, {
             state: {
                reported: stateObject.state
             }
          });
       });
 
    thingShadows
       .on('timeout', function(thingName, clientToken) {
          console.warn('timeout: ' + thingName + ', clientToken=' + clientToken);
       });
 }

module.exports = cmdLineProcess;

if (require.main === module) {
   cmdLineProcess('Report metrics to the AWS IoT service',
      process.argv.slice(2), processTest, ' ', true);
}