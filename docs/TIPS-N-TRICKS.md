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

## Installing Donkey library with GPU enabled TensorFlow

The [Donkey](https://github.com/wroscoe/donkey) library will install a CPU enabled TensorFlow and a slightly outdated Keras version per default. Here's how to install it with a GPU enabled TensorFlow instead:

```bash
# Conda commands only applicable if you're actually using Ana/MiniConda, like on SageMaker
conda list | grep -i tensorflow
conda list | grep -i donkey

# Clone donkey git
git clone https://github.com/wroscoe/donkey

# Change Donkey dependencies
sed -i -e 's/keras==2.0.8/keras>=2.1/g' donkey/setup.py
sed -i -e 's/tensorflow>=1.1/tensorflow-gpu>=1.4/g' donkey/setup.py

# Install Donkey
pip uninstall donkeycar --yes
pip install ./donkey
pip show donkeycar
```