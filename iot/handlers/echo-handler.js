'use strict';

const logger = require('../common/logger');

const Operation = 'echo';

const STEP_STARTED = 'started';
const STEP_FINISHED = 'finished';

function reportProgress(job, step) {
  job.inProgress({
    operation: Operation,
    step
  });
}

function reportSuccess(job) {
  job.succeeded({
    operation: Operation,
    step: STEP_FINISHED
  });
}

function reportFailure(job, errorCode, error) {
  job.failed({
    operation: Operation,
    errorCode,
    error
  });
}

function echo(job, Device, EchoTopic, ThingName) {
  Device.publish(EchoTopic, JSON.stringify({ Name: ThingName }));
  logger.debug({ thing: ThingName, topic: EchoTopic }, 'Published message');
}

module.exports = ({ Device, ThingTypeName, ThingName }) => ({
  Operation,
  handle(error, job) {
    logger.debug({ job }, 'Received new job event');

    if (error) {
      logger.error({ error }, 'Error in IoT job');
      return reportFailure(job, 'ERR_UNEXPECTED', 'job in unexpected state');
    }

    function handleStep(status, step) {
      if (status === 'QUEUED' || !step) {
        logger.info('Handling echo job');
        reportProgress(job, STEP_STARTED);
        const topic = `${ThingTypeName}/echo`;
        echo(job, Device, topic, ThingName);
        job.reportSuccess(job);
      } else {
        logger.warn({ step }, 'Unexpected job state, failing...');
        reportFailure(job, 'ERR_UNEXPECTED', 'job in unexpected state');
      }
    }

    const { status: { status, statusDetails: { step } } } = job;
    return handleStep(status, step);
  }
});
