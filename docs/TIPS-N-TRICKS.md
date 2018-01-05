# Tips n Tricks

## Starting a service at boot on Raspbian

Raspbian use [systemd](https://www.raspberrypi.org/documentation/linux/usage/systemd.md) as init system.

TODO: Add sensor tracking script as example:

```
[Unit]
Description=My Service
After=network.target

[Service]
ExecStart=/usr/bin/python3 -u main.py
WorkingDirectory=/home/pi/myscript
StandardOutput=inherit
StandardError=inherit
Restart=always
User=pi

[Install]
WantedBy=multi-user.target
```