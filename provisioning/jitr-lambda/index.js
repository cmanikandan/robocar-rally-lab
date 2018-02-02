'use-strict'

const AWS = require('aws-sdk');
const x509 = require('x509');

const thingTemplate = require('./thing-template.json')

// Incoming event
// {
//  "certificateId": "<certificateID>",
//  "caCertificateId": "<caCertificateId>",
//  "timestamp": "<timestamp>",
//  "certificateStatus": "PENDING_ACTIVATION",
//  "awsAccountId": "<awsAccountId>",
//  "certificateRegistrationTimestamp": "<certificateRegistrationTimestamp>"
//}

/**
This node.js Lambda function code creates and attaches an IoT policy to the 
just-in-time registered certificate. It also activates the certificate. The Lambda
function is attached as a rule engine action to the registration topic 
Saws/events/certificates/registered/<caCertificateID>
**/
    
exports.handler = function(event, context, callback) {
  console.log(`Handling certificate activation for ${JSON.stringify(event)}`);

  const PolicyName = process.env.THING_POLICY_NAME;
  const CertificateId = event.certificateId.toString().trim();
  const uparams = {
    CertificateId,
    newStatus: 'ACTIVE'
  };

  const Iot = new AWS.Iot();
  Iot.updateCertificate(uparams).promise()
    .then((res) => {
      console.log('Certificate updated');

      const dparams = {
        CertificateId
      };

      return Iot.describeCertificate(dparams).promise();
    })
    .then((res) => {
      console.log(`Certificate after update ${JSON.stringify(res)}`);

      // https://www.npmjs.com/package/child-process-promise ???
      // https://gist.github.com/JensWalter/8eab250f28360f696caa8e8c616f0dd8
      const { certificatePem } = res.certificateDescription;
      console.log(`CertificatePem: ${certificatePem}`);
      const subject = x509.getSubject(certificatePem);
      console.log(`subject: ${subject}`);
      const { commonName } = subject;
      console.log(`commonName: ${commonName}`);
      const rparams = {
        templateBody: thingTemplate,
        parameters: {
          ThingName: commonName,
          CertificateId,
          PolicyName
        }
      };
      return Iot.registerThing(params).promise();
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