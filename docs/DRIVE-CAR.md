# Driving the car manually

Mastering the manual control of the car is one of the keys to victory. Producing good training data for the [deep learning network](../README.md#the-ml-track) is crucial, and much depends on how smooth and steady you drive your car. That being said, many things affect the quality of the training data, and you as a team must work together to figure out what actions to take to improve your data.

You'll use the default (and only) `donkeycar` setup to drive the car.

## Driving
### Donkey library API

This section is mostly informational

The lab uses a python library called [Donkey](https://github.com/wroscoe/donkey) to drive and train the car:
- [https://github.com/wroscoe/donkey](https://github.com/wroscoe/donkey)

The library reference can be found here:
- [http://docs.donkeycar.com/utility/donkey](http://docs.donkeycar.com/utility/donkey)

### Using the on-car webserver to control the car

The easiest way is simply to follow the instructions on the Donkey site:
- [http://docs.donkeycar.com/guide/get_driving/](http://docs.donkeycar.com/guide/get_driving/)

### Using the IOS App (RoboRemote) to control the car

We've created a BLE app for IOS you can use for driving. It's available on [TestFlight](https://itunes.apple.com/se/app/testflight/id899247664?mt=8).

1. Install [TestFlight](https://itunes.apple.com/se/app/testflight/id899247664?mt=8)
2. Get invite from Jayway TestFlight admins (they need your email address)
3. Install RoboRemote
4. Start the application, and find your car in the list.

The car runs a BLE service which will broadcast with a name that includes the `hostname` you configured in the previous steps, so it should be easy to find. Once connected, you need to start your car with the `joystick` flag turned on:

```bash
# Run this command in the ~/d2 dir on the car
python3 manage.py drive --js
```

Note! When joystick is used, the webserver is not, so you cannot follow the video stream in the browser.

## Next

[Autonomous driving](AUTO-DRIVE-CAR.md)