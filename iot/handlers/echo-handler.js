'use strict';

const logger = require('../common/logger');
const { exec } = require('child_process');

const Operation = 'echo';

const STEP_STARTED = 'started';

function reportProgress(job, step) {
  job.inProgress({
    operation: Operation,
    step
  });
}

function reportSuccess(job) {
  job.succeeded({
    operation: Operation,
    step: STEP_STARTED
  });
}

function reportFailure(job, errorCode, error) {
  job.failed({
    operation: Operation,
    errorCode,
    error
  });
}

function echo(job) {
  exec('sudo echo none >/sys/class/leds/led0/trigger', (err) => {
    if (err) {
      reportFailure(job, 'ERR_SYSTEM_CALL_FAILED', err);
      return;
    }

    exec('sudo echo 0 >/sys/class/leds/led0/brightness', (err2) => {
      if (err2) {
        reportFailure(job, 'ERR_SYSTEM_CALL_FAILED', err2);
        return;
      }

      setTimeout(() => {
        exec('sudo echo 1 >/sys/class/leds/led0/brightness', (err3) => {
          if (err3) {
            reportFailure(job, 'ERR_SYSTEM_CALL_FAILED', err3);
            return;
          }

          setTimeout(() => {
            exec('sudo echo mmc0 >/sys/class/leds/led0/trigger', (err4) => {
              if (err4) {
                reportFailure(job, 'ERR_SYSTEM_CALL_FAILED', err4);
                return;
              }
              reportSuccess(job);
            });
          }, 1000);
        });
      }, 100);
    });
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
      logger.info(' system');
      reportProgress(job, STEP_STARTED);
      echo();
    } else {
      logger.warn({ step }, 'Unexpected job state, failing...');
      reportFailure(job, 'ERR_UNEXPECTED', 'job in unexpected state');
    }
  }

  const { status: { status, statusDetails: { step } } } = job;
  return handleStep(status, step);
}

module.exports = {
  Operation,
  handle
};
