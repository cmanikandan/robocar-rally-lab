# Prepare the car

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
country=SE
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
update_config=1

network={
    ssid="JaywayGuest"
    psk="jaywayguest"
}
-----
https://unix.stackexchange.com/questions/278946/hiding-passwords-in-wpa-supplicant-conf-with-wpa-eap-and-mschap-v2
------
4. Hostname
sudo vi /media/userID/UUID/etc/hostname
sudo vi /media/userID/UUID/etc/hosts
5. Install donkey/d2
- cert??? jit??? -- Provisioning!!!!
- d2 config (after job?)
http://docs.donkeycar.com/guide/install_software/


6. Start driving
7. calibration!
http://docs.donkeycar.com/guide/get_driving/


- jobs
-- update SW:
--- apt-get update/upgrade
--- npm 