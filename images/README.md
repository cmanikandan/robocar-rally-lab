# Rasbpian

Base image: 
`2017-11-29-raspbian-stretch-lite.zip`

Changes:
- Changed default password to `pi`. You're recommended to change this.
- Added `ssh` file to root partition. Enables ssh on the Pi.
- Added `wpa_supplicant.conf` file to root partition. It's automatically copied to `/etc/wpa_supplicant/wpa_supplicant.conf` upon boot.
```bash
country=SE
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
update_config=1

network={
    ssid="JaywayGuest"
    psk="jaywayguest"
}
```
- Installed Node, 

https://github.com/aws/aws-iot-device-sdk-js