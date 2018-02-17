# Prepare the car

For this lab, we use a customized Raspbian image based on the [Donkey Car](https://github.com/wroscoe/donkey) project. See [SD-card README](../sdcard/README.md) for details on how it was created.

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

See [Help](HELP.md) if you have problems connecting...

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

Next, change hostname (`raspberrypi`) to your *car name*:
```bash
sudo nano /etc/hostname
sudo nano /etc/hosts
```

**Ask your team members if you can reboot the car!**:
```bash
# Ask your team members before rebooting...
sudo reboot now
```

Your car will now reboot with your new hostname and a wifi IP-address. Before disconnecting the TP-cable, take a note of the IP-address and share it with your team members:

```bash
ssh pi@<your car name>.local
ifconfig
```

## Calibration

The lab uses a python library called [Donkey](https://github.com/wroscoe/donkey) to drive and train the car:
- [https://github.com/wroscoe/donkey](https://github.com/wroscoe/donkey)

Its already installed in `/home/pi/donkey` and `/home/pi/d2`.

You need to calibrate the steering before it can drive properly, see:
- [http://docs.donkeycar.com/guide/calibrate/](http://docs.donkeycar.com/guide/calibrate/)

The library reference can be found here:
- [http://docs.donkeycar.com/utility/donkey](http://docs.donkeycar.com/utility/donkey)
