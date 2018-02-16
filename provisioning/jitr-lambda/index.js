'use-strict'

const AWS = require('aws-sdk');
const pem = require('pem-promise');

/**
This node.js Lambda function is attached as a rule engine action to the registration topic 
Saws/events/certificates/registered/<caCertificateID>.

It does the following:
- activate certificate
- assumes provisioning is done on CA cert
**/

// Incoming event
// {
//  "certificateId": "<certificateID>",
//  "caCertificateId": "<caCertificateId>",
//  "timestamp": "<timestamp>",
//  "certificateStatus": "PENDING_ACTIVATION",
//  "awsAccountId": "<awsAccountId>",
//  "certificateRegistrationTimestamp": "<certificateRegistrationTimestamp>"
//}
//
// Also, important to know is that this handler is limited to 10 requests/second
// (sum of all running lambda containers). See
// https://docs.aws.amazon.com/general/latest/gr/aws_service_limits.html#limits_iot
//
exports.handler = function(event, context, callback) {
  console.log(`Handling certificate activation for ${JSON.stringify(event)}`);

  const thingGroupName = process.env.THING_GROUP_NAME;
  const thingGroupArn = process.env.THING_GROUP_ARN;
  const thingTypeName = process.env.THING_TYPE_NAME;
  const certificateId = event.certificateId.toString().trim();

  console.log(`thingGroupName: ${thingGroupName}`);
  console.log(`thingGroupArn: ${thingGroupArn}`);
  console.log(`thingTypeName: ${thingTypeName}`);
  console.log(`certificateId: ${certificateId}`);

  const uparams = {
    certificateId,
    newStatus: 'ACTIVE'
  };

  const Iot = new AWS.Iot();
  Iot.updateCertificate(uparams).promise()
    .then((res) => {
      console.log('Certificate updated');

      const dparams = {
        certificateId
      };

      return Iot.describeCertificate(dparams).promise();
    })
    .then((res) => {
      console.log(res);

      const { certificatePem, certificateArn } = res.certificateDescription;
      console.log(`certificatePem: ${certificatePem}`);

      return Promise.all([pem.readCertificateInfo(certificatePem), certificateArn]);
    })
    .then(([ { commonName }, certificateArn ]) => {
      console.log(`commonName: ${commonName}`);
      console.log(`certificateArn: ${certificateArn}`);

      var tparams = {
        thingName: commonName,
        thingTypeName
      };
      return Promise.all([ Iot.createThing(tparams).promise(), certificateArn ]);
    })
    .then(([ { thingName, thingArn }, certificateArn ]) => {
      console.log(`Created thing ${thingName}`);
      console.log(`certificateArn ${certificateArn}`);

      const gparams = {
        thingName,
        thingArn,
        thingGroupArn,
        thingGroupName
      };
      return Promise.all([ Iot.addThingToThingGroup(gparams).promise(), thingName, certificateArn ]);
    })
    .then(([ _ , thingName, certificateArn ]) => {
      console.log(`thingName: ${thingName}`);
      console.log(`certificateArn: ${certificateArn}`);

      var aparams = {
        principal: certificateArn,
        thingName
      };
      return Iot.attachThingPrincipal(aparams).promise();
    })
    .then(() => {
      const lparams = {
        thingGroupName
      };
      return Iot.listThingsInThingGroup(lparams).promise();
    })
    .then((res) => {
      console.log(res);
      const laparams = {
        target: thingGroupArn
      };
      return Iot.listAttachedPolicies(laparams).promise();
    })
    .then((res) => {
      console.log(res);
      return callback(null, `Success, activated the certificate ${certificateId}`);
    })
    .catch((err) => {
      console.log(err);
      return callback(err);
    }); 
}