'use strict';

const { createLogger } = require('../common/logger');
const { exec } = require('child_process');

const logger = createLogger({ level: 'debug' });

const Operation = 'reboot';

const STEP_STARTED = 'started';
const STEP_EXECUTED = 'executed';

function reportProgress(job, step) {
  job.inProgress({
    operation: Operation,
    step
  });
}

function reportSuccess(job) {
  job.succeeded({
    operation: Operation,
    step: STEP_EXECUTED
  });
}

function reportFailure(job, errorCode, error) {
  job.failed({
    operation: Operation,
    errorCode,
    error
  });
}

function reboot() {
  // exec('sudo /sbin/shutdown -r', (error) => {
  exec('echo "hello" > /tmp/bob.txt', (error) => {
    if (error) {
      reportFailure('ERR_SYSTEM_CALL_FAILED', error);
    }
  });
}

function handle(error, job) {
  logger.debug({ job }, 'Received new job event');

  if (error) {
    logger.error({ error }, 'Error in IoT job');
    return reportFailure(job, 'ERR_UNEXPECTED', 'job in unexpected state');
  }

  function handleStep(status, step) {
    if (status === 'QUEUED' || !step) {
      logger.info('Rebooting system');
      reportProgress(job, STEP_STARTED);
      reboot();
    } else if (step === STEP_STARTED) {
      logger.info('Reporting successful system reboot');
      reportSuccess(job);
    } else {
      logger.warn({ step }, 'Unexpected job state, failing...');
      reportFailure(job, 'ERR_UNEXPECTED', 'job in unexpected state');
    }
  }

  const { status: { status, statusDetails: { step } } } = job;
  return handleStep(status, step);
}

module.exports = () => ({
  Operation,
  handle
});
