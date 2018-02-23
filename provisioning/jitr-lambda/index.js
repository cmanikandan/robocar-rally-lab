'use-strict';

/* eslint-disable-next-line */
const AWS = require('aws-sdk');
const pem = require('pem-promise');

const logger = require('./common/logger');

/*
This node.js Lambda function is attached as a rule engine action to the registration topic
Saws/events/certificates/registered/<caCertificateID>.
*/

// Incoming event
// {
//  "certificateId": "<certificateID>",
//  "caCertificateId": "<caCertificateId>",
//  "timestamp": "<timestamp>",
//  "certificateStatus": "PENDING_ACTIVATION",
//  "awsAccountId": "<awsAccountId>",
//  "certificateRegistrationTimestamp": "<certificateRegistrationTimestamp>"
// }
//
// Also, important to know is that this handler is limited to 10 requests/second
// (sum of all running lambda containers). See
// https://docs.aws.amazon.com/general/latest/gr/aws_service_limits.html#limits_iot
//
exports.handler = (event, context, callback) => {
  logger.debug({ event }, 'JITR event received');

  const thingGroupName = process.env.THING_GROUP_NAME;
  const thingGroupArn = process.env.THING_GROUP_ARN;
  const thingTypeName = process.env.THING_TYPE_NAME;
  const certificateId = event.certificateId.toString().trim();

  logger.debug({
    thingGroupName, thingGroupArn, thingTypeName, certificateId
  }, 'Provisioning information');

  const uparams = {
    certificateId,
    newStatus: 'ACTIVE'
  };

  const Iot = new AWS.Iot();
  Iot.updateCertificate(uparams).promise()
    .then(() => {
      logger.info({ certificateId }, 'Certificate updated successfully');

      const dparams = {
        certificateId
      };

      return Iot.describeCertificate(dparams).promise();
    })
    .then((res) => {
      logger.debug({ certificateId, res }, 'Certificate after update');

      const { certificatePem, certificateArn } = res.certificateDescription;
      logger.debug({ certificateId, certificatePem }, 'Public certificate');

      return Promise.all([pem.readCertificateInfo(certificatePem), certificateArn]);
    })
    .then(([{ commonName }, certificateArn]) => {
      logger.debug({ commonName, certificateArn }, 'Extracted information');

      const tparams = {
        thingName: commonName,
        thingTypeName
      };
      return Promise.all([Iot.createThing(tparams).promise(), certificateArn]);
    })
    .then(([{ thingName, thingArn }, certificateArn]) => {
      logger.info({ thingName, thingArn }, 'Created thing');

      const gparams = {
        thingName,
        thingArn,
        thingGroupArn,
        thingGroupName
      };
      return Promise.all([Iot.addThingToThingGroup(gparams).promise(), thingName, certificateArn]);
    })
    .then(([, thingName, certificateArn]) => {
      logger.debug({
        thingName, certificateArn, thingGroupName, thingGroupArn
      }, 'Added thing to group');

      const aparams = {
        principal: certificateArn,
        thingName
      };
      return Iot.attachThingPrincipal(aparams).promise();
    })
    .then(() => {
      logger.debug('Added thing to certificate');
      const lparams = {
        thingGroupName
      };
      return Iot.listThingsInThingGroup(lparams).promise();
    })
    .then((res) => {
      logger.debug({ res, thingGroupName }, 'All things in group');
      const laparams = {
        target: thingGroupArn
      };
      return Iot.listAttachedPolicies(laparams).promise();
    })
    .then((res) => {
      logger.debug({ res, thingGroupName }, 'All policies attached to group');
      return callback(null, `Success, activated the certificate ${certificateId}`);
    })
    .catch((err) => {
      logger.error({ err }, 'Failed to activate and provision device');
      return callback(err);
    });
};
