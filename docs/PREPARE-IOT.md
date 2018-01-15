# Prepare IoT

Instructions for lab assistants on how to prepare the IoT environment for a race.

## Create and register a self-signed AWS IoT CA certificate

See instructions on AWS IoT docs:
- [https://aws.amazon.com/premiumsupport/knowledge-center/iot-self-signed-certificates/](https://aws.amazon.com/premiumsupport/knowledge-center/iot-self-signed-certificates/)
- [https://docs.aws.amazon.com/iot/latest/developerguide/device-certs-your-own.html](https://docs.aws.amazon.com/iot/latest/developerguide/device-certs-your-own.html)

See below for suggested file names:

| File | Suggested file name |
| -------------------- | ----- |
| [Verisign root CA server certificate](https://www.symantec.com/content/en/us/enterprise/verisign/roots/VeriSign-Class%203-Public-Primary-Certification-Authority-G5.pem) | vs-iot-root-ca.pem |
| CA cert private key | jw-robocar-ca-priv.key |
| CA cert             | jw-robocar-ca.pem      |
| Verification cert private key | jw-robocar-ver-priv.key |
| Verification cert             | jw-robocar-ver.pem      |

Use the following information when creating CSRs:

| JW IoT CA cert           | Value  |
| ------------------------ | ------ |
| Country name             | SE     |
| State name               | Skane  |
| Locality name            | Malmo  |
| Organization name        | Jayway |
| Organizational unit name | mmo    |
| Common name              | Jayway Certificate Authority for AWS IoT |
| Email                    | robocar@jayway.com |

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