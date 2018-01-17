#!/bin/bash

# TODO: aws iot update-ca-certificate --cert-id caCertificateId --new-auto-registration-status ENABLE
# TODO: create .ssh dir in pi home

set -e

die() { echo "$*"; exit 111; }

command -v jq >/dev/null 2>&1 || die "Please install jq"

unset DEVICE_NAME
while getopts ":d:i:" opt; do
  case $opt in
    d )
      DEVICE_NAME=$OPTARG
      ;;
    i )
      DEVICE_IP=$OPTARG
      ;;
    \? )
      die "Error: invalid option: -$OPTARG"
      ;;
    : )
      die "Error: option -$OPTARG requires an argument."
      ;;
  esac
done

[ -z $DEVICE_NAME ] && die "Error: -d DEVICE_NAME is missing"

# Check if device is reachable using .local name
CONNECT_TO=$DEVICE_NAME.local
if ! arping -w 5 -f $CONNECT_TO &> /dev/null
then  
  # Nope, try IP if specified
  [ -z $DEVICE_IP ] && die "Error: $CONNECT_TO not reachable and -i <IP address> parameter not specified. Cannot connect to car."
  CONNECT_TO=$DEVICE_IP
  if ! ping -c4 $CONNECT_TO -c 1 &> /dev/null
  then
    die "Error: $CONNECT_TO not reachable. Cannot connect to car."
  fi
fi

# Check if SSH key is available
[ -f $HOME/.ssh/robocar_rsa ] || die "Error: No SSH key for the car in $HOME/.ssh/robocar_rsa. To create one, see docs/PREPARE-CAR.md"

echo "Using device name '$DEVICE_NAME' to create a certificate..."

# Device cert files
TMP=`mktemp -d 2>/dev/null || mktemp -d -t 'mytmpdir'`
PRIVATE_KEY_PATH=$TMP/${DEVICE_NAME}-priv.key
CSR_PATH=$TMP/${DEVICE_NAME}.csr
CERT_PATH=$TMP/${DEVICE_NAME}.pem

# CSR info
COUNTRY="SE"
STATE="Skane"
CITY="Malmo"
ORGANIZATION="Jayway"
ORGANIZATION_UNIT="mmo"
COMMON_NAME=$DEVICE_NAME

# Fetch Jayway CA files from SSM Parameter Store
CA_PRIVATE_KEY_PATH=$TMP/jw-robocar-ca-priv.key
aws ssm get-parameter --name /robocar/jw-robocar-ca-priv-key --with-decryption | jq -r '.Parameter.Value' > $CA_PRIVATE_KEY_PATH
CA_CERT_PATH=$TMP/jw-robocar-ca.pem
aws ssm get-parameter --name /robocar/jw-robocar-ca --with-decryption | jq -r '.Parameter.Value' > $CA_CERT_PATH

# Create device cert
openssl genrsa -out $PRIVATE_KEY_PATH 2048 &> /dev/null
openssl req -new -key $PRIVATE_KEY_PATH -out $CSR_PATH -subj "/C=${COUNTRY}/ST=${STATE}/L=${CITY}/O=${ORGANIZATION}/OU=${ORGANIZATION_UNIT}/CN=${COMMON_NAME}" &> /dev/null
openssl x509 -req -in $CSR_PATH -CA $CA_CERT_PATH -CAkey $CA_PRIVATE_KEY_PATH -CAcreateserial -out $CERT_PATH -days 365 -sha256 &> /dev/null

# Move certs to device
ssh -i $HOME/.ssh/robocar_rsa "mkdir -p /home/pi/certs"
scp -i $HOME/.ssh/robocar_rsa $PRIVATE_KEY_PATH pi@${CONNECT_TO}:/home/pi/certs
scp -i $HOME/.ssh/robocar_rsa $CERT_PATH pi@${CONNECT_TO}:/home/pi/certs
scp -i $HOME/.ssh/robocar_rsa $CA_CERT_PATH pi@${CONNECT_TO}:/home/pi/certs

# Clean up
rm -rf $TMP