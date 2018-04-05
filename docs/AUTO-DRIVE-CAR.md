# Autonomous driving

Time to test the self driving feature of a `Donkey` car.

## Using a sample model

To get started, we've provided you with a (not particulary good) sample model. Download the model from s3:

```bash
aws s3 cp s3://jayway-robocar-raw-data/samples/sample-model .
```

Copy it to the car:
```bash
scp sample-model pi@<you car>.local:/home/pi/d2/models/sample-model
```

Start the car using the model:
```bash
python3 manage.py drive --model ~/d2/models/sample-model
```

See [Donkey docs](http://docs.donkeycar.com/guide/train_autopilot/) for more details.

### Test the model in the simulator

The simulator is a fast way of testing if your model is completely broken or not. It allows you to run the model in a simulated Donkey car on your local computer.

In the [ML Track](../README.md#the-ml-track), you'll get familiar with the [Donkey Simulator](http://docs.donkeycar.com/guide/simulator/). Either ask your team-mate doing the *ML Track* if he/she can show you, or follow the documentation in the link above.

## Recording training data and using a real model

It's now time to start recording your own training data by driving the car around the track manually. If you use the default configuration, the car will start a new recording (*Tub*) when the car starts moving (`throttle != 0`).

Recording data is a joint effort between you (the car expert) and your team-mate doing the [ML Track](../README.md#the-ml-track)(the ML expert). When he/she is ready, you'll teach each other the basics of what you've learned, and start record data for a first model.

Some general advice when building the first model is to have arount 5-10 minutes of training data, to examine (and clean if necessary) the data well using the `Donkey` tools, to make sure that lightning isn't too bright (creates reflections), and that furniture that looks like the car track (like chair legs) are removed.

Uploading data to SageMaker is easiest to do by copying the *Tubs* to your local computer, then upload to a `S3` bucket that SageMaker can read from.

Downloading the model is the reversed process.

Good luck =)