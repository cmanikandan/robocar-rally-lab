# Prepare Just-In-Time-Registration

Instructions for lab assistants on how to prepare the IoT environment for a race.

This section prepares the AWS IoT Just-In-Time-Registration (and Just-In-Time-Provisioning).

## Create and register a self-signed AWS IoT CA certificate

See instructions on AWS IoT docs:
- [https://aws.amazon.com/premiumsupport/knowledge-center/iot-self-signed-certificates/](https://aws.amazon.com/premiumsupport/knowledge-center/iot-self-signed-certificates/)
- [https://docs.aws.amazon.com/iot/latest/developerguide/device-certs-your-own.html](https://docs.aws.amazon.com/iot/latest/developerguide/device-certs-your-own.html)

Make sure you enable `--allow-auto-registration` on the CA certificate.

See below for suggested file names:

| File | Suggested file name |
| -------------------- | ----- |
| [Verisign root CA server certificate](https://www.symantec.com/content/en/us/enterprise/verisign/roots/VeriSign-Class%203-Public-Primary-Certification-Authority-G5.pem) | vs-iot-root-ca.pem |
| CA cert private key | jw-robocar-ca-priv.key |
| CA cert serial file | jw-robocar-ca.srl      |
| CA cert             | jw-robocar-ca.pem      |
| Verification cert private key | jw-robocar-ver-priv.key |
| Verification CSR              | jw-robocar-ver.csr      |
| Verification cert             | jw-robocar-ver.crt      |

Use the following information when creating CA:

| JW IoT CA cert           | Value  |
| ------------------------ | ------ |
| Country name             | SE     |
| State name               | Skane  |
| Locality name            | Malmo  |
| Organization name        | Jayway |
| Organizational unit name | mmo    |
| Common name              | Jayway Certificate Authority for AWS IoT |
| Email                    | robocar@jayway.com |

Use the following information when creating CSRs:

| Verification CSR         | Value  |
| ------------------------ | -------|
| Country name             | SE     |
| State name               | Skane  |
| Locality name            | Malmo  |
| Organization name        | Jayway |
| Organizational unit name | mmo    |
| Common name              | [XXXXXXXXXXXXMYREGISTRATIONCODEXXXXXX](http://docs.aws.amazon.com/cli/latest/reference/iot/get-registration-code.html) |
| Email                    | robocar@jayway.com |
| Challenge                | robocar            |

## Store CA information in SSM Parameter Store

The following data needs to be stored in [AWS SSM Parameter Store](https://aws.amazon.com/systems-manager/):
- CA cert private key
- CA cert (for easy access)

First, create a KMS key for encrypting the parameters:
```bash
aws kms create-key --description robocar-key
aws kms create-alias --alias-name alias/robocar-key --target-key-id <key id from output>
```

Next, store the CA private key and CA in SSM Parameter Store:
```bash
aws ssm put-parameter --name /robocar/jw-robocar-ca-priv-key --type SecureString --key-id alias/robocar-key --value file://<path to jw-robocar-ca-priv.key>
aws ssm put-parameter --name /robocar/jw-robocar-ca --type SecureString --key-id alias/robocar-key --value file://<path to jw-robocar-ca.pem>
```

To later get the value, type:
```bash
aws ssm get-parameter --name /robocar/jw-robocar-ca-priv-key --with-decryption | jq -r '.Parameter.Value'
```

To get all robocar parameters, type:
```bash
aws ssm get-parameters-by-path --path /robocar
```

## Launch the JITR lambda

When a device attempts to connect with an X.509 certificate that is not known to AWS IoT but was signed by a CA that was registered with AWS IoT, the device certificate will be auto-registered by AWS IoT in a new `PENDING_ACTIVATION` state. AWS IoT will also publish an event to the following topic:

```bash
$aws/events/certificates/registered/<caCertificateID>
```

The JITR lambda listens to all incoming registration events, activates and provisions a `thing`. Launch it using a CF template:

```bash
./<repository root>/provisioning/deploy-jitr-lambda.sh
```

## Testing

Create a new dummy device using the `create-device-cert.sh` script:
```bash
mkdir -p $HOME/tmp/iot-test
./<repository root>/provisioning/create-device-cert.sh -d mydummy -l $HOME/tmp/iot-test
```

To verify that JITR is properly configured, in the [AWS console](https://648414911232.signin.aws.amazon.com/console), in the IoT service left navigation pane, choose **Test**. Subscribe to the `Donkey/hello` topic.

<img src="subscribe-button-topic.png" width="400">

Then run the iot application using the dummy certificate:
```bash
export IOT_CONFIG_PATH=$HOME/tmp/iot-test/config.json
cd <repository root>/iot
npm start
```

Don't forget to clean up the dummy certificate in the IoT console when you're done.