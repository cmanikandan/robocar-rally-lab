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

3. First thing after boot is to configure wifi. A new and easy way of connecting w.o. the need of a monitor/keyboard or local wifi router is to use direct ethernet connection:

   1. Connect a TP-cable between your computer and the Pi.
   2. SSH is already enabled on the image, and a local IP-address is assigned to the Pi using DHCP as soon as the TP-cable is attached. You can now connect using default hostname, user and password:

   ```bash
   ssh pi@raspberrypi.local
   ```
   3. What to do now??

- wifi (/etc/wpa_supplicant/wpa_supplicant.conf)
----
country=US
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
update_config=1

network={
    ssid="<your network name>"
    psk="<your password>"
}
-----
network={
	ssid="YourNetworkSSID"
	psk="Your Network's Passphrase"
	key_mgmt=WPA-PSK
}
------
https://unix.stackexchange.com/questions/278946/hiding-passwords-in-wpa-supplicant-conf-with-wpa-eap-and-mschap-v2
------
4. Hostname
sudo vi /media/userID/UUID/etc/hostname
sudo vi /media/userID/UUID/etc/hosts
5. Install donkey/d2
- cert??? jit???
- d2 config (after job?)
http://docs.donkeycar.com/guide/install_software/
6. Start driving
7. calibration!
http://docs.donkeycar.com/guide/get_driving/