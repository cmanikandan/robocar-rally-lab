# Donkey image

We've created a slimmed down version of the [donkey image](http://docs.donkeycar.com/faq/#how-do-i-create-my-own-raspberry-pi-disk).

Donkey image location (S3):
- [s3://robocar-rally-lab/donkey.img](s3://robocar-rally-lab/donkey.img)

Base image:
- [2017-11-29-raspbian-stretch-lite.zip](http://downloads.raspberrypi.org/raspbian_lite/images/raspbian_lite-2017-12-01/2017-11-29-raspbian-stretch-lite.zip)

All software should already be installed, but the instructions can be handy if you're debugging or developing new features:
- [install.sh](install.sh)

The following is already configured on the customized Raspbian image in [donkey.img]():
- Locale (en_US.UTF8)
- Change default password to `pi`
- Enable **SSH**
- Enable **camera** interface
- Enable **I2C** interface
- Enable **wifi** (Jayway guest). Should be verified in next section.