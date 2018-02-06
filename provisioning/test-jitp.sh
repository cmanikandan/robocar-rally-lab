#!/bin/bash

DEVICE_NAME='TestCar'

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

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
openssl genrsa -out $PRIVATE_KEY_PATH 2048 &> /dev/null
openssl req -new -key $PRIVATE_KEY_PATH -out $CSR_PATH -subj "/C=${COUNTRY}/ST=${STATE}/L=${CITY}/O=${ORGANIZATION}/OU=${ORGANIZATION_UNIT}/CN=${COMMON_NAME}" &> /dev/null
openssl x509 -req -in $CSR_PATH -CA $CA_CERT_PATH -CAkey $CA_PRIVATE_KEY_PATH -CAcreateserial -out $CERT_PATH -days 365 -sha256 &> /dev/null

# Create combined device and JW CA cert (need for JITR)
CERT_AND_CA_CERT_PATH=$TMP/jw-robocar-ca-${DEVICE_NAME}.pem
cat $CERT_PATH $CA_CERT_PATH > $CERT_AND_CA_CERT_PATH

# Move root cert
cp $AWS_ROOT_CA_CERT $TMP

# Generate config file for Node app
IOT_ENDPOINT=a1t9ro997wkd3s.iot.eu-west-1.amazonaws.com
REGION=eu-west-1
cat > $TMP/config.json <<EOF
{
  "Host":           "${IOT_ENDPOINT}",
  "Port":           8883,
  "Region":         "${REGION}",
  "ClientId":       "${DEVICE_NAME}",
  "ThingName":      "${DEVICE_NAME}",
  "ThingTypeName":  "Donkey",
  "ThingGroupName": "RoboCars",
  "CaCert":         "${TMP}/vs-root-ca.pem",
  "ClientCert":     "${TMP}/${DEVICE_NAME}.pem",
  "PrivateKey":     "${TMP}/${DEVICE_NAME}-priv.key"
}
EOF

# copy iot app
cp $DIR/../iot/index.js $TMP
cp $DIR/../iot/package.json $TMP
cd $TMP && npm install && cd $DIR

echo "mosquitto_pub --cafile ${TMP}/vs-root-ca.pem --cert ${CERT_AND_CA_CERT_PATH} --key ${PRIVATE_KEY_PATH} -h a1t9ro997wkd3s.iot.eu-west-1.amazonaws.com -p 8883 -q 1 -t Donkey/hello -i TestCar --tls-version tlsv1.2 -m 'TestCar!' -d"
echo $TMP