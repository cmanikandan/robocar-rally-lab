'use strict';

const logger = require('bunyan');

function handle(error, job) {
  if (error) {
    logger.error({ message: 'Error in IoT job', error });
    return job.failed({
      operation: job.operation,
      errorCode: 'ERR_UNEXPECTED',
      errorMessage: 'reboot job execution in unexpected state'
    }, showJobsError);
  }

  logger.debug({ message: 'Received new job event', job });

  if (job.status.status === 'QUEUED' ||
    isUndefined(job.status.statusDetails) ||
    isUndefined(job.status.statusDetails.step)) {

    job.inProgress({ operation: job.operation, step: 'initiated' }, (err) => {
      showJobsError(err);

      const delay = (isUndefined(job.document.delay) ? '0' : job.document.delay.toString());

      exec('sudo /sbin/shutdown -r +' + delay, function (err) { 
        if (!isUndefined(err)) {
          job.failed({ operation: job.operation, errorCode: 'ERR_SYSTEM_CALL_FAILED', errorMessage: 'unable to execute reboot, check passwordless sudo permissions on agent', error: errorToString(err) }, showJobsError);
        }
      });
    });

  } else if (job.status.statusDetails.step === 'initiated') {
    job.succeeded({ operation: job.operation, step: 'reboot' }, showJobsError);
  } else {
    job.failed({ operation: job.operation, errorCode: 'ERR_UNEXPECTED', errorMessage: 'reboot job execution in unexpected state' }, showJobsError);
  }
}

module.exports = {
  handle
};
