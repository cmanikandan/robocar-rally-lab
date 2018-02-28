'use strict';

const { exec } = require('child_process');

// TODO: Remove me
const STEP_STARTED = 'started';
const STEP_EXECUTED = 'executed';

// TODO: Remove me
function reportProgress(operation, job, step) {
  job.inProgress({
    operation,
    step
  });
}

// TODO: Remove me
function reportSuccess(operation, job) {
  job.succeeded({
    operation,
    step: STEP_EXECUTED
  });
}

// TODO: Remove me
function reportFailure(operation, job, errorCode, error) {
  job.failed({
    operation,
    errorCode,
    error
  });
}

class RebootHandler {
  constructor({
    logger
  }) {
    this.logger = logger;
  }

  static get Operation() {
    return this.operation;
  }

  static reboot() {
    // exec('sudo /sbin/shutdown -r', (error) => {
    exec('echo "hello" > /tmp/bob.txt', (error) => {
      if (error) {
        reportFailure(this.operation, 'ERR_SYSTEM_CALL_FAILED', error);
      }
    });
  }

  handle(error, job) {
    console.log(this.logger);

    if (error) {
      this.logger.error({ error }, 'Error in IoT job');
      return reportFailure(this.operation, job, 'ERR_UNEXPECTED', 'job in unexpected state');
    }

    function handleStep(status, step) {
      if (status === 'QUEUED' || !step) {
        this.logger.info('Rebooting system');
        reportProgress(this.operation, job, STEP_STARTED);
        this.reboot();
      } else if (step === STEP_STARTED) {
        this.logger.info('Reporting successful system reboot');
        reportSuccess(this.operation, job);
      } else {
        this.logger.warn({ step }, 'Unexpected job state, failing...');
        reportFailure(this.operation, job, 'ERR_UNEXPECTED', 'job in unexpected state');
      }
    }

    const { status: { status, statusDetails: { step } = {} } } = job;
    return handleStep(status, step);
  }
}

module.exports = {
  RebootHandler
};
