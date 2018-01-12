#!/bin/bash
#
# A simplified version of http://docs.donkeycar.com/faq/#how-do-i-create-my-own-raspberry-pi-disk
# Omitted Python virtualenv (Miniconda)
#
set -ex

die() { echo "$*"; exit 111; }

if (( $EUID == 0 )); then
  echo "Don't run as root"
  exit
fi

cd $HOME

# 1. Update system
sudo apt-get update && sudo apt-get --yes upgrade

# 2. Install git
sudo apt-get --yes install git

# 3. Install python3 & friends
sudo apt-get --yes install python3 python3-pip python3-dev

# 4. Install build dependencies
# libhdf5-dev - for pillow
# libatlas-base-dev - for numpy
# libopenjp2-7-dev - for PIL (Python Imaging Library)
# libtiff5 - for PIL (Python Imaging Library)
# Might be needed in the future: gfortran
sudo apt-get --yes install build-essential libhdf5-dev libatlas-base-dev libopenjp2-7-dev libtiff5

# 5. Install drivers
sudo apt-get --yes install python3-picamera
sudo pip3 install adafruit-pca9685 

# 6. Install tensorflow (see https://github.com/lhelontra/tensorflow-on-arm)
wget https://github.com/lhelontra/tensorflow-on-arm/releases/download/v1.4.1/tensorflow-1.4.1-cp35-none-linux_armv7l.whl
sudo pip3 install tensorflow-1.4.1-cp35-none-linux_armv7l.whl
rm tensorflow-1.4.1-cp35-none-linux_armv7l.whl
# Validate
RES=$(python3 -c "import tensorflow as tf; sess = tf.Session(); print(sess.run(tf.constant('ok')).decode('unicode_escape'))")
[ $RES == "ok" ] || die "Tensorflow not properly installed"

# 7. Clone donkey git
if [ ! -d "$HOME/donkey" ]; then
  git clone https://github.com/wroscoe/donkey $HOME/donkey
else
  cd $HOME/donkey
  git pull origin master
  cd $HOME
fi

# 8. Setup donkey
sudo pip3 install -e $HOME/donkey

# 8.1 Perhaps not necessary (if 9. fails with: RuntimeError: module compiled against API version 0xb but this version of numpy is 0xa)
#sudo pip3 install numpy --upgrade --ignore-installed

# 9. Create a "car"
donkey createcar --template donkey2 --path ~/d2

# Debug prints
python3 -c 'import h5py; print("h5py version {}".format(h5py.__version__))'
python3 -c 'import numpy; print("numpy version {}".format(numpy.__version__))'
python3 -c 'import tensorflow; print("tensorflow version {}".format(tensorflow.__version__))'
python3 -c 'import keras; print("keras version {}".format(keras.__version__))'
python3 -c 'import pandas; print("pandas version {}".format(pandas.__version__))'
python3 -c 'import donkeycar; print("donkeycar version {}".format(donkeycar.__version__))'

# 10. Install nvm, node and npm
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.6/install.sh | bash
source $HOME/.bashrc
nvm install 8
nvm use 8

# 11. Install AWS IoT device SDK for JS/Node
npm install -g aws-iot-device-sdk


echo "Finished installing software"
