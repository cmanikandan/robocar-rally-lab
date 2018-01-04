# Prepare the car

For this lab, we use a customized Raspbian image based on the [Donkey Car](https://github.com/wroscoe/donkey) project. See [Debug](#debug) for details on how it was created.

## Install sd-card

Install [Etcher](https://etcher.io/) and copy the customized Raspbian image in `images/donkey.img` to the SD-card, or use a tool like `dd`.

![Etcher](https://etcher.io/static/screenshot.gif)

Install the SD-card in the *Raspberry pi* and boot it up.

## Connect to pi

### Direct connect

A new and easy way of connecting w.o. the need of a monitor/keyboard or local wifi router is to use direct ethernet connection (it makes use of diffent techniques such as *Auto MDI-X*, *DHCP* and *IPv4 settings*) :

1. Connect a TP-cable between your computer and the Pi.
2. On Linux, change/create the *wired connection* settings on your computer to *link-local*/*Share to other computers* or similar. On Ubuntu 17.10, you need to start the old network manager using `nm-connection-editor` in the console.
3. SSH is already enabled on the image, and a local IP-address is assigned to the Pi using DHCP as soon as the TP-cable is attached. You can now connect using default username and hostname, and password *pi*.

```bash
ssh pi@raspberrypi.local
```

If this doesn't work, try find the IP-address of the PI by e.g. looking in the DHCP leases table:

```bash
cat /var/lib/misc/dnsmasq.leases
```

### Wifi

Once you have wifi up and running, you'll find the IP-address by typing:

```bash
ifconfig
```

Then simply SSH to it:

```bash
ssh pi@<ip addr>
```

## Configure network

Make sure the pre-configured wifi settings in `/etc/wpa_supplicant/wpa_supplicant.conf` are correct by opening it in a editor, e.g:

```bash
sudo vim /etc/wpa_supplicant/wpa_supplicant.conf
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
sudo vim /etc/hostname
sudo vim /etc/hosts
```

## Donkey library API

The donkey library reference can be found here:
[http://docs.donkeycar.com/utility/donkey](http://docs.donkeycar.com/utility/donkey)

## Calibration

TODO
http://docs.donkeycar.com/guide/get_driving/

## Debug

### Configuration

The following is already configured on the customized Raspbian image in `images/donkey.img`:
- Locale (en_US.UTF8)
- Change default password to `pi`
- Enable **SSH**
- Enable **camera** interface
- Enable **I2C** interface
- Enable **wifi** (Jayway guest). Should be verified in next section.

### Installed software

We've created a slimmed down version of the [donkey image](http://docs.donkeycar.com/faq/#how-do-i-create-my-own-raspberry-pi-disk).

All software should already be installed, but the instructions can be handy if you're debugging or developing new features.

Installing the [donkey](https://github.com/wroscoe/donkey) software and dependencies:
```bash
./install.sh
```

### AWS IoT provisioning

- cert??? jit??? -- Provisioning!!!!
- jobs
-- update SW:
--- apt-get update/upgrade
--- npm 