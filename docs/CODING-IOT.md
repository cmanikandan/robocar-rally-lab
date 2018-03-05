# Code IoT

The car uses the [Donkey](https://github.com/wroscoe/donkey) library to drive and train the car. The library runs an event loop that execute tasks called `parts`. Since much of the data that is interesting to the IoT backend flows through the library, this is where we need to \'hook in\'.

This part of the lab explains how to create a custom *Donkey library part*. See introduction here:

http://docs.donkeycar.com/parts/about/

## Environment

First, 

## First try


## Adding AWS IoT

There is a [service](../iot/index.js) written in *NodeJS* pre-installed on the car that initially will do the following:

- start on boot
- publish its `hostname` (i.e. car name) on the `Donkey/hello` AWS IOT topic when it is able to connect to the AWS IoT service.
- publish its cpu and memory statistics to the `Donkey/<car name>` topic every second.

To verify that the car is properly configured, in the [AWS console](https://648414911232.signin.aws.amazon.com/console), in the IoT service left navigation pane, choose **Test**. Subscribe to the `Donkey/hello` topic.

<img src="subscribe-button-topic.png" width="400"> 

## The next step is up to you

You can now modify the [IoT application](../iot/index.js) in any way you like.

### Suggestion: Add 'throttle' and 'steering angle'

A first suggestion to get started is to add *throttle* and *steering angle* to the report.

To simplify development, you can create a dummy IoT car to connect to AWS IoT.

#### Optional: Create and run a local IoT device for development

On your **host computer**, provision a new certificate for your local dev environment:
```bash
cd <robocar-rally-lab root>
./provisioning/create-device-cert.sh -d <a dummy name> -l <mydir>
```
where `<mydir>` is a directory on your computer where you want the x509 certificates and IoT config file to be created.

Next, start the [IoT application](../iot/index.js) using your new config file in `<mydir>/config.json`. You can specify the directory path using the `IOT_CONFIG_PATH` environment variable.
```bash
cd <robocar-rally-lab root>/iot
export IOT_CONFIG_PATH=<mydir>/config.json
npm run start
```

#### Adding 'throttle' and 'steering angle'

Add the following snippets to [index.js](../iot/index.js), either directly on your car, or on your development environment if you chose to set one up in the previous step.

Include the [gamepad](https://www.npmjs.com/package/gamepad) library:
```javascript
const gamepad = require('gamepad');
```

Create a reporting function that receives joystick events and reports them to AWS IoT:
```javascript
function createMove(shadow) {
  const move = (id, axis, value) => {
    const throttle = axis;
    const angle = value;
    shadow.publish(ReportTopic, JSON.stringify({ throttle, angle }));
  };
  return move;
}
```

Initialize [gamepad](https://www.npmjs.com/package/gamepad) and poll for joystick events every 500 ms:
```javascript
let gamepadInterval = 0;

shadow.on('connect', () => {
  console.log(`${ThingName} connected to https://${Host}:${Port}`);

  shadow.publish(HelloTopic, JSON.stringify({ Name: ThingName }));
  console.log(`${ThingName} published its name to '${HelloTopic}'`);

  gamepad.init();
  gamepad.on("move", createMove(shadow));
  gamepadInterval = setInterval(gamepad.processEvents, 500);
}
```

Clean up on disconnect:
```javascript
shadow.on('close', () => {
  console.log('Stopping metric loop');
  clearInterval(interval);
  interval = 0;

  clearInterval(gamepadInterval);
  gamepadInterval = 0;

  gamepad.shutdown();
});
```