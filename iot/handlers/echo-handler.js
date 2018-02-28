'use strict';

const { createLogger } = require('../common/logger');

const logger = createLogger({ level: 'debug' });

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

function echo(job, device, topic, thing, message) {
  device.publish(topic, JSON.stringify({ thing, message }));
  logger.debug({ thing, topic, msg: message }, 'Published message');
}

module.exports = ({ Device, ThingTypeName, ThingName }) => ({
  Operation,
  handle(error, job) {
    logger.debug({ job }, 'Received new job event');

    if (error) {
      logger.error({ error }, 'Error in IoT job');
      return reportFailure(job, 'ERR_UNEXPECTED', 'job in unexpected state');
    }

    function handleStep(status, step, message) {
      if (status === 'QUEUED' || !step) {
        logger.info('Handling echo job');
        reportProgress(job, STEP_STARTED);
        const topic = `${ThingTypeName}/echo`;
        echo(job, Device, topic, ThingName, message);
        reportSuccess(job);
      } else {
        logger.warn({ step }, 'Unexpected job state, failing...');
        reportFailure(job, 'ERR_UNEXPECTED', 'job in unexpected state');
      }
    }

    const { document: { message } = {}, status: { status, statusDetails: { step } = {} } } = job;
    return handleStep(status, step, message);
  }
});
