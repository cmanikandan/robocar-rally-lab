#!/bin/bash
set -e

die() { echo "$*"; exit 111; }

unset DEVICE_NAME
while getopts ":d:" opt; do
  case $opt in
    d )
      DEVICE_NAME=$OPTARG
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

echo "Using device name '$DEVICE_NAME' to create a certificate..."
PRIVATE_KEY_NAME="${DEVICE_NAME}-priv.key"
CSR_NAME="${DEVICE_NAME}.csr"
CERT_NAME="${DEVICE_NAME}.pem"

COUNTRY="SE"
STATE="Skane"
CITY="Malmo"
ORGANIZATION="Jayway"
ORGANIZATION_UNIT="mmo"
COMMON_NAME=$DEVICE_NAME

# TODO: aws iot update-ca-certificate --cert-id caCertificateId --new-auto-registration-status ENABLE
# TODO: Add private key to parameter store
# TODO: Add CA cert to sd image? Or IoT root cert?
CA_CERT=???
CA_PRIVATE_KEY=

openssl genrsa -out $PRIVATE_KEY_NAME 2048
openssl req -new -key $PRIVATE_KEY_NAME -out $CSR_NAME -subj "/C=${COUNTRY}/ST=${STATE}/L=${CITY}/O=${ORGANIZATION}/OU=${ORGANIZATION_UNIT}/CN=${COMMON_NAME}"
#openssl x509 -req -in $CSR_NAME -CA $CA_CERT -CAkey $CA_PRIVATE_KEY -CAcreateserial -out $CERT_NAME -days 365 –sha256
