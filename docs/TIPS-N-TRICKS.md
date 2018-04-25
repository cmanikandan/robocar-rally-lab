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

The [Donkey](https://github.com/wroscoe/donkey) library will install a CPU enabled TensorFlow and a slightly outdated Keras version per default. Here's how to install it with a GPU enabled TensorFlow instead.

Note, if you're running in a SageMaker Jupyter Notebook, all commands must be prepended with a `!` (see [IPython docs](https://ipython.org/ipython-doc/3/interactive/tutorial.html#system-shell-commands))
```bash
# Conda commands only applicable if you're actually using Ana/MiniConda, like on SageMaker
conda list | grep -i tensorflow
conda list | grep -i donkey

# Clone donkey git
rm -rf donkey
git clone https://github.com/wroscoe/donkey

# Change Donkey dependencies
sed -i -e 's/keras==2.0.8/keras>=2.1.2/g' donkey/setup.py
sed -i -e 's/tensorflow>=1.1/tensorflow-gpu>=1.4/g' donkey/setup.py

# Install Donkey
pip uninstall donkeycar --yes
pip install ./donkey
pip show donkeycar
```

## Zipping and copying data from car to S3

SSH to car:
```bash
ssh pi@<your car name>.local
```

Zip Tubs:
```
cd ~/m2/data
zip -r <zip file name>.zip *

Close SSH session an scp file to host
```bash
exit
scp pi@<your car name>.local:/home/pi/m2/data/<zip file name>.zip
```

Upload zipfile to S3:
```bash
aws s3 cp <zip file name>.zip s3://robocar-raw-data/data/
```
