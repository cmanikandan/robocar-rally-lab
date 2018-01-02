# Prepare the car

These instructions are a condensed version of the [Donkey Car](http://docs.donkeycar.com/) installation.

## Install sd-card

Install [Etcher](https://etcher.io/) and copy the customized Raspbian image in `images/donkey.img` to the SD-card, or use a tool like `dd`.

![Etcher](https://etcher.io/static/screenshot.gif)

Install the SD-card in the *Raspberry pi* and boot it up. It has **SSH** already enabled.

## Configure network

First thing after boot is to configure wifi. A new and easy way of connecting w.o. the need of a monitor/keyboard or local wifi router is to use direct ethernet connection (it makes use of diffent techniques such as *Auto MDI-X*, *DHCP* and *IPv4 settings*) :

1. Connect a TP-cable between your computer and the Pi.
2. On Linux, change the *wired connection* settings on your computer to *link-local*/*Share to other computers* or similar.
3. SSH is already enabled on the image, and a local IP-address is assigned to the Pi using DHCP as soon as the TP-cable is attached. You can now connect using default username and hostname, and password *pi*.

```bash
ssh pi@raspberrypi.local
```

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

## Install software

Install donkey/d2
- cert??? jit??? -- Provisioning!!!!
- d2 config (after job?)
http://docs.donkeycar.com/guide/install_software/

- jobs
-- update SW:
--- apt-get update/upgrade
--- npm 