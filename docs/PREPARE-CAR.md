# Prepare the car

For this lab, we use a customized Raspbian image based on the [Donkey Car](https://github.com/wroscoe/donkey) project. See [Debug](#debug) for details on how it was created.

## Connect to pi

1. Connect a TP-cable between your computer and the Pi.
2. On Linux, change/create the *wired connection* settings on your computer to *link-local*/*Share to other computers* or similar. On Ubuntu 17.10, you need to start the old network manager using `nm-connection-editor` in the console.
3. SSH is already enabled on the image, and a local IP-address is assigned to the Pi using DHCP as soon as the TP-cable is attached. You can now connect using default username and hostname, and password *pi*.

```bash
ssh pi@raspberrypi.local
```

If this doesn't work, try find the IP-address of the `pi` by e.g. looking in the DHCP leases table:

```bash
cat /var/lib/misc/dnsmasq.leases
```

## Configure Wifi and hostname

Make sure the pre-configured wifi settings in `/etc/wpa_supplicant/wpa_supplicant.conf` are correct by opening it in a editor, e.g:

```bash
sudo nano /etc/wpa_supplicant/wpa_supplicant.conf
```

It should look something similar to:

```bash
country=SE
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
update_config=1
network={
  ssid="JaywayGuest"
  psk="jaywayguest"
}
```

Next, update `hostname` to reflect your team name:
```bash
sudo nano /etc/hostname
sudo nano /etc/hosts
```

Reboot the pi
```bash
sudo reboot now
```

! TODO: find out WIFI IP after reboot
! TODO: share with other team members

## Calibration

The lab uses a python library called [Donkey](https://github.com/wroscoe/donkey) to drive and train the car:
- [https://github.com/wroscoe/donkey](https://github.com/wroscoe/donkey)

Its already installed in `/home/pi/donkey` and `/home/pi/d2`.

You need to calibrate the steering before it can drive properly, see:
- [http://docs.donkeycar.com/guide/calibrate/](http://docs.donkeycar.com/guide/calibrate/)

The library reference can be found here:
- [http://docs.donkeycar.com/utility/donkey](http://docs.donkeycar.com/utility/donkey)

## AWS IoT provisioning

### Create an SSH key for IoT onboarding

Create an RSA key for the IoT onboarding script:

```bash
ssh-keygen -t rsa -f ~/.ssh/robocar_rsa -N ''
```

Copy the public key to the car:
```bash
cat ~/.ssh/robocar_rsa.pub | ssh pi@<hostname>.local "cat >>.ssh/authorized_keys"
```

Don't forget to share the private key with the others in the team.

### Create a device certificate

The car needs a unique [AWS IoT device certificate](https://docs.aws.amazon.com/iot/latest/developerguide/x509-certs.html) to connect to AWS IOT service. Run the following script on your **host** machine:
```bash
cd <?>/robocar-rally-lab/provisioning
./create-device-cert.sh -d <your device/hostname>
```

The certs will automatically be copied to your device using the `SSH` key created in [Create an SSH key for IoT onboarding](#create-an-ssh-key-for-iot-onboarding).

There is a small *NodeJS* app pre-installed on the car that will publish a `hello` message on a particular topic in AWS IOT when it is able to connect to the AWS IoT service.

To verify that the car is properly configured, in the [AWS console](https://648414911232.signin.aws.amazon.com/console), in the IoT service left navigation pane, choose **Test**. Subscribe to the `DonkeyCar/hello` topic.

<img src="subscribe-button-topic.png" width="400"> 

Reboot the car.

You will find the app in the following path on the car:
```bash
/home/pi/iot/index.js
```

## Debug

### SD-card/Raspbian image

See [SD-card README](../sdcard/README.md)

### AWS IoT provisioning

- jobs
-- update SW:
--- apt-get update/upgrade
--- npn
- hello
   ```bash
   DonkeyCar/hello
   ```
