# RobocarRally - lab

Compete agains your Jayway collegues in this AI-controlled car race.

You'll be divided up in 4 teams with 4 people per team. Each team will be given a `Robocar` to name and race with.

## Preparations

You should be familiar with at least some of the technologies listed below:

- Raspberry pi / Rasbian
- Bash
- Python
- Tensorflow / Keras
- AI/ML theory
- AWS IoT
- AWS SageMaker
- AWS CloudFormation

You'll need to do the following before starting the lab:

1. Create or re-use an AWS account for this lab. Make sure it is added to the Jayway organization for consolidated billing.
1. Give all team members access, i.e. create IAM users with proper permissions.
1. Each team member must set up the AWS CLI and be able to access the account both via the CLI and the web console.
1. Clone this repository.

## Instructions

### Prepare the car

![Donkey Car](http://www.donkeycar.com/uploads/7/8/1/7/7817903/donkey-car-graphic_orig.jpg)

These instructions are a condensed version of the [Donkey Car](http://docs.donkeycar.com/) installation.

1. Install [Etcher](https://etcher.io/) and copy the customized Raspbian image in `images/donkey.img` to the SD-card

![Etcher](https://etcher.io/static/screenshot.gif)

2. Install the SD-card in the car and boot it up.
