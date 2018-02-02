'use-strict'

const AWS = require('aws-sdk');

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
  console.log(`Handling certificate activation for ${event}`);

  const certificateId = event.certificateId.toString().trim();
  const params = {
    certificateId,
    newStatus: 'ACTIVE'
  };

  const Iot = new AWS.Iot();
  Iot.updateCertificate(params).promise()
    .then((res) => {
      console.log(res);   
      return callback(null, `Success, activated the certificate ${certificateId}`);
    })
    .catch((err) => {
      console.log(err); 
      return callback(err);
    }); 
}