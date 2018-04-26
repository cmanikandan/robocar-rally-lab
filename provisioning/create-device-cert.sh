#!/bin/bash

set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

die() {
  echo $1
  [ -d "$2" ] && rm -rf $2 && echo "Cleaned up temporary certificates in $2"
  exit 111
}

command -v jq >/dev/null 2>&1 || die "Please install jq"

unset DEVICE_NAME
unset DEVICE_IP
unset LOCAL
while getopts ":d:i:l:" opt; do
  case $opt in
    d )
      DEVICE_NAME=$OPTARG
      ;;
    i )
      DEVICE_IP=$OPTARG
      ;;
    l )
      LOCAL=$OPTARG
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

if [[ $(aws configure get region) != "eu-west-1" ]]; then
  die "Error: Invalid region configured in AWS CLI, must be 'eu-west-1'"
fi

echo "Using device name '$DEVICE_NAME' to create a certificate..."

# AWS IoT root CA cert (VeriSign)
AWS_ROOT_CA_CERT=$DIR/vs-root-ca.pem

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
echo "Creating private RSA key..."
openssl genrsa -out $PRIVATE_KEY_PATH 2048 &> /dev/null
echo "Creating x509 certificate..."
openssl req -new -key $PRIVATE_KEY_PATH -out $CSR_PATH -subj "/C=${COUNTRY}/ST=${STATE}/L=${CITY}/O=${ORGANIZATION}/OU=${ORGANIZATION_UNIT}/CN=${COMMON_NAME}" &> /dev/null
openssl x509 -req -in $CSR_PATH -CA $CA_CERT_PATH -CAkey $CA_PRIVATE_KEY_PATH -CAcreateserial -out $CERT_PATH -days 365 -sha256 &> /dev/null

# Create combined device and JW CA cert (need for JITR)
CERT_AND_CA_CERT_PATH=$TMP/jw-robocar-ca-${DEVICE_NAME}.pem
cat $CERT_PATH $CA_CERT_PATH > $CERT_AND_CA_CERT_PATH

# Generate config file for Node app
IOT_ENDPOINT=a1t9ro997wkd3s.iot.eu-west-1.amazonaws.com
REGION=eu-west-1
[[ -z "$LOCAL" ]] && DST="/home/pi/certs" || DST=$LOCAL
cat > $TMP/config.json <<EOF
{
  "Host":           "${IOT_ENDPOINT}",
  "Port":           8883,
  "Region":         "${REGION}",
  "ClientId":       "${DEVICE_NAME}",
  "ThingName":      "${DEVICE_NAME}",
  "ThingTypeName":  "Donkey",
  "ThingGroupName": "RoboCars",
  "CaCert":         "${DST}/vs-root-ca.pem",
  "ClientCert":     "${DST}/jw-robocar-ca-${DEVICE_NAME}.pem",
  "PrivateKey":     "${DST}/${DEVICE_NAME}-priv.key"
}
EOF
echo "Content of config file"
echo "----------------------"
cat $TMP/config.json

if [[ -z "$LOCAL" ]]; then

  echo "Copying certificates to $DEVICE_NAME"

  # Check if device is reachable using .local name
  TARGET=$DEVICE_NAME.local
  if ! ping -c4 $TARGET -c 1 &> /dev/null
  then
    # Nope, try IP if specified
    [ -z $DEVICE_IP ] && die "Error: $TARGET not reachable and -i <IP address> parameter not specified. Cannot connect to car." $TMP
    TARGET=$DEVICE_IP
    if ! ping -c4 $TARGET -c 1 &> /dev/null
    then
      die "Error: $TARGET not reachable. Cannot connect to car." $TMP
    fi
  fi

  # Check if SSH key is available
  SSH_KEY=${DEVICE_NAME}_rsa
  echo "SSH will assume key named $KEY"
  [ -f $HOME/.ssh/$SSH_KEY ] || die "Error: No SSH key for the car in $HOME/.ssh/${DEVIE_NAME}_rsa. To create one, see docs/PREPARE-IOT.md" $TMP

  # Commented this part out because it gets stuck at the ssh command when running on a mac
  # Check if we can connect using the RSA key
  #if ! ssh -i $HOME/.ssh/$SSH_KEY -T pi@$TARGET &> /dev/null
  #then
  #  die "Error: $TARGET not reachable. Cannot connect to car." $TMP_DIR
  #fi
  #echo "Successfully connected to $TARGET"

  # Move certs to device
  ssh -i $HOME/.ssh/$SSH_KEY pi@${TARGET} "mkdir -p ${DST}"
  echo "Copying private key to device..."
  scp -i $HOME/.ssh/$SSH_KEY $PRIVATE_KEY_PATH pi@${TARGET}:${DST}
  echo "Copying x509 cetificate to device..."
  scp -i $HOME/.ssh/$SSH_KEY $CERT_PATH pi@${TARGET}:${DST}
  echo "Copying Jayway AWS IoT CA certificate to device..."
  scp -i $HOME/.ssh/$SSH_KEY $CA_CERT_PATH pi@${TARGET}:${DST}
  echo "Copying AWS IoT root certficate (VeriSign) to device..."
  scp -i $HOME/.ssh/$SSH_KEY $AWS_ROOT_CA_CERT pi@${TARGET}:${DST}
  echo "Copying x509 certificate chain (device and JW CA) to device..."
  scp -i $HOME/.ssh/$SSH_KEY $CERT_AND_CA_CERT_PATH pi@${TARGET}:${DST}

  echo "Copying IoT config file to device..."
  scp -i $HOME/.ssh/$SSH_KEY $TMP/config.json pi@${TARGET}:${DST}

else

  echo "Creating local device in $DST"
  [ ! -d "$LOCAL" ] && die "Error: local directory $LOCAL does not exist" $TMP

  # Move certs to local
  echo "Copying private key to local..."
  cp $PRIVATE_KEY_PATH $DST
  echo "Copying x509 cetificate to local..."
  cp $CERT_PATH $DST
  echo "Copying Jayway AWS IoT CA certificate to local..."
  cp $CA_CERT_PATH $DST
  echo "Copying AWS IoT root certficate (VeriSign) to local..."
  cp $AWS_ROOT_CA_CERT $DST
  echo "Copying x509 certificate chain (device and JW CA) to local..."
  cp $CERT_AND_CA_CERT_PATH $DST

  echo "Copying IoT config file to local..."
  scp $TMP/config.json $DST
fi

# Clean up
rm -rf $TMP
